"""Development settings — SQLite (local) or PostgreSQL (Docker), DEBUG=True."""

import os

import dj_database_url

from .base import *  # noqa: F401, F403

DEBUG = True

SECRET_KEY = "django-insecure-dev-secret-key-change-in-production-12345"

ALLOWED_HOSTS = ["*"]

_db_url = os.environ.get("DATABASE_URL")
if _db_url:
    DATABASES = {"default": dj_database_url.config(default=_db_url, conn_max_age=60)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",  # type: ignore[name-defined]
        }
    }

CORS_ALLOW_ALL_ORIGINS = True
