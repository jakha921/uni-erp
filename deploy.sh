#!/bin/bash
set -e

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building Docker images..."
docker compose build

echo "==> Starting services..."
docker compose up -d

echo "==> Running migrations..."
docker compose exec backend uv run python manage.py migrate --settings=config.settings.prod

echo "==> Collecting static files..."
docker compose exec backend uv run python manage.py collectstatic --noinput --settings=config.settings.prod

echo "==> Deploy complete."
docker compose ps
