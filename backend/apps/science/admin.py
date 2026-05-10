from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Article, Conference, Grant, Patent, ResearchProject, Thesis


@admin.register(ResearchProject)
class ResearchProjectAdmin(ModelAdmin):
    list_display = ["title", "leader", "status", "progress"]
    list_filter = ["status"]


@admin.register(Article)
class ArticleAdmin(ModelAdmin):
    list_display = ["title", "journal", "year", "type", "citations"]
    list_filter = ["type", "year"]


@admin.register(Grant)
class GrantAdmin(ModelAdmin):
    list_display = ["project_name", "sponsor", "amount", "status"]


@admin.register(Conference)
class ConferenceAdmin(ModelAdmin):
    list_display = ["name", "date", "type", "status"]


@admin.register(Thesis)
class ThesisAdmin(ModelAdmin):
    list_display = ["title", "student", "supervisor", "stage", "type"]
    list_filter = ["stage", "type"]


@admin.register(Patent)
class PatentAdmin(ModelAdmin):
    list_display = ["title", "status", "application_date"]
    list_filter = ["status"]
