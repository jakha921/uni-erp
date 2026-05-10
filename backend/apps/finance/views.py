"""Finance views — Contract, Payment, Scholarship, Dashboard."""

from django.db.models import Count, Sum
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import ContractFilter, PaymentFilter
from .models import Contract, Payment, Scholarship
from .serializers import (
    ContractDetailSerializer,
    ContractListSerializer,
    CreateContractSerializer,
    CreatePaymentSerializer,
    CreateScholarshipSerializer,
    PaymentListSerializer,
    ScholarshipSerializer,
)


class ContractViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = ContractFilter
    search_fields = [
        "contract_number",
        "student__user__first_name",
        "student__user__last_name",
        "student__student_id_number",
    ]

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
        if self.action == "list":
            return ContractListSerializer
        if self.action == "create":
            return CreateContractSerializer
        return ContractDetailSerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = CreateContractSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contract = serializer.save()
        return Response(
            ContractDetailSerializer(contract, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def perform_destroy(self, instance: Contract):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    @action(detail=True, methods=["get"], url_path="pdf")
    def download_pdf(self, request, pk=None):
        from apps.core.pdf import generate_contract_pdf

        contract = self.get_object()
        student = contract.student
        data = {
            "number": contract.contract_number,
            "student_name": student.user.full_name if student else "",
            "faculty": (
                student.group.specialty.department.faculty.name if student and student.group else ""
            ),
            "specialty": student.group.specialty.name if student and student.group else "",
            "group": student.group.name if student and student.group else "",
            "education_form": student.get_education_form_display() if student else "",
            "course": student.course if student else "",
            "contract_amount": float(contract.contract_amount),
            "paid_amount": float(contract.paid_amount),
            "debt_amount": float(contract.debt_amount),
            "status": contract.get_status_display(),
            "contract_date": (
                contract.contract_date.strftime("%d.%m.%Y") if contract.contract_date else ""
            ),
        }
        return generate_contract_pdf(data)

    @action(detail=False, methods=["get"], url_path="export-pdf")
    def export_pdf(self, request):
        from apps.core.pdf import generate_table_pdf

        qs = self.filter_queryset(self.get_queryset())
        headers = ["#", "Raqam", "Talaba", "Umumiy summa", "To'langan", "Qarz", "Holat"]
        rows = []
        for i, c in enumerate(qs[:500], 1):
            rows.append(
                [
                    i,
                    c.contract_number,
                    c.student.user.full_name if c.student else "",
                    f"{c.contract_amount:,.0f}",
                    f"{c.paid_amount:,.0f}",
                    f"{c.debt_amount:,.0f}",
                    c.get_status_display(),
                ]
            )
        return generate_table_pdf(
            title="Shartnomalar hisoboti",
            subtitle=f"Jami: {qs.count()} ta shartnoma",
            headers=headers,
            rows=rows,
            filename="shartnomalar_hisoboti",
        )


class PaymentViewSet(ModelViewSet):
    http_method_names = ["get", "post", "head", "options"]
    permission_classes = [IsAuthenticated]
    filterset_class = PaymentFilter

    def get_queryset(self):
        return Payment.objects.select_related(
            "contract__student__user",
            "contract__student__group__specialty__department__faculty",
        ).all()

    def get_serializer_class(self):
        if self.action == "create":
            return CreatePaymentSerializer
        return PaymentListSerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(
            PaymentListSerializer(payment, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ScholarshipViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

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
