export interface AdminDashboardData {
  totalStudents: number;
  totalEmployees: number;
  totalRevenue: number;
  totalDebt: number;
  attendanceRate: number;
  avgGrade: number;
  newStudents: number;
  graduatedStudents: number;
  studentsByFaculty: { faculty: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
  recentActivity: {
    id: number;
    type: string;
    description: string;
    date: string;
    user: string;
  }[];
}

export interface BuxgalterDashboardData {
  totalContracts: number;
  totalPaid: number;
  totalDebt: number;
  collectionRate: number;
  paymentsByMonth: { month: string; amount: number }[];
  topDebtors: { name: string; amount: number }[];
}

export interface DekanDashboardData {
  totalStudents: number;
  avgGrade: number;
  attendanceRate: number;
  scholarshipCount: number;
  studentsByCourse: { course: number; count: number }[];
  gradeDistribution: { range: string; count: number }[];
}

export interface OqituvchiDashboardData {
  totalGroups: number;
  totalStudents: number;
  avgAttendance: number;
  pendingGrades: number;
  todaySchedule: {
    time: string;
    group: string;
    subject: string;
    room: string;
  }[];
}

export interface TalabaDashboardData {
  gpa: number;
  credits: number;
  attendanceRate: number;
  debtAmount: number;
  todaySchedule: {
    time: string;
    subject: string;
    room: string;
    teacher: string;
  }[];
  upcomingExams: { subject: string; date: string; type: string }[];
}
