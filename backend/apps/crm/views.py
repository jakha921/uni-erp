"""CRM ViewSets for lead management."""

from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .filters import LeadFilter
from .models import Lead
from .serializers import LeadCreateSerializer, LeadDetailSerializer, LeadListSerializer


class LeadViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = LeadFilter
    search_fields = ["first_name", "last_name", "phone", "direction"]
    ordering_fields = ["created_at", "score", "status"]

    def get_queryset(self):
        return Lead.objects.filter(is_deleted=False).select_related("assignee")

    def get_serializer_class(self):
        if self.action == "list":
            return LeadListSerializer
        if self.action in ("create", "update", "partial_update"):
            return LeadCreateSerializer
        return LeadDetailSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    @action(detail=False, methods=["get"])
    def stats(self, request):
        qs = self.get_queryset()
        total = qs.count()
        new_leads = qs.filter(status="new").count()
        enrolled = qs.filter(status="enrolled").count()
        conversion = round(enrolled / total * 100, 1) if total else 0

        by_source = list(qs.values("source").annotate(count=Count("id")).order_by("-count"))
        by_status = list(qs.values("status").annotate(count=Count("id")).order_by("-count"))

        return Response(
            {
                "totalLeads": total,
                "newLeads": new_leads,
                "enrolledLeads": enrolled,
                "conversionRate": conversion,
                "bySource": by_source,
                "byStatus": by_status,
            }
        )

    @action(detail=False, methods=["post"], url_path="bulk-status")
    def bulk_status(self, request):
        ids = request.data.get("ids", [])
        new_status = request.data.get("status")
        if not ids or not new_status:
            return Response(
                {"detail": "ids and status required"}, status=status.HTTP_400_BAD_REQUEST
            )
        updated = Lead.objects.filter(id__in=ids, is_deleted=False).update(status=new_status)
        return Response({"updated": updated})

    @action(detail=False, methods=["get"], url_path="export")
    def export_excel(self, request):
        from apps.core.export import export_to_excel

        qs = self.filter_queryset(self.get_queryset())
        data = []
        for lead in qs[:1000]:
            data.append(
                {
                    "id": lead.id,
                    "name": f"{lead.first_name} {lead.last_name}",
                    "phone": lead.phone,
                    "email": lead.email,
                    "direction": lead.direction,
                    "source": lead.get_source_display(),
                    "status": lead.get_status_display(),
                    "score": lead.score,
                    "created_at": lead.created_at,
                }
            )
        columns = [
            ("id", "ID"),
            ("name", "F.I.O"),
            ("phone", "Telefon"),
            ("email", "Email"),
            ("direction", "Yo'nalish"),
            ("source", "Manba"),
            ("status", "Holat"),
            ("score", "Ball"),
            ("created_at", "Yaratilgan sana"),
        ]
        return export_to_excel(data, columns, filename="lidlar", sheet_name="CRM Lidlar")
