from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user-register')
        self.login_url = reverse('user-login')

    def test_user_registration(self):
        data = {
            'username': 'testdonor',
            'email': 'donor@test.com',
            'password': 'strongpassword123',
            'role': 'DONOR'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testdonor')

    def test_user_login(self):
        User.objects.create_user(username='testdonor', password='strongpassword123', role='DONOR')
        data = {
            'username': 'testdonor',
            'password': 'strongpassword123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'DONOR')
