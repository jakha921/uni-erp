// data.jsx — shared realistic Uzbek / UniERP (Navoiy) data

const UZ_MALE_NAMES = ['Jasur', 'Aziz', 'Bekzod', 'Sardor', 'Otabek', 'Davron', 'Rustam', 'Sherzod', 'Kamoliddin', 'Akmal', 'Javohir', 'Nodir', 'Bobur', 'Oybek', 'Shavkat', 'Dilshod'];
const UZ_FEMALE_NAMES = ['Nilufar', 'Malika', 'Dilnoza', 'Shahnoza', 'Mohira', 'Zarina', 'Gulnora', 'Madina', 'Feruza', 'Sevinch', 'Muhayyo', 'Kamola', 'Nozima', 'Laylo', 'Sanobar', 'Shaxlo'];
const UZ_SURNAMES = ['Aliyev', 'Karimov', 'Yusupov', 'Rahimov', 'Nazarov', 'Tursunov', 'Shodiyev', 'Mirzayev', 'Xolmatov', 'Saidov', 'Ergashev', 'Jalilov', 'Hasanov', 'Qodirov', 'Ismoilov', 'Usmonov'];
const UZ_PATRONYMICS = ['Kamoliddinovich', 'Bahodirovich', 'Rashidovich', 'Sobirovich', 'Mahmudovich', 'Abdullayevich', 'Nematovich', 'Shokirovich'];

const FACULTIES = [
  'Iqtisodiyot va menejment',
  'Axborot texnologiyalari',
  'Tog\'-kon ishi',
  'Energetika',
  'Filologiya',
  'Pedagogika',
  'Qurilish va arxitektura',
  'Ekologiya va tabiiy fanlar',
];

const DEPARTMENTS = [
  'Dasturiy injiniring kafedrasi',
  'Axborot tizimlari kafedrasi',
  'Iqtisodiyot nazariyasi kafedrasi',
  'Menejment kafedrasi',
  'Tog\'-kon texnologiyalari kafedrasi',
  'Energetika kafedrasi',
  'O\'zbek tili va adabiyoti kafedrasi',
  'Pedagogika va psixologiya kafedrasi',
];

const SUBJECTS = ['Matematika', 'Algoritmlar', 'Ma\'lumotlar bazalari', 'Iqtisodiyot asoslari', 'Menejment', 'Marketing', 'Veb-dasturlash', 'Mashina o\'rganish', 'Pedagogika', 'Psixologiya'];

const DIRECTIONS = ['Axborot texnologiyalari', 'Iqtisodiyot', 'Menejment', 'Pedagogika', 'Tog\'-kon ishi'];

function seed(i) { return (i * 2654435761 % 2**32) / 2**32; }
function pick(arr, i) { return arr[Math.floor(seed(i) * arr.length)]; }
function rnum(i, min, max) { return Math.floor(seed(i) * (max - min + 1)) + min; }

function fullName(i, femaleChance = 0.5) {
  const isFemale = seed(i * 3) < femaleChance;
  const first = isFemale ? pick(UZ_FEMALE_NAMES, i) : pick(UZ_MALE_NAMES, i * 2);
  const last = pick(UZ_SURNAMES, i * 7);
  const patr = pick(UZ_PATRONYMICS, i * 11);
  const suffix = isFemale ? 'ova' : 'ov';
  const surname = last.endsWith('v') ? last : last + suffix;
  return { full: `${surname} ${first} ${patr}`, short: `${surname} ${first[0]}.`, first, last: surname, isFemale, initials: (surname[0] + first[0]).toUpperCase() };
}

function phone(i) {
  const codes = ['90', '91', '93', '94', '97', '99'];
  const c = pick(codes, i);
  const n = String(rnum(i * 13, 1000000, 9999999));
  return `+998 ${c} ${n.slice(0,3)}-${n.slice(3,5)}-${n.slice(5,7)}`;
}

// Students
const STUDENTS = Array.from({ length: 28 }, (_, i) => {
  const n = fullName(i + 1, 0.55);
  const faculty = pick(FACULTIES, i + 2);
  const direction = pick(DIRECTIONS, i + 5);
  const course = rnum(i + 3, 1, 6);
  const groupNum = rnum(i + 7, 101, 605);
  const groupLetter = ['A','B','V','G'][rnum(i+9, 0, 3)];
  const eduForm = seed(i+11) < 0.67 ? 'Kunduzgi' : 'Sirtqi';
  const status = seed(i+13) < 0.92 ? 'Faol' : seed(i+14) < 0.5 ? 'Akademik ta\'til' : 'Chetlashtirilgan';
  const gpa = (2.5 + seed(i+17) * 1.5).toFixed(2);
  return {
    id: `STU-2024-${String(847 + i).padStart(4, '0')}`,
    name: n,
    faculty,
    direction,
    group: `${groupNum}-${groupLetter}`,
    course,
    eduForm,
    status,
    gpa,
    phone: phone(i + 19),
    email: `${n.last.toLowerCase()}.${n.first[0].toLowerCase()}@uni.uz`,
    birthDate: `${rnum(i+21,1,28)}.${String(rnum(i+22,1,12)).padStart(2,'0')}.${2003 + rnum(i+23, 0, 4)}`,
    region: pick(['Navoiy','Samarqand','Buxoro','Qashqadaryo','Xorazm','Toshkent'], i+25),
  };
});

// Teachers
const TEACHERS = Array.from({ length: 22 }, (_, i) => {
  const n = fullName(i + 101, 0.35);
  const degree = seed(i+103) < 0.36 ? 'PhD' : seed(i+104) < 0.5 ? 'DSc' : '—';
  const title = seed(i+105) < 0.23 ? 'Dotsent' : seed(i+106) < 0.15 ? 'Professor' : seed(i+107) < 0.5 ? 'Katta o\'qituvchi' : 'O\'qituvchi';
  const mode = seed(i+109) < 0.7 ? 'Shtatli' : 'Soatbay';
  return {
    id: i + 1,
    name: n,
    dept: pick(DEPARTMENTS, i + 111),
    degree, title, mode,
    phone: phone(i + 113),
    email: `${n.last.toLowerCase()}.${n.first[0].toLowerCase()}@uni.uz`,
    experience: rnum(i+117, 2, 28),
    hours: rnum(i+119, 180, 480),
  };
});

// CRM leads
const CRM_STATUSES = ['Yangi', 'Qo\'ng\'iroq', 'Kutilmoqda', 'Qabul', 'Rad'];
const CRM_SOURCES = ['Website', 'Telegram', 'Instagram', 'Referral'];
const LEADS = Array.from({ length: 18 }, (_, i) => {
  const n = fullName(i + 201, 0.48);
  return {
    id: i + 1,
    name: n,
    phone: phone(i + 203),
    direction: pick(DIRECTIONS, i + 205),
    source: pick(CRM_SOURCES, i + 207),
    status: pick(CRM_STATUSES, i + 209),
    assignee: pick(['Olimov B.', 'Nazarova M.', 'Saidov R.', 'Xolmatova D.'], i + 211),
    date: `${rnum(i+213, 1, 23)}.04.2026`,
  };
});

// Contracts
const CONTRACTS = Array.from({ length: 12 }, (_, i) => {
  const s = STUDENTS[i];
  const total = [10500000, 12500000, 14000000, 16500000, 9800000][rnum(i+301, 0, 4)];
  const paidRatio = [1, 1, 0.65, 0.5, 1, 0.4, 0.8, 1, 0.3, 0.75, 1, 0.5][i];
  const paid = Math.round(total * paidRatio);
  const type = seed(i+303) < 0.15 ? 'Davlat grant' : seed(i+304) < 0.1 ? 'Xorijiy' : 'To\'lov-kontrakt';
  return {
    id: `KNT-2024-${String(847 + i).padStart(4, '0')}`,
    student: s,
    type, total, paid,
    balance: total - paid,
    deadline: `${rnum(i+305, 1, 28)}.05.2026`,
    status: paidRatio === 1 ? 'To\'langan' : paidRatio < 0.5 ? 'Qarzdor' : 'Qisman',
    overdue: paidRatio < 0.5,
  };
});

// Tasks
const TASKS = Array.from({ length: 14 }, (_, i) => {
  const titles = [
    'Oylik buxgalteriya hisobotini tayyorlash',
    'Talabalar kontrakt sverkasi',
    'Kafedra yig\'ilishini o\'tkazish',
    'Olimpiada ishtirokchilari ro\'yxati',
    'TTJ 3-bino ta\'mirlash rejasi',
    'Yangi o\'qituvchilar intervyusi',
    'Dars jadvalini yangilash — 2-semester',
    'Kutubxona inventarizatsiyasi',
    'Xorijiy talabalar hujjatlari',
    'Konferensiya uchun taklifnomalar',
    'Stipendiya ro\'yxati tekshirish',
    'Navoiy filiali shartnomalari',
    'Laboratoriya jihozlari buyurtmasi',
    'O\'qituvchi baholash natijalari',
  ];
  const priorities = ['Yuqori', 'O\'rta', 'Past'];
  const statuses = ['Yangi', 'Jarayonda', 'Bajarildi', 'Muddati o\'tgan'];
  return {
    id: i + 1,
    title: titles[i],
    priority: pick(priorities, i + 401),
    assigner: fullName(i + 403, 0.4).short,
    assignee: fullName(i + 405, 0.5).short,
    deadline: `${rnum(i+407, 20, 30)}.04.2026`,
    status: pick(statuses, i + 409),
    created: `${rnum(i+411, 1, 18)}.04.2026`,
  };
});

// ============== ROLES, MODULES, PERMISSIONS ==============

const MODULE_GROUPS = [
  {
    label: 'Akademik',
    modules: [
      { id: 'students', name: 'Talabalar', desc: 'Talabalar ro\'yxati, profillari, kontingent' },
      { id: 'teachers', name: 'O\'qituvchilar', desc: 'PPS, yuk, ish jadvali' },
      { id: 'attendance', name: 'Davomat', desc: 'Davomat jurnali, kelmagan kunlar' },
      { id: 'grading', name: 'Baholash', desc: 'Joriy/oraliq/yakuniy baholar' },
      { id: 'schedule', name: 'Dars jadvali', desc: 'Auditoriyalar, vaqtlar, jadvalni tahrir' },
      { id: 'curriculum', name: 'O\'quv rejalar', desc: 'Yo\'nalishlar, fanlar, kreditlar' },
      { id: 'exams', name: 'Imtihonlar', desc: 'Sessiya, biletlar, baholash protokollari' },
      { id: 'theses', name: 'Diplom ishlari', desc: 'BMI rahbarligi, himoya, baholash' },
    ],
  },
  {
    label: 'Moliya',
    modules: [
      { id: 'contracts', name: 'Kontraktlar', desc: 'To\'lov-kontrakt, qarzlar' },
      { id: 'scholarship', name: 'Stipendiya', desc: 'Stipendiya tayinlash, hisob-kitob' },
      { id: 'payroll', name: 'Oylik maoshlar', desc: 'Xodimlar maosh hisob-kitobi' },
      { id: 'budget', name: 'Byudjet', desc: 'Universitet moliyaviy ko\'rsatkichlari' },
    ],
  },
  {
    label: 'Operatsion',
    modules: [
      { id: 'crm', name: 'CRM', desc: 'Abituriyent arizalari, voronka' },
      { id: 'hr', name: 'HR', desc: 'Xodimlar, ta\'tillar, malaka oshirish' },
      { id: 'orders', name: 'Buyruqlar', desc: 'Rektor buyruqlari, prikazlar' },
      { id: 'dms', name: 'Hujjat aylanishi', desc: 'Kiruvchi/chiquvchi hujjatlar' },
      { id: 'dormitory', name: 'TTJ', desc: 'Yotoqxona joylari, arizalar' },
      { id: 'library', name: 'Kutubxona', desc: 'Kitoblar, qarzlar' },
    ],
  },
  {
    label: 'Tizim',
    modules: [
      { id: 'users', name: 'Foydalanuvchilar', desc: 'User CRUD, parol reset, 2FA' },
      { id: 'roles', name: 'Rollar', desc: 'Rol va ruxsatlarni boshqarish' },
      { id: 'audit', name: 'Audit log', desc: 'Tizimdagi barcha o\'zgarishlar tarixi' },
      { id: 'settings', name: 'Sozlamalar', desc: 'Universitet sozlamalari, integratsiyalar' },
      { id: 'analytics', name: 'Analytics', desc: 'Boshqaruv hisobotlari, KPI' },
    ],
  },
];

const ALL_MODULES = MODULE_GROUPS.flatMap(g => g.modules);

// Permission verbs
const PERM_VERBS = [
  { id: 'view', label: 'Ko\'rish', short: 'V', color: '#64748B' },
  { id: 'edit', label: 'Tahrir', short: 'E', color: '#3B82F6' },
  { id: 'create', label: 'Yaratish', short: 'C', color: '#2DB976' },
  { id: 'delete', label: 'O\'chirish', short: 'D', color: '#EF4444' },
  { id: 'approve', label: 'Tasdiqlash', short: 'A', color: '#8B5CF6' },
  { id: 'export', label: 'Eksport', short: 'X', color: '#F59E0B' },
];

// Roles — 7 system + 2 custom
const ROLES = [
  {
    id: 'super-admin', name: 'Super Admin', color: '#EF4444', system: true, level: 100,
    desc: 'Tizimning to\'liq nazorati. Faqat IT-direktor.', users: 2,
    icon: 'shield',
    grants: '*', // all-access
  },
  {
    id: 'rector', name: 'Rektor', color: '#8B5CF6', system: true, level: 90,
    desc: 'Universitet rahbari. Strategik nazorat va tasdiqlash.', users: 1,
    icon: 'crown',
    grants: { all: ['view','export','approve'], orders: ['view','create','edit','approve'], users: ['view'], roles: ['view'], settings: ['view','edit'], audit: ['view'] },
  },
  {
    id: 'vice-rector', name: 'Prorektor', color: '#3B82F6', system: true, level: 80,
    desc: 'O\'quv ishlari bo\'yicha prorektor. Akademik blokni boshqaradi.', users: 3,
    icon: 'briefcase',
    grants: { academic: ['view','edit','approve','export'], crm: ['view'], hr: ['view'], audit: ['view'] },
  },
  {
    id: 'dean', name: 'Dekan', color: '#06B6D4', system: true, level: 70,
    desc: 'Fakultet rahbari. O\'z fakulteti doirasida kengaytirilgan huquqlar.', users: 8,
    icon: 'users',
    grants: { academic: ['view','edit','create'], hr: ['view'], crm: ['view'] },
    scope: 'Fakultet',
  },
  {
    id: 'hr-manager', name: 'HR menejer', color: '#F59E0B', system: true, level: 60,
    desc: 'Xodimlar bo\'limi. Kadrlar va shtat jadvali bilan ishlaydi.', users: 4,
    icon: 'users',
    grants: { hr: ['view','edit','create','delete','export'], teachers: ['view','edit'], orders: ['view','create'], users: ['view','create','edit'] },
  },
  {
    id: 'finance', name: 'Buxgalter', color: '#2DB976', system: true, level: 60,
    desc: 'Moliya bo\'limi. Kontraktlar, stipendiya va maoshlar.', users: 6,
    icon: 'wallet',
    grants: { finance: ['view','edit','create','export','approve'], students: ['view'], analytics: ['view','export'] },
  },
  {
    id: 'teacher', name: 'O\'qituvchi', color: '#10B981', system: true, level: 40,
    desc: 'PPS xodimi. O\'z fanlari bo\'yicha davomat va baho qo\'yadi.', users: 186,
    icon: 'user',
    grants: { students: ['view'], attendance: ['view','edit','create'], grading: ['view','edit','create'], schedule: ['view'], curriculum: ['view'], theses: ['view','edit'] },
    scope: 'O\'z guruhlari',
  },
  {
    id: 'student', name: 'Talaba', color: '#3B82F6', system: true, level: 20,
    desc: 'Talaba kabineti. Faqat o\'z ma\'lumotlarini ko\'radi.', users: 3247,
    icon: 'user',
    grants: { students: ['view-self'], grading: ['view-self'], attendance: ['view-self'], schedule: ['view'], library: ['view'], contracts: ['view-self'] },
    scope: 'O\'zi',
  },
  // custom
  {
    id: 'crm-operator', name: 'CRM operator', color: '#EC4899', system: false, level: 35,
    desc: 'Qabul komissiyasi xodimi. Abituriyent arizalari bilan ishlaydi.', users: 5,
    icon: 'inbox',
    grants: { crm: ['view','edit','create'], students: ['view','create'] },
    custom: true, createdBy: 'Karimov F.A.', createdAt: '15.01.2026',
  },
  {
    id: 'librarian', name: 'Kutubxonachi', color: '#06B6D4', system: false, level: 30,
    desc: 'Kutubxona xodimi. Kitoblar va o\'quvchilarga xizmat ko\'rsatadi.', users: 3,
    icon: 'doc',
    grants: { library: ['view','edit','create','delete'], students: ['view'] },
    custom: true, createdBy: 'Karimov F.A.', createdAt: '03.02.2026',
  },
];

// Build a permission matrix: { roleId: { moduleId: [verbs...] } }
function buildPermMatrix() {
  const m = {};
  for (const r of ROLES) {
    m[r.id] = {};
    if (r.grants === '*') {
      for (const mod of ALL_MODULES) m[r.id][mod.id] = ['view','edit','create','delete','approve','export'];
      continue;
    }
    const g = r.grants;
    // expand category aliases
    const academicMods = ['students','teachers','attendance','grading','schedule','curriculum','exams','theses'];
    const financeMods = ['contracts','scholarship','payroll','budget'];
    if (g.academic) for (const id of academicMods) m[r.id][id] = [...(m[r.id][id]||[]), ...g.academic];
    if (g.finance)  for (const id of financeMods) m[r.id][id] = [...(m[r.id][id]||[]), ...g.finance];
    if (g.all)      for (const mod of ALL_MODULES) m[r.id][mod.id] = [...(m[r.id][mod.id]||[]), ...g.all];
    for (const k of Object.keys(g)) {
      if (k === 'academic' || k === 'finance' || k === 'all') continue;
      m[r.id][k] = [...(m[r.id][k]||[]), ...g[k]];
    }
    // dedupe
    for (const k of Object.keys(m[r.id])) m[r.id][k] = [...new Set(m[r.id][k])];
  }
  return m;
}
const PERM_MATRIX = buildPermMatrix();

// ============== USERS ==============
const USER_STATUSES = ['Faol', 'Bloklangan', 'Taklif yuborilgan', 'Pauza'];
const USER_BRANCHES = ['Navoiy (bosh)', 'Zarafshon filiali', 'Uchquduq filiali', 'Qiziltepa filiali'];

const USERS = Array.from({ length: 32 }, (_, i) => {
  const n = fullName(i + 501, 0.42);
  const roleSeed = seed(i + 503);
  // distribution: 1 super-admin, 1 rector, 2 prorektor, 3 dekan, 4 hr, 5 buxgalter, 6 teacher, 5 crm, 3 librarian, 2 mixed
  let roles = [];
  if (i === 0) roles = ['super-admin'];
  else if (i === 1) roles = ['super-admin'];
  else if (i === 2) roles = ['rector'];
  else if (i < 5) roles = ['vice-rector'];
  else if (i < 8) roles = ['dean', 'teacher']; // dean often also teaches
  else if (i < 12) roles = ['hr-manager'];
  else if (i < 17) roles = ['finance'];
  else if (i < 22) roles = ['teacher'];
  else if (i < 26) roles = ['crm-operator'];
  else if (i < 29) roles = ['librarian'];
  else if (i === 29) roles = ['hr-manager', 'finance']; // dual-role
  else if (i === 30) roles = ['teacher', 'crm-operator'];
  else roles = ['teacher'];

  const status = i === 11 ? 'Bloklangan' : i === 25 ? 'Taklif yuborilgan' : i === 28 ? 'Pauza' : 'Faol';
  const branch = pick(USER_BRANCHES, i + 507);
  const lastLoginDays = rnum(i + 509, 0, 60);
  const twoFa = roles.includes('super-admin') || roles.includes('rector') || roles.includes('finance') || seed(i+511) < 0.4;
  const sessions = status === 'Faol' ? rnum(i+513, 1, 4) : 0;

  return {
    id: `USR-${String(1000 + i).padStart(5, '0')}`,
    name: n,
    login: `${n.last.toLowerCase()}.${n.first[0].toLowerCase()}`,
    email: `${n.last.toLowerCase()}.${n.first[0].toLowerCase()}@uni.uz`,
    phone: phone(i + 515),
    roles,
    primaryRole: roles[0],
    status,
    branch,
    department: pick(DEPARTMENTS, i + 517),
    twoFa,
    lastLogin: lastLoginDays === 0 ? 'Hozir online' : lastLoginDays === 1 ? 'Bugun, 09:42' : lastLoginDays < 7 ? `${lastLoginDays} kun oldin` : `${Math.floor(lastLoginDays/7)} hafta oldin`,
    lastLoginDays,
    sessions,
    createdAt: `${rnum(i+519, 1, 28)}.${String(rnum(i+520,1,12)).padStart(2,'0')}.${2024 + rnum(i+521, 0, 2)}`,
    failedAttempts: status === 'Bloklangan' ? 7 : rnum(i+523, 0, 2),
    avatar: n.initials,
  };
});

// ============== AUDIT LOG ==============
const AUDIT_ACTIONS = [
  { kind: 'auth.login.success', label: 'Tizimga kirish', icon: 'check', color: '#2DB976', sev: 'info' },
  { kind: 'auth.login.fail', label: 'Muvaffaqiyatsiz kirish', icon: 'x', color: '#EF4444', sev: 'warn' },
  { kind: 'auth.password.reset', label: 'Parol tiklandi', icon: 'shield', color: '#3B82F6', sev: 'info' },
  { kind: 'auth.2fa.enabled', label: '2FA yoqildi', icon: 'shield', color: '#2DB976', sev: 'info' },
  { kind: 'auth.session.kill', label: 'Sessiya o\'chirildi', icon: 'x', color: '#F59E0B', sev: 'info' },
  { kind: 'user.create', label: 'Foydalanuvchi yaratildi', icon: 'user', color: '#2DB976', sev: 'info' },
  { kind: 'user.delete', label: 'Foydalanuvchi o\'chirildi', icon: 'x', color: '#EF4444', sev: 'critical' },
  { kind: 'user.block', label: 'Foydalanuvchi bloklandi', icon: 'shield', color: '#EF4444', sev: 'warn' },
  { kind: 'user.role.assign', label: 'Rol biriktirildi', icon: 'plus', color: '#8B5CF6', sev: 'warn' },
  { kind: 'user.role.revoke', label: 'Rol bekor qilindi', icon: 'x', color: '#F59E0B', sev: 'warn' },
  { kind: 'role.create', label: 'Rol yaratildi', icon: 'plus', color: '#2DB976', sev: 'warn' },
  { kind: 'role.edit', label: 'Rol tahrir qilindi', icon: 'edit', color: '#3B82F6', sev: 'warn' },
  { kind: 'role.delete', label: 'Rol o\'chirildi', icon: 'x', color: '#EF4444', sev: 'critical' },
  { kind: 'perm.grant', label: 'Ruxsat berildi', icon: 'check', color: '#2DB976', sev: 'warn' },
  { kind: 'perm.revoke', label: 'Ruxsat olib tashlandi', icon: 'x', color: '#F59E0B', sev: 'warn' },
  { kind: 'data.export', label: 'Ma\'lumot eksport qilindi', icon: 'download', color: '#F59E0B', sev: 'warn' },
  { kind: 'data.bulk.delete', label: 'Bulk o\'chirish', icon: 'x', color: '#EF4444', sev: 'critical' },
  { kind: 'settings.change', label: 'Sozlama o\'zgartirildi', icon: 'settings', color: '#8B5CF6', sev: 'info' },
];

function ipFor(i) {
  if (seed(i) < 0.7) return `10.10.${rnum(i+1, 1, 99)}.${rnum(i+2, 1, 254)}`;
  return `213.230.${rnum(i+3, 1, 254)}.${rnum(i+4, 1, 254)}`; // public UZ
}
function uaFor(i) {
  const list = [
    'Chrome 124 · Windows 11',
    'Chrome 124 · macOS 14',
    'Safari 17 · macOS 14',
    'Firefox 125 · Ubuntu',
    'Mobile Safari · iOS 17',
    'Chrome Mobile · Android 14',
  ];
  return pick(list, i);
}

const AUDIT_LOG = Array.from({ length: 64 }, (_, i) => {
  const action = pick(AUDIT_ACTIONS, i + 601);
  const actor = USERS[rnum(i + 603, 0, USERS.length - 1)];
  const target = seed(i + 605) < 0.6 ? USERS[rnum(i + 607, 0, USERS.length - 1)] : null;
  const minutesAgo = i * 7 + rnum(i + 609, 0, 6); // monotonic-ish
  const h = Math.floor(minutesAgo / 60);
  const mm = minutesAgo % 60;
  let when;
  if (h < 1) when = `${minutesAgo} daqiqa oldin`;
  else if (h < 24) when = `${h} soat oldin`;
  else when = `${Math.floor(h/24)} kun oldin`;

  // Build human description
  let desc = '';
  switch (action.kind) {
    case 'auth.login.success': desc = `${actor.login} tizimga kirdi`; break;
    case 'auth.login.fail': desc = `${actor.login} — noto'g'ri parol (urinish #${rnum(i,2,6)})`; break;
    case 'auth.password.reset': desc = `${actor.login} paroli ${target ? target.login : 'admin'} tomonidan tiklandi`; break;
    case 'auth.2fa.enabled': desc = `${actor.login} hisobida 2FA yoqildi`; break;
    case 'auth.session.kill': desc = `${target ? target.login : actor.login} sessiyasi majburan tugatildi`; break;
    case 'user.create': desc = `Yangi foydalanuvchi: ${target ? target.login : 'demo.user'}`; break;
    case 'user.delete': desc = `Foydalanuvchi o'chirildi: ${target ? target.login : 'old.user'}`; break;
    case 'user.block': desc = `${target ? target.login : actor.login} bloklandi (xavfsizlik)`; break;
    case 'user.role.assign': desc = `${target ? target.login : 'user'} ga "${pick(ROLES, i).name}" roli biriktirildi`; break;
    case 'user.role.revoke': desc = `${target ? target.login : 'user'} dan "${pick(ROLES, i+1).name}" roli olindi`; break;
    case 'role.create': desc = `Yangi rol yaratildi: "${pick(['Marketing','Yordamchi dekan','Praktika rahbari','Magistratura ko\'ord.'], i)}"`; break;
    case 'role.edit': desc = `"${pick(ROLES, i).name}" roli tahrir qilindi`; break;
    case 'role.delete': desc = `"${pick(['Eski rol','Test role','Temp_admin'], i)}" roli o'chirildi`; break;
    case 'perm.grant': desc = `${pick(ROLES, i).name} → ${pick(ALL_MODULES, i).name}: +${pick(PERM_VERBS, i).label.toLowerCase()}`; break;
    case 'perm.revoke': desc = `${pick(ROLES, i).name} → ${pick(ALL_MODULES, i).name}: −${pick(PERM_VERBS, i).label.toLowerCase()}`; break;
    case 'data.export': desc = `${pick(['Talabalar (CSV)','Kontraktlar (XLSX)','Davomat (PDF)','HR ro\'yxati (CSV)'], i)} eksport qilindi`; break;
    case 'data.bulk.delete': desc = `${rnum(i, 5, 28)} ta yozuv o'chirildi (${pick(['Eski leadlar','Test users','Arxiv'], i)})`; break;
    case 'settings.change': desc = `Sozlama: ${pick(['Sessiya muddati','Parol siyosati','SMTP','Backup vaqti','2FA majburiy'], i)} yangilandi`; break;
  }

  return {
    id: `LOG-${String(50_000 + 64 - i).padStart(7, '0')}`,
    when, minutesAgo,
    timestamp: `${String(23 - h % 24).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(rnum(i+611,0,59)).padStart(2,'0')}`,
    date: minutesAgo < 1440 ? '25.04.2026' : '24.04.2026',
    action,
    actor,
    target,
    ip: ipFor(i + 613),
    ua: uaFor(i + 615),
    desc,
  };
});

Object.assign(window, {
  UZ_MALE_NAMES, UZ_FEMALE_NAMES, UZ_SURNAMES, FACULTIES, DEPARTMENTS, SUBJECTS, DIRECTIONS,
  STUDENTS, TEACHERS, LEADS, CONTRACTS, TASKS,
  ROLES, MODULE_GROUPS, ALL_MODULES, PERM_VERBS, PERM_MATRIX, USERS, AUDIT_LOG, AUDIT_ACTIONS, USER_STATUSES, USER_BRANCHES,
  pick, rnum, fullName, phone, seed,
});
