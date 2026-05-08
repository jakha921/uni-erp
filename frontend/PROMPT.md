# Uni ERP — Full Development Plan (MVP → Production)

> Университетская ERP система (BITU) — полный план разработки.
> Solo developer. Frontend готов на ~90%, бэкенд с нуля.
> Цель: рабочий MVP с реальными данными на сервере.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript 6 strict, Vite 8, Tailwind CSS 4, Zustand 5, TanStack Query 5, React Hook Form + Zod |
| **Backend** | Django 5, Django REST Framework, SimpleJWT, django-filter, django-cors-headers, Unfold Admin |
| **Database** | SQLite (dev) → PostgreSQL 16 (prod) |
| **Infra** | Docker, Nginx, Gunicorn, Let's Encrypt |
| **Package Managers** | `uv` (Python), `npm` (JS) |

## Paths

- Frontend: `/Users/jakha/Programming/Django/uni-erp/frontend/`
- Backend: `/Users/jakha/Programming/Django/uni-erp/backend/` (создать)
- Prototype: `/Users/jakha/Programming/Django/uni-erp/bitu-erp-design/unierp/project/`

## Rules

- TypeScript strict, NO `any`
- Python: type hints, ruff, 100 char line
- Backend API responses **MUST** совпадать с существующими TypeScript интерфейсами в `frontend/src/types/`
- Каждая фаза заканчивается проверкой: `npm run build` (frontend) или `uv run pytest` (backend)
- Один коммит на фазу: `feat:`, `fix:`, `refactor:`

---

## MVP Scope

### В MVP входит:
- ✅ Auth (JWT, phone login, roles, permissions)
- ✅ Core (Branch, Faculty, Department, Specialty, Group, AcademicYear)
- ✅ Students (CRUD, statistics, grades, attendance)
- ✅ Finance (contracts, payments, scholarships, dashboard, debtors)
- ✅ Education (subjects, schedule, attendance, grading)
- ✅ HR (employees, departments, orders, leaves, attendance)
- ✅ System Admin (users, roles, audit log)
- ✅ Deploy (Docker, Nginx, PostgreSQL, SSL)

### Post-MVP (не входит):
- ❌ HEMIS OAuth2 интеграция
- ❌ Payme / Click / Uzum Bank онлайн-оплата
- ❌ SMS (Eskiz / SMS Pro)
- ❌ CRM бэкенд
- ❌ Science / Infrastructure / Warehouse бэкенд
- ❌ Multi-tenant SaaS
- ❌ 1C интеграция
- ❌ Mobile app

---

## Архитектура Backend

```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py          # Общие настройки
│   │   ├── dev.py           # SQLite, DEBUG=True, CORS *
│   │   └── prod.py          # PostgreSQL, DEBUG=False, ALLOWED_HOSTS
│   ├── urls.py              # Root URL conf — /api/v1/
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── core/                # Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester
│   ├── accounts/            # User (phone auth), Role, Permission
│   ├── students/            # Student, StudentGrade, StudentAttendance
│   ├── finance/             # Contract, Payment, Scholarship
│   ├── education/           # Subject, Schedule, Attendance, Grade, Exam
│   └── hr/                  # Employee, Position, Order, Leave, HrAttendance
├── manage.py
├── pyproject.toml
├── Dockerfile
└── .env.example
```

### Каждый app содержит:
```
apps/{name}/
├── __init__.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── filters.py           # django-filter FilterSets
├── permissions.py        # DRF permission classes (если нужны кастомные)
├── admin.py             # Unfold admin
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_api.py
└── management/
    └── commands/
        └── seed_{name}.py  # Заполнение тестовыми данными
```

### Ключевые принципы:
1. **API контракт = фронтенд типы.** Backend API возвращает JSON, структура которого совпадает с `frontend/src/types/*.ts`. Минимум изменений на фронте при интеграции.
2. **Branch ID везде.** Каждая модель привязана к Branch для будущего SaaS. В MVP — один Branch, но FK уже на месте.
3. **Soft delete для критичных данных.** Student, Contract, Employee — `is_deleted` + `deleted_at` вместо реального удаления.
4. **Audit trail.** `created_by`, `updated_by`, `created_at`, `updated_at` на всех моделях через абстрактный BaseModel.
5. **Фильтрация через django-filter.** Все list endpoints поддерживают `?search=`, `?page=`, `?page_size=`, `?ordering=` + domain-specific фильтры.

---

## Database Schema (ключевые модели)

### Core App

```python
class BaseModel(models.Model):
    """Абстрактная база для всех моделей."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL, related_name='+')
    updated_by = models.ForeignKey('accounts.User', null=True, on_delete=models.SET_NULL, related_name='+')
    class Meta:
        abstract = True

class Branch(BaseModel):
    name = models.CharField(max_length=200)                    # "BITU"
    code = models.CharField(max_length=20, unique=True)        # "bitu"
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)

class Faculty(BaseModel):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='faculties')
    name = models.CharField(max_length=200)                    # "Kompyuter fanlari"
    code = models.CharField(max_length=20)                     # "KF"
    dean = models.ForeignKey('accounts.User', null=True, blank=True, on_delete=models.SET_NULL)

class Department(BaseModel):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=200)                    # "Dasturiy injiniring"
    code = models.CharField(max_length=20)                     # "DI"
    head = models.ForeignKey('accounts.User', null=True, blank=True, on_delete=models.SET_NULL)

class Specialty(BaseModel):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='specialties')
    name = models.CharField(max_length=200)                    # "Dasturiy injiniring"
    code = models.CharField(max_length=20)                     # "60610200"
    level = models.CharField(max_length=20, choices=[('bakalavr', 'Bakalavr'), ('magistr', 'Magistr')])

class AcademicYear(BaseModel):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)                     # "2025-2026"
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

class Semester(BaseModel):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='semesters')
    number = models.PositiveSmallIntegerField()                # 1 or 2
    start_date = models.DateField()
    end_date = models.DateField()

class Group(BaseModel):
    name = models.CharField(max_length=20)                     # "IS-21"
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name='groups')
    course = models.PositiveSmallIntegerField()                # 1-4
    education_form = models.CharField(max_length=20, choices=[
        ('kunduzgi', 'Kunduzgi'), ('sirtqi', 'Sirtqi'), ('kechki', 'Kechki'),
    ])
    max_students = models.PositiveSmallIntegerField(default=30)
    curator = models.ForeignKey('accounts.User', null=True, blank=True, on_delete=models.SET_NULL)
```

### Accounts App

```python
class User(AbstractUser):
    username = None
    phone = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)              # Ism
    last_name = models.CharField(max_length=100)               # Familiya
    middle_name = models.CharField(max_length=100, blank=True) # Otasining ismi
    branch = models.ForeignKey('core.Branch', null=True, on_delete=models.SET_NULL)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    @property
    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name} {self.middle_name}".strip()

    @property
    def initials(self) -> str:
        parts = [self.last_name, self.first_name]
        return ''.join(p[0].upper() for p in parts if p)

class UserRole(BaseModel):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('buxgalter', 'Buxgalter'),
        ('dekan', 'Dekan'),
        ('oqituvchi', "O'qituvchi"),
        ('talaba', 'Talaba'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roles')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    faculty = models.ForeignKey('core.Faculty', null=True, blank=True, on_delete=models.SET_NULL)
    department = models.ForeignKey('core.Department', null=True, blank=True, on_delete=models.SET_NULL)
    is_primary = models.BooleanField(default=True)

    class Meta:
        unique_together = ['user', 'role']
```

### Students App

```python
class Student(BaseModel):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='student_profile')
    student_id_number = models.CharField(max_length=20, unique=True, db_index=True)  # "ST-2025-0001"
    group = models.ForeignKey('core.Group', on_delete=models.PROTECT, related_name='students')
    course = models.PositiveSmallIntegerField()                # 1-4
    education_type = models.CharField(max_length=20, choices=[('kontrakt', 'Kontrakt'), ('grant', 'Grant')])
    payment_form = models.CharField(max_length=20, choices=[('kontrakt', 'Kontrakt'), ('grant', 'Grant')])
    enrollment_date = models.DateField()
    graduation_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Faol'),
        ('academic_leave', "Akademik ta'til"),
        ('expelled', "O'chirilgan"),
        ('graduated', 'Bitirgan'),
        ('transferred', "Ko'chirilgan"),
    ], default='active', db_index=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Erkak'), ('female', 'Ayol')], blank=True)
    passport = models.CharField(max_length=9, blank=True)      # "AA1234567"
    pinfl = models.CharField(max_length=14, blank=True)        # 14 digits
    address = models.TextField(blank=True)
    avg_grade = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['group', 'status']),
            models.Index(fields=['student_id_number']),
        ]
```

### Finance App

```python
class Contract(BaseModel):
    CONTRACT_TYPES = [
        ('bazoviy', 'Bazoviy'),
        ('tabaqalashtirilgan', 'Tabaqalashtirilgan'),
        ('grant', 'Grant'),
        ('xorijiy', 'Xorijiy'),
    ]
    contract_number = models.CharField(max_length=30, unique=True, db_index=True)  # "CNT-2025-0001"
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='contracts')
    academic_year = models.ForeignKey('core.AcademicYear', on_delete=models.PROTECT)
    contract_type = models.CharField(max_length=30, choices=CONTRACT_TYPES)
    contract_amount = models.DecimalField(max_digits=14, decimal_places=2)          # сумма контракта
    paid_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)   # оплачено (computed)
    debt_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)   # долг (computed)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Faol'), ('completed', "To'langan"),
        ('cancelled', 'Bekor qilingan'),
    ], default='active', db_index=True)
    contract_date = models.DateField()
    due_date = models.DateField()
    is_deleted = models.BooleanField(default=False)

    def recalculate(self):
        self.paid_amount = self.payments.aggregate(total=Sum('amount'))['total'] or 0
        self.debt_amount = self.contract_amount - self.paid_amount
        if self.debt_amount <= 0:
            self.status = 'completed'

class PaymentScheduleItem(BaseModel):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='schedule_items')
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Kutilmoqda'), ('paid', "To'langan"), ('overdue', "Muddati o'tgan"),
    ], default='pending')
    paid_date = models.DateField(null=True, blank=True)

class Payment(BaseModel):
    METHODS = [
        ('bank', "Bank o'tkazmasi"), ('naqd', 'Naqd'),
        ('online', 'Online'), ('click', 'Click'), ('payme', 'Payme'),
    ]
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_date = models.DateTimeField()
    payment_method = models.CharField(max_length=20, choices=METHODS)
    receipt_number = models.CharField(max_length=30, blank=True)
    note = models.TextField(blank=True)

class Scholarship(BaseModel):
    TYPES = [
        ('davlat', 'Davlat'), ('ijtimoiy', 'Ijtimoiy'),
        ('fanlar', 'Fan bo\'yicha'), ('prezident', 'Prezident'), ('maxsus', 'Maxsus'),
    ]
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='scholarships')
    semester = models.ForeignKey('core.Semester', on_delete=models.PROTECT)
    type = models.CharField(max_length=20, choices=TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('active', 'Faol'), ('paused', "To'xtatilgan"), ('completed', 'Tugallangan'),
    ], default='active')
    basis = models.TextField(blank=True)
```

### Education App

```python
class Subject(BaseModel):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    credits = models.PositiveSmallIntegerField()
    hours_lecture = models.PositiveSmallIntegerField(default=0)
    hours_practice = models.PositiveSmallIntegerField(default=0)
    hours_lab = models.PositiveSmallIntegerField(default=0)
    department = models.ForeignKey('core.Department', on_delete=models.CASCADE, related_name='subjects')

class Schedule(BaseModel):
    group = models.ForeignKey('core.Group', on_delete=models.CASCADE, related_name='schedules')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='teaching_schedules')
    semester = models.ForeignKey('core.Semester', on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField()           # 1=Dush ... 6=Shanba
    pair_number = models.PositiveSmallIntegerField()           # 1-6 para
    room = models.CharField(max_length=20)                     # "301-A"
    lesson_type = models.CharField(max_length=20, choices=[
        ('lecture', "Ma'ruza"), ('practice', 'Amaliy'), ('lab', 'Laboratoriya'),
    ])
    class Meta:
        unique_together = ['group', 'semester', 'day_of_week', 'pair_number']

class Attendance(BaseModel):
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='attendances')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('present', 'Keldi'), ('absent', 'Kelmadi'),
        ('late', 'Kechikdi'), ('excused', 'Sababli'),
    ])
    class Meta:
        unique_together = ['student', 'schedule', 'date']

class Grade(BaseModel):
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='grades')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester = models.ForeignKey('core.Semester', on_delete=models.CASCADE)
    grade_type = models.CharField(max_length=20, choices=[
        ('midterm', 'Oraliq'), ('final', 'Yakuniy'), ('coursework', 'Kurs ishi'),
    ])
    score = models.DecimalField(max_digits=5, decimal_places=2)     # 0-100
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    graded_by = models.ForeignKey('accounts.User', on_delete=models.PROTECT, related_name='+')

    class Meta:
        unique_together = ['student', 'subject', 'semester', 'grade_type']
```

### HR App

```python
class Employee(BaseModel):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='employee_profile')
    employee_id_number = models.CharField(max_length=20, unique=True)  # "EMP-0001"
    department = models.ForeignKey('core.Department', on_delete=models.PROTECT, null=True)
    position = models.CharField(max_length=100)                # "Katta o'qituvchi"
    position_code = models.CharField(max_length=20)            # "senior_teacher"
    academic_degree = models.CharField(max_length=30, blank=True)  # "phd", "dsc"
    academic_rank = models.CharField(max_length=30, blank=True)    # "dotsent", "professor"
    employment_form = models.CharField(max_length=20, choices=[
        ('asosiy', 'Asosiy'), ('orindosh', "O'rindosh"), ('soatbay', "Soatbay"),
    ], default='asosiy')
    hire_date = models.DateField()
    contract_number = models.CharField(max_length=30, blank=True)
    contract_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    passport = models.CharField(max_length=9, blank=True)
    pinfl = models.CharField(max_length=14, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Erkak'), ('female', 'Ayol')], blank=True)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Faol'), ('leave', "Ta'tilda"),
        ('business_trip', 'Safarda'), ('inactive', 'Ishlamaydi'),
    ], default='active')
    is_deleted = models.BooleanField(default=False)

class HrOrder(BaseModel):
    ORDER_TYPES = [
        ('hire', 'Ishga qabul'), ('fire', "Ishdan bo'shatish"),
        ('transfer', "Ko'chirish"), ('promotion', 'Lavozim oshirish'),
        ('salary_change', 'Maosh o\'zgartirish'), ('leave', "Ta'til"),
        ('business_trip', 'Xizmat safari'), ('bonus', 'Mukofot'), ('penalty', 'Jazo'),
    ]
    number = models.CharField(max_length=30, unique=True)
    type = models.CharField(max_length=20, choices=ORDER_TYPES)
    title = models.CharField(max_length=200)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='orders')
    date = models.DateField()
    effective_date = models.DateField()
    signer = models.CharField(max_length=100, blank=True)
    basis = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Qoralama'), ('review', "Ko'rib chiqilmoqda"),
        ('signed', 'Imzolangan'), ('cancelled', 'Bekor qilingan'),
    ], default='draft')

class Leave(BaseModel):
    LEAVE_TYPES = [
        ('annual', "Mehnat ta'tili"), ('sick', "Kasallik"),
        ('maternity', "Dekret"), ('unpaid', "Haq to'lanmaydigan"),
        ('business_trip', 'Xizmat safari'), ('study', "O'quv"),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    days = models.PositiveSmallIntegerField()
    destination = models.CharField(max_length=200, blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Kutilmoqda'), ('approved', 'Tasdiqlangan'), ('rejected', 'Rad etilgan'),
    ], default='pending')
```

---

## API Endpoints (все `/api/v1/`)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login/` | Phone + password → JWT tokens + user |
| POST | `/auth/logout/` | Blacklist refresh token |
| GET | `/auth/me/` | Текущий пользователь + роль |
| POST | `/auth/token/refresh/` | Refresh access token |
| POST | `/auth/forgot-password/` | Запрос сброса пароля |

### Core (справочники)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/core/branches/` | Список филиалов |
| GET | `/core/faculties/` | Список факультетов |
| GET | `/core/departments/` | Список кафедр (?faculty_id=) |
| GET | `/core/specialties/` | Список специальностей |
| GET | `/core/groups/` | Список групп (?faculty_id=, ?course=) |
| GET | `/core/academic-years/` | Учебные годы |
| GET | `/core/semesters/` | Семестры |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students/` | Список (paginated, filters) |
| POST | `/students/` | Создать студента |
| GET | `/students/{id}/` | Детали студента |
| PATCH | `/students/{id}/` | Обновить студента |
| DELETE | `/students/{id}/` | Soft delete |
| GET | `/students/statistics/` | Агрегированная статистика |
| GET | `/students/{id}/grades/` | Оценки студента |
| GET | `/students/{id}/attendance/` | Посещаемость студента |

### Finance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/dashboard/` | KPI + графики |
| GET | `/finance/contracts/` | Список контрактов (paginated, filters) |
| POST | `/finance/contracts/` | Создать контракт |
| GET | `/finance/contracts/{id}/` | Детали + график оплат |
| PATCH | `/finance/contracts/{id}/` | Обновить контракт |
| GET | `/finance/payments/` | Список оплат (paginated, filters) |
| POST | `/finance/payments/` | Создать оплату (recalculates contract) |
| GET | `/finance/scholarships/` | Список стипендий |
| POST | `/finance/scholarships/` | Назначить стипендию |
| PATCH | `/finance/scholarships/{id}/` | Обновить стипендию |
| GET | `/finance/report/` | Финансовый отчёт (период, группировка) |

### Education
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/education/subjects/` | Список предметов |
| GET | `/education/schedule/` | Расписание (?group_id=, ?teacher_id=) |
| POST | `/education/schedule/` | Добавить пару |
| GET | `/education/attendance/` | Посещаемость (?group_id=, ?date=) |
| POST | `/education/attendance/bulk/` | Массовое выставление посещаемости |
| GET | `/education/grades/` | Оценки (?group_id=, ?subject_id=) |
| POST | `/education/grades/bulk/` | Массовое выставление оценок |

### HR
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hr/dashboard/` | KPI + статистика |
| GET | `/hr/employees/` | Список (paginated, filters) |
| POST | `/hr/employees/` | Создать сотрудника |
| GET | `/hr/employees/{id}/` | Детали |
| PATCH | `/hr/employees/{id}/` | Обновить |
| GET | `/hr/departments/` | Иерархия отделов |
| GET | `/hr/orders/` | Приказы |
| POST | `/hr/orders/` | Создать приказ |
| GET | `/hr/leaves/` | Отпуска |
| POST | `/hr/leaves/` | Создать заявку на отпуск |
| PATCH | `/hr/leaves/{id}/` | Обновить статус |
| GET | `/hr/attendance/` | Табель посещаемости |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/system/users/` | Список пользователей |
| POST | `/system/users/` | Создать пользователя |
| PATCH | `/system/users/{id}/` | Обновить |
| GET | `/system/roles/` | Список ролей |
| GET | `/system/audit-log/` | Аудит лог |

---

# TASKS

---

## MILESTONE 1: Backend Foundation

### - [x] PHASE 1: Django Project Scaffolding
  - **Цель:** Создать Django проект с правильной структурой, настройками, зависимостями.
  - **Создать файлы:**
    - `backend/pyproject.toml` — зависимости: django, djangorestframework, djangorestframework-simplejwt, django-filter, django-cors-headers, django-unfold, python-dotenv, psycopg[binary], gunicorn, dj-database-url
    - `backend/config/__init__.py`
    - `backend/config/settings/__init__.py` — `from .dev import *` (default dev)
    - `backend/config/settings/base.py` — INSTALLED_APPS (rest_framework, corsheaders, django_filters, unfold, все apps), REST_FRAMEWORK config (pagination: PageNumberPagination, page_size=20, DEFAULT_AUTHENTICATION: JWTAuthentication, DEFAULT_FILTER_BACKENDS: DjangoFilterBackend+SearchFilter+OrderingFilter), SIMPLE_JWT config (access: 60min, refresh: 7days), AUTH_USER_MODEL='accounts.User', LANGUAGE_CODE='uz', TIME_ZONE='Asia/Tashkent'
    - `backend/config/settings/dev.py` — DEBUG=True, SQLite, CORS_ALLOW_ALL_ORIGINS=True
    - `backend/config/settings/prod.py` — DEBUG=False, PostgreSQL через DATABASE_URL, ALLOWED_HOSTS из env
    - `backend/config/urls.py` — `/api/v1/` prefix, include app urls, admin/
    - `backend/config/wsgi.py`, `backend/config/asgi.py`
    - `backend/manage.py`
    - `backend/.env.example` — SECRET_KEY, DEBUG, DATABASE_URL, ALLOWED_HOSTS
    - `backend/.env` — dev values (в .gitignore)
    - `backend/apps/__init__.py`
  - **Проверка:**
    ```bash
    cd backend && uv sync && uv run python manage.py check
    ```
  - Commit: `feat: scaffold Django backend project`

### - [x] PHASE 2: Custom User Model + JWT Auth
  - **Цель:** Phone-based User model, JWT login/logout/me endpoints.
  - **Создать файлы:**
    - `backend/apps/accounts/__init__.py`
    - `backend/apps/accounts/models.py` — User (см. схему выше), UserRole
    - `backend/apps/accounts/managers.py` — CustomUserManager (create_user/create_superuser по phone)
    - `backend/apps/accounts/serializers.py`:
      - `LoginSerializer` — phone + password → validate → return user + tokens
      - `UserSerializer` — id, name, initials, email, phone, role, facultyId, facultyName, departmentId, departmentName, employeeId, studentId, avatar (**ДОЛЖЕН совпадать с frontend `User` interface**)
      - `TokenRefreshSerializer`
    - `backend/apps/accounts/views.py`:
      - `LoginView(APIView)` — POST, AllowAny, return {user, token}
      - `LogoutView(APIView)` — POST, blacklist refresh token
      - `MeView(RetrieveAPIView)` — GET, IsAuthenticated, return current user
    - `backend/apps/accounts/urls.py` — auth/login/, auth/logout/, auth/me/, auth/token/refresh/
    - `backend/apps/accounts/backends.py` — PhoneBackend (authenticate по phone)
    - `backend/apps/accounts/admin.py` — UserAdmin через Unfold
    - `backend/apps/accounts/tests/test_auth.py`:
      - test_login_success, test_login_wrong_password, test_me_authenticated, test_me_unauthenticated
  - **Миграции:** `uv run python manage.py makemigrations accounts && uv run python manage.py migrate`
  - **Проверка:**
    ```bash
    uv run python manage.py createsuperuser --phone=+998901234567
    uv run pytest apps/accounts/tests/ -v
    # curl test: POST /api/v1/auth/login/ → {user, token}
    ```
  - Commit: `feat: add phone-based auth with JWT`

### - [x] PHASE 3: Core Models + Seed Data
  - **Цель:** Все справочные таблицы + management command для заполнения тестовыми данными.
  - **Создать файлы:**
    - `backend/apps/core/__init__.py`
    - `backend/apps/core/models.py` — BaseModel, Branch, Faculty, Department, Specialty, AcademicYear, Semester, Group (см. схему)
    - `backend/apps/core/serializers.py` — сериализаторы для каждой модели (read-only, вложенные)
    - `backend/apps/core/views.py` — ReadOnlyModelViewSet для каждой модели
    - `backend/apps/core/urls.py`
    - `backend/apps/core/admin.py` — Unfold admin для всех моделей
    - `backend/apps/core/filters.py` — DepartmentFilter(faculty_id), GroupFilter(specialty_id, course, faculty_id)
    - `backend/apps/core/management/commands/seed_core.py`:
      - Создать 1 Branch "BITU"
      - 5 Faculties: Kompyuter fanlari, Iqtisodiyot, Pedagogika, Filologiya, Matematika
      - 16 Departments (3-4 per faculty)
      - 16 Specialties
      - AcademicYear 2024-2025, 2025-2026 (current)
      - 2 Semesters per year
      - 40 Groups (5 fac × 4 courses × 2 groups)
      - **Данные должны совпадать с frontend mock data** (`api/mock/shared-data.ts`, `students.mock.ts`)
    - `backend/apps/core/tests/test_api.py` — test_list_faculties, test_filter_departments_by_faculty
  - **Миграции:** `uv run python manage.py makemigrations core && uv run python manage.py migrate`
  - **Проверка:**
    ```bash
    uv run python manage.py seed_core
    uv run pytest apps/core/tests/ -v
    # curl: GET /api/v1/core/faculties/ → 5 faculties
    # curl: GET /api/v1/core/groups/?course=2 → filtered groups
    ```
  - Commit: `feat: add core models (Branch, Faculty, Department, Group) with seed data`

### - [x] PHASE 4: RBAC (Role-Based Access Control)
  - **Цель:** Permission classes для DRF, фильтрация данных по роли.
  - **Создать файлы:**
    - `backend/apps/accounts/permissions.py`:
      - `IsAdmin` — role == admin
      - `IsBuxgalter` — role in (admin, buxgalter)
      - `IsDekan` — role in (admin, dekan)
      - `IsOqituvchi` — role in (admin, oqituvchi)
      - `IsTalaba` — role in (admin, talaba)
      - `HasModuleAccess(module_id)` — проверка по MODULE_ACCESS матрице (аналог frontend `config/roles.ts`)
      - `RoleFilterMixin` — mixin для ViewSet, фильтрует queryset по role (деканн видит только свой факультет, преподаватель — свои группы, etc.)
    - `backend/apps/accounts/middleware.py` — `RoleMiddleware` — добавляет `request.current_role` из UserRole
    - Обновить `UserSerializer` — включить текущую роль, факультет, отдел
    - `backend/apps/accounts/tests/test_permissions.py`:
      - test_admin_access_all, test_buxgalter_access_finance, test_dekan_access_own_faculty, test_talaba_access_own_data
  - **Проверка:**
    ```bash
    uv run pytest apps/accounts/tests/ -v
    ```
  - Commit: `feat: add RBAC permission system`

---

## MILESTONE 2: Students Module

### - [x] PHASE 5: Student Model + CRUD API
  - **Цель:** Student model, ViewSet с CRUD, фильтры, поиск, пагинация.
  - **Создать файлы:**
    - `backend/apps/students/__init__.py`
    - `backend/apps/students/models.py` — Student (см. схему)
    - `backend/apps/students/serializers.py`:
      - `StudentListSerializer` — поля как `StudentListItem` в frontend types
      - `StudentDetailSerializer` — полные поля как `Student` interface
      - `CreateStudentSerializer` — поля как `CreateStudentDto`
      - `UpdateStudentSerializer` — partial update
    - `backend/apps/students/views.py`:
      - `StudentViewSet(ModelViewSet)` — queryset с select_related('user', 'group__specialty__department__faculty'), permission: HasModuleAccess('students'), search_fields=['user__first_name', 'user__last_name', 'student_id_number', 'group__name']
    - `backend/apps/students/filters.py`:
      - `StudentFilter` — faculty_id, department_id, course, status, education_form, payment_form, group_id
    - `backend/apps/students/urls.py`
    - `backend/apps/students/admin.py`
    - `backend/apps/students/management/commands/seed_students.py`:
      - 200 студентов (как в mock data), привязаны к Group/Faculty
      - Создать User для каждого студента
    - `backend/apps/students/tests/test_api.py`:
      - test_list_students, test_filter_by_faculty, test_search_by_name, test_create_student, test_student_detail, test_pagination
  - **Миграции + seed:**
    ```bash
    uv run python manage.py makemigrations students && uv run python manage.py migrate
    uv run python manage.py seed_students
    ```
  - **Проверка:**
    ```bash
    uv run pytest apps/students/tests/ -v
    # curl: GET /api/v1/students/?page=1&page_size=20&search=Karimov → paginated list
    # curl: GET /api/v1/students/1/ → full student detail
    ```
  - Commit: `feat: add students CRUD API with filters`

### - [x] PHASE 6: Student Statistics + Grades + Attendance API
  - **Цель:** Endpoints для статистики, оценок и посещаемости студента.
  - **Создать/обновить файлы:**
    - `backend/apps/students/views.py` — добавить:
      - `StatisticsView(APIView)` — GET, агрегация: totalStudents, byFaculty, byCourse, byGender, byEducationForm, byPaymentForm, byStatus. **Формат ответа = `StudentStatistics` interface.**
      - `StudentGradesView(ListAPIView)` — GET `/students/{id}/grades/`, формат = `StudentGrade[]`
      - `StudentAttendanceView(ListAPIView)` — GET `/students/{id}/attendance/`, формат = `StudentAttendance[]`
    - `backend/apps/students/serializers.py` — добавить:
      - `StudentStatisticsSerializer`
      - `StudentGradeSerializer`
      - `StudentAttendanceSerializer`
    - `backend/apps/students/management/commands/seed_students.py` — обновить: добавить генерацию оценок и посещаемости (Grade, Attendance из education app — или seed отдельно в Phase 12)
    - `backend/apps/students/tests/test_api.py` — добавить:
      - test_statistics_endpoint, test_statistics_by_faculty, test_student_grades, test_student_attendance
  - **Проверка:**
    ```bash
    uv run pytest apps/students/tests/ -v
    # curl: GET /api/v1/students/statistics/ → {totalStudents: 200, byFaculty: [...]}
    ```
  - Commit: `feat: add student statistics, grades, attendance endpoints`

### - [x] PHASE 7: Frontend Integration — Students
  - **Цель:** Подключить фронтенд к реальному API для модуля студентов.
  - **Обновить файлы:**
    - `frontend/src/api/services/students.service.ts`:
      - Создать `StudentsApiService implements IStudentsService` — использует `apiClient` для реальных HTTP запросов
      - Переключить export: `export const studentsService: IStudentsService = USE_MOCK ? new StudentsMockService() : new StudentsApiService()`
    - `frontend/src/api/hooks/useStudents.ts` — без изменений (уже работает через service interface)
    - `frontend/src/config/api.ts` — убедиться что endpoints правильные
    - `frontend/.env` — `VITE_USE_MOCK=false` (для тестирования с реальным API)
  - **Проверка:**
    ```bash
    # Terminal 1: cd backend && uv run python manage.py runserver
    # Terminal 2: cd frontend && npm run dev
    # Browser: открыть /students — должен показать данные из Django API
    # Проверить: фильтры, поиск, пагинация, профиль студента, статистика
    npm run build  # TypeScript check
    ```
  - Commit: `feat: connect students module to real API`

---

## MILESTONE 3: Finance Module

### - [x] PHASE 8: Contract + Payment Models + API
  - **Цель:** Контракты, оплаты, график оплат. CRUD + автоматический пересчёт долгов.
  - **Создать файлы:**
    - `backend/apps/finance/__init__.py`
    - `backend/apps/finance/models.py` — Contract, PaymentScheduleItem, Payment (см. схему)
    - `backend/apps/finance/serializers.py`:
      - `ContractListSerializer` — формат `ContractListItem`
      - `ContractDetailSerializer` — формат `Contract` (с вложенным paymentSchedule)
      - `CreateContractSerializer` — формат `CreateContractDto` (с вложенным paymentSchedule items)
      - `PaymentListSerializer` — формат `Payment`
      - `CreatePaymentSerializer` — формат `CreatePaymentDto`, в `create()` вызывать `contract.recalculate()`
    - `backend/apps/finance/views.py`:
      - `ContractViewSet` — CRUD, permission IsBuxgalter
      - `PaymentViewSet` — list + create, permission IsBuxgalter
    - `backend/apps/finance/filters.py`:
      - `ContractFilter` — faculty_id, status, contract_type, education_year, search
      - `PaymentFilter` — faculty_id, payment_method, date_from, date_to, period
    - `backend/apps/finance/urls.py`
    - `backend/apps/finance/admin.py`
    - `backend/apps/finance/signals.py` — post_save Payment → recalculate Contract
    - `backend/apps/finance/management/commands/seed_finance.py`:
      - 30 контрактов с графиками оплат
      - 45 оплат
      - Данные совпадают с `finance.mock.ts`
    - `backend/apps/finance/tests/test_api.py`:
      - test_list_contracts, test_create_contract, test_create_payment_recalculates_debt, test_filter_contracts
  - **Проверка:**
    ```bash
    uv run python manage.py makemigrations finance && uv run python manage.py migrate
    uv run python manage.py seed_finance
    uv run pytest apps/finance/tests/ -v
    ```
  - Commit: `feat: add contracts and payments API`

### - [x] PHASE 9: Scholarship + Finance Dashboard API
  - **Цель:** Стипендии CRUD + агрегированная статистика для dashboard.
  - **Создать/обновить файлы:**
    - `backend/apps/finance/models.py` — Scholarship (уже в схеме)
    - `backend/apps/finance/serializers.py` — добавить:
      - `ScholarshipSerializer` — формат `Scholarship`
      - `CreateScholarshipSerializer` — формат `CreateScholarshipDto`
      - `FinanceDashboardSerializer` — формат `FinanceDashboardStats`
    - `backend/apps/finance/views.py` — добавить:
      - `ScholarshipViewSet` — CRUD
      - `FinanceDashboardView(APIView)` — агрегация: totalContracts, totalContractAmount, totalPaid, totalDebt, collectionRate, debtorCount, scholarshipCount, scholarshipTotal, byFaculty, byMonth, byStatus
      - `FinanceReportView(APIView)` — отчёт с параметрами (период, группировка)
    - `backend/apps/finance/tests/test_api.py` — добавить:
      - test_dashboard_stats, test_create_scholarship, test_finance_report
  - **Проверка:**
    ```bash
    uv run pytest apps/finance/tests/ -v
    # curl: GET /api/v1/finance/dashboard/ → {totalContracts: 30, ...}
    ```
  - Commit: `feat: add scholarships and finance dashboard API`

### - [x] PHASE 10: Frontend Integration — Finance
  - **Цель:** Подключить фронтенд к реальному API для модуля финансов.
  - **Обновить файлы:**
    - `frontend/src/api/services/finance.service.ts`:
      - Создать `FinanceApiService implements IFinanceService`
      - Переключить export по USE_MOCK
    - `frontend/src/api/hooks/useFinance.ts` — без изменений
  - **Проверка:**
    ```bash
    # Backend + Frontend running
    # Browser: /finance → dashboard с реальными KPI
    # /finance/contracts → таблица из Django
    # /finance/payments → создание оплаты → пересчёт долга
    npm run build
    ```
  - Commit: `feat: connect finance module to real API`

---

## MILESTONE 4: Education Module

### - [x] PHASE 11: Subject + Schedule Models + API
  - **Цель:** Предметы и расписание.
  - **Создать файлы:**
    - `backend/apps/education/__init__.py`
    - `backend/apps/education/models.py` — Subject, Schedule (см. схему)
    - `backend/apps/education/serializers.py` — SubjectSerializer, ScheduleSerializer
    - `backend/apps/education/views.py`:
      - `SubjectViewSet(ReadOnlyModelViewSet)` — список предметов
      - `ScheduleViewSet` — CRUD, фильтр по group_id, teacher_id, semester_id, day_of_week
    - `backend/apps/education/filters.py`
    - `backend/apps/education/urls.py`
    - `backend/apps/education/admin.py`
    - `backend/apps/education/management/commands/seed_education.py`:
      - 20 предметов
      - Расписание для всех 40 групп (5 дней × 3-4 пары)
    - `backend/apps/education/tests/test_api.py`
  - **Проверка:**
    ```bash
    uv run python manage.py makemigrations education && uv run python manage.py migrate
    uv run python manage.py seed_education
    uv run pytest apps/education/tests/ -v
    ```
  - Commit: `feat: add subjects and schedule API`

### - [x] PHASE 12: Attendance + Grading API
  - **Цель:** Посещаемость и оценки с bulk endpoints.
  - **Создать/обновить файлы:**
    - `backend/apps/education/models.py` — Attendance, Grade (см. схему)
    - `backend/apps/education/serializers.py` — добавить:
      - `AttendanceSerializer`, `BulkAttendanceSerializer` (список студентов + статус за дату)
      - `GradeSerializer`, `BulkGradeSerializer` (список студентов + оценка за предмет)
    - `backend/apps/education/views.py` — добавить:
      - `AttendanceViewSet` — list (фильтр по group, date range) + bulk_create action
      - `GradeViewSet` — list (фильтр по group, subject, semester) + bulk_create action
    - `backend/apps/education/management/commands/seed_education.py` — обновить:
      - Генерация посещаемости (16 недель, 5 дней, ~85% present)
      - Генерация оценок (midterm + final для каждого студента по каждому предмету)
    - `backend/apps/education/tests/test_api.py` — добавить:
      - test_bulk_attendance, test_bulk_grades, test_filter_by_group
  - **Проверка:**
    ```bash
    uv run python manage.py seed_education  # re-seed with attendance + grades
    uv run pytest apps/education/tests/ -v
    ```
  - Commit: `feat: add attendance and grading API with bulk endpoints`

### - [x] PHASE 13: Frontend Integration — Education
  - **Цель:** Подключить расписание, посещаемость, оценки к реальному API.
  - **Обновить файлы:**
    - Создать `frontend/src/api/services/education.service.ts` — IEducationService + EducationApiService
    - Создать `frontend/src/api/hooks/useEducation.ts` — useSchedule, useAttendance, useGrades
    - Обновить страницы: SchedulePage, AcademicAttendancePage, GradingPage — подключить к хукам
  - **Проверка:**
    ```bash
    # Browser: /schedule → реальное расписание из Django
    # /attendance → реальная посещаемость
    # /grading → реальные оценки
    npm run build
    ```
  - Commit: `feat: connect education module to real API`

---

## MILESTONE 5: HR Module

### - [x] PHASE 14: Employee Model + CRUD API
  - **Цель:** Сотрудники — модель, CRUD, фильтры.
  - **Создать файлы:**
    - `backend/apps/hr/__init__.py`
    - `backend/apps/hr/models.py` — Employee (см. схему)
    - `backend/apps/hr/serializers.py`:
      - `EmployeeListSerializer` — формат `EmployeeListItem`
      - `EmployeeDetailSerializer` — формат `Employee`
      - `CreateEmployeeSerializer` — формат `CreateEmployeeDto`
    - `backend/apps/hr/views.py` — EmployeeViewSet
    - `backend/apps/hr/filters.py` — department_id, position_code, degree_code, status, search
    - `backend/apps/hr/urls.py`
    - `backend/apps/hr/admin.py`
    - `backend/apps/hr/management/commands/seed_hr.py`:
      - 50 сотрудников (как в hr.mock.ts)
      - 22 departments (rektorat, fakultet, kafedra, bolim)
    - `backend/apps/hr/tests/test_api.py`
  - **Проверка:**
    ```bash
    uv run python manage.py makemigrations hr && uv run python manage.py migrate
    uv run python manage.py seed_hr
    uv run pytest apps/hr/tests/ -v
    ```
  - Commit: `feat: add employees CRUD API`

### - [x] PHASE 15: HR Orders + Leaves + Attendance + Dashboard API
  - **Цель:** Приказы, отпуска, табель посещаемости, dashboard статистика.
  - **Создать/обновить файлы:**
    - `backend/apps/hr/models.py` — HrOrder, Leave (см. схему)
    - `backend/apps/hr/serializers.py` — OrderSerializer, LeaveSerializer, HrDashboardSerializer, HrAttendanceSerializer
    - `backend/apps/hr/views.py` — добавить:
      - `OrderViewSet` — list + create
      - `LeaveViewSet` — list + create + partial_update (для approve/reject)
      - `HrAttendanceView` — табель за месяц (формат `EmployeeAttendanceRow[]`)
      - `HrDashboardView` — агрегация (формат `HrDashboardStats`)
    - `backend/apps/hr/management/commands/seed_hr.py` — обновить: orders, leaves, attendance
    - `backend/apps/hr/tests/test_api.py` — добавить тесты
  - **Проверка:**
    ```bash
    uv run pytest apps/hr/tests/ -v
    # curl: GET /api/v1/hr/dashboard/ → stats
    ```
  - Commit: `feat: add HR orders, leaves, attendance, dashboard API`

### - [x] PHASE 16: Frontend Integration — HR
  - **Цель:** Подключить HR модуль к реальному API.
  - **Обновить файлы:**
    - `frontend/src/api/services/hr.service.ts` — HrApiService implements IHrService
    - `frontend/src/api/hooks/useHr.ts` — без изменений
  - **Проверка:**
    ```bash
    # Browser: /hr → dashboard с реальными KPI
    # /hr/employees → таблица из Django
    # /hr/orders, /hr/leaves, /hr/attendance → работают
    npm run build
    ```
  - Commit: `feat: connect HR module to real API`

---

## MILESTONE 6: System Admin + Deploy

### - [x] PHASE 17: System Admin (Users, Roles, Audit Log)
  - **Цель:** Управление пользователями и ролями через API, аудит лог.
  - **Создать/обновить файлы:**
    - `backend/apps/accounts/serializers.py` — добавить:
      - `UserListSerializer` — для списка пользователей
      - `CreateUserSerializer` — создание пользователя с ролью
      - `RoleSerializer`
    - `backend/apps/accounts/views.py` — добавить:
      - `UserViewSet` — CRUD, permission IsAdmin
      - `RoleListView` — список доступных ролей
    - `backend/apps/core/models.py` — добавить:
      - `AuditLog` — user, action, model, object_id, changes (JSONField), timestamp
    - `backend/apps/core/middleware.py` — `AuditMiddleware` — логирует все POST/PATCH/DELETE запросы
    - `backend/apps/core/views.py` — добавить AuditLogListView (фильтр по user, model, date range)
    - `frontend/src/features/system/` — подключить System Users, Roles, Permissions, Audit к API
  - **Проверка:**
    ```bash
    uv run pytest -v
    # Browser: /system/users → список пользователей из Django
    # /system/audit → аудит лог действий
    npm run build
    ```
  - Commit: `feat: add system admin and audit log`

### - [x] PHASE 18: Docker + Nginx + PostgreSQL Setup
  - **Цель:** Контейнеризация для production deploy.
  - **Создать файлы:**
    - `backend/Dockerfile` — python:3.12-slim, uv, gunicorn
    - `backend/Dockerfile.dev` — для разработки с hot-reload
    - `frontend/Dockerfile` — node:22-alpine, npm build, nginx serve
    - `docker-compose.yml` (корень проекта):
      - `db` — postgres:16-alpine, volume для данных
      - `backend` — Django + gunicorn, depends_on db
      - `frontend` — nginx serving static + proxy to backend
      - `nginx` — reverse proxy, SSL termination
    - `docker-compose.dev.yml` — dev overrides (volumes, hot-reload)
    - `nginx/nginx.conf`:
      - `/` → frontend (static files)
      - `/api/` → backend (gunicorn)
      - `/admin/` → backend
      - `/media/`, `/static/` → backend collected files
    - `backend/config/settings/prod.py` — обновить: STATIC_ROOT, MEDIA_ROOT, DATABASES из env
    - `.env.prod.example` — PostgreSQL credentials, SECRET_KEY, ALLOWED_HOSTS
  - **Проверка:**
    ```bash
    docker compose -f docker-compose.dev.yml up --build
    # Browser: http://localhost → frontend
    # http://localhost/api/v1/auth/login/ → backend
    # http://localhost/admin/ → Django admin
    docker compose -f docker-compose.dev.yml down
    ```
  - Commit: `feat: add Docker setup for production`

### - [x] PHASE 19: Deploy to Server + CI Basics
  - **Цель:** Деплой на сервер, SSL, базовый CI.
  - **Действия:**
    - SSH на сервер, установить Docker + Docker Compose
    - Скопировать docker-compose.yml, nginx.conf, .env.prod
    - `docker compose up -d` — запустить в production
    - Настроить SSL через Certbot / Let's Encrypt
    - Настроить `collectstatic` для Django
    - Создать superuser на production
    - Запустить seed commands на production
    - Создать `deploy.sh` скрипт:
      ```bash
      #!/bin/bash
      git pull origin main
      docker compose build
      docker compose up -d
      docker compose exec backend uv run python manage.py migrate
      docker compose exec backend uv run python manage.py collectstatic --noinput
      ```
    - Опционально: GitHub Actions CI (lint + test на push)
  - **Проверка:**
    - Открыть https://your-domain.uz → фронтенд работает
    - Логин → Dashboard → Students → Finance → всё работает
    - HTTPS зелёный замок
  - Commit: `feat: deploy to production server`

---

## MILESTONE 7: Stub Pages (Frontend-only)

> Эти задачи НЕ требуют бэкенда — чисто фронтенд с mock data.
> Можно делать параллельно с бэкендом.

### - [x] PHASE 20: ReferencesPage — Add DictionaryDetail drill-down
  - File: `src/features/admin/pages/ReferencesPage.tsx`
  - **Прототип (NewModules.jsx:968-1030):** Клик по справочнику → таблица записей (code, name, count, status)
  - **Реализация:** state `activeDict`, компонент DictionaryDetail, back button, таблица, mock data
  - Run `npm run build` — must pass

### - [x] PHASE 21: CrmReportPage — Implement CRM Analytics
  - File: `src/features/crm/pages/CrmReportPage.tsx` (currently StubPage)
  - **Реализация:** 4 stat cards, воронка конверсии (bar chart), таблица источников, период фильтр
  - Mock data inline
  - Run `npm run build` — must pass

### - [x] PHASE 22: MyStudentsPage — Teacher's Student Groups
  - File: `src/features/education/pages/MyStudentsPage.tsx` (currently StubPage)
  - **Реализация:** Tabs по группам, таблица студентов (davomat %, ball), stat cards, search
  - Mock data inline
  - Run `npm run build` — must pass

### - [x] PHASE 23: Remaining Stub Pages (Transport, Patents, Conferences, Legacy)
  - **TransportPage** — stat cards + таблица транспорта + фильтры
  - **PatentsPage** — stat cards + таблица патентов + фильтры
  - **ConferencesPage** — card grid + tabs (Rejadagi/O'tkazilgan)
  - **LegacyOrdersPage** — stat cards + таблица приказов
  - **StaffingPage** — stat cards + grouped table штатного расписания
  - Run `npm run build` — must pass

### - [ ] PHASE 24: Final Build Verification
  - `npm run build` — zero errors
  - `uv run pytest` — all tests pass
  - `docker compose up` — everything works together
  - Smoke test all routes in browser
  - Commit: `feat: complete all stub pages and verify full build`

---

## Post-MVP Roadmap (планирование)

| Priority | Feature | Описание |
|----------|---------|----------|
| P1 | HEMIS OAuth2 | Авторизация через student.hemis.uz, импорт данных студентов |
| P1 | Payme/Click оплата | Онлайн-оплата контрактов через `paytechuz` пакет |
| P1 | SMS уведомления | Eskiz API — напоминания о долгах, уведомления |
| P2 | CRM бэкенд | Pipeline заявок, конверсия, автоматизация |
| P2 | Отчёты PDF | Генерация ведомостей, справок, контрактов в PDF |
| P2 | Bulk import/export | Excel импорт студентов, экспорт отчётов |
| P3 | Science модуль бэкенд | Исследования, диссертации, конференции, патенты |
| P3 | Infrastructure бэкенд | Общежитие, склад, оборудование, транспорт |
| P3 | Multi-tenant SaaS | Изоляция данных по Branch, billing, white-labeling |
| P4 | 1C интеграция | Экспорт финансовых данных в 1C Бухгалтерия |
| P4 | Mobile app | React Native или PWA |
| P4 | LMS интеграция | Moodle/Canvas — импорт оценок |
