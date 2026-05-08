import { useAuthStore } from '@/stores/auth.store';
import type { RoleKey } from '@/types/auth';

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalEmployees: number;
  totalContracts: number;
  totalRevenue: number;
  totalDebt: number;
  collectionRate: number;
  debtorCount: number;
  crmLeads: number;
  attendanceRate: number;
  avgGpa: number;
  scholarshipCount: number;
}

interface ActivityItem {
  id: string;
  icon: 'money' | 'users' | 'doc' | 'check';
  color: string;
  bg: string;
  title: string;
  sub: string;
  time: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface UseDashboardStatsReturn {
  stats: DashboardStats;
  activities: ActivityItem[];
  studentsByRegion: ChartDataItem[];
  studentsByGender: ChartDataItem[];
  monthlyPayments: ChartDataItem[];
  studentsByCourse: ChartDataItem[];
  role: RoleKey;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const role = useAuthStore((s) => s.currentUser?.role ?? 'admin');

  const stats: DashboardStats = {
    totalStudents: 4856,
    activeStudents: 4102,
    totalEmployees: 312,
    totalContracts: 3245,
    totalRevenue: 18_500_000_000,
    totalDebt: 3_200_000_000,
    collectionRate: 82.7,
    debtorCount: 847,
    crmLeads: 156,
    attendanceRate: 87.3,
    avgGpa: 3.42,
    scholarshipCount: 234,
  };

  const activities: ActivityItem[] = [
    {
      id: '1',
      icon: 'money',
      color: '#10B981',
      bg: '#ECFDF5',
      title: "To'lov qabul qilindi",
      sub: "Xolmatov A. — 2 500 000 so'm",
      time: '5 daqiqa oldin',
    },
    {
      id: '2',
      icon: 'users',
      color: '#3B82F6',
      bg: '#EFF6FF',
      title: "Yangi talaba qo'shildi",
      sub: 'Karimova N. — AT-21',
      time: '15 daqiqa oldin',
    },
    {
      id: '3',
      icon: 'doc',
      color: '#8B5CF6',
      bg: '#F5F3FF',
      title: 'Buyruq imzolandi',
      sub: '#2024-156 — Ishga qabul',
      time: '1 soat oldin',
    },
    {
      id: '4',
      icon: 'check',
      color: '#F59E0B',
      bg: '#FFFBEB',
      title: 'Davomat tasdiqlandi',
      sub: 'AT-31 guruhi — Bugun',
      time: '2 soat oldin',
    },
    {
      id: '5',
      icon: 'doc',
      color: '#EC4899',
      bg: '#FDF2F8',
      title: 'Yangi CRM ariza',
      sub: "IT yo'nalishi — Telegram",
      time: '3 soat oldin',
    },
  ];

  const studentsByRegion: ChartDataItem[] = [
    { name: 'Navoiy', value: 2100, color: '#2DB976' },
    { name: 'Zarafshon', value: 1500, color: '#3B82F6' },
    { name: 'Uchquduq', value: 856, color: '#F59E0B' },
    { name: 'Boshqa', value: 400, color: '#94A3B8' },
  ];

  const studentsByGender: ChartDataItem[] = [
    { name: 'Erkak', value: 2834, color: '#3B82F6' },
    { name: 'Ayol', value: 2022, color: '#EC4899' },
  ];

  const monthlyPayments: ChartDataItem[] = [
    { name: 'Yan', value: 1200, color: '#2DB976' },
    { name: 'Fev', value: 1800, color: '#2DB976' },
    { name: 'Mar', value: 2200, color: '#2DB976' },
    { name: 'Apr', value: 1900, color: '#2DB976' },
    { name: 'May', value: 2500, color: '#2DB976' },
    { name: 'Iyun', value: 2100, color: '#2DB976' },
    { name: 'Iyul', value: 800, color: '#2DB976' },
    { name: 'Avg', value: 600, color: '#2DB976' },
    { name: 'Sen', value: 3200, color: '#2DB976' },
    { name: 'Okt', value: 2800, color: '#2DB976' },
    { name: 'Noy', value: 2400, color: '#2DB976' },
    { name: 'Dek', value: 1600, color: '#2DB976' },
  ];

  const studentsByCourse: ChartDataItem[] = [
    { name: '1-kurs', value: 1450, color: '#3B82F6' },
    { name: '2-kurs', value: 1280, color: '#3B82F6' },
    { name: '3-kurs', value: 1150, color: '#3B82F6' },
    { name: '4-kurs', value: 976, color: '#3B82F6' },
  ];

  return {
    stats,
    activities,
    studentsByRegion,
    studentsByGender,
    monthlyPayments,
    studentsByCourse,
    role,
  };
}
