"""Auth views — Login, Logout, Me, UserViewSet, RoleListView."""

from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserRole
from .permissions import IsAdmin
from .serializers import (
    CreateUserSerializer,
    LoginSerializer,
    UserListSerializer,
    UserSerializer,
)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "token": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token talab qilinadi."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Token yaroqsiz yoki muddati o'tgan."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserViewSet(ModelViewSet):
    permission_classes = [IsAdmin]
    search_fields = ["phone", "first_name", "last_name", "email"]

    def get_queryset(self):
        return User.objects.prefetch_related("roles").order_by("-date_joined")

    def get_serializer_class(self):
        if self.action == "create":
            return CreateUserSerializer
        return UserListSerializer

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserListSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )

    def destroy(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        instance.is_active = False
        instance.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class RoleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        roles = [{"code": code, "name": name} for code, name in UserRole.ROLE_CHOICES]
        return Response(roles)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        import random
        from datetime import timedelta

        from django.utils import timezone

        from apps.core.sms import send_sms

        from .models import PasswordResetCode

        phone = request.data.get("phone", "").strip()
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {"detail": "Foydalanuvchi topilmadi."}, status=status.HTTP_404_NOT_FOUND
            )

        code = f"{random.randint(100000, 999999)}"
        PasswordResetCode.objects.create(
            user=user,
            code=code,
            expires_at=timezone.now() + timedelta(minutes=10),
        )
        send_sms(phone, f"Parolni tiklash kodi: {code}. 10 daqiqa ichida amal qiladi.")
        return Response({"detail": "SMS yuborildi."})


class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        from .models import PasswordResetCode

        phone = request.data.get("phone", "").strip()
        code = request.data.get("code", "").strip()
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {"detail": "Foydalanuvchi topilmadi."}, status=status.HTTP_404_NOT_FOUND
            )

        reset = (
            PasswordResetCode.objects.filter(user=user, code=code).order_by("-created_at").first()
        )
        if not reset or not reset.is_valid():
            return Response(
                {"detail": "Kod noto'g'ri yoki muddati o'tgan."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"detail": "Kod tasdiqlandi."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        from .models import PasswordResetCode

        phone = request.data.get("phone", "").strip()
        code = request.data.get("code", "").strip()
        new_password = request.data.get("newPassword", "").strip()
        if len(new_password) < 6:
            return Response(
                {"detail": "Parol kamida 6 belgi bo'lishi kerak."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {"detail": "Foydalanuvchi topilmadi."}, status=status.HTTP_404_NOT_FOUND
            )

        reset = (
            PasswordResetCode.objects.filter(user=user, code=code).order_by("-created_at").first()
        )
        if not reset or not reset.is_valid():
            return Response(
                {"detail": "Kod noto'g'ri yoki muddati o'tgan."}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])
        reset.is_used = True
        reset.save(update_fields=["is_used"])
        return Response({"detail": "Parol yangilandi."})


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        old_password = request.data.get("oldPassword", "")
        new_password = request.data.get("newPassword", "")
        if not request.user.check_password(old_password):
            return Response({"detail": "Eski parol noto'g'ri."}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 6:
            return Response(
                {"detail": "Yangi parol kamida 6 belgi bo'lishi kerak."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response({"detail": "Parol muvaffaqiyatli o'zgartirildi."})
