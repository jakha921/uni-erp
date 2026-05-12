from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AnalyticsView, DictionaryItemViewSet, DocumentViewSet, FolderViewSet

router = DefaultRouter()
router.register("dms/folders", FolderViewSet, basename="folder")
router.register("dms/documents", DocumentViewSet, basename="document")
router.register("dictionary", DictionaryItemViewSet, basename="dictionary")

urlpatterns = [
    path("analytics/", AnalyticsView.as_view(), name="analytics"),
] + router.urls
