"""Infrastructure ViewSets — Dormitory, Equipment, Transport."""

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .filters import DormRoomFilter, EquipmentFilter, VehicleFilter
from .models import DormBuilding, DormRoom, Equipment, Vehicle
from .serializers import (
    DormBuildingSerializer,
    DormRoomSerializer,
    EquipmentCreateSerializer,
    EquipmentSerializer,
    VehicleCreateSerializer,
    VehicleSerializer,
)


class DormBuildingViewSet(ReadOnlyModelViewSet):
    queryset = DormBuilding.objects.prefetch_related("rooms").all()
    serializer_class = DormBuildingSerializer
    permission_classes = [IsAuthenticated]


class DormRoomViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = DormRoomFilter
    serializer_class = DormRoomSerializer

    def get_queryset(self):
        return DormRoom.objects.select_related("building").all()


class EquipmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = EquipmentFilter
    search_fields = ["name", "inventory_number"]

    def get_queryset(self):
        return Equipment.objects.all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return EquipmentCreateSerializer
        return EquipmentSerializer


class VehicleViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = VehicleFilter
    search_fields = ["brand", "model", "plate_number"]

    def get_queryset(self):
        return Vehicle.objects.all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return VehicleCreateSerializer
        return VehicleSerializer
