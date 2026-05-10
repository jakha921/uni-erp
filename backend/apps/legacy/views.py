"""Legacy ViewSets — read-only archive of old system data."""

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import LegacyOrder, StaffingPosition
from .serializers import LegacyOrderSerializer, StaffingPositionSerializer


class LegacyOrderViewSet(ReadOnlyModelViewSet):
    queryset = LegacyOrder.objects.all()
    serializer_class = LegacyOrderSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["number", "employee_name", "department"]
    filterset_fields = ["type", "status"]


class StaffingPositionViewSet(ReadOnlyModelViewSet):
    queryset = StaffingPosition.objects.all()
    serializer_class = StaffingPositionSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["department_name", "position_name"]
