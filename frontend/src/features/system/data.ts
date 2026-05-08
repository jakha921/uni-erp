import type { PersonName } from '@/types/shared';
import { generateName, generatePhone, generateEmail, seed, pick, rnum } from '@/api/mock/shared-data';

// ============== PERMISSION VERBS ==============

export interface PermVerb {
  id: string;
  label: string;
  short: string;
  color: string;
}

export const PERM_VERBS: PermVerb[] = [
  { id: 'view', label: "Ko'rish", short: 'V', color: '#64748B' },
  { id: 'edit', label: 'Tahrir', short: 'E', color: '#3B82F6' },
  { id: 'create', label: 'Yaratish', short: 'C', color: '#2DB976' },
  { id: 'delete', label: "O'chirish", short: 'D', color: '#EF4444' },
  { id: 'approve', label: 'Tasdiqlash', short: 'A', color: '#8B5CF6' },
  { id: 'export', label: 'Eksport', short: 'X', color: '#F59E0B' },
];

// ============== MODULES ==============

export interface ModuleItem {
  id: string;
  name: string;
  desc: string;
}

export interface ModuleGroup {
  label: string;
  modules: ModuleItem[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    label: 'Akademik',
    modules: [
      { id: 'students', name: 'Talabalar', desc: "Talabalar ro'yxati, profillari, kontingent" },
      { id: 'teachers', name: "O'qituvchilar", desc: 'PPS, yuk, ish jadvali' },
      { id: 'attendance', name: 'Davomat', desc: 'Davomat jurnali, kelmagan kunlar' },
      { id: 'grading', name: 'Baholash', desc: 'Joriy/oraliq/yakuniy baholar' },
      { id: 'schedule', name: 'Dars jadvali', desc: 'Auditoriyalar, vaqtlar, jadvalni tahrir' },
      { id: 'curriculum', name: "O'quv rejalar", desc: "Yo'nalishlar, fanlar, kreditlar" },
      { id: 'exams', name: 'Imtihonlar', desc: 'Sessiya, biletlar, baholash protokollari' },
      { id: 'theses', name: 'Diplom ishlari', desc: 'BMI rahbarligi, himoya, baholash' },
    ],
  },
  {
    label: 'Moliya',
    modules: [
      { id: 'contracts', name: 'Kontraktlar', desc: "To'lov-kontrakt, qarzlar" },
      { id: 'scholarship', name: 'Stipendiya', desc: 'Stipendiya tayinlash, hisob-kitob' },
      { id: 'payroll', name: 'Oylik maoshlar', desc: 'Xodimlar maosh hisob-kitobi' },
      { id: 'budget', name: 'Byudjet', desc: "Universitet moliyaviy ko'rsatkichlari" },
    ],
  },
  {
    label: 'Operatsion',
    modules: [
      { id: 'crm', name: 'CRM', desc: 'Abituriyent arizalari, voronka' },
      { id: 'hr', name: 'HR', desc: "Xodimlar, ta'tillar, malaka oshirish" },
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
      { id: 'audit', name: 'Audit log', desc: "Tizimdagi barcha o'zgarishlar tarixi" },
      { id: 'settings', name: 'Sozlamalar', desc: 'Universitet sozlamalari, integratsiyalar' },
      { id: 'analytics', name: 'Analytics', desc: "Boshqaruv hisobotlari, KPI" },
    ],
  },
];

export const ALL_MODULES: ModuleItem[] = MODULE_GROUPS.flatMap((g) => g.modules);

// ============== ROLES ==============

type GrantsMap = Record<string, string[]>;

export interface SystemRole {
  id: string;
  name: string;
  color: string;
  system: boolean;
  level: number;
  desc: string;
  users: number;
  scope?: string;
  grants: '*' | GrantsMap;
  custom?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export const ROLES: SystemRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    color: '#EF4444',
    system: true,
    level: 100,
    desc: "Tizimning to'liq nazorati. Faqat IT-direktor.",
    users: 2,
    grants: '*',
  },
  {
    id: 'rector',
    name: 'Rektor',
    color: '#8B5CF6',
    system: true,
    level: 90,
    desc: 'Universitet rahbari. Strategik nazorat va tasdiqlash.',
    users: 1,
    grants: {
      all: ['view', 'export', 'approve'],
      orders: ['view', 'create', 'edit', 'approve'],
      users: ['view'],
      roles: ['view'],
      settings: ['view', 'edit'],
      audit: ['view'],
    },
  },
  {
    id: 'vice-rector',
    name: 'Prorektor',
    color: '#3B82F6',
    system: true,
    level: 80,
    desc: "O'quv ishlari bo'yicha prorektor. Akademik blokni boshqaradi.",
    users: 3,
    grants: { academic: ['view', 'edit', 'approve', 'export'], crm: ['view'], hr: ['view'], audit: ['view'] },
  },
  {
    id: 'dean',
    name: 'Dekan',
    color: '#06B6D4',
    system: true,
    level: 70,
    desc: "Fakultet rahbari. O'z fakulteti doirasida kengaytirilgan huquqlar.",
    users: 8,
    scope: 'Fakultet',
    grants: { academic: ['view', 'edit', 'create'], hr: ['view'], crm: ['view'] },
  },
  {
    id: 'hr-manager',
    name: 'HR menejer',
    color: '#F59E0B',
    system: true,
    level: 60,
    desc: "Xodimlar bo'limi. Kadrlar va shtat jadvali bilan ishlaydi.",
    users: 4,
    grants: {
      hr: ['view', 'edit', 'create', 'delete', 'export'],
      teachers: ['view', 'edit'],
      orders: ['view', 'create'],
      users: ['view', 'create', 'edit'],
    },
  },
  {
    id: 'finance',
    name: 'Buxgalter',
    color: '#2DB976',
    system: true,
    level: 60,
    desc: "Moliya bo'limi. Kontraktlar, stipendiya va maoshlar.",
    users: 6,
    grants: {
      finance: ['view', 'edit', 'create', 'export', 'approve'],
      students: ['view'],
      analytics: ['view', 'export'],
    },
  },
  {
    id: 'teacher',
    name: "O'qituvchi",
    color: '#10B981',
    system: true,
    level: 40,
    desc: "PPS xodimi. O'z fanlari bo'yicha davomat va baho qo'yadi.",
    users: 186,
    scope: "O'z guruhlari",
    grants: {
      students: ['view'],
      attendance: ['view', 'edit', 'create'],
      grading: ['view', 'edit', 'create'],
      schedule: ['view'],
      curriculum: ['view'],
      theses: ['view', 'edit'],
    },
  },
  {
    id: 'student',
    name: 'Talaba',
    color: '#3B82F6',
    system: true,
    level: 20,
    desc: "Talaba kabineti. Faqat o'z ma'lumotlarini ko'radi.",
    users: 3247,
    scope: "O'zi",
    grants: {
      students: ['view'],
      grading: ['view'],
      attendance: ['view'],
      schedule: ['view'],
      library: ['view'],
      contracts: ['view'],
    },
  },
  {
    id: 'crm-operator',
    name: 'CRM operator',
    color: '#EC4899',
    system: false,
    level: 35,
    desc: 'Qabul komissiyasi xodimi. Abituriyent arizalari bilan ishlaydi.',
    users: 5,
    grants: { crm: ['view', 'edit', 'create'], students: ['view', 'create'] },
    custom: true,
    createdBy: 'Karimov F.A.',
    createdAt: '15.01.2026',
  },
];

// ============== PERMISSION MATRIX ==============

export type PermMatrix = Record<string, Record<string, string[]>>;

const ACADEMIC_MODS = ['students', 'teachers', 'attendance', 'grading', 'schedule', 'curriculum', 'exams', 'theses'];
const FINANCE_MODS = ['contracts', 'scholarship', 'payroll', 'budget'];

function buildPermMatrix(): PermMatrix {
  const m: PermMatrix = {};
  for (const r of ROLES) {
    const rolePerms: Record<string, string[]> = {};
    m[r.id] = rolePerms;
    if (r.grants === '*') {
      for (const mod of ALL_MODULES) rolePerms[mod.id] = ['view', 'edit', 'create', 'delete', 'approve', 'export'];
      continue;
    }
    const g = r.grants;
    if (g.academic) for (const id of ACADEMIC_MODS) rolePerms[id] = [...(rolePerms[id] || []), ...g.academic];
    if (g.finance) for (const id of FINANCE_MODS) rolePerms[id] = [...(rolePerms[id] || []), ...g.finance];
    if (g.all) for (const mod of ALL_MODULES) rolePerms[mod.id] = [...(rolePerms[mod.id] || []), ...g.all];
    for (const k of Object.keys(g)) {
      if (k === 'academic' || k === 'finance' || k === 'all') continue;
      const verbs = g[k];
      if (verbs) rolePerms[k] = [...(rolePerms[k] || []), ...verbs];
    }
    for (const k of Object.keys(rolePerms)) rolePerms[k] = [...new Set(rolePerms[k])];
  }
  return m;
}

export const PERM_MATRIX = buildPermMatrix();

// ============== USERS ==============

const USER_STATUSES = ['Faol', 'Bloklangan', 'Taklif yuborilgan', 'Pauza'] as const;
const USER_BRANCHES = ['Navoiy (bosh)', 'Zarafshon filiali', 'Uchquduq filiali', 'Qiziltepa filiali'];
const USER_DEPARTMENTS = [
  'Dasturiy injiniring kafedrasi',
  'Axborot tizimlari kafedrasi',
  'Iqtisodiyot nazariyasi kafedrasi',
  'Menejment kafedrasi',
  'Energetika kafedrasi',
  'Pedagogika va psixologiya kafedrasi',
];

export type UserStatus = (typeof USER_STATUSES)[number];

export interface SystemUser {
  id: string;
  name: PersonName;
  login: string;
  email: string;
  phone: string;
  roles: string[];
  status: UserStatus;
  branch: string;
  department: string;
  twoFa: boolean;
  lastLogin: string;
  lastLoginDays: number;
  sessions: number;
  createdAt: string;
}

export function generateUsers(count: number = 20): SystemUser[] {
  return Array.from({ length: count }, (_, i) => {
    const n = generateName(i + 501, 0.42);

    let roles: string[];
    if (i === 0) roles = ['super-admin'];
    else if (i === 1) roles = ['super-admin'];
    else if (i === 2) roles = ['rector'];
    else if (i < 5) roles = ['vice-rector'];
    else if (i < 8) roles = ['dean', 'teacher'];
    else if (i < 10) roles = ['hr-manager'];
    else if (i < 13) roles = ['finance'];
    else if (i < 17) roles = ['teacher'];
    else if (i < 19) roles = ['crm-operator'];
    else roles = ['teacher', 'crm-operator'];

    const status: UserStatus = i === 9 ? 'Bloklangan' : i === 18 ? 'Taklif yuborilgan' : i === 15 ? 'Pauza' : 'Faol';
    const branch = pick(USER_BRANCHES, i + 507);
    const lastLoginDays = rnum(i + 509, 0, 60);
    const twoFa = roles.includes('super-admin') || roles.includes('rector') || roles.includes('finance') || seed(i + 511) < 0.4;
    const sessions = status === 'Faol' ? rnum(i + 513, 1, 4) : 0;

    const daysAgo = lastLoginDays;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const lastLogin = d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const createdD = new Date();
    createdD.setDate(createdD.getDate() - rnum(i + 600, 30, 365));
    const createdAt = createdD.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return {
      id: `USR-${String(1000 + i).padStart(5, '0')}`,
      name: n,
      login: `${n.last.toLowerCase()}.${n.first.charAt(0).toLowerCase()}`,
      email: generateEmail(n),
      phone: generatePhone(i + 515),
      roles,
      status,
      branch,
      department: pick(USER_DEPARTMENTS, i + 520),
      twoFa,
      lastLogin,
      lastLoginDays,
      sessions,
      createdAt,
    };
  });
}

// ============== AUDIT LOG ==============

interface AuditAction {
  kind: string;
  label: string;
  color: string;
  sev: 'critical' | 'warn' | 'info';
}

export interface AuditEntry {
  id: string;
  date: string;
  timestamp: string;
  action: AuditAction;
  desc: string;
  module: string;
  ip: string;
  actorName: PersonName;
  actorLogin: string;
}

const AUDIT_ACTIONS: AuditAction[] = [
  { kind: 'login', label: 'Tizimga kirish', color: '#3B82F6', sev: 'info' },
  { kind: 'edit', label: 'Tahrir qilish', color: '#F59E0B', sev: 'info' },
  { kind: 'create', label: 'Yaratish', color: '#2DB976', sev: 'info' },
  { kind: 'delete', label: "O'chirish", color: '#EF4444', sev: 'warn' },
  { kind: 'role_change', label: "Rol o'zgartirish", color: '#8B5CF6', sev: 'warn' },
  { kind: 'password_reset', label: 'Parol tiklash', color: '#F59E0B', sev: 'warn' },
  { kind: 'block', label: 'Foydalanuvchi bloklash', color: '#EF4444', sev: 'critical' },
  { kind: 'export', label: "Ma'lumot eksport", color: '#06B6D4', sev: 'info' },
];

const AUDIT_MODULES = ['Talabalar', "O'qituvchilar", 'Kontraktlar', 'HR', 'CRM', 'Buyruqlar', 'Rollar', 'Foydalanuvchilar', 'Sozlamalar'];

const AUDIT_DESCRIPTIONS = [
  "Talaba profilini yangiladi",
  "Yangi kontrakt yaratdi",
  "Stipendiya ro'yxatini eksport qildi",
  "O'qituvchi ma'lumotlarini tahrirladi",
  "Foydalanuvchiga rol biriktirdi",
  "Parolni qayta o'rnatdi",
  "Foydalanuvchini blokladi",
  "Yangi buyruq yaratdi",
  "Davomat jurnalini to'ldirdi",
  "Baholarni kiritdi",
  "CRM arizasini ko'rib chiqdi",
  "Kontrakt shartlarini o'zgartirdi",
  "Yangi foydalanuvchi qo'shdi",
  "HR hisobotini eksport qildi",
  "Tizim sozlamalarini o'zgartirdi",
];

export function generateAuditLog(count: number = 40): AuditEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const action = pick(AUDIT_ACTIONS, i * 3);
    const d = new Date();
    d.setHours(d.getHours() - rnum(i * 7, 0, 72));
    const date = d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timestamp = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const name = generateName(i + 800, 0.35);

    return {
      id: `AUD-${String(5000 + i).padStart(6, '0')}`,
      date,
      timestamp,
      action,
      desc: pick(AUDIT_DESCRIPTIONS, i * 5),
      module: pick(AUDIT_MODULES, i * 9),
      ip: `${rnum(i * 11, 10, 213)}.${rnum(i * 13, 0, 255)}.${rnum(i * 17, 0, 255)}.${rnum(i * 19, 1, 254)}`,
      actorName: name,
      actorLogin: `${name.last.toLowerCase()}.${name.first.charAt(0).toLowerCase()}`,
    };
  });
}
