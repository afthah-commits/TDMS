from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import PhysicalDonation

User = get_user_model()

class DonationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.donor = User.objects.create_user(username='testdonor', password='pw', role='DONOR')
        self.volunteer = User.objects.create_user(username='testvol', password='pw', role='VOLUNTEER')

    def test_create_donation_authenticated(self):
        self.client.force_authenticate(user=self.donor)
        url = reverse('physicaldonation-list')
        data = {
            'item_type': 'CLOTHES',
            'quantity': 5,
            'description': 'Winter Jackets',
            'pickup_location': '123 Main St'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PhysicalDonation.objects.count(), 1)

    def test_update_status_as_volunteer(self):
        donation = PhysicalDonation.objects.create(
            donor=self.donor,
            item_type='TOYS',
            quantity=2,
            pickup_location='123 Main St'
        )
        self.client.force_authenticate(user=self.volunteer)
        url = reverse('physicaldonation-update-status', kwargs={'pk': donation.id})
        data = {'status': 'VERIFIED', 'notes': 'Checked address'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        donation.refresh_from_db()
        self.assertEqual(donation.status, 'VERIFIED')
