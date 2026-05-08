from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ContractViewSet,
    FinanceDashboardView,
    PaymentViewSet,
    ScholarshipViewSet,
)

router = DefaultRouter()
router.register("contracts", ContractViewSet, basename="contract")
router.register("payments", PaymentViewSet, basename="payment")
router.register("scholarships", ScholarshipViewSet, basename="scholarship")

urlpatterns = [
    path("dashboard/", FinanceDashboardView.as_view(), name="finance-dashboard"),
] + router.urls
