"""Production settings — PostgreSQL, DEBUG=False, secure headers."""

import os

import dj_database_url

from .base import *  # noqa: F401, F403

DEBUG = False

SECRET_KEY = os.environ["SECRET_KEY"]

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ["DATABASE_URL"],
        conn_max_age=600,
        conn_health_checks=True,
    )
}

CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # type: ignore[name-defined]
MEDIA_ROOT = os.path.join(BASE_DIR, "media")  # type: ignore[name-defined]

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
