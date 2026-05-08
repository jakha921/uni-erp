from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import StatisticsView, StudentViewSet

router = DefaultRouter()
router.register("", StudentViewSet, basename="student")

urlpatterns = [
    path("statistics/", StatisticsView.as_view(), name="student-statistics"),
] + router.urls
