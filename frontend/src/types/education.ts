import type { ListParams } from './common';

export type LessonType = 'lecture' | 'practice' | 'lab' | 'seminar';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type GradeType = 'midterm' | 'final' | 'coursework';

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  hoursLecture: number;
  hoursPractice: number;
  departmentId: number;
  departmentName: string;
}

export interface Schedule {
  id: number;
  groupId: number;
  groupName: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  semesterId: number;
  dayOfWeek: number;
  pairNumber: number;
  room: string;
  lessonType: LessonType;
}

export interface AttendanceRecord {
  studentId: number;
  status: AttendanceStatus;
}

export interface BulkAttendanceDto {
  scheduleId: number;
  date: string;
  records: AttendanceRecord[];
}

export interface GradeRecord {
  studentId: number;
  score: string;
}

export interface BulkGradesDto {
  subjectId: number;
  semesterId: number;
  gradeType: GradeType;
  maxScore: string;
  records: GradeRecord[];
}

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  semesterId: number;
  gradeType: GradeType;
  score: number;
  maxScore: number;
  gradedByName: string;
}

export interface SubjectListParams extends ListParams {
  departmentId?: number;
}

export interface ScheduleListParams extends ListParams {
  groupId?: number;
  teacherId?: number;
  semesterId?: number;
  dayOfWeek?: number;
}

export interface GradeListParams extends ListParams {
  subjectId?: number;
  semesterId?: number;
  gradeType?: GradeType;
}
