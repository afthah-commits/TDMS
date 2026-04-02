from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()

class PaymentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.donor = User.objects.create_user(username='testdonor', password='pw', role='DONOR')
        self.create_url = reverse('create-order')
        self.client.force_authenticate(user=self.donor)

    @patch('razorpay.Client')
    def test_create_order(self, mock_razorpay):
        # Mock the external Razorpay API call
        instance = mock_razorpay.return_value
        instance.order.create.return_value = {'id': 'order_mock123'}

        data = {'amount': '500.00', 'currency': 'INR'}
        response = self.client.post(self.create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_id'], 'order_mock123')
