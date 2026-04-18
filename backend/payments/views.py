import razorpay
from razorpay.errors import BadRequestError
from django.conf import settings
from rest_framework import views, status, permissions
from rest_framework.response import Response
from .models import MonetaryDonation
from .serializers import MonetaryDonationSerializer

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')
        currency = request.data.get('currency', 'INR')

        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            razorpay_order = client.order.create(dict(
                amount=int(float(amount) * 100),
                currency=currency,
                payment_capture='0'
            ))

            donation = MonetaryDonation.objects.create(
                donor=request.user,
                amount=amount,
                currency=currency,
                razorpay_order_id=razorpay_order['id'],
                status='PENDING'
            )

            serializer = MonetaryDonationSerializer(donation)
            return Response({
                'order_id': razorpay_order['id'],
                'donation': serializer.data,
                'razorpay_key': settings.RAZORPAY_KEY_ID,
                'mode': 'razorpay'
            })
        except BadRequestError as error:
            if 'Authentication failed' in str(error):
                return Response(
                    {
                        'error': 'Razorpay authentication failed. Please set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env.',
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        try:
            donation = MonetaryDonation.objects.get(razorpay_order_id=razorpay_order_id)
        except MonetaryDonation.DoesNotExist:
            return Response({'error': 'Donation record not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Verify signature against Razorpay client
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            
            # Update DB on success
            donation.razorpay_payment_id = razorpay_payment_id
            donation.razorpay_signature = razorpay_signature
            donation.status = 'SUCCESS'
            donation.save()
            
            # Generate PDF and Send Email
            from .utils import generate_donation_receipt_pdf
            from django.core.mail import EmailMessage
            try:
                pdf_buffer = generate_donation_receipt_pdf(donation)
                email = EmailMessage(
                    subject='Thank You for Your Donation to TDMS',
                    body=f'Dear {donation.donor.username},\n\nWe have successfully received your generous donation of {donation.currency} {donation.amount}. Please find your official receipt attached to this email.\n\nThank you!',
                    from_email=None,
                    to=[donation.donor.email]
                )
                email.attach(f'TDMS_Receipt_{donation.razorpay_payment_id}.pdf', pdf_buffer.getvalue(), 'application/pdf')
                email.send(fail_silently=True)
            except Exception as e:
                print(f"Failed to send email/PDF: {e}")

            return Response({'status': 'Payment successful'})
            
        except razorpay.errors.SignatureVerificationError:
            donation.status = 'FAILED'
            donation.save()
            return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)

