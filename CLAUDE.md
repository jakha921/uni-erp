# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Uni ERP — университетская ERP-система (BITU). Full-stack: Django backend + React frontend. Интерфейс на **узбекском языке** (i18n: uz/ru/en, default uz). 66 страниц, 17 модулей, полная service layer архитектура. Задеплоен на **https://erp.niuedu.uz** (Coolify + Docker + PostgreSQL + SSL).

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript 6 strict, Vite 8 (port 3000), Tailwind CSS 4, Zustand 5, TanStack Query 5, React Hook Form + Zod 4, Recharts 3, Lucide React, i18next, Vitest |
| **Backend** | Django 5.1, DRF 3.15, SimpleJWT, django-filter, django-cors-headers, Unfold Admin, openpyxl, reportlab |
| **Database** | SQLite (dev) / PostgreSQL 16 (prod) |
| **Payments** | Payme (JSON-RPC webhook), Click (callback webhook) |
| **SMS** | Eskiz API (eskiz.uz) |
| **Infra** | Docker, Nginx, Gunicorn, Coolify, Let's Encrypt SSL, GitHub Actions CI/CD |
| **Package Managers** | `uv` (Python), `npm` (JS) |

## Commands

```bash
# Frontend
cd frontend
npm run dev              # Dev server :3000, proxy /api → :8000
npm run build            # TypeScript check + Vite build
npm run lint             # ESLint
npm test                 # Vitest (34 tests)
npm run test:run         # Vitest single run
npm run test:coverage    # Vitest with coverage

# Backend
cd backend
uv run python manage.py runserver    # Dev server :8000
uv run python manage.py check       # Django system check
uv run pytest -v                     # 36 tests
uv run pytest -k test_name           # Single test
uv run ruff check --fix .            # Linter
uv run python manage.py makemigrations && uv run python manage.py migrate

# Seed data (in order, all 10 commands)
uv run python manage.py seed_core
uv run python manage.py seed_students
uv run python manage.py seed_education
uv run python manage.py seed_finance
uv run python manage.py seed_hr
uv run python manage.py seed_crm
uv run python manage.py seed_operations
uv run python manage.py seed_science
uv run python manage.py seed_infrastructure
uv run python manage.py seed_warehouse

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
│   ├── core/              # Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester + export/pdf/sms/notifications utilities
│   ├── accounts/          # User (phone auth), UserRole, JWT login/logout/me, RBAC permissions
│   ├── students/          # Student CRUD, statistics, grades, attendance, Excel/PDF export
│   ├── finance/           # Contract, Payment, Scholarship, Dashboard, Payme/Click integration
│   ├── education/         # Subject, Schedule, Attendance, Grade (bulk endpoints)
│   ├── hr/                # Employee, HrOrder, Leave, HrAttendance, Dashboard, Excel export
│   ├── crm/               # Lead CRUD, stats, bulk status, Excel export
│   ├── operations/        # Task, Notification, Appeal, News CRUD
│   ├── system/            # System user management, roles, audit log
│   ├── infrastructure/    # DormBuilding, DormRoom, Equipment, Vehicle CRUD
│   ├── science/           # ResearchProject, Article, Grant, Conference, Thesis, Patent
│   ├── warehouse/         # WarehouseItem, StockMovement CRUD + stats
│   └── legacy/            # LegacyOrder, StaffingPosition (read-only archive)
├── manage.py
├── pyproject.toml
├── Dockerfile, Dockerfile.dev
```

Each app: `models.py`, `serializers.py`, `views.py`, `urls.py`, `filters.py`, `admin.py`, `tests/`, `management/commands/seed_*.py`

**Seed commands (run in order):** `seed_core` → `seed_students` → `seed_education` → `seed_finance` → `seed_hr` → `seed_crm` → `seed_operations` → `seed_science` → `seed_infrastructure` → `seed_warehouse`

**Key patterns:**
- `BaseModel` — abstract base with `created_at`, `updated_at`, `created_by`, `updated_by`
- `AUTH_USER_MODEL = 'accounts.User'` — phone-based, no username
- `PhoneBackend` — custom auth backend in `accounts/backends.py`
- `RoleMiddleware` — sets `request.current_role` from UserRole
- `AuditMiddleware` — logs POST/PATCH/DELETE to AuditLog
- Soft delete (`is_deleted`) on Student, Contract, Employee
- `Contract.recalculate()` — auto-updates `paid_amount`/`debt_amount` after Payment

**Reusable utilities in `core/`:**
- `export.py` — `export_to_excel(data, columns)`, `parse_excel(file, columns)` — branded Excel with `#2DB976` header
- `pdf.py` — `generate_table_pdf(title, headers, rows)`, `generate_contract_pdf(data)` — styled A4 PDF
- `sms.py` — `send_sms(phone, message)`, `send_bulk_sms(recipients)` — Eskiz API (eskiz.uz)
- `notifications.py` — `notify_user()`, `notify_bulk()` — in-app + optional SMS

**Payment integration (`finance/`):**
- `payment_providers.py` — `generate_payme_link()`, `generate_click_link()`, signature verification
- `payment_views.py` — `PaymeCallbackView` (JSON-RPC), `ClickCallbackView`, `PaymentLinkView`
- Env vars: `PAYME_MERCHANT_ID`, `PAYME_SECRET_KEY`, `CLICK_MERCHANT_ID`, `CLICK_SERVICE_ID`, `CLICK_SECRET_KEY`, `ESKIZ_EMAIL`, `ESKIZ_PASSWORD`

**API base:** `/api/v1/` — auth, core, students, finance, education, hr, crm, operations, system, infrastructure, science, warehouse, legacy

### Frontend (`frontend/src/`)

**Directory structure:**
- **`@/` alias** → `./src/`
- **`features/`** — 17 feature modules: auth, students, finance, hr, crm, education, dashboard, operations, admin, system, profile, cabinets, science, infrastructure, warehouse, legacy, teachers
- **`components/`** — 17 shared UI components: `ui/` (Button, Badge, Avatar, Spinner, ProgressBar, Accordion, AlertBanner, Stepper, etc.), `form/` (FormField, FormInput, FormSelect, DateRangePicker, Combobox, FileUpload, SearchInput, etc.), `table/` (DataTable, Pagination, FilterBar), `layout/` (AppShell, Sidebar, Topbar, PageHeader, PageContent), `overlays/` (Modal, SlideOver, ConfirmDialog, DropdownMenu, ToastContainer), `data-display/` (Card, StatCard, ChartCard, DonutChart, BarChartSimple, LineChartSimple, EmptyState, StatusBadge), `navigation/` (Tabs, Breadcrumb)
- **`api/`** — full service layer architecture:
  - `client.ts` — ApiClient with ApiError class, retry logic, JWT token refresh on 401 (singleton pattern)
  - `services/` — 31 service files (Interface + ApiService + MockService + USE_MOCK toggle)
  - `mock/` — 30 mock files with generated data using shared-data.ts generators
  - `hooks/` — 30 React Query hook files with KEYS factory pattern
- **`stores/`** — Zustand: `auth.store.ts`, `app.store.ts`, `ui.store.ts`
- **`config/`** — `api.ts` (24 endpoint sections), `roles.ts` (MODULE_ACCESS matrix), `navigation.ts`, `theme.ts`, `statuses.ts` (centralized status label+variant configs for all domains)
- **`types/`** — 22 TypeScript type files per domain
- **`hooks/`** — shared hooks: `useListFilters.ts` (generic filter/pagination state management)
- **`lib/`** — `utils.ts` (cn, formatMoney, formatDate, formatPhone), `permissions.ts`, `validators.ts`
- **`i18n/`** — uz.json, ru.json, en.json (default: uz) — 317 keys × 3 languages, 16 sections covering all 17 modules
- **`test/`** — Vitest setup (`setup.ts`) — 34 tests across utils, auth store, API client

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

### Design Tokens & Dark Mode

Tailwind v4 via `@theme` in `globals.css`. Primary: `#2DB976` (emerald green). Font: Inter. Card: `rounded-2xl`, shadow `0 1px 3px rgba(0,0,0,0.08)`.

Dark mode: CSS variables in `.dark` + `dark:` Tailwind variants on shared components. Toggle in Settings page via `useAppStore`. Key dark surfaces: `#0F172A` (background), `#1E293B` (surface), `#334155` (border).

### Error Handling

- `ErrorBoundary` — global React error boundary wrapping `<App>`, shows Uzbek error UI with retry/home buttons and dev stack trace
- JWT token refresh — on 401, tries `/auth/token/refresh/` before logout (singleton pattern prevents multiple concurrent refreshes)

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
- Excel export: `@action(url_path="export")` on ViewSets → `export_to_excel()` utility
- PDF export: `@action(url_path="export-pdf")` / `@action(url_path="pdf")` → `generate_table_pdf()` / `generate_contract_pdf()`
- i18n: `useTranslation()` hook, keys organized by module (`t('students.fullName')`)

## Deployment

**Production:** https://erp.niuedu.uz
**GitHub:** https://github.com/jakha921/uni-erp
**Server:** 213.230.69.57 (ssh jakha@213.230.69.57)

### Architecture
```
Internet → Host Nginx (SSL/proxy) → Docker containers
  ├── frontend (port 3080) — React + Nginx, serves SPA
  ├── backend  (port 3081) — Django + Gunicorn + WhiteNoise (static)
  └── postgres              — PostgreSQL 16
```

Host nginx (`/etc/nginx/sites-available/erp.niuedu.uz`):
- `/` → frontend:3080
- `/api/`, `/admin/`, `/static/` → backend:3081
- SSL via Let's Encrypt (certbot, auto-renew)

### Coolify Resources
| Resource | UUID | Type |
|----------|------|------|
| PostgreSQL | `xkxu4i5qnitqu1yip6yaq2n9` | Database |
| Backend | `xdz9mszvj6xjj2xaq7k3u67a` | Application (Dockerfile) |
| Frontend | `fi2artj9b7dulned4ejncm88` | Application (Dockerfile) |

### Credentials
- **Admin login:** +998901234567 / admin123
- **Django admin:** https://erp.niuedu.uz/admin/ (same credentials)

### CI/CD
- `.github/workflows/deploy.yml` — on push to `main` → curl Coolify API to restart backend + frontend
- GitHub Secrets: `COOLIFY_URL`, `COOLIFY_TOKEN`, `BACKEND_UUID`, `FRONTEND_UUID`

### Deploy flow
1. Push to `main` branch → GitHub Actions auto-triggers
2. CI/CD calls Coolify API to restart backend + frontend containers
3. Backend `entrypoint.sh` auto-runs: migrate → collectstatic → seed (if empty) → gunicorn

### Key files
- `backend/Dockerfile` — Python 3.12 + uv + gunicorn
- `backend/entrypoint.sh` — auto migrate, seed, create admin on first deploy
- `frontend/Dockerfile` — Node 22 + npm build (VITE_USE_MOCK=false) + nginx
- `frontend/nginx.conf` — SPA fallback (no backend proxy, host nginx handles it)
- `docker-compose.prod.yml` — local prod testing (not used by Coolify)
- `backend/config/settings/prod.py` — PostgreSQL, WhiteNoise, security headers
