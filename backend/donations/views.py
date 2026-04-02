from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from .models import PhysicalDonation, DonationStatusLog
from .serializers import PhysicalDonationSerializer

class PhysicalDonationViewSet(viewsets.ModelViewSet):
    serializer_class = PhysicalDonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'VOLUNTEER']:
            return PhysicalDonation.objects.all().order_by('-created_at')
        return PhysicalDonation.objects.filter(donor=user).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        donation = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if new_status not in dict(PhysicalDonation.STATUS_CHOICES).keys():
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        old_status = donation.status
        donation.status = new_status
        donation.save()

        # Log the change
        DonationStatusLog.objects.create(
            donation=donation,
            from_status=old_status,
            to_status=new_status,
            changed_by=request.user,
            notes=notes
        )

        # Send email notification
        try:
            send_mail(
                subject='Update: Your TDMS Physical Donation',
                message=f'Hello {donation.donor.username},\n\nThe status of your physical donation ({donation.quantity}x {donation.item_type}) has been updated from {old_status} to {new_status}.\n\nThank you for making a difference!',
                from_email=None, # Uses default from setting
                recipient_list=[donation.donor.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

        return Response({'status': 'Status updated successfully', 'new_status': new_status})
