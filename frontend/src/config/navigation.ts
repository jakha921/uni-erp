import type { NavGroup } from '@/types/navigation';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    key: 'main',
    roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
    items: [
      { id: 'dashboard', label: 'Asosiy', icon: 'grid', path: '/dashboard', roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'] },
    ],
  },
  {
    label: 'TALABALAR',
    key: 'tal',
    roles: ['admin', 'dekan', 'oqituvchi'],
    items: [
      { id: 'students-stat', label: 'Statistika', icon: 'chart', path: '/students/statistics', roles: ['admin', 'dekan'] },
      { id: 'students-list', label: "Ro'yxat", icon: 'users', path: '/students', roles: ['admin', 'dekan'] },
      { id: 'my-students', label: 'Mening talabalarim', icon: 'graduation', path: '/my-students', roles: ['oqituvchi'] },
    ],
  },
  {
    label: "TA'LIM",
    key: 'edu',
    roles: ['admin'],
    items: [
      { id: 'teachers', label: "O'qituvchilar", icon: 'briefcase', path: '/teachers' },
      { id: 'attendance', label: 'Davomat', icon: 'check', path: '/attendance' },
      { id: 'grading', label: 'Baholash', icon: 'edit', path: '/grading' },
      { id: 'schedule', label: 'Dars jadvali', icon: 'calendar', path: '/schedule' },
      { id: 'exams', label: 'Imtihonlar', icon: 'award', path: '/exams' },
      { id: 'alumni', label: 'Bitiruvchilar', icon: 'graduation', path: '/alumni' },
      { id: 'internship', label: 'Amaliyot', icon: 'clipboard', path: '/internship' },
    ],
  },
  {
    label: "O'QUV JARAYONI",
    key: 'curr',
    roles: ['admin'],
    items: [
      { id: 'curriculum', label: "O'quv rejalar", icon: 'doc', path: '/curriculum' },
      { id: 'departments', label: 'Kafedralar', icon: 'building', path: '/departments' },
      { id: 'subjects', label: 'Fanlar', icon: 'book', path: '/subjects' },
      { id: 'library', label: 'Kutubxona', icon: 'book', path: '/library' },
    ],
  },
  {
    label: 'QABUL (CRM)',
    key: 'crm',
    roles: ['admin'],
    items: [
      { id: 'crm', label: 'Arizalar', icon: 'inbox', path: '/crm', count: 23 },
      { id: 'crm-kanban', label: 'Voronka', icon: 'chart', path: '/crm/kanban' },
      { id: 'crm-report', label: 'CRM hisobot', icon: 'chart', path: '/crm/report' },
    ],
  },
  {
    label: 'MOLIYA',
    key: 'fin',
    roles: ['admin', 'buxgalter', 'dekan'],
    items: [
      { id: 'finance', label: 'Moliyaviy panel', icon: 'wallet', path: '/finance', roles: ['admin', 'buxgalter', 'dekan'] },
      { id: 'moliya-contracts', label: 'Kontraktlar', icon: 'doc', path: '/finance/contracts', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-debtors', label: 'Qarzdorlar', icon: 'warning', path: '/finance/debtors', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-payments', label: "To'lovlar", icon: 'money', path: '/finance/payments', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-scholarship', label: 'Stipendiya', icon: 'award', path: '/finance/scholarship', roles: ['admin', 'buxgalter'] },
      { id: 'finance-report', label: 'Hisobot', icon: 'chart', path: '/finance/report', roles: ['admin', 'buxgalter', 'dekan'] },
      { id: 'payroll', label: 'Maosh', icon: 'money', path: '/finance/payroll', roles: ['admin'] },
      { id: 'budget', label: 'Byudjet', icon: 'wallet', path: '/finance/budget', roles: ['admin'] },
    ],
  },
  {
    label: 'KADRLAR',
    key: 'hr',
    roles: ['admin', 'dekan'],
    items: [
      { id: 'hr', label: 'Kadrlar paneli', icon: 'chart', path: '/hr' },
      { id: 'hr-employees', label: 'Xodimlar', icon: 'users', path: '/hr/employees' },
      { id: 'hr-departments', label: "Bo'limlar", icon: 'building', path: '/hr/departments' },
      { id: 'hr-orders', label: 'Buyruqlar', icon: 'doc', path: '/hr/orders' },
      { id: 'hr-attendance', label: 'Davomad', icon: 'calendar', path: '/hr/attendance' },
      { id: 'hr-leaves', label: "Ta'tillar va safar", icon: 'briefcase', path: '/hr/leaves' },
    ],
  },
  {
    label: 'XODIMLAR (eski)',
    key: 'hrold',
    roles: ['admin'],
    items: [
      { id: 'orders', label: 'Buyruqlar (eski)', icon: 'doc', path: '/orders' },
      { id: 'staffing', label: 'Shtatlash jadvali', icon: 'layers', path: '/staffing' },
    ],
  },
  {
    label: 'INFRATUZILMA',
    key: 'infra',
    roles: ['admin'],
    items: [
      { id: 'dormitory', label: 'TTJ (yotoqxona)', icon: 'home', path: '/dormitory' },
      { id: 'warehouse', label: 'Ombor', icon: 'warehouse', path: '/warehouse' },
      { id: 'equipment', label: 'Jihozlar', icon: 'box', path: '/equipment' },
      { id: 'transport', label: 'Transport', icon: 'truck', path: '/transport' },
    ],
  },
  {
    label: 'ILMIY FAOLIYAT',
    key: 'sci',
    roles: ['admin'],
    items: [
      { id: 'research', label: 'Ilmiy ishlar', icon: 'chart', path: '/research' },
      { id: 'theses', label: 'Diplom ishlari', icon: 'doc', path: '/theses' },
      { id: 'conferences', label: 'Konferensiyalar', icon: 'megaphone', path: '/conferences' },
      { id: 'patents', label: 'Patentlar', icon: 'star', path: '/patents' },
    ],
  },
  {
    label: 'KABINETLAR',
    key: 'cab',
    roles: ['admin'],
    items: [
      { id: 'student-cabinet', label: 'Talaba kabineti', icon: 'user', path: '/student-cabinet' },
      { id: 'teacher-cabinet', label: "O'qituvchi kabineti", icon: 'user', path: '/teacher-cabinet' },
    ],
  },
  {
    label: 'BOSHQARUV',
    key: 'ops',
    roles: ['admin'],
    items: [
      { id: 'tasks', label: 'Topshiriqlar', icon: 'check', path: '/tasks', count: 14 },
      { id: 'appeals', label: 'Murojaatlar', icon: 'inbox', path: '/appeals', count: 12 },
      { id: 'messages', label: 'Xabarlar', icon: 'mail', path: '/messages', count: 8 },
      { id: 'notifications', label: 'Bildirishnomalar', icon: 'bell', path: '/notifications', count: 5 },
      { id: 'news', label: 'Yangiliklar', icon: 'megaphone', path: '/news' },
    ],
  },
  {
    label: 'ADMIN',
    key: 'adm',
    roles: ['admin'],
    items: [
      { id: 'dms', label: 'Hujjat aylanishi', icon: 'folder', path: '/dms' },
      { id: 'analytics', label: 'Analytics', icon: 'chart', path: '/analytics' },
      { id: 'reports', label: 'Hisobotlar', icon: 'doc', path: '/reports' },
      { id: 'reference', label: "Ma'lumotnomalar", icon: 'book', path: '/reference' },
    ],
  },
  {
    label: 'PROFIL',
    key: 'pro',
    roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
    items: [
      { id: 'profile', label: 'Shaxsiy kabinet', icon: 'user', path: '/profile' },
      { id: 'settings', label: 'Sozlamalar', icon: 'settings', path: '/settings' },
    ],
  },
  {
    label: 'TIZIM',
    key: 'sys',
    roles: ['admin'],
    items: [
      { id: 'users', label: 'Foydalanuvchilar', icon: 'users', path: '/system/users', count: 32 },
      { id: 'roles', label: 'Rollar', icon: 'shield', path: '/system/roles' },
      { id: 'permissions', label: 'Ruxsatlar', icon: 'key', path: '/system/permissions' },
      { id: 'audit', label: 'Audit log', icon: 'eye', path: '/system/audit' },
    ],
  },
];
