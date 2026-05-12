from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    MeView,
    ResetPasswordView,
    RoleListView,
    UserViewSet,
    VerifyCodeView,
)

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
    path("auth/forgot-password/", ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("auth/verify-code/", VerifyCodeView.as_view(), name="auth-verify-code"),
    path("auth/reset-password/", ResetPasswordView.as_view(), name="auth-reset-password"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("roles/", RoleListView.as_view(), name="role-list"),
    path("roles", RoleListView.as_view()),
    path("", include(router.urls)),
]
