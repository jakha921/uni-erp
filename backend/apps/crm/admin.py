from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(ModelAdmin):
    list_display = ["first_name", "last_name", "phone", "status", "source", "score", "created_at"]
    list_filter = ["status", "source"]
    search_fields = ["first_name", "last_name", "phone"]
