"""Operations serializers."""

from rest_framework import serializers

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


class TaskSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Task
        fields = ["title", "description", "assignee", "priority", "due_date", "tags"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "type", "is_read", "link", "created_at"]


class AppealCommentSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source="author.get_full_name", read_only=True, default="")

    class Meta:
        model = AppealComment
        fields = ["id", "authorName", "content", "created_at"]


class AppealSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = Appeal
        fields = ["title", "description", "category"]


class NewsSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = News
        fields = ["title", "content", "excerpt", "category", "tags", "image"]


class ChatMessageSerializer(serializers.ModelSerializer):
    senderName = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ["id", "thread", "sender", "senderName", "content", "is_read", "created_at"]

    def get_senderName(self, obj: ChatMessage) -> str:
        return obj.sender.full_name


class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["content"]


class ChatThreadSerializer(serializers.ModelSerializer):
    lastMessage = serializers.SerializerMethodField()
    participantCount = serializers.SerializerMethodField()

    class Meta:
        model = ChatThread
        fields = [
            "id",
            "title",
            "is_group",
            "participants",
            "participantCount",
            "lastMessage",
            "created_at",
            "updated_at",
        ]

    def get_lastMessage(self, obj: ChatThread) -> dict | None:
        msg = obj.messages.order_by("-created_at").first()
        if not msg:
            return None
        return {
            "content": msg.content,
            "sender": msg.sender.full_name,
            "createdAt": msg.created_at.isoformat(),
        }

    def get_participantCount(self, obj: ChatThread) -> int:
        return obj.participants.count()


class ReportTemplateSerializer(serializers.ModelSerializer):
    typeLabel = serializers.SerializerMethodField()
    formatLabel = serializers.SerializerMethodField()

    class Meta:
        model = ReportTemplate
        fields = [
            "id",
            "name",
            "report_type",
            "typeLabel",
            "format",
            "formatLabel",
            "parameters",
            "description",
            "is_active",
            "created_at",
        ]

    def get_typeLabel(self, obj: ReportTemplate) -> str:
        return obj.get_report_type_display()

    def get_formatLabel(self, obj: ReportTemplate) -> str:
        return obj.get_format_display()
