// HrStore.jsx — employees & departments data store with HEMIS API integration

const POSITIONS = [
  { code: 'rektor', name: 'Rektor' },
  { code: 'prorektor', name: 'Prorektor' },
  { code: 'dekan', name: 'Dekan' },
  { code: 'kafedra-mudiri', name: 'Kafedra mudiri' },
  { code: 'professor', name: 'Professor' },
  { code: 'dotsent', name: 'Dotsent' },
  { code: 'katta-oqituvchi', name: "Katta o'qituvchi" },
  { code: 'oqituvchi', name: "O'qituvchi" },
  { code: 'assistent', name: 'Assistent' },
  { code: 'buxgalter', name: 'Buxgalter' },
  { code: 'kotib', name: 'Kotib' },
  { code: 'inspektor', name: 'Inspektor' },
];

const DEGREES = [
  { code: 'phd', name: 'PhD' },
  { code: 'dsc', name: 'Fan doktori (DSc)' },
  { code: 'kandidat', name: 'Fan nomzodi' },
  { code: 'magistr', name: 'Magistr' },
  { code: 'bakalavr', name: 'Bakalavr' },
  { code: 'no-degree', name: "Ilmiy darajasiz" },
];

const RANKS = [
  { code: 'professor', name: 'Professor' },
  { code: 'dotsent', name: 'Dotsent' },
  { code: 'no-rank', name: "Yo'q" },
];

const EMPL_TYPES = [
  { code: 'full', name: 'Asosiy' },
  { code: 'partial', name: "O'rindosh" },
  { code: 'contract', name: 'Soatbay' },
];

// ===== Seed fallback (when HEMIS unavailable) =====
const HR_SURNAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Xolmatova', 'Yusupova', 'Mirzayev', 'Saidova',
  'Abdullayev', 'Norqulov', 'Ergasheva', 'Tursunov', 'Sobirova', 'Qodirov',
  'Hasanov', 'Ismoilova', 'Komilov', 'Olimov', 'Bekmurodov', 'Salimova', 'Tojiddinov',
  'Aliyeva', 'Nurmatov', 'Pardayeva', 'Sharipova', 'Yoqubov', 'Latipov', 'Mahmudova',
  'Rasulov', 'Shukurov', 'Ergashev'
];
const HR_FIRSTNAMES = [
  'Jasur', 'Sardor', 'Bekzod', 'Madina', 'Dilnoza', 'Otabek', 'Nilufar', 'Aziz',
  'Jahongir', 'Sevara', 'Akbar', 'Gulnora', 'Ravshan', 'Doniyor', 'Marjona',
  'Sanjarbek', 'Bobur', 'Mohira', 'Asilbek', 'Sevinch', 'Mirzohid', 'Iroda',
  'Nurbek', 'Nigora', 'Shoxrux', 'Feruza', 'Eldor', 'Lola', 'Botir', 'Komila'
];

const HR_DEPARTMENTS_SEED = [
  { id: 1, name: "Rektorat", code: 'REK', parent: null, structureType: 'admin', employees: 8 },
  { id: 2, name: "Filologiya fakulteti", code: 'FIL', parent: null, structureType: 'fakultet', employees: 42 },
  { id: 3, name: "Aniq, tabiiy va texnik fanlar fakulteti", code: 'ANT', parent: null, structureType: 'fakultet', employees: 56 },
  { id: 4, name: "Iqtisodiyot va AT fakulteti", code: 'IIT', parent: null, structureType: 'fakultet', employees: 51 },
  { id: 5, name: "Ijtimoiy-gumanitar fakultet", code: 'IGF', parent: null, structureType: 'fakultet', employees: 38 },
  { id: 6, name: "Ingliz tili kafedrasi", code: 'ING', parent: 2, structureType: 'kafedra', employees: 18 },
  { id: 7, name: "O'zbek tili kafedrasi", code: 'UZB', parent: 2, structureType: 'kafedra', employees: 14 },
  { id: 8, name: "Tarjimashunoslik kafedrasi", code: 'TRJ', parent: 2, structureType: 'kafedra', employees: 10 },
  { id: 9, name: "Matematika kafedrasi", code: 'MAT', parent: 3, structureType: 'kafedra', employees: 16 },
  { id: 10, name: "Informatika kafedrasi", code: 'INF', parent: 3, structureType: 'kafedra', employees: 22 },
  { id: 11, name: "Fizika va astronomiya kafedrasi", code: 'FIZ', parent: 3, structureType: 'kafedra', employees: 12 },
  { id: 12, name: "Iqtisodiyot kafedrasi", code: 'IQT', parent: 4, structureType: 'kafedra', employees: 19 },
  { id: 13, name: "Menejment kafedrasi", code: 'MEN', parent: 4, structureType: 'kafedra', employees: 14 },
  { id: 14, name: "Axborot xavfsizligi kafedrasi", code: 'AXX', parent: 4, structureType: 'kafedra', employees: 18 },
  { id: 15, name: "Tarix kafedrasi", code: 'TAR', parent: 5, structureType: 'kafedra', employees: 11 },
  { id: 16, name: "Falsafa kafedrasi", code: 'FAL', parent: 5, structureType: 'kafedra', employees: 9 },
  { id: 17, name: "Pedagogika kafedrasi", code: 'PED', parent: 5, structureType: 'kafedra', employees: 18 },
  { id: 18, name: "Buxgalteriya", code: 'BUX', parent: 1, structureType: 'admin', employees: 6 },
  { id: 19, name: "Kadrlar bo'limi", code: 'KAD', parent: 1, structureType: 'admin', employees: 5 },
  { id: 20, name: "AT bo'limi", code: 'IT', parent: 1, structureType: 'admin', employees: 7 },
  { id: 21, name: "Talabalar dekanati", code: 'TAL', parent: 1, structureType: 'admin', employees: 4 },
  { id: 22, name: "Xo'jalik bo'limi", code: 'XOJ', parent: 1, structureType: 'admin', employees: 12 },
];

const seedRandHr = (i, mod) => Math.abs((i * 9301 + 49297) % 233280) % mod;

const generateHrSeed = () => {
  const departments = HR_DEPARTMENTS_SEED.map((d) => ({ ...d }));
  const employees = [];

  // generate 50 employees, distributed across kafedras + admin
  const targetDepts = departments.filter((d) => d.structureType === 'kafedra' || d.structureType === 'admin');

  for (let i = 0; i < 50; i++) {
    const dept = targetDepts[i % targetDepts.length];
    const surname = HR_SURNAMES[i % HR_SURNAMES.length];
    const firstname = HR_FIRSTNAMES[(i * 7) % HR_FIRSTNAMES.length];
    const isFemale = ['Madina','Dilnoza','Nilufar','Sevara','Gulnora','Marjona','Mohira','Sevinch','Iroda','Nigora','Feruza','Lola','Komila','Xolmatova','Yusupova','Saidova','Ergasheva','Sobirova','Ismoilova','Salimova','Aliyeva','Pardayeva','Sharipova','Mahmudova'].some((n) => firstname === n || surname === n);
    const middle = isFemale ? `${HR_FIRSTNAMES[(i * 11) % HR_FIRSTNAMES.length]} qizi` : `${HR_FIRSTNAMES[(i * 11) % HR_FIRSTNAMES.length]} o'g'li`;

    const positionIdx = dept.structureType === 'admin' ? (8 + (i % 4)) : (3 + (i % 6));
    const position = POSITIONS[Math.min(positionIdx, POSITIONS.length - 1)];

    const hireDate = new Date(2018 + (i % 8), i % 12, 1 + seedRandHr(i, 28));
    const birthDate = new Date(1965 + (i % 30), i % 12, 1 + seedRandHr(i + 1, 28));

    const degreeIdx = position.code === 'professor' ? 1 : position.code === 'dotsent' ? 2
      : position.code === 'kafedra-mudiri' ? 0 : position.code === 'oqituvchi' ? 5 : 5;
    const rankIdx = position.code === 'professor' ? 0 : position.code === 'dotsent' ? 1 : 2;

    const baseSalary = 4500000 + seedRandHr(i + 3, 30) * 100000;

    employees.push({
      id: 1000 + i,
      employee_id_number: '46' + String(330000 + i * 173).slice(0, 8),
      full_name: `${surname.toUpperCase()} ${firstname.toUpperCase()} ${middle.toUpperCase()}`,
      first_name: firstname,
      second_name: surname,
      third_name: middle,
      short_name: `${surname} ${firstname[0]}.${middle[0]}.`,
      gender: isFemale ? { code: 2, name: 'Ayol' } : { code: 1, name: 'Erkak' },
      birth_date: birthDate.toISOString().slice(0, 10),
      department: { id: dept.id, name: dept.name, code: dept.code, structureType: { code: dept.structureType } },
      position: { code: position.code, name: position.name },
      academicDegree: { code: DEGREES[degreeIdx].code, name: DEGREES[degreeIdx].name },
      academicRank: { code: RANKS[rankIdx].code, name: RANKS[rankIdx].name },
      employmentForm: { code: EMPL_TYPES[i % 3].code, name: EMPL_TYPES[i % 3].name },
      employmentStaff: { code: 'staff', name: '1.0 stavka' },
      staffPosition: { code: position.code, name: position.name },
      hireDate: hireDate.toISOString().slice(0, 10),
      contractDate: hireDate.toISOString().slice(0, 10),
      contractNumber: `XK-${2018 + (i % 8)}/${String(i + 1).padStart(3, '0')}`,
      phone: `+998 (90) ${String(100 + i).slice(0, 3)}-${String(10 + i).padStart(2, '0')}-${String(50 + i).slice(0, 2)}`,
      email: `${surname.toLowerCase()}.${firstname[0].toLowerCase()}@bitu.uz`,
      passport: `AB ${String(1000000 + i * 1737).slice(0, 7)}`,
      pinfl: `${30000000000000 + i * 1739}`.slice(0, 14),
      salary: baseSalary,
      experience: { years: 2026 - hireDate.getFullYear(), months: 0 },
      status: i % 19 === 0 ? 'leave' : i % 23 === 0 ? 'business-trip' : 'active',
      image: null,
    });
  }

  return { employees, departments };
};

// ===== Context =====
const HrContext = React.createContext(null);
const useHr = () => React.useContext(HrContext);

const HrProvider = ({ children }) => {
  const auth = typeof useAuth === 'function' ? useAuth() : null;
  const fin = typeof useFinance === 'function' ? useFinance() : null;

  const [seed] = React.useState(generateHrSeed);
  const [employees, setEmployees] = React.useState(seed.employees);
  const [departments, setDepartments] = React.useState(seed.departments);
  const [loading, setLoading] = React.useState(false);
  const [hemisLoaded, setHemisLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  // ===== Orders state =====
  const [orders, setOrders] = React.useState(() => generateOrdersSeed(seed.employees));
  // ===== Attendance =====
  const [attendance, setAttendance] = React.useState(() => generateAttendanceSeed(seed.employees));
  // ===== Leaves & business trips =====
  const [leaves, setLeaves] = React.useState(() => generateLeavesSeed(seed.employees));

  // HEMIS integration — disabled for prototype, works entirely from seed data
  const loadFromHemis = React.useCallback(async () => {
    if (hemisLoaded) return;
    setHemisLoaded(true);
    window.showToast?.('Prototipda HEMIS ulanishi o\'chirilgan — seed ma\'lumotlar ishlatilmoqda', 'info');
  }, [hemisLoaded]);

  // ===== CRUD: employees =====
  const addEmployee = (e) => {
    const id = Math.max(...employees.map((x) => x.id), 1000) + 1;
    setEmployees((x) => [...x, { ...e, id, status: 'active' }]);
    return id;
  };
  const updateEmployee = (id, patch) =>
    setEmployees((x) => x.map((e) => e.id === id ? { ...e, ...patch } : e));
  const deleteEmployee = (id) =>
    setEmployees((x) => x.filter((e) => e.id !== id));

  // ===== CRUD: departments =====
  const addDepartment = (d) => {
    const id = Math.max(...departments.map((x) => x.id), 0) + 1;
    setDepartments((x) => [...x, { ...d, id, employees: 0 }]);
    return id;
  };
  const updateDepartment = (id, patch) =>
    setDepartments((x) => x.map((d) => d.id === id ? { ...d, ...patch } : d));
  const deleteDepartment = (id) =>
    setDepartments((x) => x.filter((d) => d.id !== id));

  // ===== CRUD: orders =====
  const addOrder = (o) => {
    const id = 'BUY-' + String(orders.length + 1).padStart(3, '0');
    setOrders((x) => [...x, { ...o, id, createdAt: new Date().toISOString().slice(0, 10), status: 'draft' }]);
    return id;
  };
  const updateOrder = (id, patch) =>
    setOrders((x) => x.map((o) => o.id === id ? { ...o, ...patch } : o));
  const deleteOrder = (id) =>
    setOrders((x) => x.filter((o) => o.id !== id));

  // ===== CRUD: leaves =====
  const addLeave = (l) => {
    const id = 'TT-' + String(leaves.length + 1).padStart(3, '0');
    const newLeave = { ...l, id, status: 'pending' };
    setLeaves((x) => [...x, newLeave]);

    // Auto-create corresponding order
    const vacationTypes = ['mehnat', 'oqish', 'tugruq', 'beh'];
    const isVacation = vacationTypes.includes(l.type);
    const orderType = isVacation ? 'tatil' : l.type === 'safar' ? 'xizmat_safari' : null;
    if (orderType) {
      const orderNum = 'B-2025/' + String(orders.length + 1).padStart(3, '0');
      addOrder({
        number: orderNum,
        type: orderType === 'tatil' ? 'leave' : 'trip',
        typeLabel: orderType === 'tatil' ? "Ta'tilga jo'natish" : 'Xizmat safari',
        typeColor: orderType === 'tatil' ? '#8B5CF6' : '#0891B2',
        title: `${l.employeeName} ga doir buyruq — ${orderType === 'tatil' ? "Ta'tilga jo'natish" : 'Xizmat safari'}`,
        employeeId: l.employeeId,
        employeeName: l.employeeName,
        date: new Date().toISOString().slice(0, 10),
        effectiveDate: l.startDate,
        signer: 'Rektor Ibragimov O.M.',
        basis: 'Xodim arizasi',
      });
    }
    return id;
  };
  const updateLeave = (id, patch) =>
    setLeaves((x) => x.map((l) => l.id === id ? { ...l, ...patch } : l));
  const deleteLeave = (id) => setLeaves((prev) => prev.filter((l) => l.id !== id));

  const value = {
    employees, departments, orders, attendance, leaves,
    loading, error, hemisLoaded, loadFromHemis,
    addEmployee, updateEmployee, deleteEmployee,
    addDepartment, updateDepartment, deleteDepartment,
    addOrder, updateOrder, deleteOrder,
    addLeave, updateLeave, deleteLeave,
    POSITIONS, DEGREES, RANKS, EMPL_TYPES,
  };
  return <HrContext.Provider value={value}>{children}</HrContext.Provider>;
};

// ===== Orders seed =====
function generateOrdersSeed(employees) {
  const types = [
    { code: 'hire', name: 'Ishga qabul qilish', color: '#2DB976' },
    { code: 'fire', name: 'Ishdan bo\'shatish', color: '#EF4444' },
    { code: 'promote', name: 'Lavozimga ko\'tarish', color: '#3B82F6' },
    { code: 'salary', name: 'Maosh o\'zgarishi', color: '#F59E0B' },
    { code: 'leave', name: "Ta'tilga jo'natish", color: '#8B5CF6' },
    { code: 'trip', name: 'Xizmat safari', color: '#0891B2' },
    { code: 'bonus', name: 'Mukofotlash', color: '#10B981' },
    { code: 'penalty', name: 'Hayfsan e\'lon qilish', color: '#DC2626' },
  ];
  const out = [];
  for (let i = 0; i < 18; i++) {
    const t = types[i % types.length];
    const emp = employees[(i * 3) % employees.length];
    const date = new Date(2026, 3, 1 + i);
    out.push({
      id: 'BUY-' + String(i + 1).padStart(3, '0'),
      number: `${i + 145}-K`,
      type: t.code,
      typeLabel: t.name,
      typeColor: t.color,
      title: `${emp.full_name} ga doir buyruq — ${t.name}`,
      employeeId: emp.id,
      employeeName: emp.full_name,
      date: date.toISOString().slice(0, 10),
      effectiveDate: date.toISOString().slice(0, 10),
      signer: 'Rektor Ibragimov O.M.',
      basis: t.code === 'hire' ? "Buxgalter ariza" : t.code === 'leave' ? "Xodim arizasi" : "Mehnat shartnomasi",
      status: i % 7 === 0 ? 'draft' : i % 11 === 0 ? 'review' : 'signed',
      createdAt: date.toISOString().slice(0, 10),
    });
  }
  return out;
}

// ===== Attendance seed (current month, per employee) =====
function generateAttendanceSeed(employees) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const records = {};
  (employees || []).forEach((emp) => {
    const days = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (dow === 0 || dow === 6) { days[d] = 'weekend'; continue; }
      const v = (emp.id * 7 + d * 13) % 100;
      if (v < 5) days[d] = 'absent';
      else if (v < 10) days[d] = 'leave';
      else if (v < 13) days[d] = 'sick';
      else days[d] = 'present';
    }
    records[emp.id] = days;
  });
  return { year, month, daysInMonth, records };
}

// ===== Leaves seed =====
function generateLeavesSeed(employees) {
  const types = [
    { code: 'mehnat', name: 'Mehnat ta\'tili' },
    { code: 'oqish', name: "O'qish ta'tili" },
    { code: 'tugruq', name: 'Tug\'ruq ta\'tili' },
    { code: 'beh', name: 'Behaq ta\'tili' },
    { code: 'safar', name: 'Xizmat safari' },
  ];
  const out = [];
  for (let i = 0; i < 14; i++) {
    const t = types[i % types.length];
    const emp = employees[(i * 5) % employees.length];
    const start = new Date(2026, 3, 1 + i * 2);
    const days = 5 + (i % 20);
    const end = new Date(start); end.setDate(end.getDate() + days);
    out.push({
      id: 'TT-' + String(i + 1).padStart(3, '0'),
      employeeId: emp.id,
      employeeName: emp.full_name,
      department: emp.department?.name,
      type: t.code,
      typeLabel: t.name,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      days,
      destination: t.code === 'safar' ? 'Toshkent sh.' : null,
      reason: t.code === 'mehnat' ? 'Yillik mehnat ta\'tili' : t.code === 'safar' ? 'Konferensiyada qatnashish' : 'Shaxsiy sabab',
      status: i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'rejected' : 'approved',
    });
  }
  return out;
}

// ===== Helpers =====
const positionLabel = (code) => POSITIONS.find((p) => p.code === code)?.name || code;
const degreeLabel = (code) => DEGREES.find((d) => d.code === code)?.name || code;

const EmployeeStatusBadge = ({ status }) => {
  const map = {
    active: { variant: 'success', label: 'Faol' },
    leave: { variant: 'warning', label: "Ta'tilda" },
    'business-trip': { variant: 'info', label: 'Safar' },
    inactive: { variant: 'neutral', label: 'Faol emas' },
  };
  const m = map[status] || map.active;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

const OrderStatusBadge = ({ status }) => {
  const map = {
    draft: { variant: 'neutral', label: 'Loyiha' },
    review: { variant: 'warning', label: 'Ko\'rib chiqishda' },
    signed: { variant: 'success', label: 'Imzolangan' },
    cancelled: { variant: 'error', label: 'Bekor qilingan' },
  };
  const m = map[status] || map.draft;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

const LeaveStatusBadge = ({ status }) => {
  const map = {
    pending: { variant: 'warning', label: 'Kutmoqda' },
    approved: { variant: 'success', label: 'Tasdiqlangan' },
    rejected: { variant: 'error', label: 'Rad etilgan' },
  };
  const m = map[status] || map.pending;
  return <Badge variant={m.variant} dot>{m.label}</Badge>;
};

Object.assign(window, {
  HrContext, HrProvider, useHr,
  POSITIONS, DEGREES, RANKS, EMPL_TYPES,
  HR_DEPARTMENTS_SEED, positionLabel, degreeLabel,
  EmployeeStatusBadge, OrderStatusBadge, LeaveStatusBadge,
});
