import { delay } from './delay';
import type {
  AdminDashboardData,
  BuxgalterDashboardData,
  DekanDashboardData,
  OqituvchiDashboardData,
  TalabaDashboardData,
} from '@/types/dashboard';
import type { IDashboardService } from '../services/dashboard.service';

export class DashboardMockService implements IDashboardService {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    await delay(400);

    return {
      totalStudents: 3247,
      totalEmployees: 412,
      totalRevenue: 48_500_000_000,
      totalDebt: 12_300_000_000,
      attendanceRate: 87.4,
      avgGrade: 73.2,
      newStudents: 856,
      graduatedStudents: 724,
      studentsByFaculty: [
        { faculty: 'Kompyuter fanlari', count: 845 },
        { faculty: 'Iqtisodiyot', count: 672 },
        { faculty: 'Pedagogika', count: 589 },
        { faculty: 'Filologiya', count: 534 },
        { faculty: 'Matematika', count: 607 },
      ],
      revenueByMonth: [
        { month: 'Sen', amount: 12_500_000_000 },
        { month: 'Okt', amount: 8_200_000_000 },
        { month: 'Noy', amount: 6_800_000_000 },
        { month: 'Dek', amount: 5_400_000_000 },
        { month: 'Yan', amount: 9_100_000_000 },
        { month: 'Fev', amount: 6_500_000_000 },
      ],
      recentActivity: [
        {
          id: 1,
          type: 'student',
          description: "Yangi talaba qo'shildi: Karimov Jasur",
          date: '2026-05-08T10:30:00',
          user: 'admin@uni.uz',
        },
        {
          id: 2,
          type: 'payment',
          description: "To'lov qabul qilindi: 4 500 000 so'm",
          date: '2026-05-08T09:45:00',
          user: 'buxgalter@uni.uz',
        },
        {
          id: 3,
          type: 'grade',
          description: "Baholar kiritildi: KF-21 guruh, Algoritmlar",
          date: '2026-05-07T16:20:00',
          user: 'karimov.u@uni.uz',
        },
        {
          id: 4,
          type: 'hr',
          description: "Yangi xodim qo'shildi: Rahimov S.",
          date: '2026-05-07T14:10:00',
          user: 'hr@uni.uz',
        },
        {
          id: 5,
          type: 'system',
          description: 'Tizim yangilandi: v2.4.1',
          date: '2026-05-07T08:00:00',
          user: 'system',
        },
      ],
    };
  }

  async getBuxgalterDashboard(): Promise<BuxgalterDashboardData> {
    await delay(300);

    return {
      totalContracts: 2850,
      totalPaid: 36_200_000_000,
      totalDebt: 12_300_000_000,
      collectionRate: 74.6,
      paymentsByMonth: [
        { month: 'Sen', amount: 12_500_000_000 },
        { month: 'Okt', amount: 8_200_000_000 },
        { month: 'Noy', amount: 6_800_000_000 },
        { month: 'Dek', amount: 5_400_000_000 },
        { month: 'Yan', amount: 9_100_000_000 },
        { month: 'Fev', amount: 6_500_000_000 },
      ],
      topDebtors: [
        { name: 'Toshmatov Bekzod', amount: 15_000_000 },
        { name: "Xolmatova Madina", amount: 13_500_000 },
        { name: 'Yusupova Dilnoza', amount: 12_800_000 },
        { name: "Mirzayev Otabek", amount: 11_200_000 },
        { name: 'Abdullayev Aziz', amount: 10_500_000 },
        { name: 'Saidova Nilufar', amount: 9_800_000 },
        { name: 'Norqulov Jahongir', amount: 9_200_000 },
        { name: "Ergasheva Sevara", amount: 8_700_000 },
        { name: 'Tursunov Akbar', amount: 8_100_000 },
        { name: 'Sobirova Gulnora', amount: 7_500_000 },
      ],
    };
  }

  async getDekanDashboard(): Promise<DekanDashboardData> {
    await delay(300);

    return {
      totalStudents: 845,
      avgGrade: 74.8,
      attendanceRate: 89.2,
      scholarshipCount: 67,
      studentsByCourse: [
        { course: 1, count: 245 },
        { course: 2, count: 218 },
        { course: 3, count: 203 },
        { course: 4, count: 179 },
      ],
      gradeDistribution: [
        { range: '90-100', count: 85 },
        { range: '80-89', count: 178 },
        { range: '70-79', count: 245 },
        { range: '60-69', count: 198 },
        { range: '50-59', count: 89 },
        { range: '0-49', count: 50 },
      ],
    };
  }

  async getOqituvchiDashboard(): Promise<OqituvchiDashboardData> {
    await delay(300);

    return {
      totalGroups: 6,
      totalStudents: 168,
      avgAttendance: 88.5,
      pendingGrades: 24,
      todaySchedule: [
        { time: '08:30', group: 'KF-21', subject: "Algoritmlar va ma'lumotlar tuzilmasi", room: '301-A' },
        { time: '10:15', group: 'KF-32', subject: "Ma'lumotlar bazalari", room: '205-B' },
        { time: '12:00', group: 'KF-11', subject: 'Dasturlash asoslari', room: '301-A' },
        { time: '14:00', group: 'KF-42', subject: 'Diplom ishi', room: '108-C' },
      ],
    };
  }

  async getTalabaDashboard(): Promise<TalabaDashboardData> {
    await delay(300);

    return {
      gpa: 3.67,
      credits: 124,
      attendanceRate: 91.3,
      debtAmount: 4_500_000,
      todaySchedule: [
        { time: '08:30', subject: "Algoritmlar va ma'lumotlar tuzilmasi", room: '301-A', teacher: 'Karimov U.B.' },
        { time: '10:15', subject: 'Veb-dasturlash', room: '205-B', teacher: 'Nazarova M.A.' },
        { time: '12:00', subject: 'Kompyuter tarmoqlari', room: '110-C', teacher: 'Xolmatov A.S.' },
      ],
      upcomingExams: [
        { subject: "Algoritmlar va ma'lumotlar tuzilmasi", date: '2026-06-10', type: 'Yakuniy nazorat' },
        { subject: "Ma'lumotlar bazalari", date: '2026-06-14', type: 'Yakuniy nazorat' },
        { subject: 'Veb-dasturlash', date: '2026-06-18', type: 'Yakuniy nazorat' },
        { subject: 'Kompyuter tarmoqlari', date: '2026-06-22', type: 'Yakuniy nazorat' },
      ],
    };
  }
}
