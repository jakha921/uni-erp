from rest_framework.routers import DefaultRouter

from .views import (
    DormBuildingViewSet,
    DormRoomViewSet,
    EquipmentViewSet,
    VehicleViewSet,
)

router = DefaultRouter()
router.register("dormitory/buildings", DormBuildingViewSet, basename="dorm-building")
router.register("dormitory/rooms", DormRoomViewSet, basename="dorm-room")
router.register("equipment", EquipmentViewSet, basename="equipment")
router.register("transport", VehicleViewSet, basename="vehicle")

urlpatterns = router.urls
