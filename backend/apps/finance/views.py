"""Finance views — Contract, Payment, Scholarship, Dashboard, Payroll, Budget, Report."""

from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import ContractFilter, PaymentFilter
from .models import BudgetCategory, Contract, Payment, PayrollRecord, Scholarship
from .serializers import (
    BudgetCategoryCreateSerializer,
    BudgetCategorySerializer,
    ContractDetailSerializer,
    ContractListSerializer,
    CreateContractSerializer,
    CreatePaymentSerializer,
    CreateScholarshipSerializer,
    PaymentListSerializer,
    PayrollCreateSerializer,
    PayrollSerializer,
    ScholarshipSerializer,
)


class ContractViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = ContractFilter
    search_fields = ["contract_number", "student__user__last_name", "student__student_id_number"]

    def get_queryset(self):
        return (
            Contract.objects.filter(is_deleted=False)
            .select_related(
                "student__user",
                "student__group__specialty__department__faculty",
                "academic_year",
            )
            .prefetch_related("schedule_items")
        )

    def get_serializer_class(self):
        if self.action in ("create",):
            return CreateContractSerializer
        if self.action in ("retrieve",):
            return ContractDetailSerializer
        return ContractListSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get"], url_path="pdf")
    def export_pdf(self, request: Request, pk=None) -> Response:
        from apps.core.pdf import generate_contract_pdf

        contract = self.get_object()
        data = ContractDetailSerializer(contract).data
        return generate_contract_pdf(data)

    @action(detail=True, methods=["get"], url_path="payment-link")
    def payment_link(self, request: Request, pk=None) -> Response:
        from .payment_providers import generate_click_link, generate_payme_link

        contract = self.get_object()
        return Response(
            {
                "payme": generate_payme_link(contract),
                "click": generate_click_link(contract),
            }
        )

    @action(detail=False, methods=["get"], url_path="export")
    def export_excel(self, request: Request) -> Response:
        from apps.core.export import export_to_excel

        qs = self.get_queryset()
        data = ContractListSerializer(qs, many=True).data
        columns = [
            ("contractNumber", "Kontrakt №"),
            ("studentName", "Talaba"),
            ("contractAmount", "Summa"),
            ("paidAmount", "To'langan"),
            ("debtAmount", "Qarz"),
            ("status", "Holat"),
        ]
        return export_to_excel(data, columns, filename="contracts")


class PaymentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = PaymentFilter

    def get_queryset(self):
        return Payment.objects.select_related(
            "contract__student__user",
            "contract__student__group__specialty__department__faculty",
        ).all()

    def get_serializer_class(self):
        if self.action in ("create",):
            return CreatePaymentSerializer
        return PaymentListSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(
            PaymentListSerializer(payment).data,
            status=status.HTTP_201_CREATED,
        )


class ScholarshipViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "type", "student", "semester"]

    def get_queryset(self):
        return Scholarship.objects.select_related("student__user", "semester").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return CreateScholarshipSerializer
        return ScholarshipSerializer


class FinanceDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        contracts = Contract.objects.filter(is_deleted=False)
        scholarships = Scholarship.objects.filter(status="active")

        totals = contracts.aggregate(
            total_amount=Sum("contract_amount"),
            total_paid=Sum("paid_amount"),
            total_debt=Sum("debt_amount"),
        )
        total_amount = float(totals["total_amount"] or 0)
        total_paid = float(totals["total_paid"] or 0)
        total_debt = float(totals["total_debt"] or 0)
        collection_rate = round(total_paid / total_amount * 100, 1) if total_amount else 0

        by_faculty = list(
            contracts.values("student__group__specialty__department__faculty__name")
            .annotate(count=Count("id"), total=Sum("contract_amount"), paid=Sum("paid_amount"))
            .order_by("-total")
        )
        debtor_count = contracts.filter(status="active", debt_amount__gt=0).count()
        scholarship_total = float(scholarships.aggregate(total=Sum("amount"))["total"] or 0)

        return Response(
            {
                "totalContracts": contracts.count(),
                "totalContractAmount": total_amount,
                "totalPaid": total_paid,
                "totalDebt": total_debt,
                "collectionRate": collection_rate,
                "debtorCount": debtor_count,
                "scholarshipCount": scholarships.count(),
                "scholarshipTotal": scholarship_total,
                "byFaculty": [
                    {
                        "faculty": r["student__group__specialty__department__faculty__name"],
                        "count": r["count"],
                        "total": float(r["total"] or 0),
                        "paid": float(r["paid"] or 0),
                    }
                    for r in by_faculty
                ],
            }
        )


class PayrollViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "period_year", "period_month", "employee"]

    def get_queryset(self):
        return PayrollRecord.objects.select_related("employee__department").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return PayrollCreateSerializer
        return PayrollSerializer

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request: Request) -> Response:
        year = request.query_params.get("year")
        month = request.query_params.get("month")
        qs = self.get_queryset()
        if year:
            qs = qs.filter(period_year=year)
        if month:
            qs = qs.filter(period_month=month)
        agg = qs.aggregate(
            total_base=Sum("base_salary"),
            total_bonus=Sum("bonus"),
            total_deductions=Sum("deductions"),
            total_net=Sum("net_salary"),
        )
        return Response(
            {
                "count": qs.count(),
                "totalBase": float(agg["total_base"] or 0),
                "totalBonus": float(agg["total_bonus"] or 0),
                "totalDeductions": float(agg["total_deductions"] or 0),
                "totalNet": float(agg["total_net"] or 0),
            }
        )

    @action(detail=False, methods=["post"], url_path="process")
    def process(self, request: Request) -> Response:
        year = request.data.get("year")
        month = request.data.get("month")
        if not year or not month:
            return Response({"detail": "year va month kerak."}, status=status.HTTP_400_BAD_REQUEST)
        updated = PayrollRecord.objects.filter(
            period_year=year, period_month=month, status="draft"
        ).update(status="processed")
        return Response({"processed": updated})


class BudgetCategoryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["year", "period", "parent"]

    def get_queryset(self):
        return BudgetCategory.objects.prefetch_related("children").filter(parent=None)

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return BudgetCategoryCreateSerializer
        return BudgetCategorySerializer

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request: Request) -> Response:
        year = request.query_params.get("year")
        qs = BudgetCategory.objects.all()
        if year:
            qs = qs.filter(year=year)
        agg = qs.aggregate(
            total_planned=Sum("planned_amount"),
            total_actual=Sum("actual_amount"),
        )
        return Response(
            {
                "totalPlanned": float(agg["total_planned"] or 0),
                "totalActual": float(agg["total_actual"] or 0),
            }
        )


class FinanceReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        from django.db.models.functions import TruncMonth

        contracts = Contract.objects.filter(is_deleted=False)

        by_type = list(
            contracts.values("contract_type")
            .annotate(count=Count("id"), total=Sum("contract_amount"))
            .order_by("-total")
        )

        by_month = list(
            Payment.objects.annotate(month=TruncMonth("payment_date"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        by_faculty = list(
            contracts.values("student__group__specialty__department__faculty__name")
            .annotate(revenue=Sum("paid_amount"))
            .order_by("-revenue")
        )

        return Response(
            {
                "contractsByType": [
                    {
                        "type": r["contract_type"],
                        "count": r["count"],
                        "total": float(r["total"] or 0),
                    }
                    for r in by_type
                ],
                "paymentsByMonth": [
                    {
                        "month": r["month"].strftime("%Y-%m") if r["month"] else "",
                        "total": float(r["total"] or 0),
                    }
                    for r in by_month
                ],
                "revenueByFaculty": [
                    {
                        "faculty": r["student__group__specialty__department__faculty__name"],
                        "revenue": float(r["revenue"] or 0),
                    }
                    for r in by_faculty
                ],
            }
        )
