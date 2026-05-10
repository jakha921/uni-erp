// NewModules.jsx — Yangi modullar: Ombor, Maosh, Qarzdorlar, Murojaatlar, Yangiliklar,
// Ma'lumotnomalar, Jihozlar, Fanlar, Bitiruvchilar, Amaliyot, Byudjet
// Loyihaning mavjud primitivlari (Card, Button, Badge, Tabs, Avatar, Icon, Input, Select)
// va data.jsx hjlperlaridan (pick, rnum, seed, fullName, phone, FACULTIES, DEPARTMENTS, DIRECTIONS, STUDENTS) foydalanadi.

const fmtNum = (n) => Number(n).toLocaleString('ru-RU').replace(/,/g, ' ');
const fmtSum = (n) => fmtNum(Math.round(n)) + " so'm";
const fmtMln = (n) => (n / 1_000_000).toFixed(1) + ' mln';
const fmtMlrd = (n) => (n / 1_000_000_000).toFixed(2) + ' mlrd';

// ============================================================
// SHARED LITTLE BITS
// ============================================================
const KpiCard = ({ label, value, delta, icon, color = '#2DB976', sub }) => (
  <Card hover padding={18}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={18} />
      </div>
      {delta != null && (
        <Badge variant={delta >= 0 ? 'success' : 'error'}>
          {delta >= 0 ? '+' : ''}{delta}%
        </Badge>
      )}
    </div>
    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginTop: 2, letterSpacing: '-0.02em' }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 4 }}>{sub}</div>}
  </Card>
);

const KpiRow = ({ items }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length},1fr)`, gap: 14, marginBottom: 18 }}>
    {items.map((k, i) => <KpiCard key={i} {...k} />)}
  </div>
);

const Th = ({ children, align = 'left' }) => (
  <th style={{ padding: '10px 14px', textAlign: align, fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#F8FAFB', borderBottom: '1px solid #E2E8F0' }}>{children}</th>
);
const Td = ({ children, align = 'left', mono, weight = 400, color = '#334155', style }) => (
  <td style={{ padding: '12px 14px', fontSize: 13, color, fontWeight: weight, textAlign: align, fontVariantNumeric: mono ? 'tabular-nums' : 'normal', borderTop: '1px solid #F1F5F9', ...style }}>{children}</td>
);

const ToolbarSelect = ({ value, onChange, children, width }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ height: 36, padding: '0 28px 0 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'inherit', width }}>
    {children}
  </select>
);

const SearchField = ({ value, onChange, placeholder, width = 260 }) => (
  <div style={{ position: 'relative', width }}>
    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
      <Icon name="search" size={14} />
    </span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', height: 36, padding: '0 12px 0 32px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
  </div>
);

const Toolbar = ({ children }) => (
  <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 13.5, color: '#64748B', marginTop: 4 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </div>
);

const InfoPair2 = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10.5, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ fontSize: 13.5, color: '#0F172A', marginTop: 3 }}>{value}</div>
  </div>
);

// ============================================================
// DATA
// ============================================================
const WAREHOUSE_CATEGORIES = ["O'quv jihozlari", "Xo'jalik mollari", 'IT texnika', 'Mebel', 'Ish kiyimlari', 'Oziq-ovqat'];
const WAREHOUSE_LOCATIONS = ['Asosiy ombor', 'IT ombor', 'Mebel ombor', "Xo'jalik bo'limi"];
const WAREHOUSE_ITEM_NAMES = [
  ['Printer kartridji HP 107a', 'IT texnika', 'dona', 145000],
  ['Doska markeri (ko\'k)', "O'quv jihozlari", 'dona', 8500],
  ['A4 qog\'oz, 500 varaq', "O'quv jihozlari", 'paket', 65000],
  ['Proyektor lampa', 'IT texnika', 'dona', 380000],
  ['Laboratoriya idishi 500ml', "O'quv jihozlari", 'dona', 32000],
  ['Sichqoncha Logitech B100', 'IT texnika', 'dona', 95000],
  ['O\'quv stoli (1.4m)', 'Mebel', 'dona', 850000],
  ['Yumshoq stul', 'Mebel', 'dona', 420000],
  ['Tozalovchi suyuqlik 5L', "Xo'jalik mollari", 'litr', 45000],
  ['Tualet qog\'ozi (24 rul.)', "Xo'jalik mollari", 'paket', 78000],
  ['Halat (M o\'lcham)', 'Ish kiyimlari', 'dona', 125000],
  ['Klaviatura A4Tech KR-83', 'IT texnika', 'dona', 165000],
  ['Disk DVD-R (10 dona)', 'IT texnika', 'paket', 22000],
  ['Stapler "Kangaro"', "O'quv jihozlari", 'dona', 38000],
];
const WAREHOUSE_ITEMS = WAREHOUSE_ITEM_NAMES.map((row, i) => {
  const [name, cat, unit, price] = row;
  const stock = Math.round(rnum(i + 701, 0, 320));
  const min = Math.round(rnum(i + 703, 8, 28));
  const status = stock === 0 ? 'Tugagan' : stock < min ? 'Kam' : 'Yetarli';
  return {
    sku: `SKU-${String(2000 + i * 17).padStart(5, '0')}`,
    name, category: cat, unit, price,
    stock, minStock: min, status,
    location: pick(WAREHOUSE_LOCATIONS, i + 705),
    lastIn: `${rnum(i + 707, 1, 25) | 0}.04.2026`,
  };
});

const PAYROLL_DATA = Array.from({ length: 14 }, (_, i) => {
  const n = fullName(i + 801, 0.4);
  const dept = pick(DEPARTMENTS, i + 803);
  const positions = ['Professor', 'Dotsent', "Katta o'qituvchi", "O'qituvchi", 'Laborant', 'Mutaxassis'];
  const position = pick(positions, i + 805);
  const rate = position === 'Professor' ? 12500000 : position === 'Dotsent' ? 9800000 : position === "Katta o'qituvchi" ? 7600000 : position === "O'qituvchi" ? 5800000 : position === 'Laborant' ? 3800000 : 4500000;
  const hours = Math.round(rnum(i + 807, 140, 184));
  const bonus = Math.round(rnum(i + 809, 200000, 1500000) / 10000) * 10000;
  const deductions = Math.round(rate * 0.12) + Math.round(rnum(i + 811, 50000, 200000) / 1000) * 1000;
  const net = rate + bonus - deductions;
  const status = i < 10 ? 'Hisoblangan' : i < 12 ? 'Kutilmoqda' : "To'langan";
  return { name: n, dept, position, rate, hours, bonus, deductions, net, status };
});

const DEBTORS = Array.from({ length: 14 }, (_, i) => {
  const s = STUDENTS[i + 4];
  const totalOpts = [10500000, 12500000, 14000000, 9800000, 16500000];
  const total = totalOpts[Math.round(rnum(i + 901, 0, 4))];
  const paid = Math.round(total * (0.1 + seed(i + 902) * 0.7) / 10000) * 10000;
  const balance = total - paid;
  const overdueDays = Math.round(rnum(i + 903, 5, 184));
  return {
    student: s, total, paid, balance,
    deadline: `${(rnum(i + 904, 1, 28) | 0).toString().padStart(2, '0')}.${(rnum(i + 905, 1, 4) | 0).toString().padStart(2, '0')}.2026`,
    overdueDays,
    bucket: overdueDays < 30 ? '0-30' : overdueDays < 60 ? '30-60' : overdueDays < 90 ? '60-90' : '90+',
  };
});

const APPEAL_CATS = [
  { id: 'shikoyat', label: 'Shikoyat', variant: 'error' },
  { id: 'taklif', label: 'Taklif', variant: 'info' },
  { id: 'savol', label: 'Savol', variant: 'success' },
  { id: 'ariza', label: 'Ariza', variant: 'warning' },
];
const APPEAL_SUBJECTS = [
  "Auditoriya iliqligi haqida", "Wi-Fi sifatini yaxshilash", "Stipendiya muddati",
  "Imtihon natijasi haqida", "TTJ xonasi xizmati", "Kutubxona soatlari",
  "O'qituvchi munosabati", "Bufet narxlari", "Onlayn dars sifati",
  "Diplom mavzusini tasdiqlash", "Akademik ta'til arizasi", "Ko'chirish arizasi",
  "Stipendiya kechikishi", "Imtihon jadvali",
];
const APPEALS = APPEAL_SUBJECTS.map((subject, i) => ({
  id: `MUR-${String(3000 + i).padStart(5, '0')}`,
  subject,
  cat: pick(APPEAL_CATS, i + 1001),
  status: i < 3 ? 'Yangi' : i < 9 ? "Ko'rib chiqilmoqda" : 'Hal qilingan',
  author: fullName(i + 1003, 0.5),
  assignee: fullName(i + 1005, 0.4).short,
  date: `${(rnum(i + 1007, 1, 25) | 0).toString().padStart(2, '0')}.04.2026`,
}));

const NEWS_TITLES = [
  ['Yangi laboratoriya ochildi: AI Lab', "Sun'iy intellekt sohasidagi izlanishlar uchun zamonaviy laboratoriya ochildi. 24 ta ish o'rni mavjud.", '#2DB976', 'Universitet'],
  ["O'quv yili 2026-2027 boshlanish sanasi", "Yangi o'quv yili 2-sentabrda boshlanishi rejalashtirilgan. Talabalar ro'yxatdan o'tishi 25-avgustdan.", '#3B82F6', 'Akademik'],
  ['Xalqaro hamkorlik shartnomasi', "Germaniya universitetlari bilan akademik almashinuv dasturi bo'yicha shartnoma imzolandi.", '#F59E0B', 'Hamkorlik'],
  ['Qabul komissiyasi natijalari', "Bu yilgi qabul komissiyasi 1247 ta yangi talabani qabul qildi. O'tgan yilga nisbatan +12%.", '#EC4899', 'Akademik'],
  ['Talabalar olimpiadasi g\'oliblari', "Matematika, IT va Iqtisodiyot bo'yicha respublika olimpiadasida 8 ta sovrin.", '#8B5CF6', 'Talabalar'],
  ["Yangi kafedra: Robototexnika", "Sentabrdan boshlab Robototexnika kafedrasi yangi yo'nalishni qabul qiladi.", '#10B981', 'Akademik'],
  ['Stipendiyalar yangi tartibi', "Yuqori GPA (3.5+) talabalar uchun stipendiya summasi 30% oshirildi.", '#06B6D4', 'Talabalar'],
  ["Ilmiy konferensiya — Mart 2026", "12-13 mart kunlari xalqaro ilmiy konferensiya bo'lib o'tadi. 18 mamlakat ishtirokchilari.", '#0EA5E9', 'Ilm-fan'],
  ["Bahor: ekologik aksiyalar", "April oyida atrof-muhitni muhofaza qilish bo'yicha bir qator tadbirlar rejalashtirildi.", '#22C55E', 'Universitet'],
];
const NEWS_ITEMS = NEWS_TITLES.map((row, i) => ({
  id: i + 1,
  title: row[0],
  excerpt: row[1],
  color: row[2],
  tag: row[3],
  date: `${(rnum(i + 1100, 1, 25) | 0).toString().padStart(2, '0')}.04.2026`,
  author: fullName(i + 1101, 0.4).short,
  views: Math.round(rnum(i + 1103, 80, 2400)),
}));

const REFERENCE_DICTS = [
  { id: 'directions', name: "Yo'nalishlar", count: 24, icon: 'graduation', color: '#2DB976' },
  { id: 'programs', name: 'Dasturlar', count: 18, icon: 'doc', color: '#3B82F6' },
  { id: 'languages', name: 'Tillar', count: 5, icon: 'flag', color: '#06B6D4' },
  { id: 'nationalities', name: 'Millatlar', count: 12, icon: 'users', color: '#F59E0B' },
  { id: 'subject-types', name: 'Fan turlari', count: 8, icon: 'book', color: '#8B5CF6' },
  { id: 'districts', name: 'Tumanlar', count: 186, icon: 'pin', color: '#EC4899' },
  { id: 'family-status', name: 'Oila holati', count: 4, icon: 'home', color: '#10B981' },
  { id: 'specialties', name: 'Mutaxassisliklar', count: 32, icon: 'briefcase', color: '#EF4444' },
];
const DICT_SAMPLES = {
  directions: ['Axborot tizimlari', 'Iqtisodiyot', 'Pedagogika', 'Tibbiyot', 'Yuridik fanlar', 'Filologiya', 'Matematika', 'Kimyo', 'Biologiya'],
  programs: ['Bakalavr (kunduzi)', 'Bakalavr (sirtqi)', 'Magistratura', 'Doktorantura (PhD)', 'Doktorantura (DSc)', 'Kasb-hunar'],
  languages: ["O'zbek", 'Rus', 'Ingliz', 'Qoraqalpoq', 'Tojik'],
  nationalities: ["O'zbek", 'Rus', 'Tojik', 'Qozoq', 'Qirg\'iz', "Qoraqalpoq", 'Tatar', 'Boshqa'],
  'subject-types': ['Majburiy', 'Tanlov', 'Asosiy', "Ixtisoslashgan", 'Umumkasbiy', 'Tabiiy fanlar'],
  districts: ["Toshkent sh.", 'Samarqand v.', 'Buxoro v.', 'Andijon v.', "Farg'ona v.", 'Namangan v.', 'Xorazm v.'],
  'family-status': ["Oilali", "Bo'ydoq", "Ajrashgan", 'Beva'],
  specialties: ['Dasturiy injiniring', 'Marketing', 'Buxgalteriya', 'Klinik tibbiyot', 'Hamshiralik ishi', 'Pedagogika'],
};

const EQUIPMENT_NAMES = [
  ['Dell OptiPlex 7090', 'IT', 3500000],
  ['HP LaserJet Pro M404', 'IT', 8500000],
  ['Acer Projector P5530', 'IT', 12000000],
  ["O'quv stoli (1.4m)", 'Mebel', 850000],
  ['Yumshoq stul (qora)', 'Mebel', 420000],
  ['Microscope BX53', 'Laboratoriya', 24000000],
  ['Doska (yashil 2x1m)', 'Mebel', 1800000],
  ['Klimat-kontrol Samsung', 'Boshqa', 4200000],
  ['Lab spektrometr', 'Laboratoriya', 38000000],
  ['Server Dell PowerEdge R640', 'IT', 65000000],
  ['Kondensator yig\'masi', 'Laboratoriya', 5400000],
  ['Qog\'oz kesgich', 'Boshqa', 2200000],
  ['Smart-doska Promethean 75"', 'IT', 18500000],
  ['Telefon Cisco IP-7841', 'IT', 1850000],
];
const EQUIPMENT_ITEMS = EQUIPMENT_NAMES.map((row, i) => {
  const [name, cat, value] = row;
  const stat = i === 2 || i === 7 ? "Ta'mirda" : i === 11 ? 'Hisobdan chiqarilgan' : 'Ishlamoqda';
  return {
    invNum: `INV/2024/${String(100 + i * 17).padStart(4, '0')}`,
    name, category: cat, value,
    location: pick(['IT bo\'limi', 'Auditoriya 312', 'Lab-7', 'Dekanat', 'Kutubxona', 'Auditoriya 215'], i + 1201),
    user: fullName(i + 1203, 0.4).short,
    status: stat,
    lastCheck: `${(rnum(i + 1205, 1, 28) | 0).toString().padStart(2, '0')}.${(rnum(i + 1206, 1, 4) | 0).toString().padStart(2, '0')}.2026`,
  };
});

const SUBJECT_NAMES = [
  ['MAT-101', 'Oliy matematika', 'Majburiy', 6, 36, 18, 0, 1],
  ['IT-204', "Algoritmlar va ma'lumotlar tuzilmasi", 'Majburiy', 5, 32, 24, 12, 3],
  ['IT-308', 'Veb-dasturlash', 'Tanlov', 4, 24, 36, 12, 5],
  ['EC-101', 'Iqtisodiy nazariya', 'Majburiy', 5, 36, 18, 0, 1],
  ['MG-302', 'Strategik menejment', 'Tanlov', 4, 28, 20, 0, 5],
  ['MG-201', 'Marketing asoslari', 'Majburiy', 4, 28, 20, 0, 3],
  ['PD-101', 'Pedagogika asoslari', 'Majburiy', 5, 32, 24, 0, 1],
  ['PD-205', 'Psixologiya', 'Majburiy', 4, 28, 20, 0, 2],
  ['TK-301', "Tog'-kon mashinalari", 'Majburiy', 6, 32, 24, 24, 5],
  ['EN-201', 'Elektr energetikasi', 'Majburiy', 5, 28, 24, 16, 3],
  ['LN-401', "O'zbek mumtoz adabiyoti", 'Tanlov', 3, 24, 16, 0, 7],
  ['FL-201', 'Ingliz tili (B2)', 'Majburiy', 4, 16, 32, 0, 3],
];
const SUBJECTS_LIST = SUBJECT_NAMES.map((row, i) => ({
  code: row[0], name: row[1], type: row[2], credits: row[3],
  lec: row[4], prac: row[5], lab: row[6], semester: row[7],
  dept: pick(DEPARTMENTS, i + 1309),
}));

const ALUMNI_LIST = Array.from({ length: 14 }, (_, i) => {
  const n = fullName(i + 1401, 0.5);
  const employers = ['EPAM Uzbekistan', 'Beeline UZ', 'Uzpromstroybank', 'Navoiy MMC', 'Artel Electronics', 'IT Park', 'Universitet (PhD)', 'Xorijda (Germaniya)', "Toshkent shahar hokimligi", 'TBC Bank', "O'zbekiston Aviasozlari", 'Xususiy biznes', 'Uzbekneftegaz', "Ministerlik"];
  const positions = ['Senior Developer', 'Marketing menejer', 'Bosh hisobchi', 'Bosh injener', 'QA Lead', 'Junior Dev', 'Tadqiqotchi', 'Software Engineer', "Bo'lim boshlig'i", 'Bank operatori', 'Texnolog', 'Rahbar', 'Geolog', 'Mutaxassis'];
  const employed = i !== 7 && i !== 11;
  return {
    name: n,
    year: 2020 + (i % 6),
    faculty: pick(FACULTIES, i + 1403),
    direction: pick(DIRECTIONS, i + 1405),
    gpa: (3.0 + seed(i + 1407) * 1.0).toFixed(2),
    employer: employed ? employers[i] : null,
    position: employed ? positions[i] : null,
    phone: phone(i + 1409),
    employed,
  };
});

const INTERNSHIPS = Array.from({ length: 14 }, (_, i) => {
  const types = ['Ishlab chiqarish', 'Pedagogik', 'Klinik'];
  const orgs = ['Navoiy MMC', "EPAM Uzbekistan", "Maktab №16", "Tibbiyot markazi", "IT Park", "Beeline UZ", "Pedagogika ITI", "Buxoro IT", "Texnopark", "O'zbekiston Bank", "Klinika 'Nur'", "Uzpromstroybank", "Davlat boshqaruvi", "Yusuf-Asatel"];
  const status = i < 5 ? 'Jarayonda' : i < 10 ? 'Tugallangan' : i === 13 ? "Muddati o'tgan" : 'Boshlanmagan';
  const grade = status === 'Tugallangan' ? Math.round(rnum(i + 1503, 70, 95)) : null;
  return {
    id: `AML-${String(4000 + i).padStart(5, '0')}`,
    student: STUDENTS[i],
    type: pick(types, i + 1501),
    organization: orgs[i],
    internalSup: fullName(i + 1505, 0.4).short,
    externalSup: fullName(i + 1507, 0.5).short,
    start: `${(rnum(i + 1509, 1, 25) | 0).toString().padStart(2, '0')}.02.2026`,
    end: `${(rnum(i + 1511, 1, 25) | 0).toString().padStart(2, '0')}.05.2026`,
    grade, status,
  };
});

// ============================================================
// 1) OMBOR
// ============================================================
const OmborPage = () => {
  const [tab, setTab] = React.useState('stock');
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('Hammasi');
  const [loc, setLoc] = React.useState('Hammasi');
  const [stat, setStat] = React.useState('Hammasi');

  const filtered = WAREHOUSE_ITEMS.filter(it => {
    if (cat !== 'Hammasi' && it.category !== cat) return false;
    if (loc !== 'Hammasi' && it.location !== loc) return false;
    if (stat !== 'Hammasi' && it.status !== stat) return false;
    if (q && !(it.name.toLowerCase().includes(q.toLowerCase()) || it.sku.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const totalValue = WAREHOUSE_ITEMS.reduce((s, x) => s + x.price * x.stock, 0);
  const lowCount = WAREHOUSE_ITEMS.filter(x => x.status === 'Kam').length;
  const outCount = WAREHOUSE_ITEMS.filter(x => x.status === 'Tugagan').length;

  return (
    <>
      <PageHeader title="Ombor" subtitle="Materiallar va inventarni boshqarish"
        actions={<>
          <Button variant="secondary" size="sm" icon="download">Eksport</Button>
          <Button variant="primary" size="sm" icon="plus">Kelim qo'shish</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Mahsulotlar', value: fmtNum(WAREHOUSE_ITEMS.length * 18), delta: 3, icon: 'box', color: '#3B82F6' },
        { label: 'Umumiy qiymat', value: fmtMlrd(totalValue * 18), delta: 8, icon: 'wallet', color: '#2DB976', sub: "so'm" },
        { label: 'Kam qoldiq', value: lowCount, delta: -2, icon: 'warning', color: '#F59E0B' },
        { label: 'Tugagan', value: outCount, delta: 1, icon: 'x', color: '#EF4444' },
      ]} />

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'stock', label: 'Qoldiq' },
        { id: 'movements', label: 'Kelim-chiqim' },
        { id: 'inventory', label: 'Inventarizatsiya' },
      ]} />

      {tab === 'stock' && (
        <Card padding={0}>
          <Toolbar>
            <SearchField value={q} onChange={setQ} placeholder="Mahsulot nomi yoki SKU…" width={280} />
            <ToolbarSelect value={cat} onChange={setCat}>
              <option>Hammasi</option>
              {WAREHOUSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </ToolbarSelect>
            <ToolbarSelect value={loc} onChange={setLoc}>
              <option>Hammasi</option>
              {WAREHOUSE_LOCATIONS.map(c => <option key={c}>{c}</option>)}
            </ToolbarSelect>
            <ToolbarSelect value={stat} onChange={setStat}>
              <option>Hammasi</option>
              <option>Yetarli</option>
              <option>Kam</option>
              <option>Tugagan</option>
            </ToolbarSelect>
            <div style={{ flex: 1 }} />
            <Button variant="secondary" size="sm" icon="barcode">Skaner</Button>
          </Toolbar>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <Th>SKU</Th><Th>Nomi</Th><Th>Kategoriya</Th><Th>Joylashuv</Th>
              <Th align="right">Qoldiq</Th><Th align="right">Narx</Th><Th align="right">Qiymat</Th><Th>Holat</Th>
            </tr></thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.sku}>
                  <Td color="#64748B" mono>{r.sku}</Td>
                  <Td color="#0F172A" weight={500}>{r.name}</Td>
                  <Td>{r.category}</Td>
                  <Td>{r.location}</Td>
                  <Td align="right" mono weight={600} color="#0F172A">{r.stock} {r.unit}</Td>
                  <Td align="right" mono>{fmtNum(r.price)}</Td>
                  <Td align="right" mono weight={600} color="#0F172A">{fmtNum(r.price * r.stock)}</Td>
                  <Td><Badge variant={r.status === 'Yetarli' ? 'success' : r.status === 'Kam' ? 'warning' : 'error'} dot>{r.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'movements' && <WarehouseMovements />}
      {tab === 'inventory' && <WarehouseInventoryAudit />}
    </>
  );
};

const WarehouseMovements = () => {
  const movs = Array.from({ length: 14 }, (_, i) => {
    const it = WAREHOUSE_ITEMS[i % WAREHOUSE_ITEMS.length];
    const type = i % 3 === 0 ? 'Chiqim' : 'Kelim';
    const qty = Math.round(rnum(i + 1601, 5, 80));
    return {
      doc: `${type === 'Kelim' ? 'KEL' : 'CHQ'}-${String(700 + i).padStart(4, '0')}`,
      date: `${(rnum(i + 1603, 1, 28) | 0).toString().padStart(2, '0')}.04.2026`,
      type, item: it.name, qty, unit: it.unit,
      sum: it.price * qty,
      counterparty: type === 'Kelim' ? pick(['"Asaxiy"', '"Texno-Stroy"', '"Office World"', "Ishlab chiq."], i + 1605) : pick(['IT bo\'limi', 'Aud. 312', 'Lab-7', 'Dekanat'], i + 1607),
      user: fullName(i + 1609, 0.4).short,
    };
  });
  const inSum = movs.filter(m => m.type === 'Kelim').reduce((s, m) => s + m.sum, 0);
  const outSum = movs.filter(m => m.type === 'Chiqim').reduce((s, m) => s + m.sum, 0);
  return (
    <>
      <KpiRow items={[
        { label: 'Kelim (April)', value: fmtMln(inSum), delta: 12, icon: 'arrowDown', color: '#2DB976' },
        { label: 'Chiqim (April)', value: fmtMln(outSum), delta: -4, icon: 'arrowUp', color: '#EF4444' },
        { label: 'Aylanma', value: fmtMln(inSum + outSum), delta: 7, icon: 'trendUp', color: '#3B82F6' },
      ]} />
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Hujjat №</Th><Th>Sana</Th><Th>Turi</Th><Th>Mahsulot</Th>
            <Th align="right">Miqdor</Th><Th align="right">Summa</Th><Th>Kim/Qaerga</Th><Th>Foydalanuvchi</Th>
          </tr></thead>
          <tbody>
            {movs.map(r => (
              <tr key={r.doc}>
                <Td mono color="#0F172A" weight={500}>{r.doc}</Td>
                <Td mono color="#64748B">{r.date}</Td>
                <Td><Badge variant={r.type === 'Kelim' ? 'success' : 'warning'}>{r.type}</Badge></Td>
                <Td color="#0F172A">{r.item}</Td>
                <Td align="right" mono>{r.qty} {r.unit}</Td>
                <Td align="right" mono weight={600} color="#0F172A">{fmtNum(r.sum)}</Td>
                <Td>{r.counterparty}</Td>
                <Td color="#64748B">{r.user}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

const WarehouseInventoryAudit = () => {
  const audits = [
    { id: 'INV-2026-04', date: '15.04.2026', responsible: "Karimov S.A.", items: 248, matched: 241, diff: 7, status: 'Tugallangan' },
    { id: 'INV-2026-03', date: '15.03.2026', responsible: "Saidova M.K.", items: 246, matched: 246, diff: 0, status: 'Tugallangan' },
    { id: 'INV-2026-Q1', date: '01.04.2026', responsible: "Komissiya №3", items: 412, matched: 398, diff: 14, status: 'Akt tuzilgan' },
    { id: 'INV-2026-02', date: '15.02.2026', responsible: "Karimov S.A.", items: 240, matched: 238, diff: 2, status: 'Tugallangan' },
    { id: 'INV-2026-05', date: '15.05.2026', responsible: "Karimov S.A.", items: 0, matched: 0, diff: 0, status: 'Rejalashtirilgan' },
  ];
  return (
    <Card padding={0}>
      <Toolbar>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Inventarizatsiya hujjatlari</div>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="sm" icon="plus">Yangi inventarizatsiya</Button>
      </Toolbar>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <Th>Hujjat №</Th><Th>Sana</Th><Th>Mas'ul</Th>
          <Th align="right">Pozitsiya</Th><Th align="right">Mos kelgan</Th>
          <Th align="right">Farq</Th><Th>Holat</Th>
        </tr></thead>
        <tbody>
          {audits.map(r => (
            <tr key={r.id}>
              <Td mono color="#0F172A" weight={500}>{r.id}</Td>
              <Td mono color="#64748B">{r.date}</Td>
              <Td>{r.responsible}</Td>
              <Td align="right" mono>{r.items}</Td>
              <Td align="right" mono color="#1B7A4E">{r.matched}</Td>
              <Td align="right" mono weight={600} color={r.diff > 0 ? '#B91C1C' : '#1B7A4E'}>{r.diff > 0 ? `−${r.diff}` : '0'}</Td>
              <Td><Badge variant={r.status === 'Tugallangan' ? 'success' : r.status === 'Akt tuzilgan' ? 'warning' : 'info'} dot>{r.status}</Badge></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

// ============================================================
// 2) MAOSH
// ============================================================
const MaoshPage = () => {
  const [tab, setTab] = React.useState('current');
  const [q, setQ] = React.useState('');
  const [dept, setDept] = React.useState('Hammasi');

  const filtered = PAYROLL_DATA.filter(r => {
    if (dept !== 'Hammasi' && r.dept !== dept) return false;
    if (q && !r.name.full.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const total = PAYROLL_DATA.reduce((s, r) => s + r.net, 0) * 22;
  const totalGross = PAYROLL_DATA.reduce((s, r) => s + r.rate + r.bonus, 0) * 22;
  const totalDed = PAYROLL_DATA.reduce((s, r) => s + r.deductions, 0) * 22;

  return (
    <>
      <PageHeader title="Maosh" subtitle="Xodimlarning ish haqi va to'lovlari · April 2026"
        actions={<>
          <Button variant="secondary" size="sm" icon="download">Vedomost</Button>
          <Button variant="primary" size="sm" icon="money">Hisoblash</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Umumiy fond', value: fmtMlrd(total), delta: 4, icon: 'wallet', color: '#2DB976', sub: "so'm" },
        { label: 'Brutto', value: fmtMlrd(totalGross), icon: 'trendUp', color: '#3B82F6', sub: "so'm" },
        { label: 'Soliq + ushlab qolinishlar', value: fmtMln(totalDed), icon: 'archive', color: '#F59E0B', sub: "so'm" },
        { label: 'Xodimlar', value: fmtNum(311), delta: 2, icon: 'users', color: '#8B5CF6' },
      ]} />

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'current', label: 'Joriy oy' },
        { id: 'history', label: 'Tarix' },
        { id: 'taxes', label: 'Soliqlar va ushlanmalar' },
      ]} />

      {tab === 'current' && (
        <Card padding={0}>
          <Toolbar>
            <SearchField value={q} onChange={setQ} placeholder="F.I.Sh izlash…" width={280} />
            <ToolbarSelect value={dept} onChange={setDept}>
              <option>Hammasi</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </ToolbarSelect>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: '#64748B' }}>April 2026 · 1-30</span>
          </Toolbar>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <Th>F.I.Sh</Th><Th>Kafedra</Th><Th align="right">Soat</Th>
              <Th align="right">Stavka</Th><Th align="right">Mukofot</Th>
              <Th align="right">Ushlanmalar</Th><Th align="right">Sof</Th><Th>Holat</Th>
            </tr></thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={r.name.initials} size={28} color={r.name.isFemale ? 'amber' : 'blue'} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{r.name.full}</div>
                        <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{r.position}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>{r.dept}</Td>
                  <Td align="right" mono>{r.hours}</Td>
                  <Td align="right" mono>{fmtNum(r.rate)}</Td>
                  <Td align="right" mono color="#1B7A4E">+{fmtNum(r.bonus)}</Td>
                  <Td align="right" mono color="#B91C1C">−{fmtNum(r.deductions)}</Td>
                  <Td align="right" mono weight={700} color="#0F172A">{fmtNum(r.net)}</Td>
                  <Td><Badge variant={r.status === "To'langan" ? 'success' : r.status === 'Hisoblangan' ? 'info' : 'warning'} dot>{r.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'history' && <PayrollHistory />}
      {tab === 'taxes' && <PayrollTaxes />}
    </>
  );
};

const PayrollHistory = () => {
  const months = ['Oktabr 2025', 'Noyabr 2025', 'Dekabr 2025', 'Yanvar 2026', 'Fevral 2026', 'Mart 2026', 'April 2026'];
  const data = months.map((m, i) => ({
    month: m,
    fund: 1240000000 + Math.round(rnum(i + 1701, -80, 80)) * 1000000,
    employees: 311 + Math.round(rnum(i + 1703, -3, 6)),
    avg: 4080000 + Math.round(rnum(i + 1705, -120, 280)) * 1000,
    status: i === months.length - 1 ? 'Joriy' : "To'langan",
  }));
  const max = Math.max(...data.map(d => d.fund));
  return (
    <>
      <Card hover padding={20} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', marginBottom: 14 }}>Oylik fond dinamikasi (mlrd so'm)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, paddingTop: 8 }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>{(d.fund / 1e9).toFixed(2)}</div>
              <div style={{
                width: '100%', height: `${(d.fund / max) * 100}%`,
                background: i === data.length - 1 ? 'linear-gradient(180deg,#34D399,#1B7A4E)' : 'linear-gradient(180deg,#94A3B8,#64748B)',
                borderRadius: '6px 6px 0 0', minHeight: 8,
              }} />
              <div style={{ fontSize: 11, color: '#475569' }}>{d.month.split(' ')[0].slice(0, 3)}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Oy</Th><Th align="right">Xodimlar</Th>
            <Th align="right">Umumiy fond</Th><Th align="right">O'rtacha</Th><Th>Holat</Th>
          </tr></thead>
          <tbody>
            {[...data].reverse().map((r, i) => (
              <tr key={i}>
                <Td color="#0F172A" weight={500}>{r.month}</Td>
                <Td align="right" mono>{r.employees}</Td>
                <Td align="right" mono weight={600} color="#0F172A">{fmtNum(r.fund)}</Td>
                <Td align="right" mono>{fmtNum(r.avg)}</Td>
                <Td><Badge variant={r.status === "To'langan" ? 'success' : 'info'} dot>{r.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

const PayrollTaxes = () => {
  const rows = [
    { name: 'INPS (12%)', base: 1248000000, amount: 149760000 },
    { name: "Pensiya jamg'armasi (8%)", base: 1248000000, amount: 99840000 },
    { name: "Tibbiy sug'urta (2%)", base: 1248000000, amount: 24960000 },
    { name: 'Kasaba uyushmasi (1%)', base: 1248000000, amount: 12480000 },
    { name: 'Ijroviy hujjat (alimentlar)', base: 84000000, amount: 21000000 },
  ];
  const totalDed = rows.reduce((s, r) => s + r.amount, 0);
  return (
    <Card padding={0}>
      <Toolbar>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Soliqlar va ushlab qolinishlar — April 2026</div>
        <div style={{ flex: 1 }} />
        <Badge variant="warning">Jami: {fmtNum(totalDed)} so'm</Badge>
      </Toolbar>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <Th>Soliq turi</Th><Th align="right">Baza</Th>
          <Th align="right">Summa</Th><Th align="right">Foiz</Th>
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <Td color="#0F172A" weight={500}>{r.name}</Td>
              <Td align="right" mono>{fmtNum(r.base)}</Td>
              <Td align="right" mono weight={600} color="#0F172A">{fmtNum(r.amount)}</Td>
              <Td align="right" mono color="#64748B">{((r.amount / totalDed) * 100).toFixed(1)}%</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

// ============================================================
// 3) QARZDORLAR
// ============================================================
const QarzdorlarPage = () => {
  const [bucket, setBucket] = React.useState('all');
  const filtered = bucket === 'all' ? DEBTORS : DEBTORS.filter(d => d.bucket === bucket);
  const totalDebt = DEBTORS.reduce((s, d) => s + d.balance, 0);
  const buckets = ['0-30', '30-60', '60-90', '90+'];
  const bucketData = buckets.map(b => ({
    bucket: b,
    count: DEBTORS.filter(d => d.bucket === b).length,
    sum: DEBTORS.filter(d => d.bucket === b).reduce((s, d) => s + d.balance, 0),
    color: b === '0-30' ? '#2DB976' : b === '30-60' ? '#F59E0B' : b === '60-90' ? '#EF4444' : '#7C2D12',
  }));

  return (
    <>
      <PageHeader title="Qarzdorlar ro'yxati" subtitle="Kontrakt to'lovlari bo'yicha qarzdor talabalar"
        actions={<>
          <Button variant="secondary" size="sm" icon="mail">SMS yuborish</Button>
          <Button variant="primary" size="sm" icon="download">Eksport</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Jami qarz', value: fmtMlrd(totalDebt * 12), delta: 12, icon: 'warning', color: '#EF4444', sub: "so'm" },
        { label: 'Qarzdor talabalar', value: DEBTORS.length * 12, icon: 'users', color: '#F59E0B' },
        { label: "O'rtacha qarz", value: fmtMln(totalDebt / DEBTORS.length), icon: 'wallet', color: '#3B82F6', sub: "so'm" },
        { label: 'Eng katta kechikish', value: '184 kun', icon: 'clock', color: '#8B5CF6' },
      ]} />

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {bucketData.map(b => {
          const active = bucket === b.bucket;
          return (
            <button key={b.bucket} onClick={() => setBucket(active ? 'all' : b.bucket)}
              style={{
                background: active ? '#FEF3F2' : '#fff',
                border: `1px solid ${active ? '#FECACA' : '#E2E8F0'}`,
                borderRadius: 12, padding: 16, textAlign: 'left', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: b.color }} />
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{b.bucket} kun</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginTop: 6, letterSpacing: '-0.02em' }}>{b.count * 12}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fmtMln(b.sum)} so'm</div>
            </button>
          );
        })}
      </div>

      <Card padding={0}>
        <Toolbar>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
            {bucket === 'all' ? 'Barcha qarzdorlar' : `${bucket} kun guruhi`}
          </div>
          <div style={{ flex: 1 }} />
          {bucket !== 'all' && <button onClick={() => setBucket('all')} style={{ background: 'none', border: 'none', color: '#2DB976', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Filtrni tozalash ✕</button>}
        </Toolbar>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Talaba</Th><Th>Guruh</Th>
            <Th align="right">Kontrakt</Th><Th align="right">To'langan</Th>
            <Th align="right">Qarz</Th><Th>Kechikish</Th><Th>Muddat</Th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={r.student.name.initials} size={28} color={r.student.name.isFemale ? 'amber' : 'blue'} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{r.student.name.full}</div>
                      <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{r.student.faculty} · {r.student.course}-kurs</div>
                    </div>
                  </div>
                </Td>
                <Td mono>{r.student.group}</Td>
                <Td align="right" mono>{fmtNum(r.total)}</Td>
                <Td align="right" mono color="#1B7A4E">{fmtNum(r.paid)}</Td>
                <Td align="right" mono weight={700} color="#B91C1C">{fmtNum(r.balance)}</Td>
                <Td><Badge variant={r.bucket === '90+' ? 'error' : r.bucket === '60-90' ? 'warning' : r.bucket === '30-60' ? 'warning' : 'info'} dot>{r.overdueDays} kun</Badge></Td>
                <Td mono color="#64748B">{r.deadline}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 4) MUROJAATLAR
// ============================================================
const MurojaatlarPage = () => {
  const [selected, setSelected] = React.useState(APPEALS[0]);
  const [filter, setFilter] = React.useState('all');

  const filtered = APPEALS.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'new') return a.status === 'Yangi';
    if (filter === 'progress') return a.status === "Ko'rib chiqilmoqda";
    if (filter === 'done') return a.status === 'Hal qilingan';
    return true;
  });

  const counts = {
    new: APPEALS.filter(a => a.status === 'Yangi').length,
    progress: APPEALS.filter(a => a.status === "Ko'rib chiqilmoqda").length,
    done: APPEALS.filter(a => a.status === 'Hal qilingan').length,
  };

  return (
    <>
      <PageHeader title="Murojaatlar" subtitle="Talabalar va xodimlar murojaatlari, shikoyat va takliflar"
        actions={<Button variant="primary" size="sm" icon="plus">Yangi murojaat</Button>}
      />

      <KpiRow items={[
        { label: 'Jami', value: APPEALS.length * 8, icon: 'inbox', color: '#3B82F6' },
        { label: 'Yangi', value: counts.new * 8, icon: 'bell', color: '#EF4444' },
        { label: "Ko'rib chiqilmoqda", value: counts.progress * 8, icon: 'clock', color: '#F59E0B' },
        { label: 'Hal qilingan', value: counts.done * 8, icon: 'check', color: '#2DB976' },
      ]} />

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, height: 640 }}>
        <Card padding={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 12, borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Hammasi' },
              { id: 'new', label: 'Yangi', count: counts.new },
              { id: 'progress', label: "Jarayonda", count: counts.progress },
              { id: 'done', label: 'Hal qilingan', count: counts.done },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  border: '1px solid ' + (filter === f.id ? '#2DB976' : '#E2E8F0'),
                  background: filter === f.id ? '#2DB976' : '#fff',
                  color: filter === f.id ? '#fff' : '#475569', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {f.label}{f.count != null ? ` (${f.count})` : ''}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a)}
                style={{
                  width: '100%', padding: 14, borderBottom: '1px solid #F1F5F9',
                  background: selected.id === a.id ? '#F0FDF5' : '#fff',
                  borderLeft: selected.id === a.id ? '3px solid #2DB976' : '3px solid transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'block', fontFamily: 'inherit',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Badge variant={a.cat.variant}>{a.cat.label}</Badge>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{a.subject}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{a.author.full}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card padding={24} style={{ overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Badge variant={selected.cat.variant}>{selected.cat.label}</Badge>
                <span style={{ fontSize: 12, color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>{selected.id}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>{selected.subject}</h2>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>Yuborilgan: {selected.date}</div>
            </div>
            <Badge variant={selected.status === 'Hal qilingan' ? 'success' : selected.status === 'Yangi' ? 'error' : 'warning'} dot>{selected.status}</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20, padding: 16, background: '#F8FAFB', borderRadius: 12 }}>
            <InfoPair2 label="Murojaatchi" value={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar initials={selected.author.initials} size={26} color={selected.author.isFemale ? 'amber' : 'blue'} />
                <span>{selected.author.full}</span>
              </div>
            } />
            <InfoPair2 label="Mas'ul shaxs" value={selected.assignee} />
          </div>

          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>Murojaat matni</div>
            <div style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.65 }}>
              Hurmatli rahbariyat, men sizga "{selected.subject.toLowerCase()}" masalasi bo'yicha murojaat qilmoqdaman.
              Bu masala 2-kursdan boshlab davom etmoqda va ko'plab talabalarni qiziqtirmoqda. Iltimos, ushbu masalani ko'rib chiqing va tegishli choralar ko'rishni so'rab murojaat qilmoqdaman.
              Sizning javobingizni kutaman.
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Javoblar va izohlar</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <Avatar initials="A.K" size={36} color="primary" />
              <div style={{ flex: 1, background: '#F0FDF5', border: '1px solid #BBF7D0', borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selected.assignee}</span>
                  <span style={{ fontSize: 11.5, color: '#94A3B8' }}>2 kun oldin</span>
                </div>
                <div style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.5 }}>Murojaatingiz qabul qilindi. Tegishli bo'lim bilan muhokama qilinmoqda. 5 ish kuni ichida javob beramiz.</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" icon="edit">Javob yozish</Button>
            <Button variant="secondary" size="sm" icon="users">Yo'naltirish</Button>
            <Button variant="secondary" size="sm" icon="check">Hal qilingan deb belgilash</Button>
          </div>
        </Card>
      </div>
    </>
  );
};

// ============================================================
// 5) YANGILIKLAR
// ============================================================
const YangiliklarPage = () => {
  const [view, setView] = React.useState('grid');
  const [tag, setTag] = React.useState('all');
  const tags = ['all', ...Array.from(new Set(NEWS_ITEMS.map(n => n.tag)))];
  const filtered = tag === 'all' ? NEWS_ITEMS : NEWS_ITEMS.filter(n => n.tag === tag);

  return (
    <>
      <PageHeader title="Yangiliklar" subtitle="Universitet hayotidagi muhim voqealar"
        actions={<Button variant="primary" size="sm" icon="plus">Yangilik yozish</Button>}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              border: '1px solid ' + (tag === t ? '#2DB976' : '#E2E8F0'),
              background: tag === t ? '#2DB976' : '#fff',
              color: tag === t ? '#fff' : '#475569', cursor: 'pointer', fontFamily: 'inherit',
            }}>{t === 'all' ? 'Barchasi' : t}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
          {[{ id: 'grid', icon: 'grid' }, { id: 'list', icon: 'inbox' }].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              padding: '6px 10px', borderRadius: 6, border: 'none',
              background: view === v.id ? '#fff' : 'transparent',
              boxShadow: view === v.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569',
            }}><Icon name={v.icon} size={16} /></button>
          ))}
        </div>
      </div>

      {view === 'grid' && (
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map(n => (
            <Card key={n.id} padding={0} style={{ cursor: 'pointer', overflow: 'hidden' }}>
              <div style={{ height: 140, background: `linear-gradient(135deg, ${n.color}, ${n.color}aa)`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.95)', fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{n.tag}</div>
                <div style={{ position: 'absolute', bottom: 12, left: 16, color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em' }}>{n.date}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8, lineHeight: 1.3 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>{n.excerpt}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#94A3B8', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                  <span>{n.author}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="eye" size={12} /> {fmtNum(n.views)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {view === 'list' && (
        <Card padding={0}>
          {filtered.map((n, i) => (
            <div key={n.id} style={{ display: 'flex', gap: 16, padding: 16, borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 120, height: 80, borderRadius: 10, background: `linear-gradient(135deg, ${n.color}, ${n.color}aa)`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 4, alignItems: 'center' }}>
                  <Badge variant="info">{n.tag}</Badge>
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{n.date}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#475569' }}>{n.excerpt}</div>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', alignSelf: 'flex-end', display: 'inline-flex', gap: 4, alignItems: 'center', whiteSpace: 'nowrap' }}>
                <Icon name="eye" size={12} /> {fmtNum(n.views)}
              </div>
            </div>
          ))}
        </Card>
      )}
    </>
  );
};

// ============================================================
// 6) MA'LUMOTNOMALAR
// ============================================================
const MalumotnomalarPage = () => {
  const [active, setActive] = React.useState(null);
  if (active) return <DictionaryDetail dict={active} onBack={() => setActive(null)} />;
  return (
    <>
      <PageHeader title="Ma'lumotnomalar" subtitle="Tizim lug'atlari va klassifikatorlari" />

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {REFERENCE_DICTS.map(d => (
          <button key={d.id} onClick={() => setActive(d)}
            style={{
              background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
              padding: 22, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'transform 100ms ease, box-shadow 150ms ease, border-color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + '60'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: d.color + '18', color: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name={d.icon} size={22} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{d.count} ta yozuv</div>
          </button>
        ))}
      </div>
    </>
  );
};

const DictionaryDetail = ({ dict, onBack }) => {
  const items = (DICT_SAMPLES[dict.id] || []).map((name, i) => ({
    code: `${dict.id.toUpperCase().slice(0, 3)}-${String(100 + i).padStart(3, '0')}`,
    name, active: i !== 4, count: Math.round(rnum(i + 1801, 5, 240)),
  }));
  return (
    <>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <Icon name="arrowLeft" size={14} /> Ma'lumotnomalar
      </button>
      <PageHeader title={dict.name} subtitle="Lug'at yozuvlarini boshqarish"
        actions={<Button variant="primary" size="sm" icon="plus">Yangi yozuv</Button>}
      />
      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Kod</Th><Th>Nomi</Th><Th align="right">Foydalanish</Th><Th>Holat</Th><Th align="right"></Th>
          </tr></thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={i}>
                <Td mono color="#64748B">{r.code}</Td>
                <Td color="#0F172A" weight={500}>{r.name}</Td>
                <Td align="right" mono>{r.count}</Td>
                <Td><Badge variant={r.active ? 'success' : 'neutral'} dot>{r.active ? 'Faol' : "O'chirilgan"}</Badge></Td>
                <Td align="right"><IconButton icon="edit" size={28} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 7) JIHOZLAR
// ============================================================
const JihozlarPage = () => {
  const [tab, setTab] = React.useState('all');
  const stats = {
    all: EQUIPMENT_ITEMS.length * 8,
    working: EQUIPMENT_ITEMS.filter(e => e.status === 'Ishlamoqda').length * 8,
    repair: EQUIPMENT_ITEMS.filter(e => e.status === "Ta'mirda").length * 8,
    decom: EQUIPMENT_ITEMS.filter(e => e.status === 'Hisobdan chiqarilgan').length * 8,
  };
  const totalValue = EQUIPMENT_ITEMS.reduce((s, e) => s + e.value, 0) * 8;
  const filtered = tab === 'all' ? EQUIPMENT_ITEMS : EQUIPMENT_ITEMS.filter(e => {
    if (tab === 'working') return e.status === 'Ishlamoqda';
    if (tab === 'repair') return e.status === "Ta'mirda";
    if (tab === 'decom') return e.status === 'Hisobdan chiqarilgan';
    return true;
  });
  return (
    <>
      <PageHeader title="Jihozlar" subtitle="Asosiy vositalar va texnika"
        actions={<>
          <Button variant="secondary" size="sm" icon="barcode">QR-kod chop etish</Button>
          <Button variant="primary" size="sm" icon="plus">Jihoz qo'shish</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Umumiy qiymat', value: fmtMlrd(totalValue), icon: 'wallet', color: '#2DB976', sub: "so'm" },
        { label: 'Ishlamoqda', value: stats.working, icon: 'check', color: '#3B82F6' },
        { label: "Ta'mirda", value: stats.repair, icon: 'settings', color: '#F59E0B' },
        { label: 'Hisobdan chiq.', value: stats.decom, icon: 'archive', color: '#94A3B8' },
      ]} />

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'all', label: 'Hammasi', count: stats.all },
        { id: 'working', label: 'Ishlamoqda', count: stats.working },
        { id: 'repair', label: "Ta'mirda", count: stats.repair },
        { id: 'decom', label: "Hisobdan chiqarilgan", count: stats.decom },
      ]} />

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Inv №</Th><Th>Nomi</Th><Th>Kategoriya</Th><Th>Joylashuv</Th>
            <Th>Mas'ul</Th><Th align="right">Qiymat</Th><Th>Tekshiruv</Th><Th>Holat</Th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <Td mono color="#64748B">{r.invNum}</Td>
                <Td color="#0F172A" weight={500}>{r.name}</Td>
                <Td>{r.category}</Td>
                <Td>{r.location}</Td>
                <Td color="#64748B">{r.user}</Td>
                <Td align="right" mono>{fmtNum(r.value)}</Td>
                <Td mono color="#64748B">{r.lastCheck}</Td>
                <Td><Badge variant={r.status === 'Ishlamoqda' ? 'success' : r.status === "Ta'mirda" ? 'warning' : 'neutral'} dot>{r.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 8) FANLAR
// ============================================================
const FanlarPage = () => {
  const [q, setQ] = React.useState('');
  const [dept, setDept] = React.useState('Hammasi');
  const filtered = SUBJECTS_LIST.filter(s => {
    if (dept !== 'Hammasi' && s.dept !== dept) return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.code.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totalCredits = SUBJECTS_LIST.reduce((s, x) => s + x.credits, 0);
  return (
    <>
      <PageHeader title="Fanlar" subtitle="O'quv fanlari va dasturlari katalogi"
        actions={<Button variant="primary" size="sm" icon="plus">Fan qo'shish</Button>}
      />

      <KpiRow items={[
        { label: 'Jami fanlar', value: SUBJECTS_LIST.length * 14, icon: 'book', color: '#3B82F6' },
        { label: 'Majburiy', value: SUBJECTS_LIST.filter(s => s.type === 'Majburiy').length * 14, icon: 'check', color: '#2DB976' },
        { label: 'Tanlov', value: SUBJECTS_LIST.filter(s => s.type === 'Tanlov').length * 14, icon: 'star', color: '#8B5CF6' },
        { label: "O'rtacha kredit", value: (totalCredits / SUBJECTS_LIST.length).toFixed(1), icon: 'award', color: '#F59E0B' },
      ]} />

      <Card padding={0}>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Fan nomi yoki kod…" width={280} />
          <ToolbarSelect value={dept} onChange={setDept}>
            <option>Hammasi</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </ToolbarSelect>
        </Toolbar>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>Kod</Th><Th>Fan nomi</Th><Th>Turi</Th>
            <Th align="center">Sem.</Th><Th align="center">Kredit</Th>
            <Th align="center">Lek.</Th><Th align="center">Amaliy</Th>
            <Th align="center">Lab.</Th><Th>Kafedra</Th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <Td mono color="#0F172A" weight={500}>{r.code}</Td>
                <Td color="#0F172A">{r.name}</Td>
                <Td><Badge variant={r.type === 'Majburiy' ? 'info' : 'success'}>{r.type}</Badge></Td>
                <Td align="center" mono>{r.semester}</Td>
                <Td align="center" mono weight={600}>{r.credits}</Td>
                <Td align="center" mono>{r.lec}</Td>
                <Td align="center" mono>{r.prac}</Td>
                <Td align="center" mono color={r.lab ? '#0F172A' : '#CBD5E1'}>{r.lab || '—'}</Td>
                <Td color="#64748B">{r.dept}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 9) BITIRUVCHILAR
// ============================================================
const BitiruvchilarPage = () => {
  const [year, setYear] = React.useState('Hammasi');
  const [empl, setEmpl] = React.useState('Hammasi');
  const filtered = ALUMNI_LIST.filter(a => {
    if (year !== 'Hammasi' && String(a.year) !== year) return false;
    if (empl !== 'Hammasi') {
      if (empl === "Ish bilan ta'minlangan" && !a.employed) return false;
      if (empl === "Ish topilmagan" && a.employed) return false;
    }
    return true;
  });
  const employmentRate = (ALUMNI_LIST.filter(a => a.employed).length / ALUMNI_LIST.length * 100).toFixed(0);
  return (
    <>
      <PageHeader title="Bitiruvchilar" subtitle="Bitiruvchilar bazasi va ish bilan ta'minlanish"
        actions={<>
          <Button variant="secondary" size="sm" icon="mail">So'rovnoma</Button>
          <Button variant="primary" size="sm" icon="download">Eksport</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Jami bitiruvchilar', value: fmtNum(2840), icon: 'graduation', color: '#3B82F6' },
        { label: "Ish bilan ta'minlangan", value: `${employmentRate}%`, delta: 4, icon: 'briefcase', color: '#2DB976' },
        { label: 'Magistraturada', value: 312, icon: 'book', color: '#8B5CF6' },
        { label: 'Xorijda', value: 48, icon: 'flag', color: '#F59E0B' },
      ]} />

      <Card padding={0}>
        <Toolbar>
          <ToolbarSelect value={year} onChange={setYear}>
            <option>Hammasi</option>
            {['2025','2024','2023','2022','2021','2020'].map(y => <option key={y}>{y}</option>)}
          </ToolbarSelect>
          <ToolbarSelect value={empl} onChange={setEmpl}>
            <option>Hammasi</option>
            <option>Ish bilan ta'minlangan</option>
            <option>Ish topilmagan</option>
          </ToolbarSelect>
        </Toolbar>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>F.I.Sh</Th><Th>Yil</Th><Th>Fakultet</Th>
            <Th>Yo'nalish</Th><Th>Ish joyi</Th><Th>Lavozim</Th>
            <Th>Telefon</Th><Th>Holat</Th>
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={r.name.initials} size={28} color={r.name.isFemale ? 'amber' : 'blue'} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{r.name.full}</div>
                      <div style={{ fontSize: 11.5, color: '#94A3B8' }}>GPA {r.gpa}</div>
                    </div>
                  </div>
                </Td>
                <Td mono>{r.year}</Td>
                <Td color="#64748B">{r.faculty}</Td>
                <Td color="#64748B">{r.direction}</Td>
                <Td>{r.employed ? <span style={{ fontWeight: 500, color: '#0F172A' }}>{r.employer}</span> : <span style={{ color: '#CBD5E1' }}>—</span>}</Td>
                <Td>{r.position || <span style={{ color: '#CBD5E1' }}>—</span>}</Td>
                <Td mono color="#64748B">{r.phone}</Td>
                <Td><Badge variant={r.employed ? 'success' : 'warning'} dot>{r.employed ? 'Ishlamoqda' : 'Ish izlamoqda'}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 10) AMALIYOT
// ============================================================
const AmaliyotPage = () => {
  const [tab, setTab] = React.useState('all');
  const filtered = tab === 'all' ? INTERNSHIPS : INTERNSHIPS.filter(i => {
    if (tab === 'active') return i.status === 'Jarayonda';
    if (tab === 'done') return i.status === 'Tugallangan';
    if (tab === 'overdue') return i.status === "Muddati o'tgan";
    if (tab === 'pending') return i.status === 'Boshlanmagan';
    return true;
  });
  const counts = {
    all: INTERNSHIPS.length * 12,
    active: INTERNSHIPS.filter(i => i.status === 'Jarayonda').length * 12,
    done: INTERNSHIPS.filter(i => i.status === 'Tugallangan').length * 12,
    overdue: INTERNSHIPS.filter(i => i.status === "Muddati o'tgan").length * 12,
  };
  return (
    <>
      <PageHeader title="Amaliyot" subtitle="Talabalar amaliyoti va shartnomalari"
        actions={<>
          <Button variant="secondary" size="sm" icon="doc">Shartnoma shabloni</Button>
          <Button variant="primary" size="sm" icon="plus">Yangi amaliyot</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Jami amaliyot', value: counts.all, icon: 'briefcase', color: '#3B82F6' },
        { label: 'Jarayonda', value: counts.active, icon: 'clock', color: '#2DB976' },
        { label: 'Tugallangan', value: counts.done, icon: 'check', color: '#8B5CF6' },
        { label: "Muddati o'tgan", value: counts.overdue, icon: 'warning', color: '#EF4444' },
      ]} />

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'all', label: 'Hammasi', count: counts.all },
        { id: 'active', label: 'Jarayonda', count: counts.active },
        { id: 'done', label: 'Tugallangan', count: counts.done },
        { id: 'overdue', label: "Muddati o'tgan", count: counts.overdue },
      ]} />

      <Card padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <Th>ID</Th><Th>Talaba</Th><Th>Turi</Th><Th>Tashkilot</Th>
            <Th>Davr</Th><Th>Ichki rahbar</Th><Th>Tashqi rahbar</Th>
            <Th align="center">Baho</Th><Th>Holat</Th>
          </tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <Td mono color="#64748B">{r.id}</Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={r.student.name.initials} size={28} color={r.student.name.isFemale ? 'amber' : 'blue'} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{r.student.name.full}</div>
                      <div style={{ fontSize: 11.5, color: '#94A3B8' }}>{r.student.group}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge variant="info">{r.type}</Badge></Td>
                <Td color="#0F172A" weight={500}>{r.organization}</Td>
                <Td mono color="#64748B">{r.start} — {r.end}</Td>
                <Td color="#64748B">{r.internalSup}</Td>
                <Td color="#64748B">{r.externalSup}</Td>
                <Td align="center" mono weight={600} color={r.grade ? (r.grade >= 85 ? '#1B7A4E' : r.grade >= 70 ? '#B45309' : '#B91C1C') : '#CBD5E1'}>{r.grade || '—'}</Td>
                <Td><Badge variant={r.status === 'Tugallangan' ? 'success' : r.status === 'Jarayonda' ? 'info' : r.status === "Muddati o'tgan" ? 'error' : 'neutral'} dot>{r.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// ============================================================
// 11) BYUDJET
// ============================================================
const ByudjetPage = () => {
  const [tab, setTab] = React.useState('overview');
  const articles = [
    { name: "Maosh fondi", planned: 14800000000, fact: 12480000000, color: '#3B82F6' },
    { name: "Inshootlarni saqlash", planned: 1850000000, fact: 1240000000, color: '#2DB976' },
    { name: "Kommunal xizmatlar", planned: 980000000, fact: 720000000, color: '#F59E0B' },
    { name: "O'quv jihozlari", planned: 720000000, fact: 480000000, color: '#8B5CF6' },
    { name: "Stipendiyalar", planned: 2400000000, fact: 1800000000, color: '#06B6D4' },
    { name: "Komandirovkalar", planned: 280000000, fact: 145000000, color: '#EC4899' },
    { name: "Xo'jalik xarajatlari", planned: 420000000, fact: 290000000, color: '#10B981' },
    { name: "Boshqa xarajatlar", planned: 350000000, fact: 180000000, color: '#94A3B8' },
  ];
  const totalPlan = articles.reduce((s, a) => s + a.planned, 0);
  const totalFact = articles.reduce((s, a) => s + a.fact, 0);
  const execution = (totalFact / totalPlan * 100).toFixed(1);

  return (
    <>
      <PageHeader title="Byudjet" subtitle="Daromad va xarajatlar rejasi va ijrosi · 2026"
        actions={<>
          <Button variant="secondary" size="sm" icon="download">Hisobot</Button>
          <Button variant="primary" size="sm" icon="plus">Xarajat hujjati</Button>
        </>}
      />

      <KpiRow items={[
        { label: 'Yillik reja', value: fmtMlrd(totalPlan), icon: 'target', color: '#3B82F6', sub: "so'm" },
        { label: 'Bajarilgan', value: fmtMlrd(totalFact), icon: 'check', color: '#2DB976', sub: "so'm · April" },
        { label: 'Ijro foizi', value: `${execution}%`, delta: 2, icon: 'trendUp', color: '#8B5CF6' },
        { label: 'Qoldiq', value: fmtMlrd(totalPlan - totalFact), icon: 'wallet', color: '#F59E0B', sub: "so'm" },
      ]} />

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'overview', label: "Umumiy ko'rinish" },
        { id: 'articles', label: 'Xarajat moddalari' },
        { id: 'transactions', label: 'Operatsiyalar' },
      ]} />

      {tab === 'overview' && (
        <div className="grid-2-asym" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
          <Card hover padding={20}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Reja taqsimoti</h3>
            <DonutChart segments={articles.map(a => ({ label: a.name, value: a.planned, color: a.color }))} centerValue={fmtMlrd(totalPlan)} centerLabel="Reja" size={200} />
          </Card>
          <Card hover padding={20}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Reja vs Fakt (mlrd so'm)</h3>
            <BudgetBars data={articles} />
          </Card>
        </div>
      )}

      {tab === 'articles' && (
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <Th>Modda</Th><Th align="right">Reja</Th>
              <Th align="right">Fakt</Th><Th align="right">Qoldiq</Th>
              <Th align="center">Ijro</Th><Th>Progress</Th>
            </tr></thead>
            <tbody>
              {articles.map((r, i) => {
                const p = (r.fact / r.planned * 100);
                return (
                  <tr key={i}>
                    <Td color="#0F172A" weight={500}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: r.color }} />
                        {r.name}
                      </span>
                    </Td>
                    <Td align="right" mono>{fmtNum(r.planned)}</Td>
                    <Td align="right" mono weight={600} color="#0F172A">{fmtNum(r.fact)}</Td>
                    <Td align="right" mono color="#1B7A4E">{fmtNum(r.planned - r.fact)}</Td>
                    <Td align="center"><Badge variant={p >= 90 ? 'error' : p >= 75 ? 'warning' : 'success'}>{p.toFixed(0)}%</Badge></Td>
                    <Td>
                      <div style={{ width: 160, height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(p, 100)}%`, height: '100%', background: r.color }} />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'transactions' && <BudgetTransactions />}
    </>
  );
};

const BudgetBars = ({ data }) => {
  const max = Math.max(...data.flatMap(d => [d.planned, d.fact]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: '#475569' }}>{d.name}</span>
            <span style={{ color: '#94A3B8', fontVariantNumeric: 'tabular-nums' }}>
              <strong style={{ color: '#0F172A' }}>{(d.fact / 1e9).toFixed(2)}</strong> / {(d.planned / 1e9).toFixed(2)}
            </span>
          </div>
          <div style={{ position: 'relative', height: 14, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${d.planned / max * 100}%`, background: '#E2E8F0' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${d.fact / max * 100}%`, background: d.color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const BudgetTransactions = () => {
  const txs = Array.from({ length: 14 }, (_, i) => {
    const t = i % 4 === 0 ? 'Daromad' : 'Xarajat';
    return {
      doc: `${t === 'Daromad' ? 'DAR' : 'XAR'}-${String(900 + i).padStart(4, '0')}`,
      date: `${(rnum(i + 1901, 1, 28) | 0).toString().padStart(2, '0')}.04.2026`,
      type: t,
      article: t === 'Daromad' ? pick(['Kontrakt to\'lovi', 'Granti', 'Xizmat'], i + 1903) : pick(['Maosh', 'Kommunal', 'Sotib olish', 'Stipendiya', 'Komandirovka'], i + 1905),
      sum: Math.round(rnum(i + 1907, 5, 280)) * 1000000,
      counterparty: t === 'Daromad' ? STUDENTS[i].name.short : pick(['"Asaxiy"', '"Hududgaz"', '"Suvtaminot"', 'Xodim', 'Talaba'], i + 1909),
      status: i < 11 ? 'Tasdiqlangan' : 'Kutilmoqda',
    };
  });
  return (
    <Card padding={0}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <Th>Hujjat №</Th><Th>Sana</Th><Th>Turi</Th><Th>Modda</Th>
          <Th align="right">Summa</Th><Th>Kontragent</Th><Th>Holat</Th>
        </tr></thead>
        <tbody>
          {txs.map(r => (
            <tr key={r.doc}>
              <Td mono color="#0F172A" weight={500}>{r.doc}</Td>
              <Td mono color="#64748B">{r.date}</Td>
              <Td><Badge variant={r.type === 'Daromad' ? 'success' : 'warning'}>{r.type}</Badge></Td>
              <Td>{r.article}</Td>
              <Td align="right" mono weight={700} color={r.type === 'Daromad' ? '#1B7A4E' : '#0F172A'}>
                {r.type === 'Daromad' ? '+' : '−'}{fmtNum(r.sum)}
              </Td>
              <Td color="#64748B">{r.counterparty}</Td>
              <Td><Badge variant={r.status === 'Tasdiqlangan' ? 'success' : 'warning'} dot>{r.status}</Badge></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

// expose
Object.assign(window, {
  OmborPage, MaoshPage, QarzdorlarPage, MurojaatlarPage,
  YangiliklarPage, MalumotnomalarPage, JihozlarPage,
  FanlarPage, BitiruvchilarPage, AmaliyotPage, ByudjetPage,
});
