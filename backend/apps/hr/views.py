"""HR views — Employee, Order, Leave, Dashboard, Attendance."""

import calendar
from datetime import date

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
        active = qs.filter(status="active").count()
        on_leave = Leave.objects.filter(status="approved", employee__is_deleted=False).count()
        on_business_trip = HrOrder.objects.filter(
            type="business_trip", status="signed", employee__is_deleted=False
        ).count()
        pending_orders = HrOrder.objects.filter(
            status__in=["draft", "review"], employee__is_deleted=False
        ).count()
        pending_leaves = Leave.objects.filter(status="pending", employee__is_deleted=False).count()

        by_status = list(qs.values("status").annotate(count=Count("id")))
        by_department = list(
            qs.values("department__name").annotate(count=Count("id")).order_by("-count")[:10]
        )

        # Age distribution
        today = date.today()
        by_age = []
        for label, min_age, max_age in [
            ("до 30", 0, 29),
            ("30–39", 30, 39),
            ("40–49", 40, 49),
            ("50–59", 50, 59),
            ("60+", 60, 200),
        ]:
            min_birth = date(today.year - max_age - 1, today.month, today.day)
            max_birth = date(today.year - min_age, today.month, today.day)
            count = qs.filter(birth_date__gte=min_birth, birth_date__lte=max_birth).count()
            by_age.append({"range": label, "count": count})

        science_stats = {
            "dsc": qs.filter(academic_degree="dsc").count(),
            "phd": qs.filter(academic_degree="phd").count(),
            "professor": qs.filter(academic_rank="professor").count(),
            "dotsent": qs.filter(academic_rank="dotsent").count(),
        }

        recent_orders = list(
            HrOrder.objects.select_related("employee__user")
            .order_by("-date")[:5]
            .values(
                "id",
                "number",
                "type",
                "title",
                "employee__user__first_name",
                "employee__user__last_name",
                "date",
                "status",
            )
        )

        return Response(
            {
                "totalEmployees": total,
                "activeEmployees": active,
                "onLeave": on_leave,
                "onBusinessTrip": on_business_trip,
                "pendingOrders": pending_orders,
                "pendingLeaves": pending_leaves,
                "byStatus": [{"status": r["status"], "count": r["count"]} for r in by_status],
                "byDepartment": [
                    {"department": r["department__name"], "count": r["count"]}
                    for r in by_department
                ],
                "byAge": by_age,
                "scienceStats": science_stats,
                "recentOrders": [
                    {
                        "id": r["id"],
                        "number": r["number"],
                        "type": r["type"],
                        "title": r["title"],
                        "employeeName": f"{r['employee__user__last_name']} {r['employee__user__first_name']}",
                        "date": str(r["date"]),
                        "status": r["status"],
                    }
                    for r in recent_orders
                ],
            }
        )


class HrAttendanceView(APIView):
    """GET /hr/attendance/?year=2025&month=5&department_id=1 — monthly attendance sheet."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        today = date.today()
        year = int(request.query_params.get("year", today.year))
        month = int(request.query_params.get("month", today.month))
        dept_id = request.query_params.get("department_id")

        _, days_in_month = calendar.monthrange(year, month)
        month_days = [date(year, month, d) for d in range(1, days_in_month + 1)]

        qs = Employee.objects.filter(is_deleted=False).select_related("user", "department")
        if dept_id:
            qs = qs.filter(department_id=dept_id)

        # Build leave date maps per employee
        leaves = Leave.objects.filter(
            employee__in=qs,
            status="approved",
            start_date__lte=date(year, month, days_in_month),
            end_date__gte=date(year, month, 1),
        ).select_related("employee")

        leave_map: dict[int, dict[date, str]] = {}
        for leave in leaves:
            eid = leave.employee_id
            if eid not in leave_map:
                leave_map[eid] = {}
            leave_status = (
                "sick"
                if leave.type == "sick"
                else "business_trip"
                if leave.type == "business_trip"
                else "leave"
            )
            cur = leave.start_date
            while cur <= leave.end_date:
                if cur.year == year and cur.month == month:
                    leave_map[eid][cur] = leave_status
                cur = (
                    date(cur.year, cur.month + (1 if cur.month < 12 else 0), cur.day + 1)
                    if False
                    else date.fromordinal(cur.toordinal() + 1)
                )

        rows = []
        for emp in qs:
            days = []
            for d in month_days:
                if d.weekday() >= 5:
                    day_status = "weekend"
                elif emp.id in leave_map and d in leave_map[emp.id]:
                    day_status = leave_map[emp.id][d]
                else:
                    day_status = "present"
                days.append({"date": str(d), "status": day_status})

            rows.append(
                {
                    "employeeId": emp.id,
                    "employeeName": emp.user.full_name,
                    "department": emp.department.name if emp.department else "",
                    "days": days,
                }
            )

        return Response(rows)


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
