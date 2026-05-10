from rest_framework import serializers

from .models import DormBuilding, DormRoom, Equipment, Vehicle


class DormBuildingSerializer(serializers.ModelSerializer):
    occupancy = serializers.SerializerMethodField()

    class Meta:
        model = DormBuilding
        fields = ["id", "name", "address", "floors", "total_rooms", "occupancy"]

    def get_occupancy(self, obj):
        rooms = obj.rooms.all()
        if not rooms:
            return 0
        total_cap = sum(r.capacity for r in rooms)
        total_occ = sum(r.occupied for r in rooms)
        return round(total_occ / total_cap * 100) if total_cap else 0


class DormRoomSerializer(serializers.ModelSerializer):
    buildingName = serializers.CharField(source="building.name", read_only=True)

    class Meta:
        model = DormRoom
        fields = [
            "id",
            "building",
            "buildingName",
            "number",
            "floor",
            "capacity",
            "occupied",
            "status",
        ]


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            "id",
            "name",
            "inventory_number",
            "category",
            "location",
            "responsible_person",
            "purchase_date",
            "cost",
            "status",
            "last_maintenance_date",
        ]


class EquipmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = [
            "name",
            "inventory_number",
            "category",
            "location",
            "responsible_person",
            "purchase_date",
            "cost",
        ]


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "id",
            "brand",
            "model",
            "plate_number",
            "year",
            "driver_name",
            "route",
            "status",
            "mileage",
            "last_service_date",
        ]


class VehicleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            "brand",
            "model",
            "plate_number",
            "year",
            "driver_name",
            "route",
        ]
