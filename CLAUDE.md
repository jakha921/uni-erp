# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Uni ERP — университетская ERP-система (BITU). Full-stack: Django backend + React frontend. Интерфейс на **узбекском языке** (i18n: uz/ru/en, default uz). 66 страниц, 17 модулей, полная service layer архитектура. Frontend подключён к реальному Django API (`VITE_USE_MOCK=false`). Backend: 36 тестов проходят.

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript 6 strict, Vite 8 (port 3000), Tailwind CSS 4, Zustand 5, TanStack Query 5, React Hook Form + Zod 4, Recharts 3, Lucide React, i18next |
| **Backend** | Django 5.1, DRF 3.15, SimpleJWT, django-filter, django-cors-headers, Unfold Admin |
| **Database** | SQLite (dev) / PostgreSQL 16 (prod) |
| **Infra** | Docker, Nginx, Gunicorn |
| **Package Managers** | `uv` (Python), `npm` (JS) |

## Commands

```bash
# Frontend
cd frontend
npm run dev              # Dev server :3000, proxy /api → :8000
npm run build            # TypeScript check + Vite build
npm run lint             # ESLint

# Backend
cd backend
uv run python manage.py runserver    # Dev server :8000
uv run python manage.py check       # Django system check
uv run pytest -v                     # 36 tests
uv run pytest -k test_name           # Single test
uv run ruff check --fix .            # Linter
uv run python manage.py makemigrations && uv run python manage.py migrate

# Seed data (in order)
uv run python manage.py seed_core
uv run python manage.py seed_students
uv run python manage.py seed_education
uv run python manage.py seed_finance
uv run python manage.py seed_hr

# Docker
docker compose up                              # Dev
docker compose -f docker-compose.prod.yml up   # Prod
```

## Architecture

### Backend (`backend/`)

```
backend/
├── config/
│   ├── settings/          # base.py, dev.py (default), prod.py
│   ├── urls.py            # /api/v1/ prefix for all apps
│   ├── wsgi.py, asgi.py
├── apps/
│   ├── core/              # Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester
│   ├── accounts/          # User (phone auth), UserRole, JWT login/logout/me, RBAC permissions
│   ├── students/          # Student CRUD, statistics, grades, attendance
│   ├── finance/           # Contract, Payment, Scholarship, Dashboard stats
│   ├── education/         # Subject, Schedule, Attendance, Grade (bulk endpoints)
│   └── hr/                # Employee, HrOrder, Leave, HrAttendance, Dashboard
├── manage.py
├── pyproject.toml
├── Dockerfile, Dockerfile.dev
```

Each app: `models.py`, `serializers.py`, `views.py`, `urls.py`, `filters.py`, `admin.py`, `tests/`, `management/commands/seed_*.py`

**Key patterns:**
- `BaseModel` — abstract base with `created_at`, `updated_at`, `created_by`, `updated_by`
- `AUTH_USER_MODEL = 'accounts.User'` — phone-based, no username
- `PhoneBackend` — custom auth backend in `accounts/backends.py`
- `RoleMiddleware` — sets `request.current_role` from UserRole
- `AuditMiddleware` — logs POST/PATCH/DELETE to AuditLog
- Soft delete (`is_deleted`) on Student, Contract, Employee
- `Contract.recalculate()` — auto-updates `paid_amount`/`debt_amount` after Payment

**API base:** `/api/v1/` — auth, core, students, finance, education, hr, system

### Frontend (`frontend/src/`)

**Directory structure:**
- **`@/` alias** → `./src/`
- **`features/`** — 17 feature modules: auth, students, finance, hr, crm, education, dashboard, operations, admin, system, profile, cabinets, science, infrastructure, warehouse, legacy, teachers
- **`components/`** — 17 shared UI components: `ui/` (Button, Badge, Avatar, Spinner, ProgressBar, Accordion, AlertBanner, Stepper, etc.), `form/` (FormField, FormInput, FormSelect, DateRangePicker, Combobox, FileUpload, SearchInput, etc.), `table/` (DataTable, Pagination, FilterBar), `layout/` (AppShell, Sidebar, Topbar, PageHeader, PageContent), `overlays/` (Modal, SlideOver, ConfirmDialog, DropdownMenu, ToastContainer), `data-display/` (Card, StatCard, ChartCard, DonutChart, BarChartSimple, LineChartSimple, EmptyState, StatusBadge), `navigation/` (Tabs, Breadcrumb)
- **`api/`** — full service layer architecture:
  - `client.ts` — ApiClient with ApiError class, retry logic, auto-logout on 401
  - `services/` — 31 service files (Interface + ApiService + MockService + USE_MOCK toggle)
  - `mock/` — 30 mock files with generated data using shared-data.ts generators
  - `hooks/` — 30 React Query hook files with KEYS factory pattern
- **`stores/`** — Zustand: `auth.store.ts`, `app.store.ts`, `ui.store.ts`
- **`config/`** — `api.ts` (24 endpoint sections), `roles.ts` (MODULE_ACCESS matrix), `navigation.ts`, `theme.ts`, `statuses.ts` (centralized status label+variant configs for all domains)
- **`types/`** — 22 TypeScript type files per domain
- **`hooks/`** — shared hooks: `useListFilters.ts` (generic filter/pagination state management)
- **`lib/`** — `utils.ts` (cn, formatMoney, formatDate, formatPhone), `permissions.ts`, `validators.ts`
- **`i18n/`** — uz.json, ru.json, en.json (default: uz)

**Service layer pattern (all 66 pages use this):**
```typescript
// types/<domain>.ts — TypeScript interfaces + DTOs
// api/services/<domain>.service.ts — Interface + ApiService + MockService
export const studentsService: IStudentsService = USE_MOCK
  ? new StudentsMockService()
  : new StudentsApiService();

// api/hooks/use<Domain>.ts — React Query hooks with KEYS factory
const KEYS = {
  all: ['students'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params) => [...KEYS.lists(), params] as const,
};

// features/<module>/schemas/<name>.schema.ts — Zod validation
```
`VITE_USE_MOCK=false` in `.env` activates real API calls for all 66 pages.

**DRF Integration (api/client.ts):**
- `transformPaginated(drf, page, pageSize)` — converts DRF `{count, results}` → frontend `{data, total, page, pageSize, totalPages}`
- `drfListToArray(drf)` — unwraps DRF paginated responses that return arrays (orders, leaves, scholarships)
- All ApiService classes use these helpers in their real API methods
- Demo users: admin `+998901234567`/`admin123`, buxgalter `+998902345678`/`demo123`, dekan `+998903456789`/`demo123`, oqituvchi `+998904567890`/`demo123`, talaba `+998905678901`/`demo123`

**Frontend service coverage:**

| Domain | Services | Mocks | Hooks | Types | Schemas | Pages |
|--------|----------|-------|-------|-------|---------|-------|
| Auth | 1 | 1 | — | auth.ts | 1 | 3 |
| Core | 1 | 1 | 1 | core.ts | — | — |
| Students | 1 | 1 | 1 | student.ts | 1 | 4 |
| Finance | 3 (finance, payroll, budget) | 3 | 3 | finance.ts | 3 | 9 |
| HR | 1 | 1 | 1 | hr.ts | 3 | 7 |
| Education | 6 (edu, exam, curriculum, library, alumni, internship) | 6 | 6 | education.ts | 6 | 11 |
| CRM | 1 | 1 | 1 | crm.ts | 1 | 3 |
| Teachers | 1 | 1 | 1 | teacher.ts | — | 1 |
| Science | 1 | 1 | 1 | science.ts | 5 | 4 |
| Operations | 6 (task, notification, message, appeal, news, report) | 6 | 6 | operations.ts | 3 | 6 |
| Dashboard | 1 | 1 | 1 | dashboard.ts | — | 1 |
| System | 1 | 1 | 1 | system.ts | — | 4 |
| Admin | 3 (dms, analytics, dictionary) | 3 | 3 | admin.ts | — | 3 |
| Infrastructure | 1 | 1 | 1 | infrastructure.ts | — | 3 |
| Warehouse | 1 | 1 | 1 | warehouse.ts | — | 1 |
| Legacy | 1 | 1 | 1 | legacy.ts | — | 2 |
| Cabinets | 1 | 1 | 1 | cabinet.ts | — | 2 |
| Profile/Settings | — | — | — | — | — | 2 |
| **Total** | **31** | **30** | **30** | **22** | **23** | **66** |

### Roles & Access

5 roles: `admin`, `buxgalter`, `dekan`, `oqituvchi`, `talaba` (RoleKey union in `types/auth.ts`).

Access matrix in `config/roles.ts` (MODULE_ACCESS). Backend mirrors this with permission classes: `IsAdmin`, `IsBuxgalter`, `IsDekan`, `IsOqituvchi`, `HasModuleAccess`.

### Layout & Routing

`AppShell` = Sidebar (collapsible 240px→72px) + Topbar + Outlet. `router.tsx` — 68 routes, lazy loading via `<Lazy>` wrapper. Auth guards: `AuthGuard`, `GuestGuard`, `RoleGuard`.

### Design Tokens

Tailwind v4 via `@theme` in `globals.css`. Primary: `#2DB976` (emerald green). Font: Inter. Card: `rounded-2xl`, shadow `0 1px 3px rgba(0,0,0,0.08)`.

## Conventions

- `cn()` for conditional Tailwind classes (clsx + tailwind-merge)
- `formatMoney()` → `"1 234 567 so'm"`, phones: `+998 (XX) XXX-XX-XX`
- Named exports (lazy imports via `.then(m => ({ default: m.Component }))`)
- React Query key factory pattern (KEYS.all → KEYS.lists() → KEYS.list(params))
- `useListFilters()` hook for filter/pagination state in list pages
- Centralized status configs in `config/statuses.ts` (getStatusConfig helper)
- Backend serializers match frontend TypeScript interfaces in `types/`
- Seed data matches frontend mock data for visual consistency
- All pages use service layer hooks (zero inline mock data in page components)
