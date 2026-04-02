from django.urls import path
from .views import CreateOrderView, VerifyPaymentView
from .analytics_views import ImpactAnalyticsView

urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('analytics/', ImpactAnalyticsView.as_view(), name='analytics'),
]
