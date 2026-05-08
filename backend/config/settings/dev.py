"""Development settings — SQLite, DEBUG=True, CORS open."""

from .base import *  # noqa: F401, F403

DEBUG = True

SECRET_KEY = "django-insecure-dev-secret-key-change-in-production-12345"

ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CORS_ALLOW_ALL_ORIGINS = True
