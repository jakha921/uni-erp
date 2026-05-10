from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import StockMovement, WarehouseItem


@admin.register(WarehouseItem)
class WarehouseItemAdmin(ModelAdmin):
    list_display = ["name", "sku", "category", "quantity", "min_quantity", "price"]
    list_filter = ["category"]


@admin.register(StockMovement)
class StockMovementAdmin(ModelAdmin):
    list_display = ["item", "type", "quantity", "created_at"]
    list_filter = ["type"]
