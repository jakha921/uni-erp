from rest_framework.routers import DefaultRouter

from .views import LegacyOrderViewSet, StaffingPositionViewSet

router = DefaultRouter()
router.register("orders", LegacyOrderViewSet, basename="legacy-order")
router.register("staffing", StaffingPositionViewSet, basename="staffing-position")

urlpatterns = router.urls
