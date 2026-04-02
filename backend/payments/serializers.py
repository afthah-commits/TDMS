from rest_framework import serializers
from .models import MonetaryDonation

class MonetaryDonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)

    class Meta:
        model = MonetaryDonation
        fields = (
            'id', 'amount', 'currency', 'status', 'created_at', 
            'razorpay_order_id', 'donor_name'
        )
        read_only_fields = ('status', 'razorpay_order_id')
