# PROMPT.md — Полный план доработки фронтенда Uni ERP

> Цель: каждая из 66 страниц должна быть **полностью функциональной** — CRUD, формы с валидацией, фильтры, поиск, экспорт, i18n, loading/error/empty states. Никаких hardcoded массивов, никаких заглушек.

## Общие требования (применять к КАЖДОЙ странице)

1. **Данные**: только через React Query hooks (`useXxx`). Убрать все `const ITEMS = [...]`, `generateXxx()`, hardcoded массивы
2. **CRUD**: каждая сущность — Create (форма в Modal/SlideOver), Read (таблица/список), Update (форма с предзаполнением), Delete (ConfirmDialog)
3. **Формы**: React Hook Form + Zod schema. Валидация на каждое поле. Показ ошибок под полями
4. **Фильтры**: через API query params, не локальная фильтрация. Сброс фильтров кнопкой
5. **Поиск**: debounced search через API (300ms)
6. **Пагинация**: `<Pagination>` компонент, page/pageSize через API
7. **i18n**: все тексты через `t('key')`. Никакого hardcoded текста
8. **Loading**: `<Spinner>` при загрузке данных
9. **Error**: показ ApiError message в `<AlertBanner variant="error">`
10. **Empty**: `<EmptyState>` когда данных нет
11. **Экспорт**: кнопка "Excel" → GET `/export/`, кнопка "PDF" → GET `/export-pdf/`
12. **Кнопка "Назад"**: на всех detail/profile страницах — `<ArrowLeft>` + navigate(-1)
13. **Dark mode**: все компоненты должны корректно отображаться в dark mode
14. **Responsive**: корректное отображение на mobile (< 768px)

---

## Модуль 1: AUTH (3 страницы)

### 1.1 LoginPage `/login`
**Файл:** `features/auth/pages/LoginPage.tsx`
**Статус:** Частично работает
**Задачи:**
- [x] i18n: перевести все тексты через `t('auth.*')`
- [x] Показывать детальную ошибку API (неверный пароль, пользователь заблокирован) — сейчас показывает "Xatolik: 500"
- [x] Добавить rate limiting feedback (показывать таймер при 429)
- [x] Кнопка "Показать пароль" — проверить работу toggle
- [x] Загрузка (loading state на кнопке "Kirish" при отправке)
- [x] Телефон: input mask `+998 (XX) XXX-XX-XX` — сейчас plain text

### 1.2 RoleSelectPage `/role-select`
**Файл:** `features/auth/pages/RoleSelectPage.tsx`
**Статус:** Работает (demo mode)
**Задачи:**
- [x] i18n: перевести hardcoded тексты ("Demo rejim — rolni tanlang", подписи карточек)
- [x] При реальном API (USE_MOCK=false) — логин через `authService.login()` должен работать корректно (сейчас 500 из-за phone format mismatch)
- [x] Loading overlay на карточке при клике — проверить что спиннер показывается

### 1.3 ForgotPasswordPage `/forgot-password`
**Файл:** `features/auth/pages/ForgotPasswordPage.tsx`
**Статус:** UI есть, API нет
**Задачи:**
- [ ] i18n: перевести все тексты
- [x] Реализовать 3-step flow: ввод телефона → SMS код → новый пароль (Stepper компонент)
- [x] Таймер повторной отправки SMS (60 сек countdown)
- [ ] Подключить к реальному API endpoint `/auth/forgot-password/`

---

## Модуль 2: DASHBOARD (1 страница)

### 2.1 DashboardPage `/dashboard`
**Файл:** `features/dashboard/pages/DashboardPage.tsx`
**Статус:** Частично работает — 5 sub-dashboards по ролям
**Задачи:**
- [ ] Подключить AdminDashboard к реальному API `/api/v1/dashboard/` (сейчас hardcoded mock данные внутри sub-dashboard компонентов)
- [ ] i18n: StatCard лейблы ("Fakultetlar", "Talabalar" и т.д.) через `t()`
- [ ] Добавить DateRangePicker для фильтрации по периоду
- [ ] BuxgalterDashboard: подключить к `/api/v1/finance/dashboard/`
- [ ] DekanDashboard: подключить к real API
- [ ] OqituvchiDashboard: подключить к real API
- [ ] TalabaDashboard: подключить к real API
- [ ] Графики (DonutChart, BarChart, LineChart) — проверить что рендерятся с реальными данными
- [ ] "So'nggi faoliyat" список — подключить к API (сейчас hardcoded)

---

## Модуль 3: TALABALAR / STUDENTS (4 страницы)

### 3.1 StudentsStatPage `/students/statistics`
**Файл:** `features/students/pages/StudentsStatPage.tsx`
**Статус:** Работает через hooks
**Задачи:**
- [ ] i18n: все тексты через `t('students.*')`
- [x] Добавить DateRangePicker для фильтрации по периоду
- [ ] Добавить кнопку "Eksport PDF" → вызов `/students/export-pdf/`
- [x] Dark mode: проверить цвета прогресс-баров и карточек

### 3.2 StudentsListPage `/students`
**Файл:** `features/students/pages/StudentsListPage.tsx`
**Статус:** Read работает, нет Update/Delete
**Задачи:**
- [ ] i18n: все тексты (заголовки таблицы, фильтры, кнопки)
- [x] Delete: добавить кнопку удаления в DropdownMenu каждой строки → ConfirmDialog → `useDeleteStudent()`
- [x] Bulk actions: чекбоксы для массового удаления/экспорта
- [ ] Кнопка "Excel eksport" → вызов `/students/export/`
- [ ] Кнопка "PDF eksport" → вызов `/students/export-pdf/`
- [x] Фильтры факультет/группа: заменить hardcoded массивы на данные из `useFaculties()`, `useGroups()`
- [x] Кнопка "Yangi talaba" → навигация на `/students/new`

### 3.3 StudentFormPage `/students/new` и `/students/:id/edit`
**Файл:** `features/students/pages/StudentFormPage.tsx`
**Статус:** Create работает, Update частично
**Задачи:**
- [ ] i18n: все лейблы формы через `t()`
- [x] Убрать hardcoded FACULTIES, DEPARTMENTS, SPECIALTIES, GROUPS массивы → загружать через `useFaculties()`, `useDepartments()`, `useSpecialties()`, `useGroups()`
- [x] Cascading selects: Faculty → Department → Specialty → Group (фильтрация зависимых)
- [x] FileUpload: загрузка фото студента
- [x] При Edit mode: предзаполнение формы данными из `useStudent(id)`
- [x] Кнопка "Назад" → navigate('/students')
- [x] Success toast после сохранения → redirect на profile

### 3.4 StudentProfilePage `/students/:id`
**Файл:** `features/students/pages/StudentProfilePage.tsx`
**Статус:** Read работает
**Задачи:**
- [ ] i18n: все тексты
- [x] Убрать hardcoded `STUDENT_DOCS` массив (строка 527) → загружать из API
- [x] Tab "Hujjatlar" (Документы): FileUpload для загрузки сканов
- [x] Tab "Kontrakt": ссылки на контракты студента из Finance API
- [x] Tab "Davomat": реальные данные посещаемости за семестр
- [x] Tab "O'zlashtirish": реальные оценки из API
- [x] Кнопка "Tahrirlash" → navigate(`/students/${id}/edit`)
- [x] Кнопка "Ma'lumotnoma" → генерация PDF справки
- [x] Кнопка "Chop etish" → print-friendly layout

---

## Модуль 4: TA'LIM / EDUCATION (11 страниц)

### 4.1 SchedulePage `/schedule`
**Файл:** `features/education/pages/SchedulePage.tsx`
**Статус:** ⚠️ КРИТИЧНО — hardcoded EVENTS массив
**Задачи:**
- [x] **УБРАТЬ hardcoded EVENTS массив** (строки 25-38) → `useSchedules(params)`
- [x] Убрать hardcoded DAYS, HOURS, DATES массивы
- [x] CRUD: кнопка "Yangi dars" → ScheduleForm в Modal (группа, предмет, преподаватель, аудитория, день, пара)
- [x] Edit: клик по ячейке расписания → редактирование в Modal
- [x] Delete: удаление занятия через ConfirmDialog
- [x] Фильтры: группа (Combobox), преподаватель, неделя (DatePicker)
- [x] 3 вида: Haftalik (недельный), Kunlik (дневной), Oylik (месячный)
- [ ] i18n: все тексты
- [ ] Экспорт расписания в PDF

### 4.2 AcademicAttendancePage `/attendance`
**Файл:** `features/education/pages/AcademicAttendancePage.tsx`
**Статус:** Grid UI есть, mutation неполная
**Задачи:**
- [x] Подключить grid к `useBulkAttendance()` mutation — сохранение отметок
- [x] Фильтры: группа, предмет, дата — через API
- [x] Убрать hardcoded данные, если есть
- [x] Кнопка "Saqlash" должна отправлять bulk attendance на бэкенд
- [ ] i18n: все тексты
- [ ] Экспорт посещаемости в Excel

### 4.3 GradingPage `/grading`
**Файл:** `features/education/pages/GradingPage.tsx`
**Статус:** Grid UI есть, mutation неполная
**Задачи:**
- [x] Подключить к `useBulkGrades()` mutation — сохранение оценок
- [x] Фильтры: группа, предмет, семестр — через API
- [x] Inline editing оценок в таблице
- [x] Auto-compute итоговой оценки (joriy + oraliq + yakuniy)
- [x] Кнопка "Saqlash" — bulk save
- [ ] i18n: все тексты
- [ ] Экспорт ведомости в Excel/PDF

### 4.4 ExamsPage `/exams`
**Файл:** `features/education/pages/ExamsPage.tsx`
**Статус:** Tabs с inline mock данными
**Задачи:**
- [x] Подключить к `useExams(params)` hook
- [x] Tab "Sessiyalar": список экзаменов → CRUD (создание, редактирование, удаление)
- [x] ExamForm: subjectId, groupId, examDate, room, type (midterm/final), teacherId
- [x] Zod schema: `examSchema` валидация всех полей
- [x] Tab "Imtihon jadvali": таблица расписания экзаменов
- [x] Tab "Biletlar": загрузка/просмотр экзаменационных билетов
- [x] Tab "Vedomost": ведомость оценок (подключить к Grades API)
- [x] Фильтры: семестр, группа, предмет
- [ ] i18n: все тексты

### 4.5 CurriculumPage `/curriculum`
**Файл:** `features/education/pages/CurriculumPage.tsx`
**Статус:** Read через hooks, нет CRUD
**Задачи:**
- [x] Убрать hardcoded YEARS массив
- [x] CRUD: создание/редактирование учебного плана в SlideOver
- [x] CurriculumForm с useFieldArray для предметов (добавление/удаление строк)
- [x] Zod schema: specialtyId, year, subjects[] (name, credits, hours, controlForm)
- [x] Фильтры: специальность (Combobox из `useSpecialties()`), год обучения
- [ ] i18n: все тексты
- [ ] Экспорт учебного плана в PDF

### 4.6 SubjectsPage `/subjects`
**Файл:** `features/education/pages/SubjectsPage.tsx`
**Статус:** Read через hooks, нет CRUD
**Задачи:**
- [x] CRUD: кнопка "Yangi fan" → SubjectForm в Modal
- [x] SubjectForm: name, code, credits, hoursLecture, hoursPractice, departmentId
- [x] Edit: клик по строке → Modal с предзаполненной формой
- [x] Delete: ConfirmDialog
- [x] Zod schema: `subjectSchema`
- [x] Фильтры кафедры: загружать из `useDepartments()` (убрать hardcoded)
- [ ] i18n: все тексты

### 4.7 LibraryPage `/library`
**Файл:** `features/education/pages/LibraryPage.tsx`
**Статус:** Read через hooks, нет CRUD
**Задачи:**
- [x] Tab "Katalog": useBooks(params) + CRUD для книг
- [x] BookForm: title, author, isbn, year, category, totalCopies, location
- [x] Tab "Berilganlar": `useLoans(params)` + создание выдачи + кнопка "Qaytarish" (returnBook)
- [x] LoanForm: bookId (Combobox), studentId (Combobox), dueDate
- [x] Tab "Kutish": очередь ожидания
- [x] Zod schemas: `bookSchema`, `loanSchema`
- [x] Поиск книг по названию/автору/ISBN
- [ ] i18n: все тексты

### 4.8 AlumniPage `/alumni`
**Файл:** `features/education/pages/AlumniPage.tsx`
**Статус:** Read через hooks, нет CRUD
**Задачи:**
- [x] CRUD: кнопка "Yangi bitiruvchi" → AlumniForm в SlideOver
- [x] AlumniForm: fullName, graduationYear, faculty, specialty, workplace, position, phone, email
- [x] Edit: клик по строке → SlideOver с предзаполнением
- [x] Delete: ConfirmDialog
- [x] Zod schema: `alumniSchema`
- [x] Фильтры: год выпуска, факультет, статус трудоустройства
- [ ] Экспорт в Excel
- [ ] i18n: все тексты

### 4.9 InternshipPage `/internship`
**Файл:** `features/education/pages/InternshipPage.tsx`
**Статус:** Read через hooks, нет CRUD
**Задачи:**
- [x] CRUD: кнопка "Yangi amaliyot" → InternshipForm в SlideOver
- [x] InternshipForm: studentId, companyName, supervisorName, startDate, endDate, type (production/pre_diploma)
- [x] Edit + Delete
- [x] Zod schema: `internshipSchema`
- [x] Tabs: Joriy (текущие), Yakunlangan (завершённые)
- [ ] i18n: все тексты

### 4.10 MyStudentsPage `/my-students`
**Файл:** `features/education/pages/MyStudentsPage.tsx`
**Статус:** Read через hooks
**Задачи:**
- [ ] Подключить к `/education/my-students` endpoint (группы преподавателя)
- [x] Убрать inline mock генераторы если есть
- [x] Фильтр по группе (Combobox)
- [x] Показывать оценки и посещаемость каждого студента
- [ ] i18n: все тексты

### 4.11 AcademicDepartmentsPage `/departments`
**Файл:** `features/education/pages/AcademicDepartmentsPage.tsx`
**Статус:** Read через hooks
**Задачи:**
- [x] Показывать статистику: кол-во преподавателей, студентов, средний балл
- [x] Клик по кафедре → детальная страница или SlideOver
- [ ] i18n: все тексты

---

## Модуль 5: MOLIYA / FINANCE (9 страниц)

### 5.1 FinanceDashboardPage `/finance`
**Файл:** `features/finance/pages/FinanceDashboardPage.tsx`
**Статус:** Read через hooks
**Задачи:**
- [ ] Подключить все графики к реальным данным (убрать hardcoded если есть)
- [ ] DateRangePicker для фильтрации по периоду
- [x] Drill-down: клик по факультету → фильтр контрактов
- [ ] i18n: все лейблы карточек и графиков

### 5.2 ContractsListPage `/finance/contracts`
**Файл:** `features/finance/pages/ContractsListPage.tsx`
**Статус:** C✓ R✓ D✓, нет Update
**Задачи:**
- [x] Update: редактирование контракта (тип, сумма) в Modal
- [x] Фильтры: загружать факультеты/годы из API (убрать hardcoded)
- [ ] Кнопка "Excel eksport" → `/finance/contracts/export/`
- [ ] Кнопка "PDF eksport" → `/finance/contracts/export-pdf/`
- [x] Кнопка "Shartnoma PDF" на каждой строке → `/finance/contracts/{id}/pdf/`
- [ ] i18n: все тексты (TYPE_LABELS, STATUS_LABELS → `t('statuses.*')`)

### 5.3 ContractDetailPage `/finance/contracts/:id`
**Файл:** `features/finance/pages/ContractDetailPage.tsx`
**Статус:** Read + Payment creation
**Задачи:**
- [x] Кнопка "Onlayn to'lov" → показать Payme/Click ссылки из `/contracts/{id}/payment-link/`
- [x] Кнопка "Shartnomani yuklab olish" → PDF download
- [x] Кнопка "Nazad" → navigate('/finance/contracts')
- [ ] i18n: все тексты (убрать hardcoded status labels)
- [ ] PaymentTimeline: подключить к реальной истории платежей

### 5.4 DebtorsListPage `/finance/debtors`
**Файл:** `features/finance/pages/DebtorsListPage.tsx`
**Статус:** Read работает
**Задачи:**
- [x] Убрать hardcoded FACULTIES массив → `useFaculties()`
- [ ] SMS Modal: подключить к реальному `/core/sms/send/` endpoint
- [x] Bulk SMS: массовая рассылка выбранным должникам
- [ ] Экспорт списка должников в Excel
- [ ] i18n: все тексты

### 5.5 PaymentsListPage `/finance/payments`
**Файл:** `features/finance/pages/PaymentsListPage.tsx`
**Статус:** Read + Create через modal
**Задачи:**
- [ ] Убрать hardcoded PAYMENT_METHOD_LABELS → `t('finance.paymentMethod.*')`
- [ ] DateRangePicker вместо простых пресетов
- [x] Receipt печать: кнопка на каждом платеже
- [ ] Экспорт в Excel
- [ ] i18n: все тексты

### 5.6 ScholarshipsPage `/finance/scholarship`
**Файл:** `features/finance/pages/ScholarshipsPage.tsx`
**Статус:** C✓ R✓ D✓, нет Update
**Задачи:**
- [x] Update: редактирование стипендии в Modal
- [ ] Убрать hardcoded TYPE_LABELS, STATUS_LABELS → `t('statuses.*')`
- [x] Массовое назначение стипендии (bulk create)
- [ ] i18n: все тексты

### 5.7 FinanceReportPage `/finance/report`
**Файл:** `features/finance/pages/FinanceReportPage.tsx`
**Статус:** Read + CSV export работает
**Задачи:**
- [ ] PDF export: подключить к реальному endpoint
- [ ] Убрать hardcoded report types → из API
- [ ] i18n: все тексты

### 5.8 PayrollPage `/finance/payroll`
**Файл:** `features/finance/pages/PayrollPage.tsx`
**Статус:** Read через hooks
**Задачи:**
- [ ] Кнопка "Excel eksport" → подключить к реальному endpoint
- [x] Кнопка "Hisoblash" (Рассчитать) → `useProcessPayroll()` mutation
- [x] Убрать hardcoded month/year options
- [ ] i18n: все тексты

### 5.9 BudgetPage `/finance/budget`
**Файл:** `features/finance/pages/BudgetPage.tsx`
**Статус:** Read через hooks
**Задачи:**
- [x] CRUD: редактирование бюджетных категорий (плановые суммы)
- [ ] Убрать hardcoded color map → в config
- [x] Фильтр по кварталу
- [ ] i18n: все тексты

---

## Модуль 6: KADRLAR / HR (7 страниц)

### 6.1 HrDashboardPage `/hr`
**Файл:** `features/hr/pages/HrDashboardPage.tsx` | **Задачи:**
- [ ] DateRangePicker для периода
- [x] Drill-down по метрикам (клик → фильтр)
- [ ] i18n: все тексты

### 6.2 EmployeesListPage `/hr/employees`
**Файл:** `features/hr/pages/EmployeesListPage.tsx` | **Статус:** C✓ R✓, нет U/D
**Задачи:**
- [x] Update: редактирование xodim в Modal/SlideOver
- [x] Delete: soft delete через ConfirmDialog
- [x] Убрать hardcoded position list (строки 122-127) → из API
- [x] Bulk actions: массовый экспорт
- [ ] Кнопка "Excel eksport" → `/hr/employees/export/`
- [ ] i18n: все тексты

### 6.3 EmployeeProfilePage `/hr/employees/:id`
**Файл:** `features/hr/pages/EmployeeProfilePage.tsx` | **Статус:** Read ✓
**Задачи:**
- [x] Tab "Hujjatlar": FileUpload для загрузки документов
- [ ] Tab "Maosh": реальные данные зарплаты из API (сейчас hardcoded)
- [ ] Tab "Ish faoliyati": реальная карьерная история (сейчас hardcoded CAREER_EVENTS)
- [x] Кнопка "Tahrirlash" → navigate к форме редактирования
- [x] Печать карточки сотрудника → PDF
- [ ] i18n: все тексты

### 6.4 DepartmentsPage `/hr/departments`
**Файл:** `features/hr/pages/DepartmentsPage.tsx` | **Статус:** Read, нет CRUD
**Задачи:**
- [x] CRUD: создание/редактирование bo'lim в Modal
- [x] DepartmentForm: name, code, facultyId, headId (Combobox из employees)
- [x] Delete: ConfirmDialog
- [ ] i18n: все тексты

### 6.5 OrdersPage `/hr/orders`
**Файл:** `features/hr/pages/OrdersPage.tsx` | **Статус:** C✓ R✓, нет U/D
**Задачи:**
- [x] Update: редактирование buyruq (статус: draft → review → signed)
- [x] Delete: ConfirmDialog
- [x] Генерация PDF приказа → `/hr/orders/{id}/pdf/`
- [ ] i18n: все тексты

### 6.6 AttendancePage `/hr/attendance`
**Файл:** `features/hr/pages/AttendancePage.tsx` | **Статус:** Read
**Задачи:**
- [x] Убрать hardcoded MONTH_NAMES, department options
- [ ] Кнопка "Excel eksport" — подключить к endpoint
- [x] Bulk-отметка (выходной для всех)
- [ ] i18n: все тексты

### 6.7 LeavesPage `/hr/leaves`
**Файл:** `features/hr/pages/LeavesPage.tsx` | **Статус:** C✓ R✓ U✓
**Задачи:**
- [x] Delete: отмена ta'til запроса
- [x] Календарь отпусков (визуализация)
- [x] DateRangePicker для фильтрации
- [ ] i18n: все тексты

---

## Модуль 7: QABUL / CRM (3 страницы)

### 7.1 CrmListPage `/crm`
**Файл:** `features/crm/pages/CrmListPage.tsx`
**Задачи:**
- [x] CRUD: Create (LeadForm в SlideOver), Delete (ConfirmDialog)
- [x] LeadForm: firstName, lastName, phone, email, direction, source, notes
- [x] Zod schema: `leadSchema`
- [x] Фильтры: статус (tabs), source (select), assignee (Combobox), DateRangePicker
- [x] Bulk actions: массовое изменение статуса
- [ ] Кнопка "Excel eksport" → `/crm/leads/export/`
- [ ] i18n: все тексты

### 7.2 CrmKanbanPage `/crm/kanban`
**Файл:** `features/crm/pages/CrmKanbanPage.tsx`
**Задачи:**
- [x] Подключить к `useLeads({})` → группировка по статусу
- [x] Drag-and-drop: перемещение карточки → `useUpdateLead({status: newStatus})`
- [x] Клик по карточке → LeadDetailSlide (просмотр + история)
- [ ] i18n: все тексты

### 7.3 CrmReportPage `/crm/report`
**Файл:** `features/crm/pages/CrmReportPage.tsx`
**Задачи:**
- [ ] Подключить к `useCrmStats()` — реальные данные
- [ ] DateRangePicker для периода
- [x] Графики: воронка (BarChart), источники (DonutChart), динамика (LineChart)
- [ ] i18n: все тексты

---

## Модуль 8: BOSHQARUV / OPERATIONS (6 страниц)

### 8.1 TasksPage `/tasks`
**Файл:** `features/operations/pages/TasksPage.tsx` | **Статус:** Kanban + List
**Задачи:**
- [x] CRUD: Create (TaskForm в SlideOver)
- [x] TaskForm: title, description, assigneeId (Combobox), priority, dueDate, tags
- [x] Zod schema: `taskSchema`
- [ ] Убрать hardcoded PRIORITY_LABELS, STATUS_LABELS, KANBAN_COLUMNS → i18n
- [x] Drag-and-drop обновление статуса через mutation
- [ ] i18n: все тексты

### 8.2 NotificationsPage `/notifications`
**Файл:** `features/operations/pages/NotificationsPage.tsx`
**Задачи:**
- [x] "O'qilgan deb belgilash" → `useMarkNotificationRead()` mutation
- [x] "Barchasini o'qilgan" → `useMarkAllRead()` mutation
- [x] Delete: удаление bildirishnoma
- [x] Tabs по типам (info, warning, success, system)
- [ ] i18n: все тексты

### 8.3 MessagesPage `/messages`
**Файл:** `features/operations/pages/MessagesPage.tsx`
**Задачи:**
- [x] Подключить к `useChatThreads()` и `useMessages(threadId)`
- [x] Compose: `useSendMessage()` mutation
- [ ] Real-time: polling каждые 10 сек
- [x] Split layout: треды слева, сообщения справа
- [ ] i18n: все тексты

### 8.4 AppealsPage `/appeals`
**Файл:** `features/operations/pages/AppealsPage.tsx`
**Задачи:**
- [x] CRUD: Create (AppealForm), Update (статус), Delete
- [x] AppealForm: title, description, category
- [x] Комментарии: `useAddComment()` mutation
- [x] Фильтры: status tabs, category select
- [ ] i18n: все тексты

### 8.5 NewsPage `/news`
**Файл:** `features/operations/pages/NewsPage.tsx`
**Задачи:**
- [x] CRUD (для admin): Create (NewsForm в SlideOver), Edit, Delete
- [x] NewsForm: title, content, category, tags
- [x] Grid/List toggle view
- [x] Фильтры: category, tag
- [ ] i18n: все тексты

### 8.6 ReportsPage `/reports`
**Файл:** `features/operations/pages/ReportsPage.tsx`
**Задачи:**
- [x] Подключить к `useReportTemplates()`
- [x] Генерация: `useGenerateReport()` → скачивание файла
- [x] Параметры отчёта в Modal
- [ ] i18n: все тексты

---

## Модуль 9: O'QITUVCHILAR / TEACHERS (1+1 страница)

### 9.1 TeachersListPage `/teachers`
**Файл:** `features/teachers/pages/TeachersListPage.tsx`
**Задачи:**
- [x] Клик по строке → `/teachers/:id` (TeacherProfilePage)
- [x] Фильтры: кафедра (Combobox), степень, звание, форма занятости
- [ ] i18n: все тексты

### 9.2 TeacherProfilePage `/teachers/:id` — **НОВАЯ СТРАНИЦА**
**Файл:** `features/teachers/pages/TeacherProfilePage.tsx` — СОЗДАТЬ
**Задачи:**
- [x] Создать по аналогии с EmployeeProfilePage
- [x] Tabs: Информация, Расписание, Нагрузка, Публикации
- [x] Route в router.tsx

---

## Модуль 10: ILMIY FAOLIYAT / SCIENCE (4 страницы)

### 10.1 ResearchPage `/research`
**Задачи:**
- [x] ProjectForm создан (title, leaderId, description, fundAmount, dates)
- [x] ArticleForm создан (title, authors, journal, year, type, doi)
- [x] Zod schemas: `projectSchema`, `articleSchema`
- [ ] i18n: все тексты

### 10.2 ThesesPage `/theses`
**Задачи:**
- [x] ThesisForm создан в Modal
- [x] Zod schema: `thesisSchema`
- [x] Фильтры: stage tabs, type select, supervisor
- [ ] i18n: все тексты

### 10.3 ConferencesPage `/conferences`
**Задачи:**
- [x] ConferenceForm создан в SlideOver
- [x] Tabs: Kelgusi / O'tgan
- [ ] i18n: все тексты

### 10.4 PatentsPage `/patents`
**Задачи:**
- [x] PatentForm создан в Modal
- [ ] Убрать hardcoded STATUS_META → i18n
- [ ] i18n: все тексты

---

## Модуль 11: TIZIM / SYSTEM (4 страницы)

### 11.1 UsersListPage `/system/users`
**Задачи:**
- [x] UserForm: полная форма (firstName, lastName, phone, email, password, roles[])
- [x] Edit + Block/Unblock + Reset password
- [ ] i18n: все тексты

### 11.2 RolesPage `/system/roles`
**Задачи:**
- [ ] Убрать hardcoded MODULE_GROUPS → из API
- [x] Кастомные роли: CRUD
- [ ] i18n: все тексты

### 11.3 PermissionMatrixPage `/system/permissions`
**Задачи:**
- [x] Click → toggle permission → `useUpdateRolePermissions()` mutation
- [ ] Убрать hardcoded verbs/modules
- [ ] i18n: все тексты

### 11.4 AuditLogPage `/system/audit`
**Задачи:**
- [ ] DateRangePicker
- [ ] Экспорт логов в Excel
- [ ] i18n: все тексты

---

## Модуль 12: ADMIN (3 страницы)

### 12.1 DmsPage `/dms`
**Задачи:**
- [x] Folder sidebar: `useFolders()`
- [x] CRUD: DocumentForm в SlideOver (title, category, folderId, priority, file)
- [x] FileUpload
- [ ] i18n: все тексты

### 12.2 AnalyticsPage `/analytics`
**Задачи:**
- [ ] Подключить к `useAnalytics(params)` — реальные данные
- [ ] DateRangePicker
- [x] Графики: тренды, сравнение, top groups
- [ ] i18n: все тексты

### 12.3 ReferencesPage `/reference`
**Задачи:**
- [x] CRUD для каждого типа справочника
- [x] DictionaryItemForm: code, name, description, sortOrder
- [ ] i18n: все тексты

---

## Модуль 13: INFRATUZILMA / INFRASTRUCTURE (3 страницы)

### 13.1 DormitoryPage `/dormitory`
**Задачи:**
- [x] BuildingSelector → floor → room grid
- [x] CRUD для комнат: DormRoomForm
- [x] Поселение/выселение студентов
- [ ] i18n: все тексты

### 13.2 EquipmentPage `/equipment`
**Задачи:**
- [x] CRUD: EquipmentForm в SlideOver
- [x] Фильтры: category, status, location
- [ ] Экспорт в Excel
- [ ] i18n: все тексты

### 13.3 TransportPage `/transport`
**Задачи:**
- [x] CRUD: VehicleForm в Modal
- [x] Status tabs
- [ ] i18n: все тексты

---

## Модуль 14: OMBOR / WAREHOUSE (1 страница)

### 14.1 WarehousePage `/warehouse`
**Задачи:**
- [x] CRUD: ItemForm в SlideOver
- [x] Tab "Harakatlar": MovementForm в Modal (itemId, type, quantity, note)
- [x] AlertBanner для товаров ниже минимума
- [ ] Убрать hardcoded CATEGORIES, STATUS_CONFIG
- [ ] Экспорт в Excel
- [ ] i18n: все тексты

---

## Модуль 15: ESKI TIZIM / LEGACY (2 страницы)

### 15.1 LegacyOrdersPage `/orders`
**Задачи:**
- [x] Пагинация
- [ ] DateRangePicker
- [ ] i18n: все тексты

### 15.2 StaffingPage `/staffing`
**Задачи:**
- [x] Фильтр по bo'lim
- [x] ProgressBar для fill rate
- [ ] i18n: все тексты

---

## Модуль 16: KABINETLAR / CABINETS (2 страницы)

### 16.1 StudentCabinetPage `/student-cabinet`
**Задачи:**
- [ ] Подключить к `useStudentCabinet()` — реальные данные
- [x] Hero banner, расписание, оценки, экзамены, уведомления
- [x] Quick actions: оплата, справка
- [ ] i18n: все тексты

### 16.2 TeacherCabinetPage `/teacher-cabinet`
**Задачи:**
- [ ] Подключить к `useTeacherCabinet()` — реальные данные
- [x] Сегодняшние занятия, группы, pending tasks
- [ ] i18n: все тексты

---

## Модуль 17: PROFIL / PROFILE (2 страницы)

### 17.1 ProfilePage `/profile`
**Задачи:**
- [x] FileUpload для фото
- [x] `useUpdateProfile()` mutation
- [x] Форма: firstName, lastName, phone, email
- [ ] i18n: все тексты

### 17.2 SettingsPage `/settings`
**Задачи:**
- [x] Смена пароля: `useChangePassword()` с Zod валидацией
- [ ] Notification settings → API persistence
- [ ] i18n: все тексты

---

## Технические задачи (cross-cutting)

### T1. Убрать все hardcoded массивы
Файлы с hardcoded данными → заменить на API:
- `SchedulePage.tsx` — EVENTS, DAYS, HOURS, DATES
- `StudentFormPage.tsx` — FACULTIES, DEPARTMENTS
- `DebtorsListPage.tsx` — FACULTIES
- `AttendancePage.tsx` — MONTH_NAMES, department options
- `WarehousePage.tsx` — CATEGORIES, STATUS_CONFIG
- `TasksPage.tsx` — PRIORITY_LABELS, KANBAN_COLUMNS
- `PatentsPage.tsx` — STATUS_META
- `ProfilePage.tsx` — ROLE_LABELS
- `SettingsPage.tsx` — LANGUAGES
- `EmployeesListPage.tsx` — position list
- `CurriculumPage.tsx` — YEARS
- Все `*_LABELS` / `*_CONFIG` → `config/statuses.ts` или i18n

### T2. i18n — подключить ко ВСЕМ 66 страницам
- Sidebar navigation → `t('nav.*')`
- PageHeader title/subtitle → `t('module.title')`
- Form labels → `t('module.fieldName')`
- Buttons → `t('common.save')`, `t('common.cancel')`
- Statuses → `t('statuses.*')`
- Errors → `t('errors.*')`
- Empty states → `t('common.noData')`

### T3. Создать 23 недостающие формы
| Форма | Модуль | Schema |
|-------|--------|--------|
| ScheduleForm | Education | scheduleSchema |
| SubjectForm | Education | subjectSchema |
| BookForm | Education | bookSchema |
| LoanForm | Education | loanSchema |
| AlumniForm | Education | alumniSchema |
| InternshipForm | Education | internshipSchema |
| CurriculumForm | Education | curriculumSchema |
| LeadForm | CRM | leadSchema |
| TaskForm | Operations | taskSchema |
| AppealForm | Operations | appealSchema |
| NewsForm | Operations | newsSchema |
| ProjectForm | Science | projectSchema |
| ArticleForm | Science | articleSchema |
| ConferenceForm | Science | conferenceSchema |
| ThesisForm | Science | thesisSchema |
| PatentForm | Science | patentSchema |
| DepartmentForm | HR | departmentSchema |
| DormRoomForm | Infrastructure | dormRoomSchema |
| EquipmentForm | Infrastructure | equipmentSchema |
| VehicleForm | Infrastructure | vehicleSchema |
| ItemForm | Warehouse | warehouseItemSchema |
| MovementForm | Warehouse | movementSchema |
| DocumentForm | Admin | documentSchema |

### T4. Export кнопки на list страницах
- StudentsListPage → Excel + PDF
- ContractsListPage → Excel + PDF + per-contract PDF
- EmployeesListPage → Excel
- PaymentsListPage → Excel
- DebtorsListPage → Excel
- CrmListPage → Excel
- OrdersPage → PDF (приказ)
- AttendancePage → Excel
- GradingPage → Excel + PDF (ведомость)
- WarehousePage → Excel
- AuditLogPage → Excel

### T5. Новые страницы
- TeacherProfilePage `/teachers/:id` — по аналогии с EmployeeProfilePage
