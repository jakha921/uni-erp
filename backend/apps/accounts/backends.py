"""Phone-based authentication backend — full implementation in Phase 2."""

from typing import Any

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.http import HttpRequest

User = get_user_model()


class PhoneBackend(ModelBackend):
    """Authenticate using phone number instead of username."""

    def authenticate(
        self,
        request: HttpRequest | None,
        phone: str | None = None,
        password: str | None = None,
        **kwargs: Any,
    ) -> Any:
        if phone is None or password is None:
            return None
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
