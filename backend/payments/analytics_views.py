from rest_framework import views, permissions
from rest_framework.response import Response
from donations.models import PhysicalDonation
from .models import MonetaryDonation
from django.db.models import Sum

class ImpactAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'ADMIN':
            return Response({'error': 'Unauthorized'}, status=403)

        # Physical analytics
        total_physical = PhysicalDonation.objects.count()
        delivered_items = PhysicalDonation.objects.filter(status='DELIVERED').aggregate(Sum('quantity'))['quantity__sum'] or 0

        # Monetary analytics
        total_funds = MonetaryDonation.objects.filter(status='SUCCESS').aggregate(Sum('amount'))['amount__sum'] or 0

        # Recent activities
        recent_funds = MonetaryDonation.objects.filter(status='SUCCESS').order_by('-created_at')[:5].values(
            'amount', 'donor__username', 'created_at'
        )

        return Response({
            'total_physical_pledges': total_physical,
            'items_delivered': delivered_items,
            'total_funds_raised': total_funds,
            'recent_funds': list(recent_funds)
        })
