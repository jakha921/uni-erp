#!/bin/sh
set -e

echo "Running migrations..."
uv run python manage.py migrate --noinput

echo "Collecting static files..."
uv run python manage.py collectstatic --noinput || true

# Seed data only if DB is empty (first deploy)
STUDENT_COUNT=$(uv run python manage.py shell -c "from apps.students.models import Student; print(Student.objects.count())" 2>/dev/null || echo "0")
if [ "$STUDENT_COUNT" = "0" ]; then
    echo "Database is empty. Running seed commands..."
    uv run python manage.py seed_core || true
    uv run python manage.py seed_students || true
    uv run python manage.py seed_education || true
    uv run python manage.py seed_finance || true
    uv run python manage.py seed_hr || true
    uv run python manage.py seed_crm || true
    uv run python manage.py seed_operations || true
    uv run python manage.py seed_science || true
    uv run python manage.py seed_infrastructure || true
    uv run python manage.py seed_warehouse || true

    echo "Creating admin user..."
    uv run python manage.py shell -c "
from apps.accounts.models import User, UserRole
if not User.objects.filter(phone='+998901234567').exists():
    admin = User.objects.create_superuser(phone='+998901234567', password='admin123', first_name='Admin', last_name='Adminov', middle_name='Akramovich', email='admin@bitu.uz')
    UserRole.objects.create(user=admin, role='admin')
    print('Admin user created')
else:
    print('Admin already exists')
" || true
    echo "Seed data completed."
else
    echo "Database has $STUDENT_COUNT students. Skipping seed."
fi

echo "Starting Gunicorn..."
exec uv run gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
