import type { NavGroup } from '@/types/navigation';

export const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    key: 'main',
    roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'],
    items: [
      { id: 'dashboard', label: 'nav.dashboard', icon: 'grid', path: '/dashboard', roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi'] },
    ],
  },
  {
    label: 'nav.students',
    key: 'tal',
    roles: ['admin', 'dekan', 'oqituvchi'],
    items: [
      { id: 'students-stat', label: 'nav.studentsStat', icon: 'chart', path: '/students/statistics', roles: ['admin', 'dekan'] },
      { id: 'students-list', label: 'nav.studentsList', icon: 'users', path: '/students', roles: ['admin', 'dekan'] },
      { id: 'my-students', label: 'nav.myStudents', icon: 'graduation', path: '/my-students', roles: ['oqituvchi'] },
    ],
  },
  {
    label: 'nav.education',
    key: 'edu',
    roles: ['admin'],
    items: [
      { id: 'teachers', label: 'nav.teachers', icon: 'briefcase', path: '/teachers' },
      { id: 'attendance', label: 'nav.attendance', icon: 'check', path: '/attendance' },
      { id: 'grading', label: 'nav.grading', icon: 'edit', path: '/grading' },
      { id: 'schedule', label: 'nav.schedule', icon: 'calendar', path: '/schedule' },
      { id: 'exams', label: 'nav.exams', icon: 'award', path: '/exams' },
      { id: 'alumni', label: 'nav.alumni', icon: 'graduation', path: '/alumni' },
      { id: 'internship', label: 'nav.internship', icon: 'clipboard', path: '/internship' },
    ],
  },
  {
    label: 'nav.curriculum',
    key: 'curr',
    roles: ['admin'],
    items: [
      { id: 'curriculum', label: 'nav.curriculum', icon: 'doc', path: '/curriculum' },
      { id: 'departments', label: 'nav.departments', icon: 'building', path: '/departments' },
      { id: 'subjects', label: 'nav.subjects', icon: 'book', path: '/subjects' },
      { id: 'library', label: 'nav.library', icon: 'book', path: '/library' },
    ],
  },
  {
    label: 'nav.crm',
    key: 'crm',
    roles: ['admin'],
    items: [
      { id: 'crm', label: 'nav.leads', icon: 'inbox', path: '/crm', count: 23 },
      { id: 'crm-kanban', label: 'nav.kanban', icon: 'chart', path: '/crm/kanban' },
      { id: 'crm-report', label: 'nav.crmReport', icon: 'chart', path: '/crm/report' },
    ],
  },
  {
    label: 'nav.finance',
    key: 'fin',
    roles: ['admin', 'buxgalter', 'dekan'],
    items: [
      { id: 'finance', label: 'nav.financePanel', icon: 'wallet', path: '/finance', roles: ['admin', 'buxgalter', 'dekan'] },
      { id: 'moliya-contracts', label: 'nav.contracts', icon: 'doc', path: '/finance/contracts', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-debtors', label: 'nav.debtors', icon: 'warning', path: '/finance/debtors', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-payments', label: 'nav.payments', icon: 'money', path: '/finance/payments', roles: ['admin', 'buxgalter'] },
      { id: 'moliya-scholarship', label: 'nav.scholarships', icon: 'award', path: '/finance/scholarship', roles: ['admin', 'buxgalter'] },
      { id: 'finance-report', label: 'nav.report', icon: 'chart', path: '/finance/report', roles: ['admin', 'buxgalter', 'dekan'] },
      { id: 'payroll', label: 'nav.payroll', icon: 'money', path: '/finance/payroll', roles: ['admin'] },
      { id: 'budget', label: 'nav.budget', icon: 'wallet', path: '/finance/budget', roles: ['admin'] },
    ],
  },
  {
    label: 'nav.hr',
    key: 'hr',
    roles: ['admin', 'dekan'],
    items: [
      { id: 'hr', label: 'nav.hrPanel', icon: 'chart', path: '/hr' },
      { id: 'hr-employees', label: 'nav.employees', icon: 'users', path: '/hr/employees' },
      { id: 'hr-departments', label: 'nav.departments', icon: 'building', path: '/hr/departments' },
      { id: 'hr-orders', label: 'nav.orders', icon: 'doc', path: '/hr/orders' },
      { id: 'hr-attendance', label: 'nav.hrAttendance', icon: 'calendar', path: '/hr/attendance' },
      { id: 'hr-leaves', label: 'nav.leaves', icon: 'briefcase', path: '/hr/leaves' },
    ],
  },
  {
    label: 'nav.legacy',
    key: 'hrold',
    roles: ['admin'],
    items: [
      { id: 'orders', label: 'nav.orders', icon: 'doc', path: '/orders' },
      { id: 'staffing', label: 'nav.staffing', icon: 'layers', path: '/staffing' },
    ],
  },
  {
    label: 'nav.infrastructure',
    key: 'infra',
    roles: ['admin'],
    items: [
      { id: 'dormitory', label: 'nav.dormitory', icon: 'home', path: '/dormitory' },
      { id: 'warehouse', label: 'nav.warehouse', icon: 'warehouse', path: '/warehouse' },
      { id: 'equipment', label: 'nav.equipment', icon: 'box', path: '/equipment' },
      { id: 'transport', label: 'nav.transport', icon: 'truck', path: '/transport' },
    ],
  },
  {
    label: 'nav.science',
    key: 'sci',
    roles: ['admin'],
    items: [
      { id: 'research', label: 'nav.research', icon: 'chart', path: '/research' },
      { id: 'theses', label: 'nav.theses', icon: 'doc', path: '/theses' },
      { id: 'conferences', label: 'nav.conferences', icon: 'megaphone', path: '/conferences' },
      { id: 'patents', label: 'nav.patents', icon: 'star', path: '/patents' },
    ],
  },
  {
    label: 'nav.cabinets',
    key: 'cab',
    roles: ['admin'],
    items: [
      { id: 'student-cabinet', label: 'nav.studentCabinet', icon: 'user', path: '/student-cabinet' },
      { id: 'teacher-cabinet', label: 'nav.teacherCabinet', icon: 'user', path: '/teacher-cabinet' },
    ],
  },
  {
    label: 'nav.operations',
    key: 'ops',
    roles: ['admin'],
    items: [
      { id: 'tasks', label: 'nav.tasks', icon: 'check', path: '/tasks', count: 14 },
      { id: 'appeals', label: 'nav.appeals', icon: 'inbox', path: '/appeals', count: 12 },
      { id: 'messages', label: 'nav.messages', icon: 'mail', path: '/messages', count: 8 },
      { id: 'notifications', label: 'nav.notifications', icon: 'bell', path: '/notifications', count: 5 },
      { id: 'news', label: 'nav.news', icon: 'megaphone', path: '/news' },
    ],
  },
  {
    label: 'nav.admin',
    key: 'adm',
    roles: ['admin'],
    items: [
      { id: 'dms', label: 'nav.dms', icon: 'folder', path: '/dms' },
      { id: 'analytics', label: 'nav.analytics', icon: 'chart', path: '/analytics' },
      { id: 'reports', label: 'nav.reports', icon: 'doc', path: '/reports' },
      { id: 'reference', label: 'nav.references', icon: 'book', path: '/reference' },
    ],
  },
  {
    label: 'nav.profile',
    key: 'pro',
    roles: ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'],
    items: [
      { id: 'profile', label: 'nav.profile', icon: 'user', path: '/profile' },
      { id: 'settings', label: 'nav.settings', icon: 'settings', path: '/settings' },
    ],
  },
  {
    label: 'nav.system',
    key: 'sys',
    roles: ['admin'],
    items: [
      { id: 'users', label: 'nav.users', icon: 'users', path: '/system/users', count: 32 },
      { id: 'roles', label: 'nav.roles', icon: 'shield', path: '/system/roles' },
      { id: 'permissions', label: 'nav.permissions', icon: 'key', path: '/system/permissions' },
      { id: 'audit', label: 'nav.auditLog', icon: 'eye', path: '/system/audit' },
    ],
  },
];
