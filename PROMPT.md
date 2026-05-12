# PROMPT.md — MVP Uni ERP: ВСЕ задачи Backend + Frontend

> Автономный план для ralph-loop. Каждая задача — чекбокс `[ ]`.
> Найди первую `[ ]`, выполни, отметь `[x]`, коммить. Повторяй до `ALL PHASES COMPLETE`.
>
> **Проект:** /Users/jakha/Programming/Django/uni-erp
> **Backend:** Django 5.1 + DRF, `cd backend`, команды через `uv run`
> **Frontend:** React 19 + TypeScript + Vite, `cd frontend`, команды через `npm`
> **Паттерн Backend:** Model(BaseModel) → Serializer(camelCase) → ViewSet(ModelViewSet) → Router → Filter → Admin(Unfold) → Seed
> **Паттерн Frontend:** types/ → services/(Interface+ApiService+MockService) → hooks/(KEYS factory) → schemas/(Zod) → pages/

---

## PHASE 0: FIX BUILD

- [x] **FIX-1**: Исправить `frontend/src/features/system/pages/UsersListPage.tsx` — TS ошибки: `STATUS_MAP_KEYS` declared but never read, `STATUS_MAP` not found. Убрать/исправить. Проверить: `cd frontend && npm run build` — 0 ошибок.

---

## PHASE 1: BACKEND — Недостающие модели и endpoints (26 endpoints)

### 1.1 Education: Exam
- [x] **BE-1**: Модель `Exam` в `apps/education/models.py` + сериализатор ExamSerializer (subjectName, groupName, teacherName через SerializerMethodField) + ExamCreateSerializer + ExamViewSet(ModelViewSet) + ExamFilter(django-filters: semester, group, subject, type, status) + admin.py + router.register("exams") + makemigrations + migrate.

### 1.2 Education: Curriculum
- [x] **BE-2**: Модели `Curriculum` + `CurriculumSubject` в education/models.py + сериализаторы (nested subjects) + CurriculumViewSet + filterset_fields=[specialty, year] + router.register("curriculums") + миграция.

### 1.3 Education: Library
- [ ] **BE-3**: Модели `Book` + `BookLoan` в education/models.py + сериализаторы + BookViewSet(search: title,author,isbn) + BookLoanViewSet(@action return для возврата книги) + router.register("library/books") + router.register("library/loans") + миграция.

### 1.4 Education: Alumni
- [ ] **BE-4**: Модель `Alumni` в education/models.py + сериализатор + AlumniViewSet(filterset: graduation_year, status; search: full_name, workplace) + router.register("alumni") + миграция.

### 1.5 Education: Internship
- [ ] **BE-5**: Модель `Internship` в education/models.py + сериализатор(studentName) + InternshipViewSet(filterset: status, type) + router.register("internships") + миграция.

### 1.6 Education: Seed + Verify
- [ ] **BE-6**: Обновить seed_education.py: 30 exams, 5 curriculums(15 subjects каждый), 50 books, 30 loans, 40 alumni, 20 internships. Запустить seed. `uv run python manage.py check`. Git commit.

### 1.7 Finance: Payroll + Budget + Report
- [ ] **BE-7**: Модель `PayrollRecord` в finance/models.py + PayrollSerializer + PayrollViewSet(@action summary, @action process) + router.register("payroll") + миграция.
- [ ] **BE-8**: Модель `BudgetCategory` в finance/models.py(parent FK self) + сериализатор(remaining, percentUsed computed) + BudgetCategoryViewSet(@action summary) + router.register("budget/categories") + миграция.
- [ ] **BE-9**: FinanceReportView(APIView) GET → агрегация contracts_by_type, payments_by_month, revenue_by_faculty. URL: path("report/"). Seed payroll(3 месяца) + budget(10 категорий). Git commit.

### 1.8 Auth: Password Recovery
- [ ] **BE-10**: Модель `PasswordResetCode` в accounts/models.py + 4 views: ForgotPasswordView(SMS через core.sms), VerifyCodeView, ResetPasswordView, ChangePasswordView + URLs + миграция. Git commit.

### 1.9 Admin Panel App
- [ ] **BE-11**: Создать app `apps/admin_panel/` (НЕ admin). Модели: Folder(name, parent), Document(title, number, category, folder, priority, status, author, file), DictionaryItem(type, code, name). ViewSets: FolderViewSet, DocumentViewSet, DictionaryItemViewSet(filter by type from URL), AnalyticsView(APIView). Зарегистрировать в settings + urls.py. Миграция. Seed. Git commit.

### 1.10 Cabinets + Teachers + Messages + Reports + Student Documents
- [ ] **BE-12**: StudentCabinetView + TeacherCabinetView в core/views.py (агрегация данных для текущего пользователя). URLs в config/urls.py: `/api/v1/cabinets/student/`, `/api/v1/cabinets/teacher/`.
- [ ] **BE-13**: TeacherViewSet в education/views.py (queryset Employee filtered by department). teacher_urls.py + config/urls.py: `/api/v1/teachers/`.
- [ ] **BE-14**: ChatThread + ChatMessage модели в operations/models.py + ChatThreadViewSet(@action messages GET/POST) + router.register("messages/threads"). ReportTemplate модель + ReportTemplateViewSet + GenerateReportView. Миграция. Seed.
- [ ] **BE-15**: StudentDocument модель в students/models.py + ViewSet(list, create multipart, delete) + URL: `students/<id>/documents/`. Миграция.
- [ ] **BE-16**: Финальная проверка: `uv run python manage.py check` + `uv run pytest -v` + все seed commands + curl тесты. Git commit + push.

---

## PHASE 2: FRONTEND — Полная детализация каждой страницы (66 страниц)

> Для каждой страницы: проверить что данные из API (не mock), CRUD работает, формы с Zod, фильтры через API, i18n, error handling, loading/empty states.

### 2.1 Auth (3 страницы)

- [ ] **FE-1**: **LoginPage** `/login` — Проверить: input mask телефона работает, ошибка API показывается (не "Xatolik: 500" а детальный текст), loading на кнопке, i18n все тексты. Если нет — исправить.
- [ ] **FE-2**: **RoleSelectPage** `/role-select` — Проверить: 5 карточек ролей отображаются, клик логинит (при USE_MOCK=false phone format совпадает с API), i18n. Исправить если не работает.
- [ ] **FE-3**: **ForgotPasswordPage** `/forgot-password` — Проверить: 3-step flow (телефон → SMS код → новый пароль) через Stepper компонент, таймер 60 сек, подключен к API `/auth/forgot-password/`. Если нет — реализовать.

### 2.2 Dashboard (1 страница)

- [ ] **FE-4**: **DashboardPage** `/dashboard` — Проверить: AdminDashboard подключён к `/api/v1/dashboard/` (не mock). StatCards показывают реальные цифры. Графики рендерятся. "So'nggi faoliyat" из API. Если sub-dashboard компоненты используют hardcoded данные — подключить к API. i18n все лейблы.

### 2.3 Students (4 страницы)

- [ ] **FE-5**: **StudentsListPage** `/students` — Проверить: таблица из API, пагинация, поиск(debounced), фильтры факультет/группа из `useFaculties()`/`useGroups()` (не hardcoded), кнопка "Yangi talaba" → `/students/new`, Delete через ConfirmDialog, Excel/PDF export кнопки скачивают файлы. Исправить что не работает.
- [ ] **FE-6**: **StudentFormPage** `/students/new` и `/students/:id/edit` — Проверить: форма с Zod, cascading selects (Faculty→Department→Specialty→Group) из API, FileUpload фото, при Edit предзаполнение из useStudent(id), success → redirect на profile. Исправить.
- [ ] **FE-7**: **StudentProfilePage** `/students/:id` — Проверить: данные из API, tabs (Info, Grades, Attendance, Contract, Documents) все подключены к API. Tab "Hujjatlar" — FileUpload для документов через `/students/{id}/documents/`. Кнопки "Tahrirlash", "Ma'lumotnoma"(PDF), "Chop etish"(print). Исправить.
- [ ] **FE-8**: **StudentsStatPage** `/students/statistics` — Проверить: данные из useStudentStatistics, export PDF кнопка. i18n. Исправить.

### 2.4 Education (11 страниц)

- [ ] **FE-9**: **SchedulePage** `/schedule` — Проверить: данные из useSchedules (НЕ hardcoded EVENTS). CRUD: "Yangi dars" → ScheduleForm в Modal (группа, предмет, преподаватель, аудитория, день, пара), Edit по клику на ячейку, Delete через ConfirmDialog. Фильтры: группа Combobox, преподаватель, неделя. 3 вида (haftalik/kunlik/oylik). i18n. Export PDF. Исправить что не работает.
- [ ] **FE-10**: **AcademicAttendancePage** `/attendance` — Проверить: attendance grid подключён к API, кнопка "Saqlash" → useBulkAttendance mutation отправляет данные. Фильтры: группа, предмет, дата. Export Excel. i18n.
- [ ] **FE-11**: **GradingPage** `/grading` — Проверить: оценки из API, inline editing, кнопка "Saqlash" → useBulkGrades mutation. Auto-compute итоговой оценки. Фильтры: группа, предмет, семестр. Export Excel/PDF ведомость. i18n.
- [ ] **FE-12**: **ExamsPage** `/exams` — Проверить: данные из useExams. CRUD: ExamForm в Modal (subject, group, teacher, date, room, type). Tabs: Sessiyalar(list), Jadval(calendar), Vedomost(grades). Фильтры: семестр, группа, предмет. i18n.
- [ ] **FE-13**: **CurriculumPage** `/curriculum` — Проверить: данные из useCurriculums. CRUD: CurriculumForm в SlideOver с useFieldArray для предметов. Фильтры: specialty Combobox, year. Export PDF. i18n.
- [ ] **FE-14**: **SubjectsPage** `/subjects` — Проверить: данные из useSubjects. CRUD: SubjectForm в Modal (name, code, credits, hours, department). Фильтр кафедры из useDepartments. i18n.
- [ ] **FE-15**: **LibraryPage** `/library` — Проверить: Tab "Katalog" → useBooks + BookForm (title, author, isbn, year, category, copies, location). Tab "Berilganlar" → useLoans + LoanForm (book Combobox, student Combobox, dueDate) + кнопка "Qaytarish"(returnBook). Поиск книг. i18n.
- [ ] **FE-16**: **AlumniPage** `/alumni` — Проверить: данные из useAlumni. CRUD: AlumniForm в SlideOver (fullName, graduationYear, faculty, specialty, workplace, phone, email, status). Фильтры: год, факультет, статус. Export Excel. i18n.
- [ ] **FE-17**: **InternshipPage** `/internship` — Проверить: данные из useInternships. CRUD: InternshipForm в SlideOver (student, company, supervisor, dates, type). Tabs: Joriy/Yakunlangan. i18n.
- [ ] **FE-18**: **MyStudentsPage** `/my-students` — Проверить: данные из API для текущего преподавателя. Фильтр по группе. Оценки и посещаемость студентов. i18n.
- [ ] **FE-19**: **AcademicDepartmentsPage** `/departments` — Проверить: данные из API. Статистика: преподаватели, студенты, средний балл. i18n.

### 2.5 Finance (9 страниц)

- [ ] **FE-20**: **FinanceDashboardPage** `/finance` — Проверить: данные из useFinanceDashboard (реальный API). Графики с реальными данными. Drill-down по факультету. i18n.
- [ ] **FE-21**: **ContractsListPage** `/finance/contracts` — Проверить: CRUD полный (Create в Modal, Edit, Delete через ConfirmDialog). Фильтры из API (не hardcoded). Excel/PDF export кнопки. Per-contract PDF кнопка "Shartnoma PDF" → `/contracts/{id}/pdf/`. i18n.
- [ ] **FE-22**: **ContractDetailPage** `/finance/contracts/:id` — Проверить: данные из API. Кнопка "Onlayn to'lov" → Payme/Click ссылки из `/contracts/{id}/payment-link/`. Кнопка PDF download. PaymentTimeline из реальных платежей. Кнопка "Nazad". i18n.
- [ ] **FE-23**: **DebtorsListPage** `/finance/debtors` — Проверить: фильтры факультет из useFaculties (не hardcoded). SMS Modal подключён к `/core/sms/send/`. Bulk SMS. Export Excel. i18n.
- [ ] **FE-24**: **PaymentsListPage** `/finance/payments` — Проверить: CRUD. DateRangePicker. Receipt печать. Export Excel. i18n.
- [ ] **FE-25**: **ScholarshipsPage** `/finance/scholarship` — Проверить: CRUD полный (Create, Edit, Delete). Bulk назначение. i18n.
- [ ] **FE-26**: **FinanceReportPage** `/finance/report` — Проверить: данные из API `/finance/report/`. CSV export работает. PDF export подключён. i18n.
- [ ] **FE-27**: **PayrollPage** `/finance/payroll` — Проверить: данные из usePayroll (реальный API). Excel export. Кнопка "Hisoblash" → useProcessPayroll mutation. i18n.
- [ ] **FE-28**: **BudgetPage** `/finance/budget` — Проверить: данные из useBudgetCategories (реальный API). CRUD категорий. Фильтр по кварталу. i18n.

### 2.6 HR (7 страниц)

- [ ] **FE-29**: **HrDashboardPage** `/hr` — Проверить: данные из API. Графики с реальными данными. i18n.
- [ ] **FE-30**: **EmployeesListPage** `/hr/employees` — Проверить: CRUD (Create в Modal, Edit, Delete soft). Position options из API/i18n (не hardcoded). Excel export. i18n.
- [ ] **FE-31**: **EmployeeProfilePage** `/hr/employees/:id` — Проверить: tabs Info/Career/Salary/Documents. Career из API (не hardcoded CAREER_EVENTS). Salary из payroll API. Documents FileUpload. Кнопки Edit/Print. i18n.
- [ ] **FE-32**: **DepartmentsPage** `/hr/departments` — Проверить: CRUD: DepartmentForm в Modal (name, code, faculty, head). i18n.
- [ ] **FE-33**: **OrdersPage** `/hr/orders` — Проверить: CRUD. Статус flow (draft→review→signed). PDF генерация приказа. i18n.
- [ ] **FE-34**: **AttendancePage** `/hr/attendance` — Проверить: MONTH_NAMES через i18n (не hardcoded). Department options из API. Excel export. i18n.
- [ ] **FE-35**: **LeavesPage** `/hr/leaves` — Проверить: CRUD (Create, Approve/Reject, Delete). Календарь отпусков. DateRangePicker. i18n.

### 2.7 CRM (3 страницы)

- [ ] **FE-36**: **CrmListPage** `/crm` — Проверить: CRUD (LeadForm в SlideOver с Zod: firstName, lastName, phone, email, direction, source). Фильтры: status tabs, source, assignee Combobox, DateRangePicker. Bulk status change. Excel export. i18n.
- [ ] **FE-37**: **CrmKanbanPage** `/crm/kanban` — Проверить: данные из useLeads группированы по статусу. Drag-and-drop → useUpdateLead mutation. Клик → LeadDetail. Rollback при ошибке drag. i18n.
- [ ] **FE-38**: **CrmReportPage** `/crm/report` — Проверить: данные из useCrmStats. Графики: воронка, источники, динамика. DateRangePicker. i18n.

### 2.8 Operations (6 страниц)

- [ ] **FE-39**: **TasksPage** `/tasks` — Проверить: CRUD (TaskForm в SlideOver: title, description, assignee Combobox, priority, dueDate, tags). Kanban + List view. Drag-drop статус через mutation. i18n.
- [ ] **FE-40**: **NotificationsPage** `/notifications` — Проверить: "O'qilgan" → useMarkNotificationRead mutation. "Barchasini" → useMarkAllRead. Delete. Tabs по типам. i18n.
- [ ] **FE-41**: **MessagesPage** `/messages` — Проверить: подключен к useChatThreads + useMessages. Compose → useSendMessage. Split layout (threads/messages). i18n.
- [ ] **FE-42**: **AppealsPage** `/appeals` — Проверить: CRUD (AppealForm: title, description, category). Комментарии useAddComment. Фильтры: status, category. i18n.
- [ ] **FE-43**: **NewsPage** `/news` — Проверить: CRUD для admin (NewsForm в SlideOver: title, content, category, tags, image FileUpload). Grid/List view. Фильтры. i18n.
- [ ] **FE-44**: **ReportsPage** `/reports` — Проверить: useReportTemplates список. Генерация useGenerateReport → скачивание файла. Параметры в Modal. i18n.

### 2.9 Teachers (2 страницы)

- [ ] **FE-45**: **TeachersListPage** `/teachers` — Проверить: данные из useTeachers. Клик → `/teachers/:id`. Фильтры: кафедра Combobox, степень, звание. i18n.
- [ ] **FE-46**: **TeacherProfilePage** `/teachers/:id` — Проверить: данные из useTeacher. Tabs: Info, Schedule, Load, Publications. Print. Кнопка "Nazad". i18n.

### 2.10 Science (4 страницы)

- [ ] **FE-47**: **ResearchPage** `/research` — Проверить: Tab "Loyihalar" CRUD (ProjectForm: title, leader, description, fund, dates). Tab "Maqolalar" CRUD (ArticleForm: title, authors, journal, year, type, doi). Tab "Grantlar" read-only. i18n.
- [ ] **FE-48**: **ThesesPage** `/theses` — Проверить: CRUD (ThesisForm: title, student, supervisor, type, department). Фильтры: stage tabs, type. i18n.
- [ ] **FE-49**: **ConferencesPage** `/conferences` — Проверить: CRUD (ConferenceForm: name, date, location, type). Tabs: Kelgusi/O'tgan. i18n.
- [ ] **FE-50**: **PatentsPage** `/patents` — Проверить: CRUD (PatentForm: title, inventors, date, category). Status tabs. i18n.

### 2.11 System (4 страницы)

- [ ] **FE-51**: **UsersListPage** `/system/users` — Проверить: CRUD (UserForm: firstName, lastName, phone, email, password, roles[]). Block/Unblock кнопка. Reset password. i18n.
- [ ] **FE-52**: **RolesPage** `/system/roles` — Проверить: системные роли read-only, кастомные CRUD. i18n.
- [ ] **FE-53**: **PermissionMatrixPage** `/system/permissions` — Проверить: matrix из API. Click toggle → useUpdateRolePermissions mutation. i18n.
- [ ] **FE-54**: **AuditLogPage** `/system/audit` — Проверить: данные из API. DateRangePicker. Export Excel. i18n.

### 2.12 Admin (3 страницы)

- [ ] **FE-55**: **DmsPage** `/dms` — Проверить: folder sidebar из useFolders. Documents из useDocuments. CRUD (DocumentForm: title, category, folder, priority, file FileUpload). Фильтры. i18n.
- [ ] **FE-56**: **AnalyticsPage** `/analytics` — Проверить: данные из useAnalytics (реальный API). Графики: тренды, сравнение. DateRangePicker. i18n.
- [ ] **FE-57**: **ReferencesPage** `/reference` — Проверить: useDictionaryItems(type) CRUD. DictionaryItemForm (code, name, description, sortOrder). i18n.

### 2.13 Infrastructure (3 страницы)

- [ ] **FE-58**: **DormitoryPage** `/dormitory` — Проверить: buildings из API. Rooms CRUD (DormRoomForm). Поселение/выселение студентов. i18n.
- [ ] **FE-59**: **EquipmentPage** `/equipment` — Проверить: CRUD (EquipmentForm: name, inventoryNumber, category, location, person, date, cost). Фильтры. Export Excel. i18n.
- [ ] **FE-60**: **TransportPage** `/transport` — Проверить: CRUD (VehicleForm: brand, model, plateNumber, year, driver, route). Status tabs. i18n.

### 2.14 Warehouse (1 страница)

- [ ] **FE-61**: **WarehousePage** `/warehouse` — Проверить: CRUD items (ItemForm: name, sku, category, unit, minQty, price, location). Tab "Harakatlar" movements (MovementForm: item, type, quantity, note). AlertBanner для belowMinimum. Export Excel. i18n.

### 2.15 Legacy (2 страницы)

- [ ] **FE-62**: **LegacyOrdersPage** `/orders` — Проверить: read-only из API. Пагинация. DateRangePicker. i18n.
- [ ] **FE-63**: **StaffingPage** `/staffing` — Проверить: read-only из API. Фильтр department. ProgressBar fill rate. i18n.

### 2.16 Cabinets (2 страницы)

- [ ] **FE-64**: **StudentCabinetPage** `/student-cabinet` — Проверить: cabinet.service.ts использует USE_MOCK toggle (не hardcoded MockService). Данные из `/cabinets/student/` API: student info, todaySchedule, currentGrades, upcomingExams, notifications. i18n.
- [ ] **FE-65**: **TeacherCabinetPage** `/teacher-cabinet` — Проверить: данные из `/cabinets/teacher/` API: teacher info, todayClasses, myGroups, pendingTasks, stats. i18n.

### 2.17 Profile (2 страницы)

- [ ] **FE-66**: **ProfilePage** `/profile` — Проверить: FileUpload фото. useUpdateProfile mutation (name, phone, email). i18n.
- [ ] **FE-67**: **SettingsPage** `/settings` — Проверить: смена пароля useChangePassword с Zod (oldPassword, newPassword, confirmPassword). Notification settings сохраняются. i18n.

### 2.18 Error handling на ВСЕХ страницах

- [ ] **FE-68**: Пройти по ВСЕМ 67 страницам. Для каждой с useQuery — добавить: `if (error) return <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />`. Import AlertBanner. `npm run build`. Git commit.

### 2.19 Frontend Final Verification

- [ ] **FE-69**: `npm run build` — 0 ошибок. `npm test` — все тесты. Git commit + push.

---

## PHASE 3: INTEGRATION — Полная проверка

- [ ] **INT-1**: Запустить backend + frontend. Проверить в браузере ВСЕ 14 новых страниц (exams, curriculum, library, alumni, internship, payroll, budget, student-cabinet, teacher-cabinet, messages, reports, dms, reference, analytics) — данные из API загружаются.
- [ ] **INT-2**: Проверить CRUD на 5 страницах: `/students` (C/R/U/D), `/finance/contracts` (C/R/U/D), `/hr/employees` (C/R/U/D), `/crm` (C/R/U/D), `/exams` (C/R/U/D). Если что-то не работает — исправить.
- [ ] **INT-3**: Войти под 5 ролями (admin/buxgalter/dekan/oqituvchi/talaba) — sidebar правильный, страницы без ошибок.
- [ ] **INT-4**: Переключить язык UZ→RU→EN — тексты на всех страницах меняются.
- [ ] **INT-5**: Включить dark mode — все страницы корректно отображаются.
- [ ] **INT-6**: Final deploy: `git add -A && git commit -m "feat: MVP complete — all 66 pages fully functional" && git push origin main`.

---

## ALL PHASES COMPLETE
