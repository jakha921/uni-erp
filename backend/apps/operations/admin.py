"""Operations admin configuration."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Appeal, News, Notification, Task


@admin.register(Task)
class TaskAdmin(ModelAdmin):
    list_display = ["title", "assignee", "priority", "status", "due_date"]
    list_filter = ["status", "priority"]


@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = ["title", "user", "type", "is_read", "created_at"]
    list_filter = ["type", "is_read"]


@admin.register(Appeal)
class AppealAdmin(ModelAdmin):
    list_display = ["title", "category", "status", "author", "created_at"]
    list_filter = ["status", "category"]


@admin.register(News)
class NewsAdmin(ModelAdmin):
    list_display = ["title", "category", "is_pinned", "created_at"]
    list_filter = ["category", "is_pinned"]
