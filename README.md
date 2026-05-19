# Uni ERP

> University ERP system covering the full lifecycle from admissions to finance, HR, and operations.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-DRF-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker&logoColor=white)
![CI](https://github.com/jakha921/uni-erp/actions/workflows/ci.yml/badge.svg)

## Overview

A modular university management platform with a Django REST Framework backend
and a React + TypeScript frontend. Integrates with HEMIS — the Uzbekistan
national higher education management system.

## Modules

| Module | Responsibility |
|--------|---------------|
| `accounts` | Authentication, RBAC, user profiles |
| `crm` | Admissions pipeline, applicant tracking |
| `education` | Programs, curriculum, academic calendar |
| `students` | Enrollment, grades, attendance, documents |
| `finance` | Tuition fees, payments, financial reporting |
| `hr` | Staff records, contracts, leave management |
| `science` | Research projects, publications |
| `operations` | Facilities, asset management |
| `system` | Settings, audit logs, notifications |
| `warehouse` | Inventory and procurement |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django, Django REST Framework, PostgreSQL |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Infrastructure | Docker, Docker Compose (dev + prod), Nginx |
| CI/CD | GitHub Actions (lint + test → deploy) |
| Integration | HEMIS API (national university registry) |

## Quick Start

```bash
# Start all services
docker-compose up -d

# Backend — run migrations and create superuser
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# Frontend dev server (optional, frontend is served via Nginx in prod)
cd frontend && npm install && npm run dev
```

API available at `http://localhost:8000/api/`  
Admin panel at `http://localhost:8000/admin/`

## Project Structure

```
backend/
  apps/         — 13 Django apps (see Modules table above)
  core/         — shared utilities, permissions, base views
frontend/       — React + TypeScript + Vite SPA
nginx/          — reverse proxy config
.github/
  workflows/    — ci.yml (lint + test), deploy.yml
```

## License

MIT
