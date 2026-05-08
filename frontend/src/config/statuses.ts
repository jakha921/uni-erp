type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

export const STUDENT_STATUSES: Record<string, StatusConfig> = {
  active: { label: "O'qimoqda", variant: 'success' },
  academic_leave: { label: "Akademik ta'til", variant: 'warning' },
  expelled: { label: 'Chetlatilgan', variant: 'error' },
  graduated: { label: 'Bitirgan', variant: 'info' },
  transferred: { label: "Ko'chirilgan", variant: 'default' },
};

export const EMPLOYEE_STATUSES: Record<string, StatusConfig> = {
  active: { label: 'Faol', variant: 'success' },
  leave: { label: "Ta'tilda", variant: 'warning' },
  business_trip: { label: 'Xizmat safari', variant: 'info' },
  inactive: { label: 'Nofaol', variant: 'default' },
};

export const CONTRACT_STATUSES: Record<string, StatusConfig> = {
  active: { label: 'Faol', variant: 'success' },
  completed: { label: 'Yakunlangan', variant: 'default' },
  cancelled: { label: 'Bekor qilingan', variant: 'error' },
};

export const ORDER_STATUSES: Record<string, StatusConfig> = {
  draft: { label: 'Qoralama', variant: 'default' },
  review: { label: "Ko'rib chiqilmoqda", variant: 'warning' },
  signed: { label: 'Imzolangan', variant: 'success' },
  cancelled: { label: 'Bekor qilingan', variant: 'error' },
};

export const LEAVE_STATUSES: Record<string, StatusConfig> = {
  pending: { label: 'Kutilmoqda', variant: 'warning' },
  approved: { label: 'Tasdiqlangan', variant: 'success' },
  rejected: { label: 'Rad etilgan', variant: 'error' },
};

export const LEAD_STATUSES: Record<string, StatusConfig> = {
  new: { label: 'Yangi', variant: 'info' },
  contacted: { label: "Qo'ng'iroq qilingan", variant: 'warning' },
  interested: { label: 'Qiziqmoqda', variant: 'default' },
  applied: { label: 'Hujjat topshirgan', variant: 'info' },
  enrolled: { label: 'Qabul qilingan', variant: 'success' },
  rejected: { label: 'Rad etilgan', variant: 'error' },
};

export const TASK_STATUSES: Record<string, StatusConfig> = {
  todo: { label: 'Bajarilishi kerak', variant: 'default' },
  in_progress: { label: 'Bajarilmoqda', variant: 'info' },
  review: { label: "Ko'rib chiqilmoqda", variant: 'warning' },
  done: { label: 'Bajarildi', variant: 'success' },
};

export const TASK_PRIORITIES: Record<string, StatusConfig> = {
  low: { label: 'Past', variant: 'default' },
  medium: { label: "O'rta", variant: 'info' },
  high: { label: 'Yuqori', variant: 'warning' },
  urgent: { label: 'Shoshilinch', variant: 'error' },
};

export const DOCUMENT_STATUSES: Record<string, StatusConfig> = {
  draft: { label: 'Qoralama', variant: 'default' },
  pending: { label: 'Kutilmoqda', variant: 'warning' },
  approved: { label: 'Tasdiqlangan', variant: 'success' },
  rejected: { label: 'Rad etilgan', variant: 'error' },
  archived: { label: 'Arxivlangan', variant: 'default' },
};

export const DOCUMENT_PRIORITIES: Record<string, StatusConfig> = {
  low: { label: 'Past', variant: 'default' },
  medium: { label: "O'rta", variant: 'info' },
  high: { label: 'Yuqori', variant: 'warning' },
  urgent: { label: 'Shoshilinch', variant: 'error' },
};

export const EQUIPMENT_STATUSES: Record<string, StatusConfig> = {
  working: { label: 'Ishlamoqda', variant: 'success' },
  repair: { label: "Ta'mirda", variant: 'warning' },
  written_off: { label: 'Hisobdan chiqarilgan', variant: 'error' },
  storage: { label: 'Omborda', variant: 'default' },
};

export const VEHICLE_STATUSES: Record<string, StatusConfig> = {
  available: { label: 'Faol', variant: 'success' },
  in_use: { label: 'Foydalanishda', variant: 'info' },
  repair: { label: "Ta'mirda", variant: 'warning' },
  decommissioned: { label: 'Nofaol', variant: 'default' },
};

export const ROOM_STATUSES: Record<string, StatusConfig> = {
  available: { label: "Bo'sh", variant: 'default' },
  partial: { label: 'Qisman', variant: 'warning' },
  full: { label: "To'liq", variant: 'success' },
  repair: { label: "Ta'mirda", variant: 'error' },
};

export const INTERNSHIP_STATUSES: Record<string, StatusConfig> = {
  planned: { label: 'Rejalashtirilgan', variant: 'default' },
  active: { label: 'Joriy', variant: 'info' },
  completed: { label: 'Yakunlangan', variant: 'success' },
};

export const ALUMNI_STATUSES: Record<string, StatusConfig> = {
  employed: { label: 'Ishlamoqda', variant: 'success' },
  unemployed: { label: 'Ish qidiryapti', variant: 'default' },
  studying: { label: 'Magistraturada', variant: 'info' },
  unknown: { label: "Noma'lum", variant: 'warning' },
};

export const EMPLOYMENT_FORMS: Record<string, string> = {
  shtatliy: 'Shtatliy',
  sovmestitel: 'Sovmestitel',
  soatbay: 'Soatbay',
};

export function getStatusConfig(configs: Record<string, StatusConfig>, status: string): StatusConfig {
  return configs[status] ?? { label: status, variant: 'default' as BadgeVariant };
}
