"""Operations ViewSets — Tasks, Notifications, Appeals, News."""

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .filters import AppealFilter, NewsFilter, NotificationFilter, TaskFilter
from .models import Appeal, AppealComment, News, Notification, Task
from .serializers import (
    AppealCreateSerializer,
    AppealSerializer,
    NewsCreateSerializer,
    NewsSerializer,
    NotificationSerializer,
    TaskCreateSerializer,
    TaskSerializer,
)


class TaskViewSet(ModelViewSet):
    """CRUD для задач."""

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
    """Уведомления текущего пользователя."""

    permission_classes = [IsAuthenticated]
    filterset_class = NotificationFilter
    serializer_class = NotificationSerializer
    http_method_names = ["get", "delete"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="read")
    def mark_all_read(self, request):
        """Пометить все уведомления как прочитанные."""
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"status": "ok"})

    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request, pk=None):
        """Пометить одно уведомление как прочитанное."""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response({"status": "ok"})


class AppealViewSet(ModelViewSet):
    """CRUD для обращений с комментариями."""

    permission_classes = [IsAuthenticated]
    filterset_class = AppealFilter
    search_fields = ["title", "description"]

    def get_queryset(self):
        return (
            Appeal.objects.select_related("author", "assignee")
            .prefetch_related("comments__author")
            .all()
        )

    def get_serializer_class(self):
        if self.action in ("create",):
            return AppealCreateSerializer
        return AppealSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"], url_path="comments")
    def add_comment(self, request, pk=None):
        """Добавить комментарий к обращению."""
        appeal = self.get_object()
        content = request.data.get("content", "")
        if not content:
            return Response(
                {"detail": "content required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        AppealComment.objects.create(appeal=appeal, author=request.user, content=content)
        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)


class NewsViewSet(ModelViewSet):
    """CRUD для новостей."""

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
