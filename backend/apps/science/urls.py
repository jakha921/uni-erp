from rest_framework.routers import DefaultRouter

from .views import (
    ArticleViewSet,
    ConferenceViewSet,
    GrantViewSet,
    PatentViewSet,
    ResearchProjectViewSet,
    ThesisViewSet,
)

router = DefaultRouter()
router.register("projects", ResearchProjectViewSet, basename="research-project")
router.register("articles", ArticleViewSet, basename="article")
router.register("grants", GrantViewSet, basename="grant")
router.register("conferences", ConferenceViewSet, basename="conference")
router.register("theses", ThesisViewSet, basename="thesis")
router.register("patents", PatentViewSet, basename="patent")

urlpatterns = router.urls
