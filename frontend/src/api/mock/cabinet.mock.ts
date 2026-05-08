import { delay } from './delay';
import { SUBJECTS, DEPARTMENTS } from './shared-data';
import type { StudentCabinetData, TeacherCabinetData } from '@/types/cabinet';
import type { ICabinetService } from '../services/cabinet.service';

export class CabinetMockService implements ICabinetService {
  async getStudentCabinet(): Promise<StudentCabinetData> {
    await delay(300);
    return {
      student: {
        fullName: 'Xolmatova Nodira Baxromovna',
        group: '301-22',
        course: 3,
        gpa: 86.4,
        totalCredits: 120,
        attendanceRate: 94,
      },
      todaySchedule: [
        { id: 1, groupId: 5, groupName: '301-22', subjectId: 1, subjectName: SUBJECTS[0]!, teacherId: 1, teacherName: 'Rahimov S.', semesterId: 2, dayOfWeek: 1, pairNumber: 1, room: '301-A', lessonType: 'lecture' },
        { id: 2, groupId: 5, groupName: '301-22', subjectId: 3, subjectName: SUBJECTS[2]!, teacherId: 2, teacherName: 'Karimov A.', semesterId: 2, dayOfWeek: 1, pairNumber: 2, room: 'Lab-2', lessonType: 'practice' },
        { id: 3, groupId: 5, groupName: '301-22', subjectId: 7, subjectName: SUBJECTS[6]!, teacherId: 3, teacherName: 'Tursunov B.', semesterId: 2, dayOfWeek: 1, pairNumber: 3, room: '205-B', lessonType: 'seminar' },
      ],
      currentGrades: [
        { subject: SUBJECTS[0]!, midterm: 28, assignment: 18, total: 82 },
        { subject: SUBJECTS[2]!, midterm: 30, assignment: 19, total: 91 },
        { subject: SUBJECTS[6]!, midterm: 25, assignment: 16, total: 78 },
        { subject: SUBJECTS[7]!, midterm: 27, assignment: 20, total: 88 },
      ],
      upcomingExams: [
        { subject: SUBJECTS[0]!, date: '2026-06-10', room: 'Sinov zali', type: 'final' },
        { subject: SUBJECTS[2]!, date: '2026-06-14', room: '301-A', type: 'final' },
      ],
      notifications: [
        { id: 1, title: "To'lov muddati yaqinlashmoqda", date: '2026-05-06', type: 'warning' },
        { id: 2, title: "Yangi dars jadvali e'lon qilindi", date: '2026-05-05', type: 'info' },
      ],
    };
  }

  async getTeacherCabinet(): Promise<TeacherCabinetData> {
    await delay(300);
    return {
      teacher: {
        fullName: "Toshmatov Raximberdi Qo'chqorovich",
        department: DEPARTMENTS[0]!,
        position: 'Dotsent',
      },
      todayClasses: [
        { id: 1, groupId: 1, groupName: '101-21', subjectId: 1, subjectName: SUBJECTS[0]!, teacherId: 4, teacherName: "Toshmatov R.", semesterId: 2, dayOfWeek: 1, pairNumber: 1, room: '301-A', lessonType: 'lecture' },
        { id: 2, groupId: 3, groupName: '201-21', subjectId: 7, subjectName: SUBJECTS[6]!, teacherId: 4, teacherName: "Toshmatov R.", semesterId: 2, dayOfWeek: 1, pairNumber: 3, room: 'Lab-1', lessonType: 'lab' },
      ],
      myGroups: [
        { groupName: '101-21', studentCount: 28, subjectName: SUBJECTS[0]! },
        { groupName: '201-21', studentCount: 25, subjectName: SUBJECTS[6]! },
        { groupName: '301-22', studentCount: 22, subjectName: SUBJECTS[7]! },
      ],
      pendingTasks: [
        { title: "Oraliq nazorat baholarini kiritish", dueDate: '2026-05-12', type: 'grading' },
        { title: "Kurs ishi mavzularini tasdiqlash", dueDate: '2026-05-15', type: 'thesis' },
      ],
      stats: { totalStudents: 75, totalClasses: 12, avgAttendance: 91, pendingGrades: 8 },
    };
  }
}
