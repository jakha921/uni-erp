// AuthStore.jsx — global authentication & role state for BITU ERP
// Defines: 5 roles, 5 demo users, AuthProvider/useAuth, role gating helpers

const ROLES_DEF = {
  admin: {
    id: 'admin',
    label: 'Administrator',
    short: 'Admin',
    color: '#0F172A',
    bg: '#0F172A',
    fg: '#fff',
    icon: 'shield',
    desc: 'Tizim boshqaruvchisi — barcha modullarga to\'liq kirish',
  },
  buxgalter: {
    id: 'buxgalter',
    label: 'Buxgalter',
    short: 'Buxgalter',
    color: '#2DB976',
    bg: '#ECFDF5',
    fg: '#1B7A4E',
    icon: 'wallet',
    desc: 'Moliya bo\'limi — kontraktlar, to\'lovlar, hisobotlar',
  },
  dekan: {
    id: 'dekan',
    label: 'Dekan',
    short: 'Dekan',
    color: '#7C3AED',
    bg: '#F5F3FF',
    fg: '#5B21B6',
    icon: 'building',
    desc: 'Fakultet dekani — talabalar va xodimlarni boshqaradi',
  },
  oqituvchi: {
    id: 'oqituvchi',
    label: "Professor-o'qituvchi",
    short: "O'qituvchi",
    color: '#0891B2',
    bg: '#ECFEFF',
    fg: '#155E75',
    icon: 'book',
    desc: 'Dars beruvchi — guruhlar va davomat bilan ishlaydi',
  },
  talaba: {
    id: 'talaba',
    label: 'Talaba',
    short: 'Talaba',
    color: '#EA580C',
    bg: '#FFF7ED',
    fg: '#9A3412',
    icon: 'graduation',
    desc: 'Shaxsiy kabinet — kontrakt, to\'lovlar, stipendiya',
  },
};

const ROLES_LIST = ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'];

// Demo users — one per role, with HEMIS bindings where applicable
const DEMO_USERS = [
  {
    id: 1,
    name: 'Adminov Abdulla Akramovich',
    initials: 'AA',
    email: 'admin@bitu.uz',
    phone: '+998 (90) 123-45-67',
    role: 'admin',
    facultyId: null,
    departmentId: null,
    employeeId: null,
    studentId: null,
    avatar: null,
  },
  {
    id: 2,
    name: 'Karimova Malika Baxtiyorovna',
    initials: 'KM',
    email: 'buxgalter@bitu.uz',
    phone: '+998 (90) 234-56-78',
    role: 'buxgalter',
    facultyId: null,
    departmentId: null,
    employeeId: null,
    studentId: null,
    avatar: null,
  },
  {
    id: 3,
    name: 'Rahimov Sardor Tulkinovich',
    initials: 'RS',
    email: 'rahimov.s@bitu.uz',
    phone: '+998 (90) 345-67-89',
    role: 'dekan',
    facultyId: 1, // Filologiya va tillarni o'qitish
    facultyName: "Filologiya va tillarni o'qitish",
    departmentId: null,
    employeeId: 410,
    studentId: null,
    avatar: null,
    position: 'Filologiya fakulteti dekani',
    degree: 'Filologiya fanlari nomzodi (PhD)',
    rank: 'Dotsent',
  },
  {
    id: 4,
    name: "Toshmatov Raximberdi Ulug'bek o'g'li",
    initials: 'TR',
    email: 'toshmatov.r@bitu.uz',
    phone: '+998 (90) 456-78-90',
    role: 'oqituvchi',
    facultyId: 13,
    facultyName: 'Aniq, tabiiy va texnik',
    departmentId: 15,
    departmentName: "Aniq, tabiiy va texnik fanlar kafedrasi",
    employeeId: 2,
    studentId: null,
    avatar: null,
    position: 'Katta o\'qituvchi',
    degree: 'Ilmiy darajasiz',
    rank: 'Yo\'q',
    rate: '1.0 stavka',
  },
  {
    id: 5,
    name: 'Xolmatova Nodira Ilxomovna',
    initials: 'XN',
    email: 'xolmatova.n@student.bitu.uz',
    phone: '+998 (90) 567-89-01',
    role: 'talaba',
    facultyId: 14,
    facultyName: 'Iqtisodiyot va axborot texnologiyalari',
    departmentId: null,
    employeeId: null,
    studentId: 22980,
    avatar: null,
    studentIdNumber: '462251103816',
    groupName: 'IIT-2105-25',
    level: '1-kurs',
    specialty: 'Axborot xavfsizligi',
  },
];

// ===== Access control matrix =====
// Maps high-level module key → roles that can access
const MODULE_ACCESS = {
  // Boshqaruv
  'dashboard': ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
  // Talabalar
  'students': ['admin', 'dekan', 'oqituvchi'],
  'students-list': ['admin', 'dekan', 'oqituvchi', 'buxgalter'],
  'my-students': ['oqituvchi'],
  'student-profile': ['admin', 'dekan', 'oqituvchi', 'buxgalter'],
  // Moliya (existing)
  'finance': ['admin', 'buxgalter', 'dekan'],
  'moliya-contracts': ['admin', 'buxgalter'],
  'moliya-debtors': ['admin', 'buxgalter'],
  'moliya-payments': ['admin', 'buxgalter'],
  'moliya-scholarship': ['admin', 'buxgalter'],
  'finance-report': ['admin', 'buxgalter', 'dekan'],
  // Kadrlar
  'hr': ['admin', 'dekan'],
  'hr-employees': ['admin', 'dekan'],
  'hr-departments': ['admin', 'dekan'],
  'hr-orders': ['admin', 'dekan'],
  'hr-attendance': ['admin', 'dekan'],
  'hr-leaves': ['admin', 'dekan'],
  // Profil
  'profile': ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  'settings': ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  // Talabalar extra
  'students-stat': ['admin', 'dekan', 'oqituvchi'],
  // Old academic pages (admin-only stubs)
  'teachers': ['admin', 'dekan'],
  'attendance': ['admin', 'dekan', 'oqituvchi'],
  'grading': ['admin', 'dekan', 'oqituvchi'],
  'schedule': ['admin', 'dekan', 'oqituvchi'],
  'exams': ['admin'],
  'library': ['admin'],
  'curriculum': ['admin', 'dekan'],
  'departments': ['admin', 'dekan'],
  'research': ['admin'],
  'theses': ['admin'],
  // Operations & admin stubs
  'crm': ['admin'],
  'crm-kanban': ['admin'],
  'crm-report': ['admin'],
  'contracts': ['admin', 'buxgalter'],
  'contract-details': ['admin', 'buxgalter'],
  'dormitory': ['admin'],
  'tasks': ['admin'],
  'reports': ['admin', 'buxgalter', 'dekan'],
  'messages': ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  'notifications': ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  'orders': ['admin'],
  'warehouse': ['admin'],
  'payroll': ['admin', 'buxgalter'],
  'debtors': ['admin', 'buxgalter'],
  'budget': ['admin', 'buxgalter'],
  'appeals': ['admin'],
  'news': ['admin'],
  'reference': ['admin'],
  'equipment': ['admin'],
  'subjects': ['admin', 'dekan'],
  'alumni': ['admin'],
  'internship': ['admin'],
  'users': ['admin'],
  'roles': ['admin'],
  'permissions': ['admin'],
  'audit': ['admin'],
  'dms': ['admin'],
  'analytics': ['admin'],
  'staffing': ['admin'],
  'transport': ['admin'],
  'conferences': ['admin'],
  'patents': ['admin'],
  'scholarship': ['admin', 'buxgalter'],
  'student-cabinet': ['admin', 'talaba'],
  'teacher-cabinet': ['admin', 'oqituvchi'],
  'student-profile': ['admin', 'dekan', 'oqituvchi', 'buxgalter'],
  'teacher-profile': ['admin', 'dekan'],
  'user-profile': ['admin'],
  'my-schedule': ['talaba'],
  'my-grades': ['talaba'],
  'my-payments': ['talaba'],
  'my-attendance': ['talaba'],
  'forgot': ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
};

const canAccessRoute = (route, role) => {
  if (!role) return false;
  const allowed = MODULE_ACCESS[route];
  if (!allowed) return false;
  return allowed.includes(role);
};

// Sidebar group → which roles see it
const SIDEBAR_GROUP_ROLES = {
  main: ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
  students: ['admin', 'dekan', 'oqituvchi'],
  finance: ['admin', 'buxgalter', 'dekan'],
  hr: ['admin', 'dekan'],
  profile: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
};

// ===== Auth context =====
const AuthContext = React.createContext(null);
const useAuth = () => React.useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);

  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);
  const switchRole = (role) => {
    const u = DEMO_USERS.find((d) => d.role === role);
    if (u) setCurrentUser(u);
  };

  const can = (route) => canAccessRoute(route, currentUser?.role);
  const isRole = (...roles) => currentUser && roles.includes(currentUser.role);

  const value = {
    currentUser, setCurrentUser, login, logout, switchRole,
    can, isRole,
    ROLES_DEF, ROLES_LIST, DEMO_USERS,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Role pill — small badge component
const RolePill = ({ role, size = 'sm' }) => {
  const r = ROLES_DEF[role];
  if (!r) return null;
  const sizes = {
    sm: { padX: 8, padY: 3, fz: 11, dot: 6 },
    md: { padX: 10, padY: 4, fz: 12, dot: 7 },
  };
  const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: `${s.padY}px ${s.padX}px`, borderRadius: 999,
      background: r.bg, color: r.fg, fontSize: s.fz, fontWeight: 600,
      letterSpacing: '0.01em',
    }}>
      <span style={{ width: s.dot, height: s.dot, borderRadius: 999, background: r.color }} />
      {r.short}
    </span>
  );
};

Object.assign(window, {
  ROLES_DEF, ROLES_LIST, DEMO_USERS, MODULE_ACCESS, SIDEBAR_GROUP_ROLES,
  canAccessRoute, AuthContext, AuthProvider, useAuth, RolePill,
});
