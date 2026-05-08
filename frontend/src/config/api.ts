export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
  },
  students: {
    list: '/students',
    detail: (id: number) => `/students/${id}`,
    create: '/students',
    statistics: '/students/statistics',
    grades: (id: number) => `/students/${id}/grades`,
    attendance: (id: number) => `/students/${id}/attendance`,
  },
  finance: {
    contracts: '/finance/contracts',
    contractDetail: (id: string) => `/finance/contracts/${id}`,
    payments: '/finance/payments',
    scholarships: '/finance/scholarships',
    dashboard: '/finance/dashboard',
    report: '/finance/report',
  },
  hr: {
    employees: '/hr/employees',
    employeeDetail: (id: number) => `/hr/employees/${id}`,
    departments: '/hr/departments',
    orders: '/hr/orders',
    attendance: '/hr/attendance',
    leaves: '/hr/leaves',
    dashboard: '/hr/dashboard',
  },
} as const;
