import django_filters

from .models import DormRoom, Equipment, Vehicle


class DormRoomFilter(django_filters.FilterSet):
    building = django_filters.NumberFilter(field_name="building_id")
    floor = django_filters.NumberFilter()
    status = django_filters.CharFilter()

    class Meta:
        model = DormRoom
        fields = ["building", "floor", "status"]


class EquipmentFilter(django_filters.FilterSet):
    category = django_filters.CharFilter()
    status = django_filters.CharFilter()
    location = django_filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Equipment
        fields = ["category", "status", "location"]


class VehicleFilter(django_filters.FilterSet):
    status = django_filters.CharFilter()

    class Meta:
        model = Vehicle
        fields = ["status"]
