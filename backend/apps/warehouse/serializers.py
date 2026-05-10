from rest_framework import serializers

from .models import StockMovement, WarehouseItem


class WarehouseItemSerializer(serializers.ModelSerializer):
    totalValue = serializers.DecimalField(
        source="total_value", max_digits=15, decimal_places=2, read_only=True
    )

    class Meta:
        model = WarehouseItem
        fields = [
            "id",
            "name",
            "sku",
            "category",
            "quantity",
            "unit",
            "min_quantity",
            "price",
            "totalValue",
            "location",
            "created_at",
        ]


class WarehouseItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseItem
        fields = ["name", "sku", "category", "unit", "min_quantity", "price", "location"]


class StockMovementSerializer(serializers.ModelSerializer):
    itemName = serializers.CharField(source="item.name", read_only=True)

    class Meta:
        model = StockMovement
        fields = [
            "id",
            "item",
            "itemName",
            "type",
            "quantity",
            "note",
            "responsible_person",
            "created_at",
        ]


class StockMovementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = ["item", "type", "quantity", "note"]
