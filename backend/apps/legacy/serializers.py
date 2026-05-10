from rest_framework import serializers

from .models import LegacyOrder, StaffingPosition


class LegacyOrderSerializer(serializers.ModelSerializer):
    typeLabel = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = LegacyOrder
        fields = [
            "id",
            "number",
            "date",
            "type",
            "typeLabel",
            "employee_name",
            "department",
            "content",
            "status",
        ]


class StaffingPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffingPosition
        fields = [
            "id",
            "department_name",
            "position_name",
            "total_slots",
            "filled_slots",
            "salary",
        ]
