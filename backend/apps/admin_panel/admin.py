"""Admin Panel admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import DictionaryItem, Document, Folder


@admin.register(Folder)
class FolderAdmin(ModelAdmin):
    list_display = ["name", "parent"]
    search_fields = ["name"]


@admin.register(Document)
class DocumentAdmin(ModelAdmin):
    list_display = [
        "title",
        "number",
        "category",
        "folder",
        "priority",
        "status",
        "author",
        "created_at",
    ]
    list_filter = ["category", "priority", "status"]
    search_fields = ["title", "number", "description"]


@admin.register(DictionaryItem)
class DictionaryItemAdmin(ModelAdmin):
    list_display = ["type", "code", "name", "sort_order", "is_active"]
    list_filter = ["type", "is_active"]
    search_fields = ["code", "name"]
