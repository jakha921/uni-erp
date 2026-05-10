# UniERP — Полная детализация + Недостающие модули

> Скопируй этот промпт в **новый чат** claude.ai/design (проект UniERP).
> Цель: детализировать все существующие модули и добавить недостающие.

---

Я продолжаю проект UniERP — ERP для университета (Навои).
В проекте 32+ страниц, RBAC система, 23 модуля в sidebar.

## Текущая структура sidebar (8 групп)

```
ASOSIY:        Dashboard
ACADEMIC:      CRM Arizalar, CRM Voronka, O'qituvchilar, Talabalar,
               Davomat, Baholash, Dars jadvali, O'quv rejalar, Kafedralar
ACADEMIC+:     Imtihonlar, Kutubxona, Ilmiy ishlar, Diplom ishlari
CABINETS:      Talaba kabineti, O'qituvchi kabineti
FINANCE:       Kontraktlar, Stipendiya, TTJ
OPERATIONS:    Topshiriqlar, Hisobotlar, Xabarlar, Bildirishnomalar
ADMIN:         HR, Buyruqlar, Hujjat aylanishi, Analytics, Sozlamalar
TIZIM:         Foydalanuvchilar, Rollar, Ruxsatlar matritsasi, Audit log
```

## UMUMIY MUAMMOLAR — avval tuzat

### 1. Emoji → SVG Icon (MUHIM!)
Dashboard va barcha sahifalarda emoji ishlatilgan (🎓📚👨‍🏫 va h.k.).
Bu professional ko'rinishni buzadi. BARCHA emoji'larni Primitives.jsx
dagi `<Icon name="..." />` ga almashtir.

Dashboard statlar uchun:
- Fakultetlar: emoji o'rniga `<Icon name="briefcase" />` yashil doira ichida
- Kafedralar: `<Icon name="grid" />` 
- O'qituvchilar: `<Icon name="users" />`
- Talabalar: `<Icon name="user" />`
- Xonalar: `<Icon name="grid" />`
- Guruhlar: `<Icon name="users" />`
- Ishchilar: `<Icon name="briefcase" />`
- Jihozlar: `<Icon name="settings" />`
- Kunduzgi/Sirtqi: `<Icon name="calendar" />`
- Adabiyotlar: `<Icon name="doc" />`

Primitives.jsx ga yangi ikonalar qo'sh agar kerak bo'lsa:
`warehouse, money, graduation, building, truck, clipboard, archive`

Barcha sahifalarni tekshir — hech qayerda emoji qolmasin.
Faqat til tanlash tugmasida flag emoji ruxsat: 🇺🇿🇷🇺🇬🇧

### 2. Sidebar guruhlarni qayta tashkillash
Hozirgi sidebar juda sich (28+ punkt). Quyidagi tartibda qayta tashkilla:

```
ASOSIY:       Dashboard
TA'LIM:       Talabalar, O'qituvchilar, Davomat, Baholash,
              Dars jadvali, Imtihonlar
O'QUV JARAYONI: O'quv rejalar, Kafedralar, Fanlar, Kutubxona
QABUL (CRM):  Arizalar, Voronka, CRM hisobot
MOLIYA:       Kontraktlar, Qarzdorlar, Stipendiya, Maosh,
              Byudjet, Moliyaviy hisobot
XODIMLAR:     HR ro'yxati, Buyruqlar, Shtatlash jadvali
INFRATUZILMA: TTJ (yotoqxona), Ombor (sklad), Jihozlar,
              Transport
ILMIY FAOLIYAT: Ilmiy ishlar, Diplom ishlari, Konferensiyalar,
                Patentlar
KABINETLAR:   Talaba kabineti, O'qituvchi kabineti
BOSHQARUV:    Topshiriqlar, Murojaatlar, Xabarlar,
              Bildirishnomalar, Yangiliklar
ADMIN:        Hujjat aylanishi, Analytics, Hisobotlar,
              Ma'lumotnomalar, Sozlamalar
TIZIM:        Foydalanuvchilar, Rollar, Ruxsatlar, Audit log
```

Har bir guruh collapsible bo'lsin (chevron bilan ochiladi/yopiladi).
Default holatda faqat aktiv guruh ochiq.

---

## YANGI MODULLAR — sidebar'ga qo'shilishi kerak

### MODUL A: Ombor va inventarizatsiya (Sklad)

```
Using TeamHub Design System, create a Warehouse/Inventory module
for UniERP with 3 pages:

PAGE A1: Ombor — Asosiy (#warehouse)
Breadcrumb: Asosiy / Infratuzilma / Ombor
Title: "Ombor boshqaruvi"

Row 1 — 4 Stats Cards (icon circles, NO emoji):
| Icon | Label | Value |
|------|-------|-------|
| archive | Jami tovarlar | 2,456 |
| trendUp | Kirim (bu oy) | 145 |
| trendDown | Chiqim (bu oy) | 89 |
| warning-icon | Kam qoldiq | 23 |

Row 2 — Charts (2 columns):
- Left: Bar chart "Kategoriya bo'yicha qoldiq" — O'quv jihozlari,
  Xo'jalik mollari, IT texnika, Mebel, Ish kiyimlari, Oziq-ovqat
- Right: Line chart "Oylik kirim-chiqim dinamikasi" — 12 oy

Filters: Search + Kategoriya + Ombor joyi + Qoldiq holati
(Yetarli/Kam/Tugagan)

Table:
| # | Nomi | SKU | Kategoriya | Birlik | Qoldiq | Min qoldiq |
| O'rtacha narx | Ombor joyi | Oxirgi kirim | Holat | Amallar |

Holat badges: "Yetarli" green, "Kam" warning, "Tugagan" error
Show 10 rows with realistic university inventory items:
- Printer kartridji HP 107a, Doska marker, A4 qog'oz,
  Proyektor lampa, Laboratoriya shisha idish, Kompyuter sichqoncha

Click row → Tovar kartasi (detail page)

PAGE A2: Kirim-chiqim (#warehouse-operations)
Breadcrumb: Asosiy / Infratuzilma / Ombor / Operatsiyalar
Title: "Kirim-chiqim operatsiyalari"
Right: "+ Yangi kirim" primary + "+ Yangi chiqim" secondary

Tabs: "Kirim" active | "Chiqim" | "Inventarizatsiya"

Tab "Kirim":
Table: # | Sana | Hujjat raqami | Yetkazib beruvchi | Tovarlar soni |
Jami summa | Mas'ul | Holat (Tasdiqlangan/Kutilmoqda) | Amallar

Tab "Chiqim":
Table: # | Sana | Hujjat raqami | Oluvchi (bo'lim/xodim) | 
Tovarlar soni | Sabab | Mas'ul | Holat | Amallar

Tab "Inventarizatsiya":
Table: # | Sana | Ombor | Status (Rejalashtirilgan/Jarayonda/Tugallangan) |
Farq topildi | Mas'ul

PAGE A3: Tovar kartasi (#warehouse-item)
Breadcrumb: Asosiy / Ombor / Printer kartridji HP 107a
Top card: Tovar rasmi + Nomi + SKU + Kategoriya + Birlik
+ Joriy qoldiq (katta raqam) + Min qoldiq

Tabs: "Ma'lumotlar" | "Kirim tarixi" | "Chiqim tarixi" | "Narx tarixi"

Tab "Ma'lumotlar": texnik spetsifikatsiya, yetkazib beruvchilar, rasmlar
Tab "Kirim tarixi": timeline of all incoming shipments
Tab "Chiqim tarixi": timeline of all outgoing
Tab "Narx tarixi": price change chart over time
```

### MODUL B: Maosh (Payroll)

```
Using TeamHub Design System, create a Payroll module for UniERP:

PAGE B1: Maosh hisoblash (#payroll)
Breadcrumb: Asosiy / Moliya / Maosh
Title: "Maosh hisoblash"

Row 1 — 4 Stats Cards:
| Icon | Label | Value |
|------|-------|-------|
| money | Oylik fond | 2,450,000,000 so'm |
| users | Xodimlar soni | 312 |
| check | Hisoblangan | 298 |
| calendar | Oylik sanasi | 15.04.2026 |

Filters: Bo'lim + Oy/yil tanlash + Holat + Search

Table:
| # | F.I.O | Bo'lim | Lavozim | Stavka | Ish soati |
| Qo'shimcha | Ushlanmalar | Qo'lga tegadigan | Holat | Amallar |

Holat: "Hisoblangan" green, "Kutilmoqda" yellow, "To'langan" blue
Show 10 rows. Bottom totals row.

Right panel: "Oylik hisob-kitob" summary card:
- Jami fond: 2,450,000,000
- Asosiy maosh: 1,980,000,000
- Qo'shimchalar: 320,000,000
- Ushlanmalar: 150,000,000 (soliq, pensiya, kasaba)
- Qo'lga: 2,300,000,000

Actions: "Hisoblash" primary + "Tasdiqlash" + "Eksport" + "Vedomost chop etish"

PAGE B2: Xodim maosh kartasi (#payroll-detail)
Single employee payroll card with 12-month history chart,
tax deductions breakdown, bonus/penalty table.
```

### MODUL C: Byudjet (Budget Planning)

```
Using TeamHub Design System, create a Budget module:

PAGE C1: Byudjet (#budget)
Breadcrumb: Asosiy / Moliya / Byudjet
Title: "Byudjet rejalashtirish"

Row 1 — 4 Stats Cards:
| Icon | Label | Value |
|------|-------|-------|
| chart | Yillik byudjet | 85,000,000,000 so'm |
| trendUp | Sarflangan | 42,300,000,000 (49.8%) |
| trendDown | Qoldiq | 42,700,000,000 |
| warning | Limit oshganlari | 3 bo'lim |

Stacked bar chart: Reja vs Fakt by quarter (Q1-Q4)

Table by department:
| Bo'lim | Reja | Fakt | Farq | Foiz | Status |
Color: green if under budget, red if over.

Drill-down: click bo'lim → detailed spending categories
(Maosh, Kommunal, Jihozlar, Ta'mirlash, Boshqa)
```

### MODUL D: Qarzdorlar (Debtors — separate from Contracts)

```
Using TeamHub Design System, create a Debtors page:

PAGE D1: Qarzdorlar (#debtors)
(Kontraktlar moduli ichida emas, alohida sahifa)

Breadcrumb: Asosiy / Moliya / Qarzdorlar
Title: "Kontrakt qarzdorlari"

Row 1 — 4 Stats Cards (qizil rangda):
| Icon | Label | Value |
|------|-------|-------|
| warning | Jami qarzdorlar | 212 |
| money | Umumiy qarz | 1,850,000,000 so'm |
| calendar | Muddati o'tgan | 89 (42%) |
| trendDown | O'rtacha qarz | 8,726,415 so'm |

Charts: Faculty-wise debt bar chart + Age of debt pie chart
(0-30 kun, 30-60, 60-90, 90+ kun)

Table:
| # | Talaba | Fakultet | Guruh | Kontrakt summasi |
| To'langan | Qarz summasi (bold, red) | Muddati |
| Kechikish (kunlar) | Amallar (ko'rish/SMS/notice print) |

Row color: > 90 days = light red bg, 30-90 = light yellow bg
Bulk actions: SMS yuborish, Ogohlantirish chop etish

Bottom: "Eksport Excel" + "SMS yuborish (tanlangan)" buttons
```

### MODUL E: Murojaatlar (Appeals — exists in design, missing from sidebar)

```
Using TeamHub Design System, create Appeals page:

PAGE E1: Murojaatlar (#appeals)
Breadcrumb: Asosiy / Boshqaruv / Murojaatlar
Title: "Murojaatlar"
Right: "+ Yangi murojaat"

Stats: Jami: 89 | Yangi: 12 | Ko'rib chiqilmoqda: 34 | Hal qilingan: 43

Filters: Search + Holat + Kategoriya 
(Shikoyat/Taklif/Savol/Ariza) + Sana

Table:
| # | Murojaat raqami | Mavzu | Kategoriya | Murojaat qiluvchi |
| Mas'ul | Sana | Holat | Amallar |

Category badges: "Shikoyat" red, "Taklif" blue,
"Savol" green, "Ariza" yellow

Click → thread view (email-style conversation)
```

### MODUL F: Yangiliklar va e'lonlar (News — exists in design, missing)

```
Using TeamHub Design System, create News & Announcements:

PAGE F1: Yangiliklar (#news)
Breadcrumb: Asosiy / Boshqaruv / Yangiliklar
Title: "Yangiliklar va E'lonlar"
Tabs: "Yangiliklar" active | "E'lonlar"
Right: "+ Yangi yangilik"

Grid (3 columns) of news cards:
- Image placeholder (16:9) + Date + Title (bold) + Excerpt (2 lines)
+ Author avatar + Views count + "Batafsil" link

E'lonlar tab: list cards with priority indicator 
(urgent/important/info), target audience badge
```

### MODUL G: Ma'lumotnomalar (Reference Data — exists in design, missing)

```
Using TeamHub Design System, create Reference Data page:

PAGE G1: Ma'lumotnomalar (#reference)
Breadcrumb: Asosiy / Admin / Ma'lumotnomalar
Title: "Ma'lumotnomalar"

Grid (4 columns) of dictionary cards:
| Yo'nalishlar (24) | Dasturlar (18) | Tillar (5) | Millatlar (12) |
| Fan turlari (8) | Tumanlar (186) | Oila holati (4) | Mutaxassisliklar (32) |

Each card: icon + name + record count + "Boshqarish" button
Click → inline CRUD table (Name UZ/RU/EN, Status, Edit/Delete)
```

### MODUL H: Jihozlar inventarizatsiyasi (Equipment Tracking)

```
Using TeamHub Design System, create Equipment module:

PAGE H1: Jihozlar (#equipment)
Breadcrumb: Asosiy / Infratuzilma / Jihozlar
Title: "Jihozlar hisobi"

Stats: Jami: 1,856 | Ishlamoqda: 1,720 | Ta'mirda: 89 | 
Hisobdan chiqarilgan: 47

Filters: Search + Kategoriya (IT, Laboratoriya, Mebel, Boshqa) +
Bo'lim + Holat

Table:
| # | Nomi | Inventar raqami | Kategoriya | Bo'lim/Xona |
| Qiymati | Foydalanuvchi | Holat | Oxirgi tekshiruv | Amallar |

Holat badges: "Ishlamoqda" green, "Ta'mirda" yellow,
"Hisobdan chiqarilgan" red, "Konservatsiyadа" gray

Click → detail with QR code, photo, history, maintenance log
```

### MODUL I: Fanlar ro'yxati (Subjects — missing)

```
Using TeamHub Design System, create Subjects list:

PAGE I1: Fanlar (#subjects)
Breadcrumb: Asosiy / O'quv jarayoni / Fanlar
Title: "Fanlar ro'yxati"
Right: "+ Yangi fan"

Stats: Jami: 156 | Majburiy: 98 | Tanlov: 58

Table:
| # | Fan kodi | Fan nomi | Turi (Majburiy/Tanlov) | Kredit |
| Soatlar (Ma'ruza/Amaliy/Lab) | Kafedra | Semester | Amallar |

Groups: by faculty or by semester
```

### MODUL J: Konferensiyalar va Patentlar (missing from Academic+)

```
Using TeamHub Design System, add to Ilmiy ishlar module:

Existing "Ilmiy ishlar" page — add tabs:
"Loyihalar" active | "Maqolalar" | "Konferensiyalar" | "Patentlar"

Tab "Konferensiyalar":
Grid of conference cards: Name, Date, Location, Participants count,
Status (Rejalashtirilgan/O'tkazilmoqda/Tugallangan)

Tab "Patentlar":
Table: # | Patent raqami | Nomi | Mualliflar | Sana | Holat
```

### MODUL K: Bitiruvchilar (Alumni — missing)

```
Using TeamHub Design System, create Alumni page:

PAGE K1: Bitiruvchilar (#alumni)
Breadcrumb: Asosiy / Ta'lim / Bitiruvchilar
Title: "Bitiruvchilar bazasi"

Stats: Jami: 12,450 | Bu yilgi: 520 | Ish bilan ta'minlangan: 78%

Filters: Search + Bitirish yili + Fakultet + Yo'nalish + Ish holati

Table:
| # | Rasm | F.I.O | Bitirish yili | Fakultet | Yo'nalish |
| GPA | Ish joyi | Lavozim | Telefon | Amallar |

Chart: Employment rate by year (line chart)
Chart: Top employers (bar chart)
```

### MODUL L: Amaliyot (Internship tracking — missing)

```
Using TeamHub Design System, create Internship page:

PAGE L1: Amaliyot (#internship)
Breadcrumb: Asosiy / Ta'lim / Amaliyot
Title: "Talabalar amaliyoti"

Stats: Jami: 890 | Jarayonda: 320 | Tugallangan: 450 | 
Boshlanmagan: 120

Filters: Kurs + Fakultet + Amaliyot turi 
(Ishlab chiqarish/Pedagogik/Klinik) + Holat

Table:
| # | Talaba | Guruh | Amaliyot turi | Tashkilot |
| Rahbar (ichki) | Rahbar (tashqi) | Boshlanish | Tugash |
| Baho | Holat | Amallar |

Holat: "Jarayonda" blue, "Tugallangan" green, 
"Boshlanmagan" gray, "Muddati o'tgan" red
```

---

## MAVJUD SAHIFALARNI DETALLASH

Har bir mavjud sahifaning tablarini tekshir va to'ldir:

### Dashboard sahifasi
- KPI grid stilini yaxshila — ikonlar doira ichida (emoji emas!)
- Welcome banner qo'sh: Foydalanuvchi ismi, bugungi sana,
  kun ob-havo (optional), tez havolalar
- "Tezkor amallar" tugmasi uchun dropdown: Yangi talaba,
  Yangi kontrakt, Yangi buyruq, Yangi xabar

### Talabalar sahifasi
Tekshir va qo'sh:
- Tab "Akademik ma'lumotlar": GPA grafigi, semester baholari
- Tab "Moliya": kontrakt holati, to'lovlar tarixi, qarz summasi
- Tab "Bonus/Jarima": mukofotlar va jarimalar timeline
- Tab "Ota-onalar": ota-ona kontakt ma'lumotlari
- Tab "Stipendiya": stipendiya turi, summasi, davri

### O'qituvchilar sahifasi
Tekshir va qo'sh:
- Tab "Dars jadvali": haftalik jadval grid
- Tab "Davomat": o'qituvchining o'z davomati (ish joyiga kelishi)
- Tab "Rag'bat va jarima": mukofotlar, jarimalar, bonuslar
- Tab "Baholash": talabalar tomonidan baholash natijalari
- Tab "Hujjatlar": passport nusxasi, diplom, mehnat shartnomasi

### Kontraktlar sahifasi
- Qarzdorlar alohida sahifaga ajratilsin (PAGE D1)
- Kontrakt details sahifasida "Chegirmalar" bo'limi qo'sh
- To'lov usullari vizualizatsiyasi (pie chart)

### TTJ (Yotoqxona) sahifasi
Tekshir va qo'sh:
- Qavat-xona vizual xaritasi (floor plan grid)
- Xona detali: rezidentlar ro'yxati, inventar, holat
- To'lov holati: har bir rezident uchun
- Texnik xizmat: ta'mir so'rovlari

### HR sahifasi
Tekshir va qo'sh:
- Tab "Ish tarixi": lavozim o'zgarishlari timeline
- Tab "Ta'tillar": yillik, kasallik, dekret
- Tab "Attestatsiya": malaka oshirish, sertifikatlar
- "Shtatlash jadvali" alohida sahifa: bo'limlar × lavozimlar matritsasi

### Sozlamalar sahifasi
Tekshir va qo'sh:
- "Umumiy" tab: logo, nom, manzil, kontaktlar
- "Filiallar" tab: filiallar CRUD
- "O'quv yili" tab: yil, semester, ta'til kunlari
- "Kontrakt" tab: shablon, raqam formati
- "Bildirishnomalar" tab: SMS/Email/Telegram sozlamalari
- "Integratsiyalar" tab: Payme, Click, Eskiz SMS, Telegram bot
- "Xavfsizlik" tab: parol siyosati, 2FA, sessiya muddati
- "Brending" tab: ranglar, logo, kirish sahifasi fon rasmi

---

## DIZAYN QO'LLANMALAR

1. **Emoji ishlatma** — faqat SVG ikonlar (Icon component)
2. **Rang sxemasi** — TeamHub Design System tokens
3. **Tipografiya** — Inter font, hierarhiya: text-2xl → text-xs
4. **Kartochkalar** — white bg, shadow-card, rounded-xl, padding-6
5. **Jadvallar** — DataTable component, pagination, sortable headers
6. **Badgelar** — pill shape, semantic colors
7. **Formalar** — 2-column grid, validation states
8. **Grafiklar** — consistent green palette, tooltips on hover
9. **Mobile** — sidebar collapsible, tables horizontal scroll
10. **Loading** — Skeleton components (already in Overlays.jsx)

## BOSHLASH TARTIBI

1. Emoji → Icon almashtirish (barcha sahifalar)
2. Sidebar restructure (collapsible groups)
3. Ombor moduli (A1-A3)
4. Maosh moduli (B1-B2)
5. Qarzdorlar (D1)
6. Murojaatlar (E1)
7. Yangiliklar (F1)
8. Ma'lumotnomalar (G1)
9. Jihozlar (H1)
10. Fanlar (I1)
11. Qolgan modullar (J, K, L)
12. Mavjud sahifalar detallash
13. Byudjet (C1) — oxirgi

Boshlang #1 (Emoji → Icon) dan — bu butun loyihaga ta'sir qiladi,
keyin #2 (Sidebar restructure).
