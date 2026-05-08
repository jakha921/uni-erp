"""HR views — Employee, Order, Leave, Dashboard."""

from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import EmployeeFilter, HrOrderFilter, LeaveFilter
from .models import Employee, HrOrder, Leave
from .serializers import (
    CreateEmployeeSerializer,
    EmployeeDetailSerializer,
    EmployeeListSerializer,
    LeaveSerializer,
    OrderSerializer,
)


class EmployeeViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = EmployeeFilter
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__middle_name",
        "employee_id_number",
        "position",
    ]

    def get_queryset(self):
        return Employee.objects.filter(is_deleted=False).select_related(
            "user", "department__faculty"
        )

    def get_serializer_class(self):
        if self.action == "list":
            return EmployeeListSerializer
        if self.action == "create":
            return CreateEmployeeSerializer
        return EmployeeDetailSerializer

    def perform_destroy(self, instance: Employee):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = CreateEmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        employee = serializer.save()
        return Response(
            EmployeeDetailSerializer(employee, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class HrDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        qs = Employee.objects.filter(is_deleted=False)
        total = qs.count()
        by_status = list(qs.values("status").annotate(count=Count("id")))
        by_employment_form = list(qs.values("employment_form").annotate(count=Count("id")))
        by_department = list(
            qs.values("department__name").annotate(count=Count("id")).order_by("-count")[:10]
        )
        on_leave = Leave.objects.filter(status="approved", employee__is_deleted=False).count()
        on_business_trip = HrOrder.objects.filter(
            type="business_trip", status="signed", employee__is_deleted=False
        ).count()
        return Response(
            {
                "totalEmployees": total,
                "onLeave": on_leave,
                "onBusinessTrip": on_business_trip,
                "byStatus": [{"status": r["status"], "count": r["count"]} for r in by_status],
                "byEmploymentForm": [
                    {"form": r["employment_form"], "count": r["count"]} for r in by_employment_form
                ],
                "byDepartment": [
                    {"department": r["department__name"], "count": r["count"]}
                    for r in by_department
                ],
            }
        )


class HrOrderViewSet(ModelViewSet):
    queryset = HrOrder.objects.select_related("employee__user").order_by("-date")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = HrOrderFilter
    search_fields = ["number", "title", "employee__user__last_name"]


class LeaveViewSet(ModelViewSet):
    queryset = Leave.objects.select_related("employee__user").order_by("-start_date")
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = LeaveFilter
    search_fields = ["employee__user__last_name", "employee__employee_id_number"]
