from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PhysicalDonationViewSet

router = DefaultRouter()
router.register(r'physical', PhysicalDonationViewSet, basename='physical-donation')

urlpatterns = [
    path('', include(router.urls)),
]
