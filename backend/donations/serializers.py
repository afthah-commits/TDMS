from rest_framework import serializers
from .models import PhysicalDonation, DonationStatusLog

class DonationStatusLogSerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = DonationStatusLog
        fields = ('id', 'from_status', 'to_status', 'changed_by_name', 'notes', 'created_at')

class PhysicalDonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    status_logs = DonationStatusLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = PhysicalDonation
        fields = (
            'id', 'item_type', 'quantity', 'description', 
            'pickup_location', 'status', 'created_at', 
            'updated_at', 'donor_name', 'status_logs'
        )
        read_only_fields = ('status',)

    def create(self, validated_data):
        user = self.context['request'].user
        donation = PhysicalDonation.objects.create(donor=user, **validated_data)
        
        # Log initial creation
        DonationStatusLog.objects.create(
            donation=donation,
            from_status='NONE',
            to_status='PENDING',
            changed_by=user,
            notes='Donation created'
        )
        
        return donation
