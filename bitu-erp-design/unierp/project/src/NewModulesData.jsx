// WarehouseModule.jsx — Ombor (Warehouse), Maosh (Payroll), Qarzdorlar, Murojaatlar, Yangiliklar, Ma'lumotnomalar, Jihozlar, Fanlar, Bitiruvchilar, Amaliyot, Byudjet

const fmt = (n) => Number(n).toLocaleString('ru-RU');
const fmtSum = (n) => fmt(Math.round(n)) + " so'm";

// ============ DATA ============
const WAREHOUSE_CATEGORIES = ["O'quv jihozlari", "Xo'jalik mollari", 'IT texnika', 'Mebel', 'Ish kiyimlari', 'Oziq-ovqat'];
const WAREHOUSE_LOCATIONS = ['Asosiy ombor', 'IT ombor', 'Mebel ombor', 'Xo\'jalik bo\'limi'];
const WAREHOUSE_ITEMS_NAMES = [
  ['Printer kartridji HP 107a', 'IT texnika', 'dona', 145000],
  ['Doska marker (ko\'k)', "O'quv jihozlari", 'dona', 8500],
  ['A4 qog\'oz (500 varaq)', "O'quv jihozlari", 'paket', 65000],
  ['Proyektor lampa OEM', 'IT texnika', 'dona', 380000],
  ['Laboratoriya shisha idish 500ml', "O'quv jihozlari", 'dona', 32000],
  ['Kompyuter sichqoncha Logitech', 'IT texnika', 'dona', 95000],
  ['Stol (o\'quv)', 'Mebel', 'dona', 850000],
  ['Stul (yumshoq)', 'Mebel', 'dona', 420000],
  ['Tozalovchi suyuqlik (5L)', "Xo'jalik mollari", 'litr', 45000],
  ['Tualet qog\'ozi (24 rulon)', "Xo'jalik mollari", 'paket', 78000],
  ['Halat (o\'lcham M)', 'Ish kiyimlari', 'dona', 125000],
  ['Klaviatura A4Tech', 'IT texnika', 'dona', 165000],
];
const WAREHOUSE_ITEMS = WAREHOUSE_ITEMS_NAMES.map((row, i) => {
  const [name, cat, unit, price] = row;
  const stock = rnum(i + 701, 0, 320);
  const min = rnum(i + 703, 5, 30);
  const status = stock === 0 ? 'Tugagan' : stock < min ? 'Kam' : 'Yetarli';
  return {
    id: `INV-${String(1000 + i).padStart(4, '0')}`,
    sku: `SKU-${String(2000 + i * 17).padStart(5, '0')}`,
    name, category: cat, unit, price,
    stock, minStock: min, status,
    location: pick(WAREHOUSE_LOCATIONS, i + 705),
    lastIn: `${rnum(i + 707, 1, 25)}.04.2026`,
  };
});

// Payroll
const PAYROLL_DATA = Array.from({ length: 12 }, (_, i) => {
  const n = fullName(i + 801, 0.4);
  const dept = pick(DEPARTMENTS, i + 803);
  const positions = ['Professor', 'Dotsent', "Katta o'qituvchi", "O'qituvchi", 'Laborant', 'Mutaxassis'];
  const position = pick(positions, i + 805);
  const rate = position === 'Professor' ? 12500000 : position === 'Dotsent' ? 9800000 : position === "Katta o'qituvchi" ? 7600000 : position === "O'qituvchi" ? 5800000 : position === 'Laborant' ? 3800000 : 4500000;
  const hours = rnum(i + 807, 140, 184);
  const bonus = rnum(i + 809, 200000, 1500000);
  const deductions = Math.round(rate * 0.12) + rnum(i + 811, 50000, 200000);
  const net = rate + bonus - deductions;
  const status = i < 9 ? 'Hisoblangan' : i < 11 ? 'Kutilmoqda' : "To'langan";
  return {
    id: `PAY-${String(900 + i).padStart(4, '0')}`,
    name: n, dept, position, rate, hours, bonus, deductions, net, status,
  };
});

// Debtors
const DEBTORS = Array.from({ length: 12 }, (_, i) => {
  const s = STUDENTS[i + 4];
  const total = [10500000, 12500000, 14000000, 9800000, 16500000][rnum(i + 901, 0, 4)];
  const paid = Math.round(total * (0.1 + seed(i + 902) * 0.7));
  const balance = total - paid;
  const overdueDays = rnum(i + 903, 5, 180);
  return {
    id: `DBT-${String(2000 + i).padStart(4, '0')}`,
    student: s, total, paid, balance,
    deadline: `${rnum(i + 904, 1, 28)}.${String(rnum(i + 905, 1, 4)).padStart(2, '0')}.2026`,
    overdueDays,
    bucket: overdueDays < 30 ? '0-30' : overdueDays < 60 ? '30-60' : overdueDays < 90 ? '60-90' : '90+',
  };
});

// Appeals
const APPEALS_CATS = [
  { id: 'shikoyat', label: 'Shikoyat', variant: 'error' },
  { id: 'taklif', label: 'Taklif', variant: 'info' },
  { id: 'savol', label: 'Savol', variant: 'success' },
  { id: 'ariza', label: 'Ariza', variant: 'warning' },
];
const APPEALS = Array.from({ length: 12 }, (_, i) => {
  const subjects = [
    "Auditoriya iliqligi haqida", "Wi-Fi sifatini yaxshilash", "Stipendiya muddati",
    "Imtihon natijasi haqida", "TTJ xonasi xizmati", "Kutubxona soatlari",
    "O'qituvchi munosabati", "Buffet narxlari", "Onlayn dars sifati",
    "Diplom mavzusi tasdiqlash", "Akademik ta'til ariza", "Ko'chirish ariza",
  ];
  const cat = pick(APPEALS_CATS, i + 1001);
  const statuses = ['Yangi', "Ko'rib chiqilmoqda", 'Hal qilingan'];
  const status = i < 3 ? 'Yangi' : i < 8 ? "Ko'rib chiqilmoqda" : 'Hal qilingan';
  return {
    id: `MUR-${String(3000 + i).padStart(5, '0')}`,
    subject: subjects[i],
    cat, status,
    author: fullName(i + 1003, 0.5),
    assignee: fullName(i + 1005, 0.4).short,
    date: `${rnum(i + 1007, 1, 25)}.04.2026`,
  };
});

// News
const NEWS_ITEMS = Array.from({ length: 9 }, (_, i) => {
  const titles = [
    'Yangi laboratoriya ochildi: AI Lab',
    "O'quv yili 2026-2027 boshlanish sanasi",
    'Xalqaro hamkorlik shartnomasi',
    'Qabul komissiyasi natijalari',
    'Talabalar olimpiadasi g\'oliblari',
    "Yangi kafedra: Robototexnika",
    'Stipendiyalar yangi tartibi',
    "Ilmiy konferensiya — Mart 2026",
    "Bahor rejasi: ekologik aksiyalar",
  ];
  const excerpts = [
    "Sun'iy intellekt sohasidagi izlanishlar uchun zamonaviy laboratoriya ochildi. 24 ta ish o'rni mavjud.",
    "Yangi o'quv yili 2-sentabrda boshlanishi rejalashtirilgan. Talabalar ro'yxatdan o'tishi 25-avgustdan.",
    "Germaniya universitetlari bilan akademik almashinuv dasturi bo'yicha shartnoma imzolandi.",
    "Bu yilgi qabul komissiyasi 1247 ta yangi talabani qabul qildi. O'tgan yilga nisbatan 12% oshish.",
    "Matematika, IT va Iqtisodiyot yo'nalishlari bo'yicha respublika olimpiadasida 8 ta sovrin.",
    "Sentabrdan boshlab Robototexnika kafedrasi yangi yo'nalishni qabul qiladi.",
    "Yuqori GPA (3.5+) talabalar uchun stipendiya summasi 30% oshirildi.",
    "12-13 mart kunlari xalqaro ilmiy konferensiya bo'lib o'tadi. 18 mamlakat ishtirokchilari.",
    "April oyida atrof-muhitni muhofaza qilish bo'yicha bir qator tadbirlar rejalashtirildi.",
  ];
  return {
    id: i + 1,
    title: titles[i],
    excerpt: excerpts[i],
    date: `${rnum(i + 1100, 1, 25)}.04.2026`,
    author: fullName(i + 1101, 0.4).short,
    views: rnum(i + 1103, 80, 2400),
    color: pick(['#2DB976', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'], i),
    tag: pick(['Universitet', 'Akademik', 'Ilm-fan', 'Talabalar', 'Hamkorlik'], i + 1105),
  };
});

// Reference dictionaries
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

// Equipment
const EQUIPMENT_ITEMS = Array.from({ length: 12 }, (_, i) => {
  const names = [
    'Dell OptiPlex 7090', 'HP LaserJet Pro M404', 'Acer Projector P5530',
    'O\'quv stoli (1.4m)', 'Yumshoq stul (qora)', 'Microscope BX53',
    'Doska (yashil 2x1m)', 'Klimat-kontrol Samsung', 'Lab spektrometr',
    'Server Dell PowerEdge', 'Kondensator yig\'masi', 'Qog\'oz kesgich',
  ];
  const cats = ['IT', 'Laboratoriya', 'Mebel', 'IT', 'Mebel', 'Laboratoriya', 'Mebel', 'Boshqa', 'Laboratoriya', 'IT', 'Laboratoriya', 'Boshqa'];
  const stat = i === 2 || i === 7 ? "Ta'mirda" : i === 11 ? 'Hisobdan chiqarilgan' : 'Ishlamoqda';
  return {
    id: `EQ-${String(5000 + i).padStart(5, '0')}`,
    invNum: `INV/${2024}/${String(100 + i * 17).padStart(4, '0')}`,
    name: names[i], category: cats[i],
    location: pick(['IT bo\'limi', 'Auditoriya 312', 'Lab-7', 'Dekanat', 'Kutubxona'], i + 1201),
    value: [3500000, 8500000, 12000000, 850000, 420000, 24000000, 1800000, 4200000, 38000000, 65000000, 5400000, 2200000][i],
    user: fullName(i + 1203, 0.4).short,
    status: stat,
    lastCheck: `${rnum(i + 1205, 1, 28)}.${String(rnum(i + 1206, 1, 4)).padStart(2, '0')}.2026`,
  };
});

// Subjects
const SUBJECTS_LIST = Array.from({ length: 12 }, (_, i) => {
  const names = [
    'Oliy matematika', 'Algoritmlar va ma\'lumotlar tuzilmasi', 'Veb-dasturlash',
    'Iqtisodiy nazariya', 'Strategik menejment', 'Marketing asoslari',
    'Pedagogika asoslari', 'Psixologiya', 'Tog\'-kon mashinalari',
    'Elektr energetikasi', 'O\'zbek mumtoz adabiyoti', 'Ingliz tili (B2)',
  ];
  const codes = ['MAT-101', 'IT-204', 'IT-308', 'EC-101', 'MG-302', 'MG-201', 'PD-101', 'PD-205', 'TK-301', 'EN-201', 'FL-401', 'LN-201'];
  const types = i % 3 === 0 ? 'Tanlov' : 'Majburiy';
  const credits = rnum(i + 1301, 3, 8);
  const lec = rnum(i + 1303, 16, 40);
  const prac = rnum(i + 1305, 16, 32);
  const lab = i % 4 === 0 ? rnum(i + 1307, 8, 24) : 0;
  return {
    id: i + 1, code: codes[i], name: names[i], type: types,
    credits, lec, prac, lab,
    dept: pick(DEPARTMENTS, i + 1309),
    semester: rnum(i + 1311, 1, 8),
  };
});

// Alumni
const ALUMNI_LIST = Array.from({ length: 12 }, (_, i) => {
  const n = fullName(i + 1401, 0.5);
  const employers = ['EPAM Uzbekistan', 'Beeline UZ', 'Uzpromstroybank', 'Navoiy MMC', 'Artel Electronics', 'IT Park', 'Universitet (PhD)', 'Xorijda (Germaniya)', "Toshkent shahar hokimligi", 'TBC Bank', 'O\'zbekiston Aviasozlari', 'Xususiy biznes'];
  const positions = ['Senior Developer', 'Marketing menejer', 'Bosh hisobchi', 'Bosh injener', 'QA Lead', 'Junior Dev', 'Tadqiqotchi', 'Software Engineer', 'Bo\'lim boshlig\'i', 'Bank operatori', 'Texnolog', 'Rahbar'];
  const employed = i !== 7 && i !== 11;
  return {
    id: i + 1, name: n,
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

// Internships
const INTERNSHIPS = Array.from({ length: 12 }, (_, i) => {
  const types = ['Ishlab chiqarish', 'Pedagogik', 'Klinik'];
  const statuses = ['Jarayonda', 'Tugallangan', 'Boshlanmagan', "Muddati o'tgan"];
  const orgs = ['Navoiy MMC', "EPAM Uzbekistan", "Maktab №16", "Tibbiyot markazi", "IT Park", "Beeline UZ", "Pedagogika ITI", "Buxoro IT", "Texnopark", "O'zbekiston Bank", "Klinika 'Nur'", "Uzpromstroybank"];
  const status = i < 4 ? 'Jarayonda' : i < 8 ? 'Tugallangan' : i === 11 ? "Muddati o'tgan" : 'Boshlanmagan';
  const grade = status === 'Tugallangan' ? rnum(i + 1503, 70, 95) : null;
  return {
    id: `AML-${String(4000 + i).padStart(5, '0')}`,
    student: STUDENTS[i],
    type: pick(types, i + 1501),
    organization: orgs[i],
    internalSup: fullName(i + 1505, 0.4).short,
    externalSup: fullName(i + 1507, 0.5).short,
    start: `${rnum(i + 1509, 1, 25)}.02.2026`,
    end: `${rnum(i + 1511, 1, 25)}.05.2026`,
    grade, status,
  };
});

Object.assign(window, {
  WAREHOUSE_ITEMS, WAREHOUSE_CATEGORIES, WAREHOUSE_LOCATIONS,
  PAYROLL_DATA, DEBTORS, APPEALS, APPEALS_CATS, NEWS_ITEMS,
  REFERENCE_DICTS, EQUIPMENT_ITEMS, SUBJECTS_LIST, ALUMNI_LIST, INTERNSHIPS,
  fmt, fmtSum,
});
