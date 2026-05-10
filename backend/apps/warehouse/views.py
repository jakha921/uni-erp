"""Warehouse ViewSets — inventory and stock movements."""

from django.db.models import Count, F
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import StockMovement, WarehouseItem
from .serializers import (
    StockMovementCreateSerializer,
    StockMovementSerializer,
    WarehouseItemCreateSerializer,
    WarehouseItemSerializer,
)


class WarehouseItemViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "sku"]
    filterset_fields = ["category"]

    def get_queryset(self):
        qs = WarehouseItem.objects.all()
        if self.request.query_params.get("belowMin") == "true":
            qs = qs.filter(quantity__lt=F("min_quantity"))
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return WarehouseItemCreateSerializer
        return WarehouseItemSerializer

    @action(detail=False, methods=["get"])
    def stats(self, request):
        qs = WarehouseItem.objects.all()
        total_items = qs.count()
        total_value = sum(i.total_value for i in qs)
        below_min = qs.filter(quantity__lt=F("min_quantity")).count()
        by_category = list(qs.values("category").annotate(count=Count("id")).order_by("-count"))
        return Response(
            {
                "totalItems": total_items,
                "totalValue": str(total_value),
                "belowMinimum": below_min,
                "byCategory": by_category,
            }
        )


class StockMovementViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["type"]

    def get_queryset(self):
        qs = StockMovement.objects.select_related("item").all()
        item_id = self.request.query_params.get("item")
        if item_id:
            qs = qs.filter(item_id=item_id)
        return qs

    def get_serializer_class(self):
        if self.action in ("create",):
            return StockMovementCreateSerializer
        return StockMovementSerializer

    def perform_create(self, serializer):
        movement = serializer.save()
        item = movement.item
        if movement.type == "incoming":
            item.quantity += movement.quantity
        elif movement.type in ("outgoing", "write_off"):
            item.quantity = max(0, item.quantity - movement.quantity)
        item.save(update_fields=["quantity"])
