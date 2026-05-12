from django.urls import path
from rest_framework.routers import DefaultRouter

from .payment_views import ClickCallbackView, PaymeCallbackView, PaymentLinkView
from .views import (
    BudgetCategoryViewSet,
    ContractViewSet,
    FinanceDashboardView,
    FinanceReportView,
    PaymentViewSet,
    PayrollViewSet,
    ScholarshipViewSet,
)

router = DefaultRouter()
router.register("contracts", ContractViewSet, basename="contract")
router.register("payments", PaymentViewSet, basename="payment")
router.register("scholarships", ScholarshipViewSet, basename="scholarship")
router.register("payroll", PayrollViewSet, basename="payroll")
router.register("budget/categories", BudgetCategoryViewSet, basename="budget-category")

urlpatterns = [
    path("dashboard/", FinanceDashboardView.as_view(), name="finance-dashboard"),
    path("report/", FinanceReportView.as_view(), name="finance-report"),
    path("payments/payme/callback/", PaymeCallbackView.as_view(), name="payme-callback"),
    path("payments/click/callback/", ClickCallbackView.as_view(), name="click-callback"),
    path(
        "contracts/<int:contract_id>/payment-link/",
        PaymentLinkView.as_view(),
        name="payment-link",
    ),
] + router.urls
