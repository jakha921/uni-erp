"""Accounts models — phone-based User and UserRole."""

from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager


class User(AbstractUser):
    """Custom user model using phone as the unique identifier."""

    username = None  # type: ignore[assignment]
    objects = CustomUserManager()  # type: ignore[assignment]
    phone = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    branch = models.ForeignKey(
        "core.Branch",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users",
    )
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"

    @property
    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name} {self.middle_name}".strip()

    @property
    def initials(self) -> str:
        parts = [self.last_name, self.first_name]
        return "".join(p[0].upper() for p in parts if p)

    def __str__(self) -> str:
        return self.full_name or self.phone


class UserRole(models.Model):
    """Maps a user to a role, optionally scoped to a faculty or department."""

    ROLE_CHOICES = [
        ("admin", "Administrator"),
        ("buxgalter", "Buxgalter"),
        ("dekan", "Dekan"),
        ("oqituvchi", "O'qituvchi"),
        ("talaba", "Talaba"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="roles")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    faculty = models.ForeignKey("core.Faculty", null=True, blank=True, on_delete=models.SET_NULL)
    department = models.ForeignKey(
        "core.Department", null=True, blank=True, on_delete=models.SET_NULL
    )
    is_primary = models.BooleanField(default=True)

    class Meta:
        unique_together = ["user", "role"]
        verbose_name = "Foydalanuvchi roli"
        verbose_name_plural = "Foydalanuvchi rollari"

    def __str__(self) -> str:
        return f"{self.user} — {self.role}"


class PasswordResetCode(models.Model):
    """SMS орқали паролни тиклаш коди."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_codes")
    code = models.CharField(max_length=6)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user.phone} — {self.code}"

    def is_valid(self) -> bool:
        from django.utils import timezone

        return not self.is_used and self.expires_at > timezone.now()
