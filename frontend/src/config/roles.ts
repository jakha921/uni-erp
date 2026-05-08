import type { RoleDef, RoleKey } from '@/types/auth';

export const ROLES_DEF: Record<RoleKey, RoleDef> = {
  admin: {
    id: 'admin',
    label: 'Administrator',
    short: 'Admin',
    color: '#0F172A',
    bg: '#0F172A',
    fg: '#fff',
    icon: 'shield',
    desc: "Tizim boshqaruvchisi — barcha modullarga to'liq kirish",
  },
  buxgalter: {
    id: 'buxgalter',
    label: 'Buxgalter',
    short: 'Buxgalter',
    color: '#2DB976',
    bg: '#ECFDF5',
    fg: '#1B7A4E',
    icon: 'wallet',
    desc: "Moliya bo'limi — kontraktlar, to'lovlar, hisobotlar",
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
    desc: "Shaxsiy kabinet — kontrakt, to'lovlar, stipendiya",
  },
};

export const ROLES_LIST: RoleKey[] = ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'];

export const MODULE_ACCESS: Record<string, RoleKey[]> = {
  // Boshqaruv
  dashboard: ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
  // Talabalar
  students: ['admin', 'dekan', 'oqituvchi'],
  'students-list': ['admin', 'dekan', 'oqituvchi', 'buxgalter'],
  'students-stat': ['admin', 'dekan', 'oqituvchi'],
  'my-students': ['oqituvchi'],
  'student-profile': ['admin', 'dekan', 'oqituvchi', 'buxgalter'],
  // Ta'lim
  teachers: ['admin', 'dekan'],
  attendance: ['admin', 'dekan', 'oqituvchi'],
  grading: ['admin', 'dekan', 'oqituvchi'],
  schedule: ['admin', 'dekan', 'oqituvchi'],
  exams: ['admin'],
  alumni: ['admin'],
  internship: ['admin'],
  // O'quv jarayoni
  curriculum: ['admin', 'dekan'],
  departments: ['admin', 'dekan'],
  subjects: ['admin', 'dekan'],
  library: ['admin'],
  // Qabul (CRM)
  crm: ['admin'],
  'crm-kanban': ['admin'],
  'crm-report': ['admin'],
  // Moliya
  finance: ['admin', 'buxgalter', 'dekan'],
  'moliya-contracts': ['admin', 'buxgalter'],
  'moliya-debtors': ['admin', 'buxgalter'],
  'moliya-payments': ['admin', 'buxgalter'],
  'moliya-scholarship': ['admin', 'buxgalter'],
  'finance-report': ['admin', 'buxgalter', 'dekan'],
  payroll: ['admin', 'buxgalter'],
  budget: ['admin', 'buxgalter'],
  debtors: ['admin', 'buxgalter'],
  contracts: ['admin', 'buxgalter'],
  'contract-details': ['admin', 'buxgalter'],
  scholarship: ['admin', 'buxgalter'],
  // Kadrlar
  hr: ['admin', 'dekan'],
  'hr-employees': ['admin', 'dekan'],
  'hr-departments': ['admin', 'dekan'],
  'hr-orders': ['admin', 'dekan'],
  'hr-attendance': ['admin', 'dekan'],
  'hr-leaves': ['admin', 'dekan'],
  // Xodimlar (eski)
  orders: ['admin'],
  staffing: ['admin'],
  // Infratuzilma
  dormitory: ['admin'],
  warehouse: ['admin'],
  equipment: ['admin'],
  transport: ['admin'],
  // Ilmiy faoliyat
  research: ['admin'],
  theses: ['admin'],
  conferences: ['admin'],
  patents: ['admin'],
  // Kabinetlar
  'student-cabinet': ['admin', 'talaba'],
  'teacher-cabinet': ['admin', 'oqituvchi'],
  // Boshqaruv
  tasks: ['admin'],
  appeals: ['admin'],
  messages: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  notifications: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  news: ['admin'],
  // Admin
  dms: ['admin'],
  analytics: ['admin'],
  reports: ['admin', 'buxgalter', 'dekan'],
  reference: ['admin'],
  // Profil
  profile: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  settings: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
  // Tizim
  users: ['admin'],
  roles: ['admin'],
  permissions: ['admin'],
  audit: ['admin'],
  // Profillar
  'teacher-profile': ['admin', 'dekan'],
  'user-profile': ['admin'],
  // Talaba kabineti sahifalari
  'my-schedule': ['talaba'],
  'my-grades': ['talaba'],
  'my-payments': ['talaba'],
  'my-attendance': ['talaba'],
  // Boshqa
  forgot: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
};
