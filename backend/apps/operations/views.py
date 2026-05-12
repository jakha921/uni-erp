"""Operations ViewSets — Tasks, Notifications, Appeals, News, Chat, Reports."""

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import AppealFilter, NewsFilter, NotificationFilter, TaskFilter
from .models import (
    Appeal,
    AppealComment,
    ChatMessage,
    ChatThread,
    News,
    Notification,
    ReportTemplate,
    Task,
)
from .serializers import (
    AppealCreateSerializer,
    AppealSerializer,
    ChatMessageCreateSerializer,
    ChatMessageSerializer,
    ChatThreadSerializer,
    NewsCreateSerializer,
    NewsSerializer,
    NotificationSerializer,
    ReportTemplateSerializer,
    TaskCreateSerializer,
    TaskSerializer,
)


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]

    def get_queryset(self):
        return Task.objects.select_related("assignee").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return TaskCreateSerializer
        return TaskSerializer


class NotificationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = NotificationFilter

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).all()

    def get_serializer_class(self):
        return NotificationSerializer

    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request: Request, pk=None) -> Response:
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return Response({"status": "read"})

    @action(detail=False, methods=["post"], url_path="read-all")
    def mark_all_read(self, request: Request) -> Response:
        count = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"updated": count})


class AppealViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = AppealFilter
    search_fields = ["title", "description"]

    def get_queryset(self):
        return (
            Appeal.objects.select_related("author", "assignee").prefetch_related("comments").all()
        )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return AppealCreateSerializer
        return AppealSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"], url_path="comment")
    def add_comment(self, request: Request, pk=None) -> Response:
        appeal = self.get_object()
        content = request.data.get("content", "").strip()
        if not content:
            return Response({"detail": "content required."}, status=status.HTTP_400_BAD_REQUEST)
        AppealComment.objects.create(appeal=appeal, author=request.user, content=content)
        return Response(AppealSerializer(appeal).data)


class NewsViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = NewsFilter
    search_fields = ["title", "content"]

    def get_queryset(self):
        return News.objects.select_related("author").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return NewsCreateSerializer
        return NewsSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ChatThreadViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatThreadSerializer

    def get_queryset(self):
        return (
            ChatThread.objects.filter(participants=self.request.user)
            .prefetch_related("participants", "messages")
            .distinct()
        )

    def perform_create(self, serializer):
        thread = serializer.save()
        thread.participants.add(self.request.user)

    @action(detail=True, methods=["get", "post"], url_path="messages")
    def messages(self, request: Request, pk=None) -> Response:
        thread = self.get_object()
        if request.method == "GET":
            msgs = thread.messages.select_related("sender").order_by("created_at")
            return Response(ChatMessageSerializer(msgs, many=True).data)
        serializer = ChatMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        msg = ChatMessage.objects.create(
            thread=thread, sender=request.user, content=serializer.validated_data["content"]
        )
        thread.save()  # update updated_at
        return Response(ChatMessageSerializer(msg).data, status=status.HTTP_201_CREATED)


class ReportTemplateViewSet(ModelViewSet):
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["report_type", "format", "is_active"]

    def get_queryset(self):
        return ReportTemplate.objects.all()


class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        template_id = request.data.get("templateId")
        params = request.data.get("params", {})
        try:
            template = ReportTemplate.objects.get(id=template_id, is_active=True)
        except ReportTemplate.DoesNotExist:
            return Response({"detail": "Template topilmadi."}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            {
                "templateId": template.id,
                "name": template.name,
                "format": template.format,
                "params": params,
                "status": "generated",
                "message": f"{template.name} hisoboti tayyor.",
            }
        )
