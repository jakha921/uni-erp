"""Admin Panel serializers — Folder, Document, DictionaryItem."""

from rest_framework import serializers

from .models import DictionaryItem, Document, Folder


class FolderSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ["id", "name", "parent", "children", "created_at"]

    def get_children(self, obj: Folder) -> list:
        return FolderSerializer(obj.children.all(), many=True).data


class DocumentSerializer(serializers.ModelSerializer):
    folderName = serializers.CharField(source="folder.name", read_only=True)
    authorName = serializers.SerializerMethodField()
    categoryLabel = serializers.SerializerMethodField()
    priorityLabel = serializers.SerializerMethodField()
    statusLabel = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "number",
            "category",
            "categoryLabel",
            "folder",
            "folderName",
            "priority",
            "priorityLabel",
            "status",
            "statusLabel",
            "author",
            "authorName",
            "file",
            "description",
            "created_at",
            "updated_at",
        ]

    def get_authorName(self, obj: Document) -> str:
        return obj.author.full_name if obj.author else ""

    def get_categoryLabel(self, obj: Document) -> str:
        return obj.get_category_display()

    def get_priorityLabel(self, obj: Document) -> str:
        return obj.get_priority_display()

    def get_statusLabel(self, obj: Document) -> str:
        return obj.get_status_display()


class DocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "title",
            "number",
            "category",
            "folder",
            "priority",
            "status",
            "description",
            "file",
        ]


class DictionaryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryItem
        fields = [
            "id",
            "type",
            "code",
            "name",
            "description",
            "sort_order",
            "is_active",
            "created_at",
        ]
