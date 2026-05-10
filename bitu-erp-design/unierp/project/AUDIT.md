# UniERP — Audit hisoboti

**Sana:** 26.04.2026
**Loyiha:** BITU ERP (32+ sahifa, 12 sidebar guruhi)
**Auditor:** Design assistant

---

## 1. Loyihaning umumiy holati

### Qo'llanilgan qoliplar
- **Layout:** `BituShell` (sidebar + header), `BituPage` wrapper
- **Primitivlar:** `Card`, `Button`, `IconButton`, `Badge`, `Avatar`, `Icon`, `Input`, `Select`, `Tabs`, `Toggle`
- **Overlays:** `Modal`, `SlideOver`, `Toast`, `ToastContainer`, `ConfirmDialog` — **mavjud va ishlaydi**
- **Data:** `src/data.jsx` — seed massivlar, FK siz, `pick`/`rnum`/`seed` helperlari bilan
- **Wizard:** `StudentWizard` 4-bosqichli — **mavjud, lekin "+ Yangi talaba" tugmasiga ulanmagan emas, ulangan**

### Asosiy muammo
Sahifalarning **~70% chiqarish-faqat (read-only) demo** — chiroyli ko'rinadi, lekin "+ Yangi", "Tahrirlash", "O'chirish", filtrlar ishlamaydi.

---

## 2. Sahifa-sahifa "o'lik elementlar" ro'yxati

Belgilashlar:
- 🔴 **dead** — element ko'rinadi, lekin click hech narsa qilmaydi
- 🟡 **partial** — qisman ishlaydi (faqat lokal state, sahifani yangilab xohlasangiz yo'qoladi)
- 🟢 **works** — to'liq ishlaydi
- ⚠️ **missing** — kerakli, lekin yo'q

### 2.1. ASOSIY — Dashboard
| Element | Holat | Izoh |
|---|---|---|
| Stat cards (KPI) | 🔴 dead | Click bo'lmaydi, modulga olib bormaydi |
| "Tezkor amal" tugmasi | 🔴 dead | Yo'q yoki ishlamaydi |
| Grafiklar | 🟡 partial | Hover tooltipi yo'q |
| "Barchasini ko'rish" linklari | 🟡 partial | Ba'zilari ishlaydi |

### 2.2. TA'LIM
**Talabalar (`students`):**
- 🟢 "+ Yangi talaba" → Wizard ochiladi (StudentWizard)
- 🔴 Wizard "Saqlash" — talaba massivga qo'shilmaydi
- 🟢 Search field — ishlaydi
- 🟡 Filter dropdownlar (Fakultet, Kurs, Holat) — UI bor, .filter() ulanmagan
- 🟢 Row click → StudentProfile
- 🔴 Profilning "Tahrirlash" tugmasi — yo'q
- 🔴 Profilning "O'chirish" tugmasi — yo'q
- 🟢 Profil tablari — Shaxsiy, O'qish, Moliya, Davomat, Baholar — barchasi to'liq

**O'qituvchilar (`teachers`):**
- 🔴 "+ Yangi o'qituvchi" — yo'q yoki dead
- 🔴 Edit/Delete — yo'q
- 🟢 Profile tablari ishlaydi (read-only)

**Davomat (`attendance`):**
- 🟡 Yacheykalarni klik qilib o'zgartirish — hozirgi holatni bilmayman, tekshirish kerak
- 🔴 "Saqlash" — server yo'q, lokal state ham noaniq

**Baholash (`grading`):**
- 🟡 Input'lar bor, lekin onChange handlerlar minimal
- 🔴 "Saqlash" — ishlamaydi
- 🔴 "Eksport" — ishlamaydi

**Dars jadvali (`schedule`):**
- 🔴 "+ Yangi dars" — yo'q
- 🔴 Yacheyka click → Edit SlideOver — yo'q
- 🟡 3 ko'rinish toggle (Guruh/O'qituvchi/Xona) — bor yoki yo'qligini tekshirish kerak

**Imtihonlar (`exams`):**
- 🔴 CRUD — yo'q
- 🟢 Read-only ro'yxat ishlaydi

### 2.3. O'QUV JARAYONI
**O'quv rejalar (`curriculum`):**
- 🟢 Ko'rsatuv UI bor
- 🔴 Fan qo'shish/olib tashlash — yo'q

**Kafedralar (`departments`):**
- 🔴 CRUD — yo'q
- 🟢 List + ba'zi statistik kartochkalar

**Fanlar (`subjects`):**
- 🟢 Yangi qo'shilgan — UI tayyor, jadval yaxshi
- 🔴 "+ Yangi fan", Edit, Delete — dead

**Kutubxona (`library`):**
- 🟢 Kitoblar ro'yxati ko'rinadi
- 🔴 Berish/qaytarish operatsiyasi — yo'q

### 2.4. QABUL (CRM)
**Arizalar (`crm`):**
- 🔴 "+ Yangi ariza" — dead
- 🟡 Status badge inline o'zgartirish — yo'q
- 🔴 Row click → Detail — qisman

**Voronka (`crm-kanban`):**
- 🟡 Kartochkalar ko'rinadi
- 🔴 **Drag-and-drop yo'q** — eng katta minus
- 🔴 Card click → SlideOver — yo'q

**CRM hisobot (`crm-report`):**
- 🟡 Grafiklar bor, period filtri ishlamaydi

### 2.5. MOLIYA
**Kontraktlar (`contracts`):**
- 🟢 Row click → ContractDetails
- 🔴 "+ Yangi kontrakt" — dead
- 🔴 "+ To'lov qo'shish" — dead

**Stipendiya (`scholarship`):**
- 🟢 Ro'yxat
- 🔴 "Tayinlash" — yo'q

**TTJ (`dormitory`):**
- 🟢 Vizual grid (yaxshi)
- 🔴 Joylashtirish operatsiyasi — yo'q
- 🔴 Xona detail — qisman

**Maosh (`payroll`)** — yangi:
- 🟢 KPI, jadval, tarix grafigi
- 🔴 "Hisoblash", "Vedomost eksport" — dead
- 🟢 Search + dept filter — ishlaydi

**Byudjet (`budget`)** — yangi:
- 🟢 Donut, Reja vs Fakt bar, jadvallar
- 🔴 "Xarajat hujjati", "Hisobot" — dead

**Qarzdorlar (`debtors`)** — yangi:
- 🟢 Bucket filter ishlaydi
- 🔴 "SMS yuborish", "Eksport" — dead

### 2.6. XODIMLAR
**HR (`hr`):**
- 🔴 CRUD yo'q
- 🟢 Read-only

**Buyruqlar (`orders`):**
- 🔴 "+ Yangi buyruq" — dead
- 🟢 List

**Shtatlash (`staffing`):**
- ⚠️ Sahifa yo'q (sidebar'da bor, App.jsx route yo'q)

### 2.7. INFRATUZILMA
**TTJ** — yuqorida ko'rsatilgan
**Ombor (`warehouse`)** — yangi:
- 🟢 3 tab: Qoldiq, Kelim-chiqim, Inventarizatsiya
- 🔴 "Kelim qo'shish", "Skaner" — dead
- 🟢 Filtrlar ishlaydi

**Jihozlar (`equipment`)** — yangi:
- 🟢 Status filter tabs ishlaydi
- 🔴 "Jihoz qo'shish", "QR-kod chop etish" — dead

**Transport (`transport`):**
- ⚠️ Sahifa yo'q

### 2.8. ILMIY FAOLIYAT
**Ilmiy ishlar (`research`):**
- 🟢 Read-only
- 🔴 CRUD yo'q

**Diplom ishlari (`theses`):**
- 🟢 Talaba → Mavzu → Rahbar zanjiri ko'rinadi
- 🔴 Status tracking interaktiv emas

**Konferensiyalar (`conferences`):**
- ⚠️ Sahifa yo'q

**Patentlar (`patents`):**
- ⚠️ Sahifa yo'q

### 2.9. KABINETLAR
**Talaba kabineti (`student-cabinet`):**
- 🟢 Read-only ko'rinish, yaxshi
- ✅ Bu sahifa CRUD talab qilmaydi

**O'qituvchi kabineti (`teacher-cabinet`):**
- 🟢 Asosiy ko'rinish bor
- 🟡 "Tezkor davomat" tugmasi — ishlamasligi mumkin

### 2.10. BOSHQARUV
**Topshiriqlar (`tasks`):**
- 🔴 Drag-and-drop yo'q
- 🔴 Card CRUD yo'q
- 🟢 Statik ko'rinish

**Murojaatlar (`appeals`)** — yangi:
- 🟢 Master-detail, filter ishlaydi
- 🔴 "Javob yozish", "Yo'naltirish" — dead

**Xabarlar (`messages`):**
- 🟢 Chat UI
- 🔴 Yangi xabar yuborish — dead

**Bildirishnomalar (`notifications`):**
- 🟢 Ro'yxat
- 🔴 "Barchasini o'qildi" — dead

**Yangiliklar (`news`)** — yangi:
- 🟢 Grid/list view toggle ishlaydi
- 🔴 "Yangilik yozish" — dead

### 2.11. ADMIN
**DMS (`dms`):**
- 🔴 Fayl yuklash — yo'q
- 🟢 Ro'yxat

**Analytics (`analytics`):**
- 🟡 Statik grafiklar
- 🔴 Filtrlar dead

**Hisobotlar (`reports`):**
- 🔴 "Generatsiya" tugmasi — dead

**Ma'lumotnomalar (`reference`)** — yangi:
- 🟢 8 ta lug'at kartochkasi
- 🟢 Detail sahifa ochiladi
- 🔴 "+ Yangi yozuv", Edit — dead

**Sozlamalar (`settings`):**
- 🟢 Tablar ko'rinadi
- 🔴 Form'lar saqlamaydi

### 2.12. TIZIM
**Foydalanuvchilar (`users`):**
- 🟢 Profile ochiladi
- 🔴 Yangi foydalanuvchi yaratish — dead
- 🔴 Rol biriktirish — dead

**Rollar (`roles`):**
- 🟢 List + Permission matrix link
- 🔴 Yangi rol — dead

**Ruxsatlar (`permissions`):**
- 🟢 Matrix ko'rinadi
- 🔴 Toggle saqlamaydi

**Audit log (`audit`):**
- 🟢 Read-only — to'g'ri
- 🟡 Filtrlar partial

### 2.13. Yangi modullar (so'nggi qo'shilganlar)
**Bitiruvchilar (`alumni`)**, **Amaliyot (`internship`)** — Status: 🟢 read-only ko'rinishi yaxshi, lekin CRUD yo'q.

---

## 3. Yetishmayotgan sahifalar (kerakli, ammo yo'q)

| Sidebar item | Route | Holati |
|---|---|---|
| Shtatlash jadvali | `staffing` | yo'q |
| Transport | `transport` | yo'q |
| Konferensiyalar | `conferences` | yo'q |
| Patentlar | `patents` | yo'q |
| CRM hisobot | `crm-report` | qisman/yo'q |
| Moliyaviy hisobot | `finreport` | yo'q |

---

## 4. Arxitektura tavsiyalari

### 4.1. `dataStore.jsx` — yagona ma'lumot manbai
Yangi fayl yaratiladi: normalizatsiya qilingan FK bilan tuzilma + `useEntityStore` React hook. Barcha CRUD shu store orqali o'tadi. Mavjud `data.jsx` qoladi (eski sahifalar uchun seed manbai sifatida).

```js
// Sxema:
window.DataStore = {
  fakultetlar: [...], kafedralar: [...], guruhlar: [...],
  talabalar: [...], oqituvchilar: [...], xodimlar: [...],
  fanlar: [...], dars_jadvali: [...], baholar: [...], davomat: [...],
  kontraktlar: [...], tolovlar: [...], stipendiya: [...],
  ttj_binolar: [...], ttj_xonalar: [...], joylashish: [...],
  ombor: [...], jihozlar: [...], buyruqlar: [...],
  crm_arizalar: [...], murojaatlar: [...], yangiliklar: [...],
  ilmiy_ishlar: [...], diplom_ishlari: [...],
  rollar: [...], foydalanuvchilar: [...], audit: [...],
};
```

`useEntityStore('talabalar')` qaytaradi: `{ items, add, update, remove, get }`.

### 4.2. Universal CRUD shabloni
Har bir CRUD-modul bir xil patternga ega bo'ladi:

```jsx
const Page = () => {
  const { items, add, update, remove } = useEntityStore('talabalar');
  const [editing, setEditing] = useState(null); // null=closed, {}=new, obj=edit
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filters, setFilters] = useState({ q: '', faculty: 'all' });

  const filtered = items.filter(/* filtrlash */);

  return (
    <>
      <PageHeader actions={<Button onClick={() => setEditing({})}>+ Yangi</Button>} />
      <Toolbar><Search/>...<Filters/></Toolbar>
      <Table data={filtered}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => setConfirmDelete(r)} />

      <SlideOver open={!!editing} onClose={() => setEditing(null)}>
        <EntityForm entity={editing} onSave={(v) => {
          if (editing.id) update(editing.id, v); else add(v);
          setEditing(null); toast.success('Saqlandi');
        }} />
      </SlideOver>

      <ConfirmDialog open={!!confirmDelete}
        onConfirm={() => { remove(confirmDelete.id); toast.success("O'chirildi"); setConfirmDelete(null); }} />
    </>
  );
};
```

### 4.3. UI/UX tavsiyalari
1. **Click-feedback yo'q** — har bir tugma bosilganda ozgina hover/active state kerak
2. **Empty state'lar yo'q** — filterlar bo'shatganda "Hech narsa topilmadi" placeholderi yo'q
3. **Yuklanish (loading) holati** — ba'zi joylarda skeleton kerak
4. **Inline edit** — kichik o'zgartirishlar uchun butun SlideOver ortiqcha (masalan, status o'zgartirish — inline dropdown bo'lishi kerak)
5. **Bulk actions** — checkbox + "Tanlanganlarni o'chirish/eksport" yo'q
6. **Keyboard shortcuts** — `Cmd+K` global search, `N` yangi qo'shish, `Esc` yopish — yo'q
7. **URL bilan sinxron** — hozir har refresh login'ga qaytaradi (yo'qolish xavfli)
8. **Validatsiya xato'lar** — formada faqat hozircha required marker bor, real validatsiya yo'q
9. **Responsive** — 1024px dan past o'lchamlarda ba'zi jadvallar overflow bo'ladi
10. **Dark mode** — `tokens.css` da bor lekin haqiqiy dark variantlari ulanmagan

---

## 5. Tavsiya etilgan ish tartibi (prioritet)

### 1-iteratsiya (asos):
1. `dataStore.jsx` + `useEntityStore` hook
2. Universal `CrudForm` komponent (SlideOver ichida)
3. **Talabalar** moduli — to'liq CRUD (Pilot)
4. **Kontraktlar** moduli — to'liq CRUD (Pilot, 2-FK bilan)

### 2-iteratsiya (asosiy modullar):
5. O'qituvchilar, HR, Buyruqlar
6. Davomat (interaktiv grid + saqlash)
7. Baholash (input + saqlash + eksport)
8. CRM Arizalar + Voronka (drag-and-drop)

### 3-iteratsiya (yetishmayotgan sahifalar):
9. Shtatlash, Transport, Konferensiyalar, Patentlar, Moliyaviy hisobot
10. Topshiriqlar Kanban (drag-and-drop)
11. Xabarlar (real chat) + Bildirishnomalar action

### 4-iteratsiya (yangi modullar CRUD):
12. Ombor, Jihozlar, Maosh, Byudjet, Qarzdorlar — "+Yangi" tugmalarini ulash
13. Murojaatlar — javob yozish dialogi
14. Yangiliklar — yozish formasi + WYSIWYG

### 5-iteratsiya (sayqallash):
15. Validatsiya, empty state, loading, keyboard shortcuts
16. Dark mode haqiqiy implementatsiya
17. URL routing (hashbang yoki query)
18. Responsive 1024px dan past

---

## 6. Texnik qarz (Tech debt)

- `data.jsx` da FK yo'q — barcha sahifalar string bilan match qilishadi (xato'larga olib keladi)
- `App.jsx` da 50+ `route === 'X'` shartlari — switch yoki route map yaxshiroq
- Ba'zi sahifalar yagona faylda 1500+ qator (NewModules.jsx, MorePages.jsx) — bo'lib chiqarish kerak
- Toast'lar ImperatIv API'da emas (`toast.success(...)` qo'lda chaqiriladigan singleton kerak)
- Wizard "Saqlash" tugmasi — qaytaruvchi callback yo'q
