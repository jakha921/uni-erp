from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, LogoutView, MeView, RoleListView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/login", LoginView.as_view()),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/logout", LogoutView.as_view()),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/me", MeView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("auth/token/refresh", TokenRefreshView.as_view()),
    path("roles/", RoleListView.as_view(), name="role-list"),
    path("roles", RoleListView.as_view()),
    path("", include(router.urls)),
]
