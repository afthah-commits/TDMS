from django.contrib import admin
from .models import PhysicalDonation, DonationStatusLog

@admin.register(PhysicalDonation)
class PhysicalDonationAdmin(admin.ModelAdmin):
    list_display = ['id', 'donor', 'item_type', 'quantity', 'status', 'created_at']
    list_filter = ['status', 'item_type', 'created_at']
    search_fields = ['donor__username', 'donor__email', 'description']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['mark_as_verified', 'mark_as_picked_up', 'mark_as_delivered']

    def mark_as_verified(self, request, queryset):
        for donation in queryset:
            if donation.status == 'PENDING':
                donation.status = 'VERIFIED'
                donation.save()
                DonationStatusLog.objects.create(
                    donation=donation,
                    from_status='PENDING',
                    to_status='VERIFIED',
                    changed_by=request.user,
                    notes='Bulk status update via admin'
                )
        self.message_user(request, f'{queryset.count()} donations marked as verified.')
    mark_as_verified.short_description = "Mark selected donations as verified"

    def mark_as_picked_up(self, request, queryset):
        for donation in queryset:
            if donation.status in ['PENDING', 'VERIFIED']:
                donation.status = 'PICKED_UP'
                donation.save()
                DonationStatusLog.objects.create(
                    donation=donation,
                    from_status=donation.status,
                    to_status='PICKED_UP',
                    changed_by=request.user,
                    notes='Bulk status update via admin'
                )
        self.message_user(request, f'{queryset.count()} donations marked as picked up.')
    mark_as_picked_up.short_description = "Mark selected donations as picked up"

    def mark_as_delivered(self, request, queryset):
        for donation in queryset:
            if donation.status in ['PENDING', 'VERIFIED', 'PICKED_UP']:
                donation.status = 'DELIVERED'
                donation.save()
                DonationStatusLog.objects.create(
                    donation=donation,
                    from_status=donation.status,
                    to_status='DELIVERED',
                    changed_by=request.user,
                    notes='Bulk status update via admin'
                )
        self.message_user(request, f'{queryset.count()} donations marked as delivered.')
    mark_as_delivered.short_description = "Mark selected donations as delivered"

@admin.register(DonationStatusLog)
class DonationStatusLogAdmin(admin.ModelAdmin):
    list_display = ['donation', 'from_status', 'to_status', 'changed_by', 'created_at']
    list_filter = ['from_status', 'to_status', 'created_at']
    readonly_fields = ['created_at']
