from django.db import models
from users.models import User

class PhysicalDonation(models.Model):
    ITEM_TYPES = (
        ('CLOTHES', 'Clothes'),
        ('TOYS', 'Toys'),
        ('OTHER', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('PICKED_UP', 'Picked Up'),
        ('DELIVERED', 'Delivered'),
    )
    
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='physical_donations')
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    quantity = models.PositiveIntegerField(help_text="Number of items")
    description = models.TextField(blank=True)
    pickup_location = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.item_type} from {self.donor.username} ({self.status})"


class DonationStatusLog(models.Model):
    donation = models.ForeignKey(PhysicalDonation, on_delete=models.CASCADE, related_name='status_logs')
    from_status = models.CharField(max_length=20, choices=PhysicalDonation.STATUS_CHOICES)
    to_status = models.CharField(max_length=20, choices=PhysicalDonation.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='status_changes_made')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Donation {self.donation.id}: {self.from_status} -> {self.to_status}"
