"""Operations serializers."""

from rest_framework import serializers

from .models import Appeal, AppealComment, News, Notification, Task


class TaskSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения задач."""

    assigneeName = serializers.CharField(
        source="assignee.get_full_name", read_only=True, default=""
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "assignee",
            "assigneeName",
            "priority",
            "status",
            "due_date",
            "tags",
            "created_at",
            "updated_at",
        ]


class TaskCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания/обновления задач."""

    class Meta:
        model = Task
        fields = ["title", "description", "assignee", "priority", "due_date", "tags"]


class NotificationSerializer(serializers.ModelSerializer):
    """Сериализатор для уведомлений."""

    class Meta:
        model = Notification
        fields = ["id", "title", "message", "type", "is_read", "link", "created_at"]


class AppealCommentSerializer(serializers.ModelSerializer):
    """Сериализатор для комментариев к обращениям."""

    authorName = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = AppealComment
        fields = ["id", "authorName", "content", "created_at"]


class AppealSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения обращений."""

    authorName = serializers.CharField(source="author.get_full_name", read_only=True, default="")
    assigneeName = serializers.CharField(
        source="assignee.get_full_name", read_only=True, default=""
    )
    comments = AppealCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Appeal
        fields = [
            "id",
            "title",
            "description",
            "category",
            "status",
            "author",
            "authorName",
            "assignee",
            "assigneeName",
            "comments",
            "created_at",
            "updated_at",
        ]


class AppealCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания обращений."""

    class Meta:
        model = Appeal
        fields = ["title", "description", "category"]


class NewsSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения новостей."""

    authorName = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "content",
            "excerpt",
            "authorName",
            "category",
            "tags",
            "image",
            "is_pinned",
            "created_at",
        ]


class NewsCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания/обновления новостей."""

    class Meta:
        model = News
        fields = ["title", "content", "excerpt", "category", "tags", "image"]
