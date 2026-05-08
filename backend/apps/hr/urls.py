"""HR URL configuration."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EmployeeViewSet, HrDashboardView, HrOrderViewSet, LeaveViewSet

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")
router.register("orders", HrOrderViewSet, basename="hr-order")
router.register("leaves", LeaveViewSet, basename="leave")

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", HrDashboardView.as_view(), name="hr-dashboard"),
]
