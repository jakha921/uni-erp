from rest_framework.routers import DefaultRouter

from .views import StockMovementViewSet, WarehouseItemViewSet

router = DefaultRouter()
router.register("items", WarehouseItemViewSet, basename="warehouse-item")
router.register("movements", StockMovementViewSet, basename="stock-movement")

urlpatterns = router.urls
