# BITU ERP — Промпты для claude.ai/design

> Каждый промпт ниже — готовый текст для вставки в claude.ai/design.
> Перед использованием загрузи `teamhub-design-system.md` как Custom Instructions / Project Knowledge.
> Все страницы используют **TeamHub Design System** (зелёная тема, Inter, white cards).

---

## Как использовать

1. Открой **claude.ai** → создай проект или чат с артефактами
2. В Project Knowledge загрузи `teamhub-design-system.md`
3. Копируй промпт нужной страницы → вставляй в чат
4. Claude сгенерирует React + Tailwind артефакт

---

## Навигация по страницам

| # | Страница | Модуль | Тип |
|---|----------|--------|-----|
| 1 | [Login](#1-login) | Auth | Auth |
| 2 | [Registration](#2-registration) | Auth | Auth |
| 3 | [Dashboard](#3-dashboard-asosiy) | Asosiy | Dashboard |
| 4 | [CRM — Список заявок](#4-crm--список-заявок) | CRM | List |
| 5 | [CRM — Kanban воронка](#5-crm--kanban-воронка) | CRM | Board |
| 6 | [CRM — Отчёт](#6-crm--отчёт) | CRM | Report |
| 7 | [Преподаватели — Список](#7-преподаватели--список) | O'qituvchi | List |
| 8 | [Преподаватель — Профиль](#8-преподаватель--профиль) | O'qituvchi | Detail |
| 9 | [Расписание преподавателя](#9-расписание-преподавателя) | O'qituvchi | Calendar |
| 10 | [Студенты — Список](#10-студенты--список) | Talaba | List |
| 11 | [Студент — Профиль](#11-студент--профиль) | Talaba | Detail |
| 12 | [Студент — Создание/Редактирование](#12-студент--созданиередактирование) | Talaba | Form |
| 13 | [Посещаемость](#13-посещаемость) | Talaba | Table |
| 14 | [Оценивание (Oraliq/Imtihon/Yakuniy)](#14-оценивание) | Talaba | Table |
| 15 | [Расписание занятий](#15-расписание-занятий) | Academic | Calendar |
| 16 | [Контракты — Список](#16-контракты--список) | Hisobxona | List |
| 17 | [Контракт — Детали и оплаты](#17-контракт--детали-и-оплаты) | Hisobxona | Detail |
| 18 | [Должники (Qarzdorlar)](#18-должники-qarzdorlar) | Hisobxona | List |
| 19 | [Финансовый отчёт](#19-финансовый-отчёт) | Hisobxona | Report |
| 20 | [Общежитие — Обзор](#20-общежитие--обзор) | TTJ | Dashboard |
| 21 | [Общежитие — Комнаты](#21-общежитие--комнаты) | TTJ | List |
| 22 | [HR — Сотрудники](#22-hr--сотрудники) | Xodimlar | List |
| 23 | [HR — Профиль сотрудника](#23-hr--профиль-сотрудника) | Xodimlar | Detail |
| 24 | [HR — Вакансии](#24-hr--вакансии) | Xodimlar | List |
| 25 | [Онлайн-магазин — Товары](#25-онлайн-магазин--товары) | Shop | List |
| 26 | [Онлайн-магазин — Дашборд](#26-онлайн-магазин--дашборд) | Shop | Dashboard |
| 27 | [Задачи (Topshiriqlar)](#27-задачи-topshiriqlar) | Tasks | Board |
| 28 | [Обращения (Murojaatlar)](#28-обращения-murojaatlar) | Discuss | List |
| 29 | [Новости и объявления](#29-новости-и-объявления) | Content | List |
| 30 | [Отчёты — Хаб](#30-отчёты--хаб) | Hisobotlar | Dashboard |
| 31 | [Справочники (BITI malumotlar)](#31-справочники) | Reference | List |
| 32 | [Пользователи и роли](#32-пользователи-и-роли) | Admin | List |
| 33 | [Настройки системы](#33-настройки-системы) | Admin | Form |
| 34 | [Олимпиады](#34-олимпиады) | Extra | List |
| 35 | [Уведомления](#35-уведомления) | System | List |

---

## 1. Login

```
Using the TeamHub Design System, create a Login page for BITU ERP — a university management system.

Layout: Split screen.
- Left side (50%): Emerald green gradient (#2DB976 → #1B7A4E) background with a centered university emblem/icon (use a graduation cap or university building icon in white). Below the icon: "BITU ERP" in white bold text, subtitle: "Buxoro Innovatsion Ta'lim va Tibbiyot Universiteti" in white/semi-transparent text.
- Right side (50%): White background, vertically centered form.

Form content:
- Logo or "BITU ERP" text at top
- Heading: "Tizimga kirish" (Login)
- Subtitle: "Telefon raqamingiz va parolingizni kiriting"
- Phone number input with label "Telefon raqami" and placeholder "+998 (__) ___-__-__"
- Password input with label "Parol" with show/hide toggle icon
- "Eslab qolish" (Remember me) checkbox on left, "Parolni unutdingiz?" link on right
- Primary green "Kirish" (Login) button, full width
- Branch selector dropdown at bottom: "Filial tanlang" (Select branch) — this is for multi-campus support

Footer: "© 2026 BITU ERP. Barcha huquqlar himoyalangan."
```

---

## 2. Registration

```
Using the TeamHub Design System, create a Registration page for BITU ERP.

Layout: Split screen (same as Login).
- Left side: Emerald gradient with university icon, brand text.
- Right side: White, multi-step registration form.

Step indicator at top: 3 steps — "1. Shaxsiy ma'lumotlar" → "2. Lavozim" → "3. Tasdiqlash"

Step 1 visible fields (2-column grid):
- "Ism" (First name) — text input
- "Familiya" (Last name) — text input
- "Telefon raqami" — phone input with +998 mask
- "Email" — email input
- "Parol" — password input
- "Parolni tasdiqlash" — confirm password input

Bottom actions:
- "Ortga" (Back) secondary button — disabled on step 1
- "Keyingi" (Next) primary green button

Footer: "Akkauntingiz bormi? Tizimga kiring" link
```

---

## 3. Dashboard (Asosiy)

```
Using the TeamHub Design System, create the main Dashboard page for BITU ERP — a university management system.

Sidebar navigation (left, 240px):
- Logo: "BITU ERP" with university icon
- Active item: "Asosiy" (Dashboard) — green highlighted
- Other items with icons: CRM, O'qituvchilar (Teachers), Talabalar (Students), BITI malumotlar (Reference), Boshqaruv (Admin), Hujjatlar (Documents), Xodimlar (HR), Hisobxona (Accounting), TTJ (Dormitory), Online Do'kon (Shop), Hisobotlar (Reports), Topshiriqlar (Tasks), Murojaatlar (Appeals)
- Bottom: branch selector showing current campus name

Top bar:
- Search input (center)
- Notification bell icon with badge count "5"
- User avatar + name "Admin" + role dropdown

Page title: "Bosh sahifa" with greeting "Assalomu alaykum, Admin!"
Branch selector pill: "Buxoro filiali" with dropdown

Row 1 — 6 Stats Cards (3 columns × 2 rows):
| Icon | Label | Value |
|------|-------|-------|
| 🎓 | Fakultetlar (Faculties) | 8 |
| 📚 | Kafedralar (Departments) | 24 |
| 👨‍🏫 | O'qituvchilar (Teachers) | 186 |
| 👨‍🎓 | Talabalar (Students) | 3,247 |
| 🏠 | Xonalar (Rooms) | 142 |
| 👥 | Guruhlar (Groups) | 89 |

Row 2 — 6 more Stats Cards:
| Icon | Label | Value |
|------|-------|-------|
| 👷 | Ishchilar (Staff) | 312 |
| 🖥 | Jihozlar (Equipment) | 1,856 |
| ☀️ | Kunduzgi (Day students) | 2,180 |
| 🌙 | Sirtqi (Evening students) | 1,067 |
| 📖 | O'quv adabiyotlar (Textbooks) | 4,523 |
| 📕 | Badiiy adabiyotlar (Fiction) | 1,287 |

Row 3 — Charts (3 columns):
- Pie chart: "Viloyatlar bo'yicha" (By region) — top 5 regions with percentages
- Pie chart: "Jinsi bo'yicha" (By gender) — Male/Female split
- Pie chart: "Yoshi bo'yicha" (By age) — age groups 17-20, 21-24, 25+

Each stat card: white bg, rounded-xl, shadow-card, colored icon circle (green), large bold number, small label, optional trend percentage.
```

---

## 4. CRM — Список заявок

```
Using the TeamHub Design System, create a CRM Leads list page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / CRM"
- Title: "CRM — Arizalar" (Applications)
- Right: "+ Yangi ariza" (New application) primary green button

Row 1 — 4 Stats Cards:
| Label | Value | Trend |
|-------|-------|-------|
| Jami arizalar (Total) | 1,245 | +18% |
| Yangi (New) | 89 | +12 bugun |
| Jarayonda (In progress) | 342 | — |
| Qabul qilingan (Accepted) | 814 | 65.4% |

Row 2 — Filters:
- Search: "Ism yoki telefon bo'yicha qidiring..."
- Status filter dropdown: "Barchasi" / "Yangi" / "Qo'ng'iroq" / "Kutilmoqda" / "Qabul" / "Rad"
- Source filter: "Barchasi" / "Website" / "Telegram" / "Instagram" / "Referral"
- Date range picker
- "Eksport" (Export) secondary button with download icon

Table columns:
| Column | Width | Content |
|--------|-------|---------|
| # | 60px | Sequential number |
| Ism (Name) | 180px | Full name text |
| Telefon | 140px | +998 phone number |
| Yo'nalish (Direction) | 160px | Education direction |
| Manba (Source) | 100px | Badge: "Telegram" blue, "Website" green, "Instagram" pink |
| Holat (Status) | 120px | Badge: "Yangi" green, "Qo'ng'iroq" yellow, "Rad" red |
| Mas'ul (Responsible) | 140px | Staff name |
| Sana (Date) | 100px | Date created |
| Amallar (Actions) | 80px | View/Edit/Delete icon buttons |

Show 10 rows of sample data. Pagination at bottom.
```

---

## 5. CRM — Kanban воронка

```
Using the TeamHub Design System, create a CRM Kanban Board page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / CRM / Voronka"
- Title: "CRM Voronka" (Sales Funnel)
- View toggle: List | Kanban (Kanban active)
- Right: "+ Yangi ariza" button

Kanban board with 5 columns:

Column 1: "Yangi" (New) — header with green dot, count badge "23"
Column 2: "Qo'ng'iroq qilindi" (Called) — yellow dot, "18"
Column 3: "Kutilmoqda" (Pending) — blue dot, "12"
Column 4: "Qabul qilindi" (Accepted) — green dot, "45"
Column 5: "Rad etildi" (Rejected) — red dot, "8"

Each card in column:
- White card, shadow-sm, rounded-lg, padding-3
- Name in bold (text-sm)
- Phone number (text-xs, gray)
- Direction tag: "Tibbiyot" / "Stomatologiya" / "Farmatsiya"
- Source badge: colored pill
- Date: text-xs, bottom right
- Drag handle on left

Cards should be draggable between columns. Show 3-5 cards per column.
Summary bar at top: Total leads funnel visualization — horizontal stacked bar showing conversion at each stage.
```

---

## 6. CRM — Отчёт

```
Using the TeamHub Design System, create a CRM Report page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / CRM / Hisobot"
- Title: "CRM Hisobotlari" (CRM Reports)
- Period filter: "Bu oy" / "Oxirgi 3 oy" / "Bu yil" / custom date range

Row 1 — 4 Stats Cards:
| Label | Value | Trend |
|-------|-------|-------|
| Jami arizalar | 1,245 | +18% vs last month |
| Konversiya | 65.4% | +3.2% |
| O'rtacha javob vaqti | 2.3 soat | -15% |
| Rad etilganlar | 8.2% | -1.5% |

Row 2 — Charts (2 columns):
- Left: Funnel chart (vertical) showing: Yangi (100%) → Qo'ng'iroq (72%) → Kutilmoqda (48%) → Qabul (34%) → Ro'yxatdan o'tdi (28%). Green gradient colors from light to dark.
- Right: Line chart "Oylik dinamika" (Monthly dynamics) — 12 months, two lines: "Arizalar" and "Qabul qilinganlar"

Row 3 — Charts (2 columns):
- Left: Pie chart "Manbalar bo'yicha" (By source) — Website 35%, Telegram 28%, Instagram 18%, Referral 12%, Other 7%
- Right: Bar chart "Yo'nalishlar bo'yicha" (By direction) — top 6 education directions

Row 4 — Table "Mas'ullar bo'yicha" (By responsible):
Columns: Xodim (Staff), Jami (Total), Yangi, Qabul, Rad, Konversiya %
Show 5-8 staff rows sorted by conversion rate.
```

---

## 7. Преподаватели — Список

```
Using the TeamHub Design System, create a Teachers list page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / O'qituvchilar"
- Title: "O'qituvchilar ro'yxati" (Teachers List)
- Right: "+ Yangi o'qituvchi" primary button

Row 1 — 4 Stats Cards:
| Label | Value | Trend |
|-------|-------|-------|
| Jami (Total) | 186 | — |
| Dotsent (Associate Prof) | 42 | 22.6% |
| Professor | 18 | 9.7% |
| PhD | 67 | 36% |

Row 2 — Donut chart "Kafedralar bo'yicha" (By department) — showing distribution across 6-8 departments

Filters: Search + Department dropdown + Academic degree dropdown + Work mode dropdown

Table columns:
| Column | Content |
|--------|---------|
| # | Row number |
| Rasm (Photo) | Avatar circle (40px) |
| F.I.O (Full name) | Bold name, subtitle: department |
| Kafedra (Department) | Text |
| Ilmiy daraja (Degree) | Badge: "PhD" blue, "DSc" green |
| Ilmiy unvon (Title) | "Dotsent" / "Professor" |
| Ish tarzi (Mode) | "Shtativ" / "Soatbay" |
| Telefon | Phone number |
| Amallar | View/Edit/Delete |

Show 10 rows with realistic Uzbek names. Pagination.
```

---

## 8. Преподаватель — Профиль

```
Using the TeamHub Design System, create a Teacher Profile (Detail) page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / O'qituvchilar / Aliyev Jasur Kamoliddinovich"
- Back arrow button

Profile card (top, full width):
- Left: Large avatar (80px), name "Aliyev Jasur Kamoliddinovich", department "Ichki kasalliklar kafedrasi"
- Right side info grid (3 columns):
  | Label | Value |
  |-------|-------|
  | Telefon | +998 91 234-56-78 |
  | Email | aliyev.j@bitu.uz |
  | Ilmiy daraja | PhD |
  | Ilmiy unvon | Dotsent |
  | Ish tarzi | Shtatli |
  | Staj | 12 yil |

Tabs below profile card:
- "Ma'lumotlar" (Info) — active
- "Dars jadvali" (Schedule)
- "Davomat" (Attendance)
- "Rag'bat va jarima" (Incentives)
- "Baholash" (Evaluation)
- "Hujjatlar" (Documents)

Tab content "Ma'lumotlar":
Left column — Personal info card:
  - Tug'ilgan sana: 15.03.1985
  - Jinsi: Erkak
  - Millati: O'zbek
  - Ma'lumoti: Oliy
  - Oila holati: Turmush qurgan
  - Manzil: Buxoro sh., Navoiy ko'chasi 45

Right column — Academic info card:
  - Mutaxassisligi: Ichki kasalliklar
  - Bitirgan muassasa: Toshkent Tibbiyot Akademiyasi (2008)
  - Dissertatsiya: "Jigar kasalliklari diagnostikasi" (2015)
  - Ilmiy maqolalar soni: 34
  - Patentlar: 2
  - Fan soatlari (bu semester): 320

Bottom card — Teaching subjects table:
Columns: Fan nomi (Subject), Guruh (Group), Soatlar (Hours), Semester
Show 4-5 rows of medical subjects.
```

---

## 9. Расписание преподавателя

```
Using the TeamHub Design System, create a Teacher Schedule page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / O'qituvchilar / Dars jadvali"
- Title: "O'qituvchi dars jadvali" (Teacher Schedule)

Filter bar:
- Teacher selector: searchable dropdown with teacher name
- Semester selector: "2025-2026 / 2-semester"
- Week selector: "< 14-18 aprel >" with prev/next arrows

Calendar grid (weekly view):
- Y-axis: Time slots (Paralar): 1-para (8:00-9:20), 2-para (9:30-10:50), 3-para (11:00-12:20), 4-para (13:00-14:20), 5-para (14:30-15:50), 6-para (16:00-17:20)
- X-axis: Days: Dushanba (Mon), Seshanba (Tue), Chorshanba (Wed), Payshanba (Thu), Juma (Fri), Shanba (Sat)

Event blocks in cells:
- Each lesson block: colored card (green, blue, yellow based on subject type)
- Content: Subject name (bold), Group name, Room number
- Example: "Ichki kasalliklar | 301-guruh | 205-xona"

Right sidebar panel (300px):
- "Bugungi darslar" (Today's classes):
  - List of 3-4 classes with time, subject, group, room
  - Status indicator: completed (green check), upcoming (blue clock), current (green pulse)

Bottom stats row:
- Total hours this week: 18
- Total groups: 6
- Room changes: 1
```

---

## 10. Студенты — Список

```
Using the TeamHub Design System, create a Students list page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Talabalar"
- Title: "Talabalar ro'yxati" (Students List)
- Right actions: "Import Excel" secondary button + "+ Yangi talaba" primary button

Row 1 — 4 Stats Cards:
| Icon | Label | Value | Trend |
|------|-------|-------|-------|
| 👨‍🎓 | Jami talabalar | 3,247 | +124 bu yil |
| ☀️ | Kunduzgi | 2,180 | 67.1% |
| 🌙 | Sirtqi | 1,067 | 32.9% |
| ⚠️ | Akademik qarzdorlar | 89 | -12 vs o'tgan oy |

Row 2 — Donut chart "Fakultetlar bo'yicha" (By faculty) with legend showing 6-8 faculties

Filters: Search + Faculty dropdown + Course (1-6) + Group + Education form (Kunduzgi/Sirtqi) + Status (Active/Academic leave/Expelled)

Table columns:
| Column | Content |
|--------|---------|
| ☐ | Checkbox |
| # | Sequential |
| Rasm | Avatar 36px |
| F.I.O | Name (bold) + student ID below |
| Fakultet | Faculty name |
| Yo'nalish | Direction |
| Guruh | Group code (e.g., "301-A") |
| Kurs | 1-6 |
| Ta'lim shakli | Badge: "Kunduzgi" green / "Sirtqi" blue |
| Holat | Badge: "Faol" green / "Akademik ta'til" yellow / "Chetlashtirilgan" red |
| Amallar | View/Edit/Delete |

Show 10 rows with realistic Uzbek names. Pagination: "10 / 3247 ta natija".
Bulk actions bar (when checkboxes selected): "Tanlangan: 3" + "Eksport" + "Guruh o'zgartirish" buttons.
```

---

## 11. Студент — Профиль

```
Using the TeamHub Design System, create a Student Profile (Detail) page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Talabalar / Karimova Nilufar Rashidovna"
- Back arrow

Profile card (top):
- Left: Large avatar (80px) with upload overlay
- Center: Name "Karimova Nilufar Rashidovna", Student ID: "STU-2024-0847"
  Faculty: "Tibbiyot fakulteti", Group: "301-A", Course: 3
- Right: Status badge "Faol" (green), QR code icon button (for verification)

Tabs:
- "Shaxsiy" (Personal) — active
- "O'qish" (Academic)
- "Moliya" (Finance)
- "Davomat" (Attendance)
- "Baholar" (Grades)
- "Bonus/Jarima"
- "Ota-onalar" (Parents)

Tab "Shaxsiy" content:

Left card — Personal data:
| Field | Value |
|-------|-------|
| Tug'ilgan sana | 22.05.2004 |
| Jinsi | Ayol |
| Millati | O'zbek |
| Fuqaroligi | O'zbekiston |
| Passport | AB 1234567 |
| JSHSHIR (PINFL) | 12345678901234 |
| Telefon | +998 93 456-78-90 |
| Email | karimova.n@mail.uz |
| Manzil | Buxoro vil., Kogon t., ... |
| Oila holati | Turmush qurmagan |

Right card — Education data:
| Field | Value |
|-------|-------|
| Yo'nalish | Davolash ishi |
| Ta'lim shakli | Kunduzgi |
| Ta'lim tili | O'zbek |
| Qabul yili | 2022 |
| Kutilgan bitirish | 2028 |
| GPA | 3.67 / 4.0 |
| Stipendiya | Ha (davlat) |
| Turar joy | TTJ, 3-bino, 215-xona |

Bottom card — IQ/Psycho test results:
Small cards or progress bars showing test scores: IQ: 112, EQ: 95, Stress tolerance: 78%
```

---

## 12. Студент — Создание/Редактирование

```
Using the TeamHub Design System, create an Add/Edit Student form page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Talabalar / Yangi talaba qo'shish"
- Title: "Yangi talaba qo'shish" (Add New Student)

Step indicator (4 steps):
1. "Shaxsiy ma'lumotlar" (Personal) — active, green
2. "Ta'lim ma'lumotlari" (Education)
3. "Hujjatlar" (Documents)
4. "Tasdiqlash" (Confirmation)

Form section "Shaxsiy ma'lumotlar":
Photo upload area (left): dashed border circle, camera icon, "Rasm yuklash"

2-column form grid:
| Label | Type | Placeholder |
|-------|------|-------------|
| Familiya (Last name) | text | Familiyangiz |
| Ism (First name) | text | Ismingiz |
| Otasining ismi (Patronymic) | text | Otangizning ismi |
| Tug'ilgan sana | date picker | KK.OO.YYYY |
| Jinsi (Gender) | select | Erkak / Ayol |
| Millati (Nationality) | searchable select | from dictionary |
| Fuqaroligi (Citizenship) | select | O'zbekiston / Boshqa |
| Passport seriya va raqami | text | AB 1234567 |
| JSHSHIR (PINFL) | text | 14 digit number |
| Telefon raqami | phone | +998 (__) ___-__-__ |
| Email | email | email@mail.uz |
| Viloyat (Region) | select | Buxoro / Samarqand / ... |
| Tuman (District) | select | depends on region |
| Manzil (Address) | textarea | To'liq manzil |
| Oila holati | select | from dictionary |

Bottom actions:
- "Bekor qilish" (Cancel) secondary button
- "Keyingi qadam" (Next step) primary green button

Show validation: required fields marked with *, error states for empty required fields.
```

---

## 13. Посещаемость

```
Using the TeamHub Design System, create a Student Attendance page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Talabalar / Davomat"
- Title: "Talabalar davomati" (Student Attendance)

Filter bar:
- Faculty selector
- Group selector (e.g., "301-A")
- Subject selector
- Date picker (single day)
- "Bugun" (Today) quick button

Attendance summary row (4 mini stats):
| Label | Value | Color |
|-------|-------|-------|
| Keldi (Present) | 24 | Green |
| Kelmadi (Absent) | 3 | Red |
| Sababli (Excused) | 2 | Yellow |
| Jami (Total) | 29 | Neutral |

Main table — attendance grid:
| # | F.I.O | 01.04 | 02.04 | 03.04 | 04.04 | 05.04 | ... | Jami % |
Each date cell contains an icon/indicator:
- ✓ green circle = present
- ✗ red circle = absent
- ! yellow circle = excused
- — gray = no class

Cells are clickable to toggle status (present → absent → excused).

Right side mini panel:
- Pie chart: Present vs Absent vs Excused for selected date
- "O'rtacha davomat" (Average attendance): 87.3%
- List of students absent today with reasons

Bottom: "Saqlash" (Save) primary button + "Eksport Excel" secondary button
```

---

## 14. Оценивание

```
Using the TeamHub Design System, create a Grading page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Talabalar / Baholash"
- Title: "Baholash" (Grading)

Tab row:
- "Oraliq" (Midterm) — active
- "Imtihon" (Exam)
- "Yakuniy" (Final)

Filters:
- Faculty → Direction → Group → Subject → Semester
- All as searchable dropdowns

Table for "Oraliq" (Midterm grading):
Header row: #, F.I.O, 1-oraliq (max 15), 2-oraliq (max 15), 3-oraliq (max 15), 4-oraliq (max 15), Jami (Total max 60), Davomat (Attendance bonus max 10), Umumiy (Overall)

Each grade cell is an editable input field (number, 0-15 range).
Color coding:
- >= 12: green background
- 8-11: yellow background
- < 8: red background

Show 15 rows of student data with realistic grades.

Summary bar at bottom:
- "O'rtacha ball" (Average score): 11.2 / 15
- "A'lochilar" (Excellent): 8 ta (27.6%)
- "Qoniqarsiz" (Unsatisfactory): 3 ta (10.3%)
- "Saqlash" primary button + "Eksport" secondary button
```

---

## 15. Расписание занятий

```
Using the TeamHub Design System, create a Class Schedule page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Dars jadvali"
- Title: "Dars jadvali" (Class Schedule)
- Right: "+ Yangi dars" primary button

Filter bar:
- View toggle: "Guruh bo'yicha" / "O'qituvchi bo'yicha" / "Xona bo'yicha"
- Group/Teacher/Room selector (depends on view toggle)
- Semester: "2025-2026 / 2-semester"
- Week: "< 14-18 Aprel 2026 >" with arrows

Schedule grid:
- Y-axis: Para numbers with times: 1 (8:00-9:20), 2 (9:30-10:50), 3 (11:00-12:20), 4 (13:00-14:20), 5 (14:30-15:50), 6 (16:00-17:20)
- X-axis: Dushanba through Shanba (Mon-Sat)

Lesson cells:
- Each cell: colored block (colors by subject type: lecture=green, practice=blue, lab=yellow, seminar=purple)
- Content: Subject name (bold text-xs), Teacher name (text-xs muted), Room number
- Click → modal with full details

Right sidebar (280px):
- "Bugungi jadval" (Today's schedule) list
- Each item: time, subject, teacher, room, group
- Color-coded left border matching subject type

Bottom legend:
- Color squares: Ma'ruza (Lecture)=green, Amaliy (Practice)=blue, Laboratoriya (Lab)=yellow, Seminar=purple
```

---

## 16. Контракты — Список

```
Using the TeamHub Design System, create a Contracts list page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Hisobxona / Kontraktlar"
- Title: "Kontraktlar" (Contracts)
- Right: "+ Yangi kontrakt" primary button

Row 1 — 4 Stats Cards:
| Label | Value | Trend |
|-------|-------|-------|
| Jami kontraktlar | 3,180 | — |
| To'langan (Paid) | 2,456 | 77.2% |
| Qisman (Partial) | 512 | 16.1% |
| Qarzdorlar (Debtors) | 212 | 6.7% ⚠️ |

Row 2 — Charts (2 columns):
- Bar chart: "Oylik tushumlar" (Monthly revenue) — last 12 months, bars in green
- Donut chart: "Kontrakt turlari" (Contract types) — Davlat grant, To'lov-kontrakt, Xorijiy

Filters: Search by student name + Contract type + Faculty + Status (Faol/Tugagan/Bekor) + Academic year

Table:
| Column | Content |
|--------|---------|
| # | Number |
| Talaba (Student) | Name + student ID |
| Kontrakt raqami | Contract number (e.g., "KNT-2024-0847") |
| Turi (Type) | Badge: "Davlat grant" blue, "To'lov" green, "Xorijiy" purple |
| Summa | Amount in UZS (e.g., "12,500,000 so'm") |
| To'langan | Paid amount + progress bar |
| Qoldiq (Balance) | Remaining amount, red if overdue |
| Muddat (Deadline) | Date, red text if past due |
| Holat | Badge: "Faol" green, "Tugagan" gray, "Bekor" red |
| Amallar | View / Payment / Print |

Show 8 rows. Pagination. Bottom total: "Jami summa: 42,500,000,000 so'm | To'langan: 32,800,000,000 so'm"
```

---

## 17. Контракт — Детали и оплаты

```
Using the TeamHub Design System, create a Contract Detail page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Hisobxona / Kontraktlar / KNT-2024-0847"
- Back arrow

Top card — Contract info (2 columns):
Left:
| Label | Value |
|-------|-------|
| Kontrakt raqami | KNT-2024-0847 |
| Turi | To'lov-kontrakt |
| Seriya | A-2024 |
| Boshlanish sanasi | 01.09.2024 |
| Tugash sanasi | 30.06.2025 |
| Holat | Badge: "Faol" green |

Right:
| Label | Value |
|-------|-------|
| Talaba | Karimova Nilufar R. (link) |
| Fakultet | Tibbiyot |
| Guruh | 301-A |
| Kurs | 3 |

Financial summary card:
- Large progress bar showing payment progress (65% filled, green)
- Kontrakt summasi (Total): 12,500,000 so'm
- To'langan (Paid): 8,125,000 so'm
- Qoldiq (Remaining): 4,375,000 so'm
- Keyingi to'lov muddati (Next deadline): 15.05.2026 (yellow warning)
- "+ To'lov kiritish" (Add payment) primary button

Payments table "To'lovlar tarixi" (Payment history):
| # | Sana (Date) | Summa (Amount) | Usul (Method) | Kvitansiya (Receipt) | Status |
Show 5 payment rows. Methods: "Naqd" (Cash), "Plastik karta", "Bank o'tkazma", "Payme"
Status badges: "Tasdiqlangan" green, "Kutilmoqda" yellow

Discounts section "Chegirmalar":
If any discounts applied — show type, percentage, amount, reason.

Bottom actions: "Chop etish" (Print) secondary, "Eksport PDF" secondary
```

---

## 18. Должники (Qarzdorlar)

```
Using the TeamHub Design System, create a Debtors page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Hisobxona / Qarzdorlar"
- Title: "Kontrakt qarzdorlar" (Contract Debtors)
- Right: "Eksport Excel" secondary button

Row 1 — 4 Stats Cards (red-tinted theme):
| Label | Value | Color |
|-------|-------|-------|
| Jami qarzdorlar | 212 | Red icon |
| Umumiy qarz summasi | 1,850,000,000 so'm | Red |
| O'rtacha qarz | 8,726,415 so'm | Orange |
| Muddati o'tgan | 89 (42%) | Red badge |

Filters: Search + Faculty + Course + Debt range (min-max) + Overdue only checkbox

Table:
| Column | Content |
|--------|---------|
| # | Number |
| Talaba | Name + avatar |
| Fakultet | Faculty |
| Guruh | Group |
| Kontrakt summasi | Total contract |
| To'langan | Paid amount |
| Qarz summasi | Debt amount (bold, red) |
| Muddati | Deadline date — red if overdue |
| Oxirgi to'lov | Last payment date |
| Kechikish (Days overdue) | Number, red badge if > 30 |
| Amallar | View / Send SMS / Print notice |

Sort by debt amount descending by default. Show 10 rows.
Color coding rows: > 90 days overdue = light red bg, 30-90 = light yellow bg.

Bottom summary bar: "Jami: 1,850,000,000 so'm | Muddati o'tgan: 1,230,000,000 so'm"
```

---

## 19. Финансовый отчёт

```
Using the TeamHub Design System, create a Financial Report page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Hisobxona / Hisobot"
- Title: "Moliyaviy hisobot" (Financial Report)
- Period: Year selector "2025-2026" + Semester selector

Row 1 — 4 Stats Cards:
| Label | Value |
|-------|-------|
| Jami kontrakt summasi | 42,500,000,000 so'm |
| Tushumlar (Revenue) | 32,800,000,000 so'm |
| Qarzdorlik | 9,700,000,000 so'm |
| Yig'ish foizi (Collection rate) | 77.2% |

Row 2 — Charts (2 columns):
- Left: Area chart "Oylik tushumlar dinamikasi" (Monthly revenue dynamics) — 12 months, green area fill, with budget line overlay (dashed)
- Right: Stacked bar chart "Fakultetlar bo'yicha" — showing Paid vs Debt per faculty

Row 3 — Charts (2 columns):
- Left: Pie chart "To'lov usullari" (Payment methods) — Naqd 25%, Plastik 35%, Bank 20%, Payme 15%, Click 5%
- Right: Horizontal bar chart "Qarzdorlik bo'yicha" (Debt by faculty) — sorted descending

Row 4 — Sverka (Reconciliation) table:
| Fakultet | Kontraktlar | Jami summa | To'langan | Qoldiq | Foiz |
Show 8 faculty rows + totals row at bottom (bold).

Export buttons: "PDF", "Excel", "Chop etish" (Print)
```

---

## 20. Общежитие — Обзор

```
Using the TeamHub Design System, create a Dormitory Overview dashboard page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / TTJ"
- Title: "Talabalar turar joyi" (Student Dormitory)

Row 1 — 4 Stats Cards:
| Label | Value |
|-------|-------|
| Binolar (Buildings) | 4 |
| Xonalar (Rooms) | 320 |
| Jami joylar (Total beds) | 1,280 |
| Band (Occupied) | 1,156 (90.3%) |

Row 2 — Visual building overview:
4 building cards side by side:
Each building card:
- Building name: "1-bino", "2-bino", "3-bino", "4-bino"
- Floor count: "4 qavat"
- Room count: "80 xona"
- Occupancy progress bar (green fill)
- Occupancy: "289/320" = "90.3%"
- Click → goes to room detail

Row 3 — Charts (2 columns):
- Left: Donut chart "Band/Bo'sh" (Occupied/Free) — green=occupied, gray=free, yellow=maintenance
- Right: Bar chart "Binolar bo'yicha to'lovlar" (Payments by building) — paid vs debt

Row 4 — Infrastructure cards (3 columns):
| Card | Content |
|------|---------|
| Oshxona (Canteen) | Capacity: 200, Meals today: 456, Menu status |
| Xojatxona (WC) | Total: 64, Working: 61, Maintenance: 3 |
| Hammom (Bathroom) | Total: 32, Working: 30, Schedule link |

Bottom: Quick links — "Yangi shartnoma" (New contract), "To'lov kiritish" (Add payment), "Xonalar ro'yxati" (Room list)
```

---

## 21. Общежитие — Комнаты

```
Using the TeamHub Design System, create a Dormitory Rooms page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / TTJ / Xonalar"
- Title: "TTJ Xonalar" (Dormitory Rooms)

Filters:
- Building selector: "Barcha binolar" / "1-bino" / "2-bino" / ...
- Floor selector: "Barcha qavatlar" / "1-qavat" / "2-qavat" / ...
- Status: "Barchasi" / "Band" / "Bo'sh" / "Ta'mirda"
- View toggle: Table | Grid

Grid view (active):
Cards in 4-column grid. Each room card:
- Room number (bold): "215"
- Building + Floor: "3-bino, 2-qavat"
- Capacity: "4 kishilik"
- Occupancy: visual dots (● ● ● ○ = 3/4 occupied)
- Status color: green border = occupied, gray = empty, yellow = partially, red = maintenance
- Hover: show resident names tooltip

Color-coded legend at top:
- 🟢 To'liq band (Full) — 180
- 🟡 Qisman (Partial) — 95
- ⚪ Bo'sh (Empty) — 35
- 🔴 Ta'mirda (Maintenance) — 10

Click on room → slide-out panel (right) showing:
- Room details: number, building, floor, capacity, condition
- Residents list: name, faculty, group, contract dates
- "Talaba qo'shish" (Add student) button
- "Ta'mirga yuborish" (Send to maintenance) button
```

---

## 22. HR — Сотрудники

```
Using the TeamHub Design System, create an Employees (HR) list page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Xodimlar"
- Title: "Xodimlar bazasi" (Employee Database)
- Right: "+ Yangi xodim" primary button

Row 1 — 4 Stats Cards:
| Label | Value |
|-------|-------|
| Jami xodimlar (Total) | 312 |
| Shtatli (Full-time) | 248 |
| Shartnomali (Contract) | 64 |
| Vakansiyalar (Vacancies) | 12 |

Row 2 — Donut chart "Bo'limlar bo'yicha" (By department)

Filters: Search + Department + Position type + Status

Table:
| # | Rasm | F.I.O | Bo'lim (Dept) | Lavozim (Position) | Ish turi (Type) | Telefon | Qabul sanasi (Hire date) | Holat | Amallar |

Show 10 rows. Position examples: "Buxgalter", "Kutubxonachi", "Laborant", "Texnik xodim", "Hamshira".
Status badges: "Faol" green, "Ta'tilda" yellow, "Bo'shatilgan" red.
```

---

## 23. HR — Профиль сотрудника

```
Using the TeamHub Design System, create an Employee Profile page for BITU ERP.

Same layout as Teacher Profile (#8) but adapted for staff:

Profile card:
- Avatar, full name, position "Bosh buxgalter" (Chief accountant)
- Department: "Moliya bo'limi"
- Phone, email, hire date, work type

Tabs: "Ma'lumotlar" | "Hujjatlar" | "Ish tarixi" | "Ta'tillar"

Tab "Ma'lumotlar":
Left card — personal info (same fields as teacher).
Right card — work info:
| Label | Value |
|-------|-------|
| Lavozim | Bosh buxgalter |
| Bo'lim | Moliya bo'limi |
| Ish turi | Shtatli |
| Ish vaqti | 9:00 — 18:00 |
| Qabul sanasi | 15.03.2018 |
| Staj | 8 yil |
| Oylik maoshi | ******* (hidden by default, show button) |

Bottom card — Document list: passport copy, diploma, employment contract, etc.
```

---

## 24. HR — Вакансии

```
Using the TeamHub Design System, create a Vacancies page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Xodimlar / Vakansiyalar"
- Title: "Vakansiyalar" (Vacancies)
- Right: "+ Yangi vakansiya" primary button

Stats: "Ochiq vakansiyalar: 12 | Yopilgan (bu oy): 3"

Grid layout (3 columns) of vacancy cards:
Each card:
- Position name (bold): "Tibbiy laborant"
- Department: "Mikrobiologiya kafedrasi"
- Type badge: "Shtatli" green / "Shartnomali" blue
- Requirements (2-3 bullet points):
  - Oliy ma'lumot
  - Kamida 2 yil tajriba
  - Ingliz tili (B2)
- Salary range: "5,000,000 — 7,000,000 so'm"
- Posted date: "12.04.2026"
- Application count: "8 ariza"
- Status badge: "Ochiq" green / "Yopilgan" gray
- "Batafsil" (Details) button

Show 6 vacancy cards. Filter bar: Department + Type + Status.
```

---

## 25. Онлайн-магазин — Товары

```
Using the TeamHub Design System, create a Shop Products page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Online Do'kon / Produktlar"
- Title: "Produktlar" (Products)
- Right: "+ Yangi produkt" primary button

Filters: Search + Category selector + Price range + Stock status (In stock / Out of stock)

View toggle: Table | Grid (Grid active)

Grid (4 columns) of product cards:
Each card:
- Product image (placeholder with icon if no image), aspect ratio 4:3
- Category badge: "Tibbiy anjomlar" / "Darsliklar" / "Ish kiyimlari"
- Product name (bold): "Stetoskop Littmann Classic III"
- Price: "450,000 so'm" (bold, green)
- Stock: "12 dona" or "Tugagan" (red text)
- "Tahrirlash" (Edit) text button

Show 8 product cards.

Table alternative shows: #, Image thumb, Name, Category, Price, Stock qty, Sales count, Actions.
```

---

## 26. Онлайн-магазин — Дашборд

```
Using the TeamHub Design System, create a Shop Dashboard page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Online Do'kon / Dashboard"
- Title: "Do'kon statistikasi" (Shop Statistics)
- Period filter: "Bu oy" / "Bu hafta" / "Bu yil"

Row 1 — 4 Stats Cards:
| Label | Value | Trend |
|-------|-------|-------|
| Jami sotuvlar (Total sales) | 1,234 | +8% |
| Daromad (Revenue) | 156,000,000 so'm | +12% |
| O'rtacha chek | 126,500 so'm | +3% |
| Produktlar soni | 89 | +5 yangi |

Row 2 — Charts (2 columns):
- Left: Line chart "Sotuvlar dinamikasi" (Sales dynamics) — daily for current month
- Right: Donut chart "Kategoriyalar bo'yicha" (By category)

Row 3 — Charts (2 columns):
- Left: Bar chart "Top 5 produktlar" (Top products by sales)
- Right: Table "Oxirgi sotuvlar" (Recent sales) — last 5 transactions: Date, Product, Qty, Amount, Buyer

Row 4 — Inventory alerts card:
List of products with low stock (< 5 items): product name, current stock, "Buyurtma berish" button
```

---

## 27. Задачи (Topshiriqlar)

```
Using the TeamHub Design System, create a Task Management page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Topshiriqlar"
- Title: "Topshiriqlar" (Tasks)
- View toggle: "Barchasi" / "Menga berilgan" / "Men bergan" / "Takrorlanuvchi"
- Right: "+ Yangi topshiriq" primary button

Filter bar: Priority (Yuqori/O'rta/Past), Status (Yangi/Jarayonda/Bajarildi/Muddati o'tgan), Assigned to, Date range

Stats bar: "Jami: 156 | Yangi: 23 | Jarayonda: 45 | Bajarildi: 78 | Muddati o'tgan: 10"

Table:
| Column | Content |
|--------|---------|
| ☐ | Checkbox |
| # | Number |
| Sarlavha (Title) | Task title (bold), truncated |
| Prioritet | Badge: "Yuqori" red, "O'rta" yellow, "Past" gray |
| Beruvchi (Assigner) | Avatar + name |
| Bajaruvchi (Assignee) | Avatar + name |
| Muddat (Deadline) | Date, red if overdue |
| Holat (Status) | Badge: "Yangi" blue, "Jarayonda" yellow, "Bajarildi" green, "Muddati o'tgan" red |
| Yaratilgan (Created) | Date |

Show 10 rows. Overdue rows have light red background.

Click on task → slide-out panel:
- Title, description (rich text), priority, assignee, deadline
- Comment thread below
- File attachments
- Status change buttons: "Boshlash" → "Tugatish" → "Qayta ochish"
```

---

## 28. Обращения (Murojaatlar)

```
Using the TeamHub Design System, create a Discussions/Appeals page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Murojaatlar"
- Title: "Murojaatlar" (Appeals)
- Right: "+ Yangi murojaat" primary button

Stats bar: "Jami: 89 | Yangi: 12 | Ko'rib chiqilmoqda: 34 | Javob berildi: 43"

Filters: Search + Status + Category (Shikoyat/Taklif/Savol/Ariza) + Date range

Table:
| # | Murojaat raqami | Mavzu (Subject) | Kategoriya (Category) | Murojaat qiluvchi (From) | Mas'ul (Assigned) | Sana | Holat | Amallar |

Category badges: "Shikoyat" (Complaint) red, "Taklif" (Suggestion) blue, "Savol" (Question) green, "Ariza" (Application) yellow.
Status: "Yangi" blue, "Ko'rib chiqilmoqda" yellow, "Javob berildi" green, "Yopilgan" gray.

Show 8 rows. Click → detail view with message thread, similar to email conversation.
```

---

## 29. Новости и объявления

```
Using the TeamHub Design System, create a News & Announcements page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Yangiliklar"
- Title: "Yangiliklar va E'lonlar" (News & Announcements)
- Tabs: "Yangiliklar" (News) active | "E'lonlar" (Announcements)
- Right: "+ Yangi yangilik" primary button

Grid layout (3 columns) for news cards:
Each card:
- Image placeholder (aspect ratio 16:9, top of card)
- Date: "20 Aprel 2026" (text-xs, gray)
- Title (bold, text-lg): "Bahorgi ilmiy konferensiya"
- Excerpt (text-sm, gray, 2 lines max): "Universitetimizda xalqaro ilmiy..."
- Author: mini avatar + name
- Views count: eye icon + "234"
- "Batafsil" (Read more) text link in green

Show 6 news cards.

For "E'lonlar" tab — different layout:
List of announcement cards (full width):
- Left: priority icon (🔴 urgent / 🟡 important / 🟢 info)
- Center: title + excerpt + date + author
- Right: target audience badge: "Barcha" / "Talabalar" / "O'qituvchilar" / "Xodimlar"
- Expiration date if set
```

---

## 30. Отчёты — Хаб

```
Using the TeamHub Design System, create a Reports Hub page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Hisobotlar"
- Title: "Hisobotlar markazi" (Reports Center)
- Search: "Hisobot qidirish..." (Search reports)

Grid of report category cards (3 columns × 6 rows = 18 reports):

Each card:
- Icon (colored circle) + Report name (bold) + short description
- "Ochish" (Open) button or click entire card

Report categories:

Row 1 — Academic:
| Icon | Name | Description |
|------|------|-------------|
| 📊 | Talaba davomati | Guruhlar bo'yicha davomat statistikasi |
| 📈 | Talaba baholari | Oraliq, imtihon, yakuniy baholar |
| 🏆 | Eng yaxshi talabalar | GPA bo'yicha top talabalar |

Row 2 — Teachers:
| 👨‍🏫 | O'qituvchi davomati | Darsga kelish statistikasi |
| ⭐ | O'qituvchi baholashi | Talabalar tomonidan baholash |
| 💰 | Rag'bat va jarimalar | Pooshqirish va jarimalar hisoboti |

Row 3 — Finance:
| 💳 | Kontrakt hisoboti | To'lovlar va qarzdorlik |
| 📋 | Kontrakt sverkasi | Batafsil sverka |
| 💸 | Tushadigan pullar | Kutilayotgan tushumlar |

Row 4 — Operations:
| 📝 | Topshiriq hisoboti | Bajarilgan/bajarilmagan topshiriqlar |
| 🏢 | Fakultet hisoboti | Fakultetlar bo'yicha statistika |
| 🔬 | Kafedra hisoboti | Kafedralar bo'yicha ma'lumotlar |

Row 5 — Equipment & Resources:
| 🖥 | Jihozlar hisoboti | Jihozlar inventarizatsiyasi |
| 📚 | Kutubxona hisoboti | Adabiyotlar statistikasi |
| 🗳 | So'rovnoma hisoboti | Ovoz berish natijalari |

Row 6 — Special:
| 🎓 | Talaba bonuslari | Mukofotlar va jarima |
| 📱 | O'qituvchi simulyatsiya | Simulyatsiya natijalari |
| 📊 | CRM hisoboti | Qabul kampaniyasi statistikasi |

Each card should be clickable and navigate to the individual report page.
```

---

## 31. Справочники

```
Using the TeamHub Design System, create a Reference Data (Dictionaries) management page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / BITI malumotlar"
- Title: "Ma'lumotnomalar" (Reference Data)

Grid of 8 dictionary cards (4 columns × 2 rows):

Each card:
- Icon + name + count of records + "Boshqarish" (Manage) button

| # | Name | UZ Name | Records |
|---|------|---------|---------|
| 1 | Yo'nalishlar (Directions) | Ta'lim yo'nalishlari | 24 |
| 2 | Dasturlar (Programs) | Ta'lim dasturlari | 18 |
| 3 | Tillar (Languages) | Tillar | 5 |
| 4 | Millatlar (Nationalities) | Millatlar | 12 |
| 5 | Fan turlari (Subject types) | Fan kategoriyalari | 8 |
| 6 | Tumanlar (Districts) | Tumanlar | 186 |
| 7 | Oila holati (Family status) | Oilaviy holat | 4 |
| 8 | Mutaxassisliklar (Specializations) | Kasb va mutaxassislik | 32 |

Click on card → expandable inline table or modal with CRUD:
Simple table: #, Name (UZ), Name (RU), Name (EN), Status (Active/Inactive), Actions (Edit/Delete)
"+ Qo'shish" (Add) button above table.
```

---

## 32. Пользователи и роли

```
Using the TeamHub Design System, create a Users & Roles management page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Boshqaruv / Foydalanuvchilar"
- Title: "Foydalanuvchilar va rollar" (Users & Roles)
- Right: "+ Yangi foydalanuvchi" primary button

Tabs: "Foydalanuvchilar" (Users) active | "Rollar" (Roles) | "Huquqlar" (Permissions)

Tab "Foydalanuvchilar":

Stats: "Jami: 198 | Faol: 186 | Nofaol: 12"

Table:
| # | Rasm | F.I.O | Telefon | Email | Rol (Role) | Filial (Branch) | Oxirgi kirish (Last login) | Holat | Amallar |

Role badges: "Admin" red, "O'qituvchi" blue, "Buxgalter" green, "Operator" gray, "Kutubxonachi" purple
Status: "Faol" green, "Bloklangan" red
Show 8 rows.

Tab "Rollar" (when clicked):
Grid of role cards:
- Role name, description, user count, permission count
- "Tahrirlash" button
Example roles: Admin, Teacher, Accountant, CRM Operator, HR Manager, Librarian, Dormitory Manager

Tab "Huquqlar" (when clicked):
Permission matrix table:
Rows = Modules (CRM, Students, Teachers, etc.)
Columns = Roles
Cells = Checkboxes (Read/Write/Delete toggles)
```

---

## 33. Настройки системы

```
Using the TeamHub Design System, create a System Settings page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Boshqaruv / Sozlamalar"
- Title: "Tizim sozlamalari" (System Settings)

Left navigation (vertical tabs):
- "Umumiy" (General) — active
- "Filiallar" (Branches)
- "O'quv yili" (Academic Year)
- "Kontrakt sozlamalari" (Contract settings)
- "Bildirishnomalar" (Notifications)
- "Integratsiyalar" (Integrations)
- "Xavfsizlik" (Security)

Right content for "Umumiy":

Section "Universitet ma'lumotlari":
- Logo upload
- University name: "Buxoro Innovatsion Ta'lim va Tibbiyot Universiteti"
- Short name: "BITU"
- Website: URL input
- Email: email input
- Phone: phone input
- Address: textarea

Section "Tizim sozlamalari":
- Default language: select (O'zbek / Русский / English)
- Academic year format: select
- Semester count: radio (2 / 3)
- Grading scale: select (5-ballik / 100-ballik / GPA)
- Timezone: select

Section "Kontrakt":
- Default contract template: file upload
- Auto-generate contract numbers: toggle
- Contract number format: text input "KNT-{YEAR}-{SEQ}"
- Payment reminder days: number input (default 7)

Bottom: "Saqlash" (Save) primary button + "Bekor qilish" (Cancel) secondary
```

---

## 34. Олимпиады

```
Using the TeamHub Design System, create an Olympiads management page for BITU ERP.

Page header:
- Breadcrumb: "Asosiy / Olimpiadalar"
- Title: "Olimpiadalar" (Olympiads)
- Right: "+ Yangi olimpiada" primary button

Stats: "Jami: 12 | Faol: 3 | Tugagan: 9 | Ishtirokchilar bu yil: 456"

Grid (3 columns) of olympiad cards:
Each card:
- Status badge top-right: "Faol" green / "Tugagan" gray / "Rejalashtirilgan" blue
- Olympiad name (bold): "Anatomiya bo'yicha respublika olimpiadasi"
- Subject: "Anatomiya"
- Date: "15-17 May 2026"
- Participants count: "89 ishtirokchi"
- Prize winners: 🥇 3, 🥈 5, 🥉 8
- "Batafsil" button

Show 6 cards.

Click → detail page with:
- Participant list table (Name, Faculty, Group, Score, Place)
- Results chart (score distribution)
- Certificate generation button
```

---

## 35. Уведомления

```
Using the TeamHub Design System, create a Notifications page for BITU ERP.

Page header:
- Title: "Bildirishnomalar" (Notifications)
- Right: "Barchasini o'qilgan deb belgilash" (Mark all as read) text button
- Filter tabs: "Barchasi" | "O'qilmagan" (Unread) with count badge

Notification list (full width, card-based):
Each notification card:
- Left: colored icon circle (type-based)
- Center: title (bold) + description + timestamp ("2 soat oldin" / "Kecha 14:30")
- Right: unread dot (green) or empty
- Bottom: action link if applicable

Notification types with sample data:
| Type | Icon | Example |
|------|------|---------|
| Task | 📝 | "Sizga yangi topshiriq berildi: Oylik hisobot tayyorlash" |
| Payment | 💳 | "Yangi to'lov qabul qilindi: Karimova N.R. — 4,375,000 so'm" |
| CRM | 📞 | "Yangi CRM ariza: Alisher Navoiy, +998 91 234-56-78" |
| System | ⚙️ | "Tizim yangilandi: v2.4.0" |
| Deadline | ⏰ | "Eslatma: Kontrakt muddati tugashiga 3 kun qoldi (Xasanov B.)" |
| Appeal | 📩 | "Yangi murojaat: #M-2024-089 — Stipendiya to'g'risida" |

Show 10 notifications. Group by date: "Bugun", "Kecha", "Bu hafta".
```

---

## Бонус: Страницы из GAP-анализа (будущие модули)

### B1. LMS — Онлайн обучение (будущее)

```
Using the TeamHub Design System, create an LMS (Learning Management System) Dashboard for BITU ERP.

Page header: "Onlayn ta'lim" (Online Learning)

Stats: Active courses, Total students enrolled, Completed this month, Average completion rate

Grid of course cards (3 columns):
Each card:
- Course image placeholder
- Subject name + teacher name
- Progress bar (enrolled students completion)
- Student count, lesson count, duration
- Status: "Faol" / "Draft" / "Tugagan"

Section: "Oxirgi faollik" (Recent activity) — timeline of student completions, submissions, quiz attempts
```

### B2. Медицинский блок (будущее)

```
Using the TeamHub Design System, create a Medical Records page for BITU ERP (medical university specific).

Page header: "Tibbiy kartalar" (Medical Records)

Stats: Total students, Medical exams completed, Pending checkups, Active conditions

Search by student name/ID.

Table: Student name, Blood type, Allergies, Last checkup date, Vaccination status (badge), Insurance, Actions
Click → detailed medical card with history, exam results, prescriptions.

Important: This is for a MEDICAL university — students are both patients AND future doctors.
```

### B3. Стипендии (будущее)

```
Using the TeamHub Design System, create a Scholarships management page for BITU ERP.

Page header: "Stipendiyalar" (Scholarships)

Stats: Total recipients, Monthly budget, Types count, GPA threshold

Table: Student, Faculty, GPA, Scholarship type (Davlat/Fan/Ijtimoiy), Monthly amount, Period, Status
Filters: Type, Faculty, GPA range
Chart: Distribution by type (pie), Monthly payments (bar)
```

---

## Рекомендации по генерации

1. **Порядок генерации**: начинай с Login (#1) → Dashboard (#3) → основные CRUD страницы
2. **Консистентность**: всегда указывай "Using the TeamHub Design System" в начале промпта
3. **Sidebar**: копируй список навигации из Dashboard (#3) для всех внутренних страниц
4. **Данные**: используй реалистичные узбекские имена и данные медицинского вуза
5. **Язык**: весь UI на узбекском (латиница), используй термины из BITU ERP
6. **Адаптивность**: каждую страницу можно дополнительно запросить в tablet/mobile версии
