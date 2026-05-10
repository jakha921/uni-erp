from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import DormBuilding, DormRoom, Equipment, Vehicle


@admin.register(DormBuilding)
class DormBuildingAdmin(ModelAdmin):
    list_display = ["name", "floors", "total_rooms"]


@admin.register(DormRoom)
class DormRoomAdmin(ModelAdmin):
    list_display = ["building", "number", "floor", "capacity", "occupied", "status"]
    list_filter = ["status", "building"]


@admin.register(Equipment)
class EquipmentAdmin(ModelAdmin):
    list_display = ["name", "inventory_number", "category", "status"]
    list_filter = ["status", "category"]


@admin.register(Vehicle)
class VehicleAdmin(ModelAdmin):
    list_display = ["brand", "model", "plate_number", "status"]
    list_filter = ["status"]
