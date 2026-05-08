import type { Schedule } from './education';

export interface StudentCabinetData {
  student: {
    fullName: string;
    group: string;
    course: number;
    gpa: number;
    totalCredits: number;
    attendanceRate: number;
    image?: string;
  };
  todaySchedule: Schedule[];
  currentGrades: { subject: string; midterm?: number; assignment?: number; total: number }[];
  upcomingExams: { subject: string; date: string; room: string; type: string }[];
  notifications: { id: number; title: string; date: string; type: string }[];
}

export interface TeacherCabinetData {
  teacher: {
    fullName: string;
    department: string;
    position: string;
    image?: string;
  };
  todayClasses: Schedule[];
  myGroups: { groupName: string; studentCount: number; subjectName: string }[];
  pendingTasks: { title: string; dueDate: string; type: string }[];
  stats: {
    totalStudents: number;
    totalClasses: number;
    avgAttendance: number;
    pendingGrades: number;
  };
}
