# PROMPT.md — MVP Uni ERP: ВСЕ задачи Backend + Frontend + HEMIS

> Автономный план для ralph-loop. Каждая задача — чекбокс `[ ]`.
> Найди первую `[ ]`, выполни, отметь `[x]`, коммить. Повторяй до `ALL PHASES COMPLETE`.
>
> **Проект:** /Users/jakha/Programming/Django/uni-erp
> **Backend:** Django 5.1 + DRF, `cd backend`, команды через `uv run`
> **Frontend:** React 19 + TypeScript + Vite, `cd frontend`, команды через `npm`
> **HEMIS API:** https://student.hemis.uz/rest/v1/data/ (Bearer token)
> **Паттерн Backend:** Model(BaseModel) → Serializer(camelCase) → ViewSet(ModelViewSet) → Router → Filter → Admin(Unfold) → Seed
> **Паттерн Frontend:** types/ → services/(Interface+ApiService+MockService) → hooks/(KEYS factory) → schemas/(Zod) → pages/

---

## PHASE 0: FIX BUILD + ADMIN URL

- [x] **FIX-1**: Исправить `frontend/src/features/system/pages/UsersListPage.tsx` — TS ошибки: `STATUS_MAP_KEYS`/`STATUS_MAP`. Проверить: `cd frontend && npm run build` — 0 ошибок.
- [x] **FIX-2**: Изменить backend URL `/api/v1/admin-panel/` → `/api/v1/admin/` в `backend/config/urls.py`. Django admin живёт на `/admin/`, а API на `/api/v1/admin/` — конфликта нет. Обновить фронтенд `config/api.ts` если нужно.

---

## PHASE 1: HEMIS ИНТЕГРАЦИЯ — Справочники + Синхронизация

### 1.1 HEMIS Client
- [x] **HEMIS-1**: Создать `backend/apps/core/hemis.py` — HEMIS API client:
```
HEMIS_BASE_URL = env("HEMIS_BASE_URL", "https://student.hemis.uz/rest/v1")
HEMIS_TOKEN = env("HEMIS_TOKEN", "")

class HemisClient:
    def _get(self, endpoint, params=None) → dict  # GET с Bearer token
    def get_departments(self) → list  # /data/department-list
    def get_specialties(self) → list  # /data/specialty-list
    def get_groups(self) → list  # /data/group-list
    def get_students(self, page=1) → dict  # /data/student-list?page=N
    def get_subjects(self) → list  # /data/subject-list
    def get_semesters(self) → list  # /data/semester-list
    def get_curriculum(self) → list  # /data/curriculum-list
    def get_employees(self) → list  # /data/employee-list
    def get_student_grades(self, student_id) → list  # student grades
    def get_schedule(self, params) → list  # schedule data
```
Добавить env vars `HEMIS_BASE_URL`, `HEMIS_TOKEN` в `.env.example`. Проверить: `uv run python manage.py check`.

### 1.2 Справочники (Reference Data) — модели + HEMIS sync
- [x] **HEMIS-2**: Создать модели справочников в `backend/apps/core/models.py` (или отдельный `reference_models.py`):
```
class ReferenceData(BaseModel):
    """Универсальный справочник — синхронизируется с HEMIS."""
    TYPE_CHOICES = [
        ('education_type', "Ta'lim turi"),          # Бакалавр/Магистр
        ('education_form', "Ta'lim shakli"),         # Kunduzgi/Sirtqi/Kechki
        ('payment_form', "To'lov shakli"),           # Kontrakt/Grant/Davlat
        ('accommodation', "Yashash joyi"),           # Yotoqxona/Ijarada/Uyda
        ('country', "Davlat"),
        ('region', "Viloyat"),
        ('district', "Tuman"),
        ('nationality', "Millat"),
        ('citizenship', "Fuqarolik"),
        ('social_category', "Ijtimoiy toifa"),       # Yetim/Nogironlik/Kam ta'minlangan
        ('student_status', "Talaba holati"),          # O'qimoqda/Akademik ta'til/Chetlatilgan
        ('gender', "Jinsi"),
        ('marital_status', "Oilaviy holat"),
        ('language', "Til"),
        ('subject_type', "Fan turi"),                # Majburiy/Tanlov
        ('academic_degree', "Ilmiy daraja"),
        ('academic_rank', "Ilmiy unvon"),
        ('employment_form', "Bandlik shakli"),        # Shtatli/Soatbay/Sovmestitel
        ('custom', "Boshqa"),                         # Кастомные справочники
    ]
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, db_index=True)
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=300)
    name_uz = models.CharField(max_length=300, blank=True)
    name_ru = models.CharField(max_length=300, blank=True)
    name_en = models.CharField(max_length=300, blank=True)
    hemis_id = models.IntegerField(null=True, blank=True, db_index=True)  # ID из HEMIS для синхронизации
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        unique_together = ['type', 'code']
        ordering = ['type', 'sort_order', 'name']
```
Сериализатор: `ReferenceDataSerializer` (id, type, code, name, nameUz, nameRu, nameEn, hemis_id, parentId, isActive, sortOrder).
ViewSet: `ReferenceDataViewSet` с URL `/api/v1/references/{type}/` — фильтрация по type из URL, search по name.
Миграция. Admin.

### 1.3 HEMIS Sync Management Command
- [x] **HEMIS-3**: Создать `backend/apps/core/management/commands/sync_hemis.py`:
```
class Command(BaseCommand):
    help = "Sync reference data from HEMIS API"
    
    def add_arguments(self, parser):
        parser.add_argument('--type', choices=['references', 'students', 'employees', 'all'])
        parser.add_argument('--force', action='store_true')
    
    def handle(self, *args, **options):
        client = HemisClient()
        sync_type = options.get('type', 'all')
        
        if sync_type in ('references', 'all'):
            self._sync_departments(client)  # → ReferenceData type=department + core.Department
            self._sync_specialties(client)  # → ReferenceData + core.Specialty
            self._sync_groups(client)       # → ReferenceData + core.Group
            self._sync_semesters(client)    # → core.Semester
            self._sync_subjects(client)     # → education.Subject
        
        if sync_type in ('students', 'all'):
            self._sync_students(client)     # → students.Student (update_or_create by hemis_id)
        
        if sync_type in ('employees', 'all'):
            self._sync_employees(client)    # → hr.Employee (update_or_create by hemis_id)
```
Каждый sync метод: get данные из HEMIS → update_or_create в локальной БД по hemis_id. Логировать: `self.stdout.write(f"Synced {count} items")`.

### 1.4 HEMIS Sync Endpoint (для кнопки в UI)
- [x] **HEMIS-4**: Создать `HemisSyncView(APIView)` в `apps/core/views.py`:
```
POST /api/v1/core/hemis/sync/ 
Body: { "type": "references" | "students" | "employees" | "all" }
Response: { "status": "ok", "synced": { "departments": 15, "students": 200, ... } }
```
Только для admin роли (IsAdminUser). URL в core/urls.py.

### 1.5 Добавить hemis_id к существующим моделям
- [x] **HEMIS-5**: Добавить `hemis_id = models.IntegerField(null=True, blank=True, unique=True)` к моделям:
- `apps/core/models.py`: Department, Specialty, Group, Semester
- `apps/students/models.py`: Student
- `apps/hr/models.py`: Employee
- `apps/education/models.py`: Subject
Миграция. Это позволит связывать записи с HEMIS при синхронизации.

### 1.6 Frontend: Reference Data Page + Sync Button
- [ ] **HEMIS-6**: Обновить `frontend/src/features/admin/pages/ReferencesPage.tsx`:
- Слева: список типов справочников (education_type, education_form, payment_form, и т.д.)
- Справа: таблица записей выбранного типа с CRUD (создание/редактирование/удаление)
- Кнопка "HEMIS dan sinxronlash" → POST `/api/v1/core/hemis/sync/` с loading state
- Показывать hemis_id если запись синхронизирована
- i18n все тексты

### 1.7 Frontend: HEMIS Sync в Settings
- [ ] **HEMIS-7**: Добавить в `frontend/src/features/profile/pages/SettingsPage.tsx` секцию "HEMIS sinxronizatsiya" (только для admin):
- Кнопка "Barcha ma'lumotlarni sinxronlash" → sync all
- Кнопки по категориям: "Faqat talabalar", "Faqat xodimlar", "Faqat ma'lumotnomalar"
- Показывать результат (сколько записей синхронизировано)
- Последняя дата синхронизации

### 1.8 HEMIS Verify
- [ ] **HEMIS-8**: Git commit: `git add backend/ frontend/ && git commit -m "feat: HEMIS integration — reference data sync, client, management command"`. `uv run python manage.py check`. `npm run build`.

---

## PHASE 2: BACKEND — Недостающие endpoints

### 2.1 Education: Exam + Curriculum + Library + Alumni + Internship
- [ ] **BE-1**: Модель `Exam` в education/models.py + ExamSerializer(subjectName, groupName, teacherName method fields) + ExamCreateSerializer + ExamViewSet(ModelViewSet, filterset: semester/group/subject/type/status) + ExamFilter + admin + router.register("exams") + makemigrations + migrate.
- [ ] **BE-2**: Модели `Curriculum` + `CurriculumSubject` + сериализаторы (nested subjects) + CurriculumViewSet(filterset: specialty, year) + router.register("curriculums") + миграция.
- [ ] **BE-3**: Модели `Book` + `BookLoan` + сериализаторы + BookViewSet(search: title,author,isbn) + BookLoanViewSet(@action return_book) + router.register("library/books", "library/loans") + миграция.
- [ ] **BE-4**: Модель `Alumni` + AlumniViewSet(filterset: graduation_year, status; search: full_name) + router.register("alumni") + миграция.
- [ ] **BE-5**: Модель `Internship`(student FK, company, supervisor, dates, type, status, grade) + InternshipViewSet + router.register("internships") + миграция.
- [ ] **BE-6**: Обновить seed_education.py: 30 exams, 5 curriculums, 50 books, 30 loans, 40 alumni, 20 internships. `uv run python manage.py seed_education`. Git commit.

### 2.2 Finance: Payroll + Budget + Report
- [ ] **BE-7**: Модель `PayrollRecord`(employee FK, month, year, base_salary, bonus, deductions, net_salary, status) + PayrollViewSet(@action summary, @action process) + router.register("payroll") + миграция.
- [ ] **BE-8**: Модель `BudgetCategory`(name, code, planned, spent, parent FK self, year) + BudgetCategoryViewSet(@action summary) + router.register("budget/categories") + миграция.
- [ ] **BE-9**: FinanceReportView(APIView) GET → агрегация. Seed payroll + budget. Git commit.

### 2.3 Auth: Password Recovery
- [ ] **BE-10**: Модель `PasswordResetCode` + ForgotPasswordView + VerifyCodeView + ResetPasswordView + ChangePasswordView + URLs. Миграция. Git commit.

### 2.4 Operations: Messages + Reports
- [ ] **BE-11**: Модели `ChatThread`(M2M participants) + `ChatMessage`(thread FK, sender FK, content, is_read) + ChatThreadViewSet(@action messages GET/POST) + router.register("messages/threads"). Модель `ReportTemplate` + ReportTemplateViewSet + GenerateReportView. Миграция. Seed. Git commit.

### 2.5 Teachers + Student Documents
- [ ] **BE-12**: TeacherViewSet в education/views.py (Employee queryset filtered by department). teacher_urls.py. URL: `/api/v1/teachers/`. Модель `StudentDocument` в students/models.py + ViewSet(multipart upload). URL: `students/<id>/documents/`. Миграция. Git commit.

### 2.6 Cabinets
- [ ] **BE-13**: StudentCabinetView + TeacherCabinetView в core/views.py (агрегированные данные). Проверить что URLs `/api/v1/cabinets/student/` и `/api/v1/cabinets/teacher/` уже зарегистрированы в config/urls.py (да, они есть). Проверить что views возвращают правильный формат для фронтенда.

### 2.7 Backend Final
- [ ] **BE-14**: `uv run python manage.py check` + `uv run python manage.py makemigrations` (No changes) + `uv run pytest -v`. Все seed commands. Git commit + push.

---

## PHASE 3: FRONTEND — Каждая из 66 страниц полностью функциональна

> Для каждой страницы: данные из API (не mock), CRUD работает (все кнопки), формы с Zod, фильтры через API, i18n, error handling (`AlertBanner`), loading/empty states.

### 3.1 Auth (3)
- [ ] **FE-1**: **LoginPage** `/login` — input mask телефона, детальная ошибка API, loading кнопка, i18n, error banner. `npm run build`.
- [ ] **FE-2**: **RoleSelectPage** `/role-select` — 5 карточек, login при USE_MOCK=false, i18n. `npm run build`.
- [ ] **FE-3**: **ForgotPasswordPage** `/forgot-password` — 3-step flow (Stepper), таймер 60с, подключен к API. i18n. `npm run build`.

### 3.2 Dashboard (1)
- [ ] **FE-4**: **DashboardPage** `/dashboard` — 5 sub-dashboards подключены к реальному API `/dashboard/`. Графики, StatCards, "So'nggi faoliyat" из API. i18n. `npm run build`.

### 3.3 Students (4)
- [ ] **FE-5**: **StudentsListPage** `/students` — таблица из API, пагинация, поиск debounced, фильтры из `useFaculties()`/`useGroups()`, Delete через ConfirmDialog, Excel/PDF export. i18n. `npm run build`.
- [ ] **FE-6**: **StudentFormPage** `/students/new`, `/students/:id/edit` — Zod форма, cascading selects из API, FileUpload фото, Edit предзаполнение, success redirect. i18n. `npm run build`.
- [ ] **FE-7**: **StudentProfilePage** `/students/:id` — tabs (Info, Grades, Attendance, Contract, Documents) из API. FileUpload документов через `/students/{id}/documents/`. Кнопки Edit/PDF/Print. i18n. `npm run build`.
- [ ] **FE-8**: **StudentsStatPage** `/students/statistics` — данные из API, export PDF, i18n. `npm run build`.

### 3.4 Education (11)
- [ ] **FE-9**: **SchedulePage** `/schedule` — данные из useSchedules, CRUD (ScheduleForm в Modal), фильтры (группа Combobox, преподаватель, неделя), 3 вида, Export PDF. i18n. `npm run build`.
- [ ] **FE-10**: **AcademicAttendancePage** `/attendance` — grid из API, "Saqlash" → useBulkAttendance, фильтры, Export Excel. i18n. `npm run build`.
- [ ] **FE-11**: **GradingPage** `/grading` — оценки из API, inline editing, "Saqlash" → useBulkGrades, auto-compute, Export Excel/PDF. i18n. `npm run build`.
- [ ] **FE-12**: **ExamsPage** `/exams` — CRUD (ExamForm: subject, group, teacher, date, room, type). Tabs. Фильтры. i18n. `npm run build`.
- [ ] **FE-13**: **CurriculumPage** `/curriculum` — CRUD (CurriculumForm с useFieldArray subjects). Фильтры: specialty, year. Export PDF. i18n. `npm run build`.
- [ ] **FE-14**: **SubjectsPage** `/subjects` — CRUD (SubjectForm: name, code, credits, hours, department). Фильтр кафедры из API. i18n. `npm run build`.
- [ ] **FE-15**: **LibraryPage** `/library` — Tab Katalog CRUD (BookForm). Tab Berilganlar CRUD (LoanForm + "Qaytarish" кнопка). Поиск. i18n. `npm run build`.
- [ ] **FE-16**: **AlumniPage** `/alumni` — CRUD (AlumniForm в SlideOver). Фильтры: год, факультет, статус. Export Excel. i18n. `npm run build`.
- [ ] **FE-17**: **InternshipPage** `/internship` — CRUD (InternshipForm). Tabs: Joriy/Yakunlangan. i18n. `npm run build`.
- [ ] **FE-18**: **MyStudentsPage** `/my-students` — данные из API для текущего преподавателя. Фильтр по группе. i18n. `npm run build`.
- [ ] **FE-19**: **AcademicDepartmentsPage** `/departments` — данные из API. Статистика. i18n. `npm run build`.

### 3.5 Finance (9)
- [ ] **FE-20**: **FinanceDashboardPage** `/finance` — данные из API. Графики. Drill-down по факультету. i18n. `npm run build`.
- [ ] **FE-21**: **ContractsListPage** `/finance/contracts` — CRUD полный (Create/Edit/Delete). Фильтры из API. Excel/PDF export. Per-contract PDF. i18n. `npm run build`.
- [ ] **FE-22**: **ContractDetailPage** `/finance/contracts/:id` — API данные. "Onlayn to'lov" → Payme/Click ссылки. PDF download. PaymentTimeline. i18n. `npm run build`.
- [ ] **FE-23**: **DebtorsListPage** `/finance/debtors` — фильтры из useFaculties. SMS Modal → API. Bulk SMS. Export Excel. i18n. `npm run build`.
- [ ] **FE-24**: **PaymentsListPage** `/finance/payments` — CRUD. DateRangePicker. Receipt print. Export Excel. i18n. `npm run build`.
- [ ] **FE-25**: **ScholarshipsPage** `/finance/scholarship` — CRUD полный (Create/Edit/Delete). Bulk назначение. i18n. `npm run build`.
- [ ] **FE-26**: **FinanceReportPage** `/finance/report` — данные из `/finance/report/` API. CSV + PDF export. i18n. `npm run build`.
- [ ] **FE-27**: **PayrollPage** `/finance/payroll` — данные из usePayroll (реальный API). Excel export. "Hisoblash" → useProcessPayroll. i18n. `npm run build`.
- [ ] **FE-28**: **BudgetPage** `/finance/budget` — данные из useBudgetCategories (реальный API). CRUD категорий. Фильтр квартал. i18n. `npm run build`.

### 3.6 HR (7)
- [ ] **FE-29**: **HrDashboardPage** `/hr` — API данные. Графики. i18n. `npm run build`.
- [ ] **FE-30**: **EmployeesListPage** `/hr/employees` — CRUD (Create/Edit/Delete). Position options из API/i18n. Excel export. i18n. `npm run build`.
- [ ] **FE-31**: **EmployeeProfilePage** `/hr/employees/:id` — tabs Info/Career/Salary/Documents из API. Career из реальных данных (не hardcoded). Salary из payroll. FileUpload документы. Edit/Print. i18n. `npm run build`.
- [ ] **FE-32**: **DepartmentsPage** `/hr/departments` — CRUD (DepartmentForm). i18n. `npm run build`.
- [ ] **FE-33**: **OrdersPage** `/hr/orders` — CRUD. Статус flow. PDF приказ. i18n. `npm run build`.
- [ ] **FE-34**: **AttendancePage** `/hr/attendance` — MONTH_NAMES через i18n. Department из API. Excel export. i18n. `npm run build`.
- [ ] **FE-35**: **LeavesPage** `/hr/leaves` — CRUD. Календарь отпусков. DateRangePicker. i18n. `npm run build`.

### 3.7 CRM (3)
- [ ] **FE-36**: **CrmListPage** `/crm` — CRUD (LeadForm, Zod). Фильтры: status/source/assignee/date. Bulk status. Excel export. i18n. `npm run build`.
- [ ] **FE-37**: **CrmKanbanPage** `/crm/kanban` — drag-drop → mutation с rollback. LeadDetail по клику. i18n. `npm run build`.
- [ ] **FE-38**: **CrmReportPage** `/crm/report` — API данные. Графики. DateRangePicker. i18n. `npm run build`.

### 3.8 Operations (6)
- [ ] **FE-39**: **TasksPage** `/tasks` — CRUD (TaskForm: title, description, assignee, priority, dueDate). Kanban + List. Drag-drop. i18n. `npm run build`.
- [ ] **FE-40**: **NotificationsPage** `/notifications` — markRead/markAllRead mutations. Delete. Tabs по типам. i18n. `npm run build`.
- [ ] **FE-41**: **MessagesPage** `/messages` — подключить к useChatThreads + useMessages. Compose → useSendMessage. Split layout. i18n. `npm run build`.
- [ ] **FE-42**: **AppealsPage** `/appeals` — CRUD. Комментарии useAddComment. Фильтры. i18n. `npm run build`.
- [ ] **FE-43**: **NewsPage** `/news` — CRUD (admin only). NewsForm с FileUpload. Grid/List view. i18n. `npm run build`.
- [ ] **FE-44**: **ReportsPage** `/reports` — useReportTemplates. Генерация → скачивание. Параметры в Modal. i18n. `npm run build`.

### 3.9 Teachers (2)
- [ ] **FE-45**: **TeachersListPage** `/teachers` — данные из useTeachers. Клик → `/teachers/:id`. Фильтры. i18n. `npm run build`.
- [ ] **FE-46**: **TeacherProfilePage** `/teachers/:id` — tabs Info/Schedule/Load/Publications. Print. "Nazad". i18n. `npm run build`.

### 3.10 Science (4)
- [ ] **FE-47**: **ResearchPage** `/research` — Tab Loyihalar CRUD (ProjectForm). Tab Maqolalar CRUD (ArticleForm). Tab Grantlar read. i18n. `npm run build`.
- [ ] **FE-48**: **ThesesPage** `/theses` — CRUD (ThesisForm). Фильтры: stage, type. i18n. `npm run build`.
- [ ] **FE-49**: **ConferencesPage** `/conferences` — CRUD (ConferenceForm). Tabs: Kelgusi/O'tgan. i18n. `npm run build`.
- [ ] **FE-50**: **PatentsPage** `/patents` — CRUD (PatentForm). Status tabs. i18n. `npm run build`.

### 3.11 System (4)
- [ ] **FE-51**: **UsersListPage** `/system/users` — CRUD (UserForm). Block/Unblock. Reset password. i18n. `npm run build`.
- [ ] **FE-52**: **RolesPage** `/system/roles` — системные read-only, кастомные CRUD. i18n. `npm run build`.
- [ ] **FE-53**: **PermissionMatrixPage** `/system/permissions` — matrix из API. Click toggle → mutation. i18n. `npm run build`.
- [ ] **FE-54**: **AuditLogPage** `/system/audit` — API данные. DateRangePicker. Export Excel. i18n. `npm run build`.

### 3.12 Admin (3)
- [ ] **FE-55**: **DmsPage** `/dms` — folder sidebar (useFolders). Documents CRUD (DocumentForm + FileUpload). Фильтры. i18n. `npm run build`.
- [ ] **FE-56**: **AnalyticsPage** `/analytics` — данные из useAnalytics. Графики. DateRangePicker. i18n. `npm run build`.
- [ ] **FE-57**: **ReferencesPage** `/reference` — CRUD по типам справочников. Кнопка "HEMIS dan sinxronlash" → POST `/core/hemis/sync/`. Показывать hemis_id. i18n. `npm run build`.

### 3.13 Infrastructure (3)
- [ ] **FE-58**: **DormitoryPage** `/dormitory` — buildings + rooms CRUD. Поселение/выселение. i18n. `npm run build`.
- [ ] **FE-59**: **EquipmentPage** `/equipment` — CRUD (EquipmentForm). Фильтры. Export Excel. i18n. `npm run build`.
- [ ] **FE-60**: **TransportPage** `/transport` — CRUD (VehicleForm). Status tabs. i18n. `npm run build`.

### 3.14 Warehouse (1)
- [ ] **FE-61**: **WarehousePage** `/warehouse` — CRUD items (ItemForm). Tab Harakatlar (MovementForm). AlertBanner belowMinimum. Export Excel. i18n. `npm run build`.

### 3.15 Legacy (2)
- [ ] **FE-62**: **LegacyOrdersPage** `/orders` — read-only. Пагинация. DateRangePicker. i18n. `npm run build`.
- [ ] **FE-63**: **StaffingPage** `/staffing` — read-only. Department filter. ProgressBar. i18n. `npm run build`.

### 3.16 Cabinets (2)
- [ ] **FE-64**: **StudentCabinetPage** `/student-cabinet` — cabinet.service.ts USE_MOCK toggle. Данные из `/cabinets/student/` API. Student info, schedule, grades, exams, notifications. i18n. `npm run build`.
- [ ] **FE-65**: **TeacherCabinetPage** `/teacher-cabinet` — данные из `/cabinets/teacher/` API. Teacher info, classes, groups, tasks, stats. i18n. `npm run build`.

### 3.17 Profile (2)
- [ ] **FE-66**: **ProfilePage** `/profile` — FileUpload фото. useUpdateProfile mutation. i18n. `npm run build`.
- [ ] **FE-67**: **SettingsPage** `/settings` — Смена пароля (Zod). HEMIS sync секция для admin. Notification settings → API. i18n. `npm run build`.

### 3.18 Cross-cutting
- [ ] **FE-68**: Error handling — для КАЖДОЙ страницы с useQuery добавить: `if (error) return <AlertBanner variant="error" ... />`. Пройти все 67 страниц. `npm run build`.
- [ ] **FE-69**: Frontend final: `npm run build` — 0 ошибок. `npm test` — все тесты. Git commit + push.

---

## PHASE 4: INTEGRATION — Полная проверка

- [ ] **INT-1**: Запустить backend + frontend. Проверить ВСЕ страницы — данные из API. Исправить что не работает.
- [ ] **INT-2**: CRUD тест: `/students` (C/R/U/D), `/finance/contracts` (C/R/U/D), `/hr/employees` (C/R/U/D), `/crm` (C/R/U/D), `/exams` (C/R/U/D).
- [ ] **INT-3**: Роли: admin/buxgalter/dekan/oqituvchi/talaba — sidebar правильный, страницы без ошибок.
- [ ] **INT-4**: i18n: переключить UZ→RU→EN — тексты меняются на всех страницах.
- [ ] **INT-5**: Dark mode — все страницы корректно.
- [ ] **INT-6**: HEMIS sync: кнопка "Sinxronlash" на `/reference` → проверить что данные подтягиваются.
- [ ] **INT-7**: Deploy: `git add -A && git commit -m "feat: MVP complete — all pages + HEMIS integration" && git push origin main`.

---

## ALL PHASES COMPLETE
