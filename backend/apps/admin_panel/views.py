"""Admin Panel views — Folder, Document, DictionaryItem, Analytics."""

from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import DictionaryItem, Document, Folder
from .serializers import (
    DictionaryItemSerializer,
    DocumentCreateSerializer,
    DocumentSerializer,
    FolderSerializer,
)


class FolderViewSet(ModelViewSet):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(parent=None).prefetch_related("children")


class DocumentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_fields = ["category", "folder", "priority", "status"]
    search_fields = ["title", "number", "description"]

    def get_queryset(self):
        return Document.objects.select_related("folder", "author").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return DocumentCreateSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class DictionaryItemViewSet(ModelViewSet):
    serializer_class = DictionaryItemSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["type", "is_active"]
    search_fields = ["code", "name"]

    def get_queryset(self):
        qs = DictionaryItem.objects.all()
        item_type = self.kwargs.get("type") or self.request.query_params.get("type")
        if item_type:
            qs = qs.filter(type=item_type)
        return qs


class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        from apps.crm.models import Lead
        from apps.hr.models import Employee
        from apps.students.models import Student

        return Response(
            {
                "students": {
                    "total": Student.objects.filter(is_deleted=False).count(),
                    "byStatus": list(
                        Student.objects.filter(is_deleted=False)
                        .values("status")
                        .annotate(count=Count("id"))
                    ),
                },
                "employees": {
                    "total": Employee.objects.filter(is_deleted=False).count(),
                    "byDepartment": list(
                        Employee.objects.filter(is_deleted=False)
                        .values("department__name")
                        .annotate(count=Count("id"))
                        .order_by("-count")[:10]
                    ),
                },
                "leads": {
                    "total": Lead.objects.count(),
                    "byStatus": list(Lead.objects.values("status").annotate(count=Count("id"))),
                },
                "documents": {
                    "total": Document.objects.count(),
                    "byCategory": list(
                        Document.objects.values("category").annotate(count=Count("id"))
                    ),
                },
            }
        )
