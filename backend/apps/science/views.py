"""Science ViewSets — Research, Articles, Grants, Conferences, Theses, Patents."""

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Article, Conference, Grant, Patent, ResearchProject, Thesis
from .serializers import (
    ArticleSerializer,
    ConferenceSerializer,
    GrantSerializer,
    PatentSerializer,
    ResearchProjectSerializer,
    ThesisSerializer,
)


class ResearchProjectViewSet(ModelViewSet):
    queryset = ResearchProject.objects.select_related("leader").all()
    serializer_class = ResearchProjectSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title", "department"]
    filterset_fields = ["status"]


class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title", "authors", "journal"]
    filterset_fields = ["type", "year"]


class GrantViewSet(ModelViewSet):
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status"]


class ConferenceViewSet(ModelViewSet):
    queryset = Conference.objects.all()
    serializer_class = ConferenceSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name"]
    filterset_fields = ["status", "type"]


class ThesisViewSet(ModelViewSet):
    queryset = Thesis.objects.select_related("student", "supervisor").all()
    serializer_class = ThesisSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title"]
    filterset_fields = ["stage", "type"]


class PatentViewSet(ModelViewSet):
    queryset = Patent.objects.all()
    serializer_class = PatentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title", "inventors"]
    filterset_fields = ["status"]
