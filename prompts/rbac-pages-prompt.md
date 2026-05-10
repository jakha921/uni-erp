# UniERP — RBAC Pages Prompt for claude.ai/design

> Скопируй этот промпт в **новый чат** claude.ai/design (проект UniERP).
> Перед отправкой убедись что файл BITU ERP.html открыт в проекте.

---

Я продолжаю проект UniERP — ERP для медицинского университета (Навои).
В проекте уже 26+ страниц. Сейчас мне нужно добавить критически важные
страницы для системы управления ролями и правами (RBAC).

## Контекст проекта
- Стек: React UMD + Babel inline, TeamHub Design System (#2DB976)
- Shell: BituShell.jsx (Sidebar + Topbar), hash routing через App.jsx
- Компоненты: Primitives.jsx, DataDisplay.jsx, TablePieces.jsx, Overlays.jsx
- Данные: data.jsx с узбекскими реалистичными данными
- Город: Навои (NAVOIY · 2026)

## Ключевая концепция: МНОЖЕСТВЕННЫЕ РОЛИ
Один пользователь может иметь НЕСКОЛЬКО ролей одновременно.
Например: Aliyev Jasur = [O'qituvchi] + [Kafedra mudiri]
Итоговые разрешения = UNION всех разрешений его ролей.

## Иерархия доступа к данным (Data Scope)
- Rektor/Prorektor → видит все данные вуза
- Dekan → видит только студентов/преподавателей своего факультета
- Kafedra mudiri → управляет преподавателями своей кафедры
- O'qituvchi → видит только свои группы (посещаемость, оценки)
- Talaba → видит только свои данные (кабинет)
- Admin → полный доступ ко всем модулям и данным

## Предустановленные роли (12 штук)

| Rol | Codename | Rang | Data Scope |
|-----|----------|------|------------|
| Administrator | admin | red | Barcha |
| Rektor/Prorektor | rector | indigo | Barcha |
| Dekan | dean | indigo | O'z fakulteti |
| Kafedra mudiri | dept_head | teal | O'z kafedrasi |
| O'qituvchi | teacher | blue | O'z guruhlari |
| Talaba | student | green | O'z ma'lumotlari |
| Buxgalter | accountant | purple | Moliya modullari |
| CRM operator | crm_operator | cyan | CRM moduli |
| HR menejer | hr_manager | orange | Xodimlar moduli |
| TTJ menejer | dorm_manager | yellow | TTJ moduli |
| Kutubxonachi | librarian | pink | Kutubxona moduli |
| Kontent-menejer | content_mgr | gray | Yangiliklar moduli |

## ZADACHA: Создать 6 новых страниц

---

### SAHIFA 1: Foydalanuvchilar ro'yxati (Users List)

```
Using TeamHub Design System, create a Users Management page.

Breadcrumb: Asosiy / Boshqaruv / Foydalanuvchilar
Title: "Foydalanuvchilar boshqaruvi"
Right: "+ Yangi foydalanuvchi" primary button

Row 1 — 4 Stats Cards:
| Icon | Label | Value |
|------|-------|-------|
| 👥 | Jami foydalanuvchilar | 498 |
| ✅ | Faol (Active) | 462 |
| 🚫 | Bloklangan (Blocked) | 24 |
| 🟢 | Bugun kirganlar | 187 |

Filters:
- Search: "Ism yoki telefon bo'yicha qidiring..."
- Rol multiselect dropdown (can select multiple roles to filter)
- Filial (Branch) dropdown
- Holat (Status): Barchasi / Faol / Bloklangan
- Oxirgi kirish (Last login) date range

Table columns:
| # | Rasm (Avatar 36px) | F.I.O (bold name) | Telefon | Rollar (Roles) | Filial | Oxirgi kirish | Holat | Amallar |

КРИТИЧЕСКИ ВАЖНО для колонки "Rollar":
Показывать ВСЕ роли пользователя как pill badges в одной ячейке.
Пример: [Admin]red [O'qituvchi]blue — два бейджа рядом.
Если ролей > 2, показать первые 2 + "+1 boshqa" серый бейдж.

Цвета бейджей ролей:
- Admin = error-light bg + red text
- O'qituvchi = info-light bg + blue text
- Talaba = success-light bg + green text
- Buxgalter = purple-light bg + purple text
- HR = orange-light bg + orange text
- CRM = cyan-light bg + cyan text
- Dekan = indigo-light bg + indigo text
- Kafedra mudiri = teal-light bg + teal text
- TTJ = warning-light bg + amber text
- Kutubxonachi = pink-light bg + pink text

Actions: View / Edit / Block / Reset password — icon buttons.
Click row → navigates to user profile page.

Show 8 rows with realistic data. Some users have 1 role, some 2-3 roles.
Example multi-role users:
- "Aliyev Jasur K." — [O'qituvchi] [Kafedra mudiri]
- "Rahimov Sardor" — [Admin] [HR menejer]
- "Karimova Nilufar" — [Talaba] (single role)

Pagination: "8 / 498 ta natija"
```

---

### SAHIFA 2: Foydalanuvchi profili (User Profile with Role Assignment)

```
Using TeamHub Design System, create a User Profile page with role management.

Breadcrumb: Asosiy / Boshqaruv / Foydalanuvchilar / Aliyev Jasur Kamoliddinovich
Back arrow button.

Top profile card (full width):
- Left: Avatar (80px) with camera overlay for upload
- Center: "Aliyev Jasur Kamoliddinovich"
  Phone: +998 91 234-56-78 | Email: aliyev.j@bitu.uz
- Right: Status badge "Faol" green, 
  "Oxirgi kirish: Bugun, 14:23" muted text,
  "Ro'yxatdan o'tgan: 15.03.2022" muted text

Tabs: "Ma'lumotlar" | "Rollar va ruxsatlar" | "Faoliyat jurnali"

--- Tab "Ma'lumotlar" (default active) ---
2-column grid of info fields (editable on click):
Left card "Shaxsiy ma'lumotlar":
| Ism | Jasur |
| Familiya | Aliyev |
| Otasining ismi | Kamoliddinovich |
| Tug'ilgan sana | 15.03.1985 |
| Jinsi | Erkak |
| Telefon | +998 91 234-56-78 |
| Email | aliyev.j@bitu.uz |

Right card "Tizim ma'lumotlari":
| Foydalanuvchi ID | USR-2022-0045 |
| Filial | Navoiy (bosh filial) |
| Bo'lim | Ichki kasalliklar kafedrasi |
| Lavozim | Kafedra mudiri |
| Holat | Faol |
| Yaratilgan | 15.03.2022 |

Bottom: "Saqlash" + "Parolni tiklash" + "Bloklash" buttons

--- Tab "Rollar va ruxsatlar" (KEY TAB — show this design) ---

Section 1: "Berilgan rollar" (Assigned Roles)
Subtitle: "Bir foydalanuvchiga bir nechta rol berish mumkin" 
(italic, text-sm, neutral-500)

List of assigned role cards (vertical stack):
Each role card (white bg, shadow-sm, rounded-lg, green left border 4px):
- Left: Role color dot + Role name (bold) + Description (text-sm, gray)
- Right: "Olib tashlash" (Remove) danger ghost button with X icon
- Bottom: "12 ruxsat · 24 foydalanuvchi" (text-xs, gray)

Show 2 assigned roles:
1. [●blue] O'qituvchi — "Dars berish, davomat, baholash" | 12 ruxsat
2. [●teal] Kafedra mudiri — "Kafedra boshqaruvi, o'qituvchilar nazorati" | 18 ruxsat

"+ Rol qo'shish" (Add role) button below → opens Modal:
Modal title: "Rol tanlash"
Modal content: Grid (2 columns) of available role cards:
Each card has checkbox top-right, role name, description, and is 
selectable (click toggles checkbox). Already assigned roles are 
disabled with "Berilgan" badge.
Modal footer: "Bekor qilish" + "Qo'shish" primary button

Section 2: "Amal qiladigan ruxsatlar" (Effective Permissions)
Subtitle: "Barcha rollardan yig'ilgan ruxsatlar" (Union of all roles)

Grouped by module (collapsible accordion):
▼ Talabalar (Manba: O'qituvchi, Kafedra mudiri)
  ✅ Ko'rish (View) — O'qituvchi
  ✅ Yaratish (Create) — Kafedra mudiri
  ✅ Tahrirlash (Edit) — Kafedra mudiri
  ❌ O'chirish (Delete)
  ❌ Eksport

▼ O'qituvchilar (Manba: Kafedra mudiri)
  ✅ Ko'rish — Kafedra mudiri
  ✅ Tahrirlash — Kafedra mudiri
  ❌ Yaratish
  ❌ O'chirish

▼ Davomat (Manba: O'qituvchi)
  ✅ Ko'rish — O'qituvchi
  ✅ Tahrirlash — O'qituvchi
  ❌ O'chirish

Each permission line: green check or red X + permission name + 
source role badge in muted text (which role grants this permission).

Data Scope section at bottom:
Card with title "Ma'lumotlar ko'lami" (Data Scope):
"O'z kafedrasi" badge — "Ichki kasalliklar kafedrasi"
Explanation text: "Bu foydalanuvchi faqat o'z kafedrasidagi 
ma'lumotlarni ko'ra oladi" (This user can only see data from 
their own department)

--- Tab "Faoliyat jurnali" (Activity Log) ---
Table: Sana/Vaqt | Amal | Modul | Tafsilot | IP manzil
Show 8 recent actions with realistic data.
Action badges: "Kirish" info, "Yaratish" success, "Tahrirlash" warning, 
"O'chirish" error
```

---

### SAHIFA 3: Rollar boshqaruvi (Roles Management)

```
Using TeamHub Design System, create a Roles Management page.

Breadcrumb: Asosiy / Boshqaruv / Rollar
Title: "Rollar boshqaruvi" (Roles Management)
Right: "+ Yangi rol" primary button

Stats bar: "Jami rollar: 12 | Tizim rollari: 8 | Maxsus rollar: 4"

Grid (3 columns) of role cards:
Each card (white bg, shadow-card, rounded-xl, padding-6):
- Top-left: Large color dot (role color, 12px) + Role name (text-lg, bold)
- Top-right: "Tizim" badge if is_system (neutral-100 bg, text-xs)
- Description (text-sm, neutral-500, 2 lines max)
- Separator line
- Stats row (text-xs, neutral-400):
  "👥 24 foydalanuvchi" | "🔑 18 ruxsat" | "📊 O'z fakulteti"
- Bottom: "Tahrirlash" secondary button (full width)

12 role cards + 1 empty "create" card:

Row 1:
| [●red] Administrator | [●indigo] Rektor | [●indigo] Dekan |
| "Tizim to'liq boshqaruvi" | "Universitetni boshqarish" | "Fakultetni boshqarish" |
| 👥 3 | 🔑 72 | Barcha | 👥 2 | 🔑 45 | Barcha | 👥 8 | 🔑 32 | O'z fakulteti |

Row 2:
| [●teal] Kafedra mudiri | [●blue] O'qituvchi | [●green] Talaba |
| "Kafedrani boshqarish" | "Dars berish, baholash" | "Shaxsiy kabinet" |
| 👥 24 | 🔑 18 | O'z kafedrasi | 👥 186 | 🔑 12 | O'z guruhlari | 👥 3247 | 🔑 6 | O'z ma'lumotlari |

Row 3:
| [●purple] Buxgalter | [●cyan] CRM operator | [●orange] HR menejer |
| "Moliya boshqaruvi" | "Arizalar boshqaruvi" | "Xodimlar boshqaruvi" |
| 👥 5 | 🔑 15 | Moliya | 👥 4 | 🔑 10 | CRM | 👥 3 | 🔑 14 | Xodimlar |

Row 4:
| [●yellow] TTJ menejer | [●pink] Kutubxonachi | [●gray] Kontent-menejer |
| "Yotoqxona boshqaruvi" | "Kutubxona boshqaruvi" | "Yangiliklar boshqaruvi" |
| 👥 2 | 🔑 8 | TTJ | 👥 3 | 🔑 6 | Kutubxona | 👥 2 | 🔑 4 | Yangiliklar |

Last card: Empty state card with dashed border, 
"+ Yangi rol yaratish" text centered, clickable.

Click on "Tahrirlash" → opens Role Edit page (Sahifa 4).
```

---

### SAHIFA 4: Rol tahrirlash — Permission Matrix (Ruxsatlar matritsasi)

```
Using TeamHub Design System, create a Role Edit page with permission matrix.

Breadcrumb: Asosiy / Boshqaruv / Rollar / O'qituvchi
Back arrow button.

Top section:
- Role color selector (row of 10 color circles, teal selected)
- Role name input: "O'qituvchi" (editable)
- Description textarea: "Dars berish, davomat yuritish, baholash" (editable)
- "Tizim roli" badge (non-removable indicator if is_system)

Section: "Ruxsatlar matritsasi" (Permission Matrix)

Table with toggle switches:
| Modul | Ko'rish | Yaratish | Tahrirlash | O'chirish | Eksport | Tasdiqlash |
|-------|---------|----------|------------|-----------|---------|------------|

Rows (16 modules):
| Talabalar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| O'qituvchilar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Davomat | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Baholash | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Dars jadvali | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| CRM | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kontraktlar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| TTJ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Xodimlar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Topshiriqlar | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Murojaatlar | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Yangiliklar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hisobotlar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kutubxona | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ilmiy ishlar | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Sozlamalar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Each cell: toggle switch (green=ON, gray=OFF). 
Row header: Module icon + module name.
Column header: Action name + "select all" checkbox at top.
First column (row level): "select all" checkbox to toggle entire row.

✅ = green toggle ON state
❌ = gray toggle OFF state

Section: "Ma'lumotlar ko'lami" (Data Scope)
Dropdown selector:
- "Barcha ma'lumotlar" (All data)
- "O'z fakulteti" (Own faculty only)
- "O'z kafedrasi" (Own department only)
- "O'z guruhlari" (Own groups only) — SELECTED for O'qituvchi
- "Faqat o'z ma'lumotlari" (Own data only)

Help text: "O'qituvchi faqat o'zi dars beradigan guruhlardagi 
talabalar ma'lumotlarini ko'ra oladi"

Sticky bottom bar (white bg, shadow-lg, border-top):
Left: "Ushbu rolda 186 foydalanuvchi bor" (186 users have this role)
Right: "Bekor qilish" secondary + "Saqlash" primary button
Warning: if changing permissions for system role, show yellow alert:
"Tizim roli o'zgartirilmoqda. Bu 186 foydalanuvchiga ta'sir qiladi."
```

---

### SAHIFA 5: Tizim jurnali (System Audit Log)

```
Using TeamHub Design System, create a System Audit Log page.

Breadcrumb: Asosiy / Boshqaruv / Tizim jurnali
Title: "Tizim jurnali" (System Audit Log)

Row 1 — 3 Stats Cards:
| Label | Value |
|-------|-------|
| Bugun (Today) | 1,234 amal |
| Bu hafta (This week) | 8,567 amal |
| Xatolar (Errors) | 12 |

Filters:
- Search: "Foydalanuvchi yoki tafsilot bo'yicha..."
- User selector dropdown (searchable)
- Module dropdown
- Action type multiselect: Kirish / Yaratish / Tahrirlash / O'chirish / Eksport
- Date range picker
- Severity: Barchasi / Info / Warning / Error

Table columns:
| Vaqt (DateTime) | Foydalanuvchi | Rol | Modul | Amal | Tafsilot | IP manzil |

Action badges with colors:
- "Kirish" (Login) = info-light bg, blue text
- "Chiqish" (Logout) = neutral-100 bg, gray text
- "Yaratish" (Create) = success-light bg, green text
- "Tahrirlash" (Edit) = warning-light bg, amber text
- "O'chirish" (Delete) = error-light bg, red text
- "Eksport" = neutral-100 bg, gray text
- "Xatolik" (Error) = error bg, white text

Show 12 rows with realistic data:
1. 14:45 | Rahimov S. | Admin | Foydalanuvchilar | Yaratish | "Yangi foydalanuvchi: Toshmatov A. Rollar: O'qituvchi" | 10.0.0.1
2. 14:38 | Aliyev J. | O'qituvchi | Davomat | Tahrirlash | "301-A guruh davomati yangilandi (12.04.2026)" | 192.168.1.45
3. 14:30 | Karimova N. | Talaba | Kabinet | Kirish | "Talaba kabinetiga kirdi" | 82.215.100.23
4. 14:22 | Buxgalter1 | Buxgalter | Kontraktlar | Eksport | "Qarzdorlar ro'yxati Excel formatida yuklandi" | 10.0.0.5
5. 14:15 | Rahimov S. | Admin | Rollar | Tahrirlash | "O'qituvchi roli: Davomat.eksport ruxsati qo'shildi" | 10.0.0.1
6. 14:10 | Dekan1 | Dekan | Talabalar | Tahrirlash | "Talaba: Xasanov B. - guruh o'zgartirildi 301-A → 302-B" | 192.168.1.20
7. 13:55 | Tizim | — | Tizim | Xatolik | "SMS yuborish xatosi: Eskiz API timeout" | —
8. 13:48 | HR_admin | HR menejer | Xodimlar | Yaratish | "Yangi vakansiya: Tibbiy laborant" | 10.0.0.8
... (4 more similar rows)

Pagination: "12 / 8,567 ta yozuv"
Bottom: "Eksport CSV" secondary button
```

---

### SAHIFA 6: Login → Rol tanlash (Role Selection after Login)

```
Using TeamHub Design System, create a Role Selection intermediate screen 
that appears after successful login for users with multiple roles.

Full screen, centered content (no sidebar, no topbar).
Background: surface-page (#F8FAFB)

Top center: University logo + "Uni ERP" text

Welcome section:
- Avatar (64px) centered
- "Xush kelibsiz, Jasur!" (Welcome, Jasur!) text-2xl, bold
- "Qaysi rol bilan kirishni xohlaysiz?" (Which role do you want to enter with?)
  text-base, neutral-500

Role selection grid (centered, max-width 640px):
3 role cards for this user:

Card 1 (clickable, hover: shadow-md + scale 1.02):
- Left: Blue dot (12px)
- Center: "O'qituvchi" (bold, text-lg)
- Below: "Dars berish, davomat, baholash" (text-sm, gray)
- Right: "12 ruxsat" badge (neutral)
- Bottom: "Faqat o'z guruhlari" scope badge (info-light)

Card 2 (clickable):
- Left: Teal dot
- Center: "Kafedra mudiri"
- Below: "Kafedra boshqaruvi, o'qituvchilar"
- Right: "18 ruxsat"
- Bottom: "O'z kafedrasi" scope badge

Card 3 (special, green border, recommended):
- Left: Green star icon
- Center: "Barcha rollar" (All roles) — bold
- Below: "Barcha ruxsatlar birlashtiriladi (26 ruxsat)"
  (All permissions combined)
- Right: "26 ruxsat"
- Bottom: "O'z kafedrasi" scope badge (max scope from roles)

Below cards:
Checkbox: "☐ Tanlangan rolni eslab qolish" (Remember selected role)
Text: "Keyingi safar ushbu rol bilan avtomatik kirasiz" (text-xs, gray)

Bottom: "Chiqish" (Logout) ghost button

If user selects a role → animate card selection (green border + check),
then transition to Dashboard.
If only 1 role → skip this screen entirely.
```

---

## Routing va Sidebar yangilanishi

App.jsx ga qo'shilishi kerak bo'lgan routelar:
- `#users` → Foydalanuvchilar ro'yxati (Sahifa 1)
- `#user-profile` → Foydalanuvchi profili (Sahifa 2)
- `#roles` → Rollar boshqaruvi (Sahifa 3)
- `#role-edit` → Rol tahrirlash (Sahifa 4)
- `#audit-log` → Tizim jurnali (Sahifa 5)
- `#role-select` → Rol tanlash (Sahifa 6, login flow)

Sidebar "Boshqaruv" guruhiga yangi puntlar:
- Foydalanuvchilar (icon: users)
- Rollar (icon: settings)
- Tizim jurnali (icon: doc)

data.jsx ga qo'shiladigan ma'lumotlar:
- ROLES array (12 roles with permissions)
- PERMISSIONS array (modules × actions)
- MODULES array (16 modules)
- USER_ROLES map (user → roles[])

## Umumiy qoidalar
- Barcha mavjud komponentlardan foydalaning (Primitives, DataDisplay, TablePieces, Overlays)
- Style objects nomi UNIQUE bo'lishi kerak (har bir faylda)
- Barcha matnlar o'zbek tilida (lotin)
- Ranglar: #2DB976 primary, TeamHub Design System tokens
- Ikonalar: `<Icon name="..." />` Primitives.jsx dan
- Emoji ishlatmang (faqat 🇺🇿🇷🇺🇬🇧 til tanlashda)

## Boshlash tartibi
1. Sahifa 3 (Rollar) — RBAC tizimining asosiy ko'rinishi
2. Sahifa 4 (Permission Matrix) — texnik jihat
3. Sahifa 1 (Users) — foydalanuvchilar boshqaruvi
4. Sahifa 2 (User Profile) — rol tayinlash
5. Sahifa 5 (Audit Log) — monitoring
6. Sahifa 6 (Role Select) — login flow

Boshlang Sahifa 3 dan — u eng ko'rsatmali sahifa.
