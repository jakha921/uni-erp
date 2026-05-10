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

// ---------- Exam types ----------

export type ExamType = 'midterm' | 'final';
export type ExamStatus = 'scheduled' | 'active' | 'completed';

export interface Exam {
  id: number;
  subjectId: number;
  subjectName: string;
  groupId: number;
  groupName: string;
  examDate: string;
  room: string;
  type: ExamType;
  semesterId: number;
  teacherId: number;
  teacherName: string;
  status: ExamStatus;
}

export interface ExamListParams extends ListParams {
  semesterId?: number;
  groupId?: number;
  subjectId?: number;
  type?: string;
}

export interface CreateExamDto {
  subjectId: number;
  groupId: number;
  examDate: string;
  room: string;
  type: ExamType;
  teacherId: number;
}

export type UpdateExamDto = Partial<CreateExamDto>;

// ---------- Curriculum types ----------

export type ControlForm = 'exam' | 'credit' | 'diff_credit';

export interface CurriculumSubject {
  id: number;
  subjectId: number;
  subjectName: string;
  semester: number;
  credits: number;
  hoursLecture: number;
  hoursPractice: number;
  hoursLab: number;
  controlForm: ControlForm;
  isElective: boolean;
}

export interface Curriculum {
  id: number;
  specialtyId: number;
  specialtyName: string;
  year: number;
  totalCredits: number;
  subjects: CurriculumSubject[];
}

export interface CurriculumListParams {
  specialtyId?: number;
  year?: number;
}

export interface CreateCurriculumDto {
  specialtyId: number;
  year: number;
  subjects: Omit<CurriculumSubject, 'id' | 'subjectName'>[];
}

export type UpdateCurriculumDto = Partial<CreateCurriculumDto>;

// ---------- Library types ----------

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  year: number;
  category: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
}

export type LoanStatus = 'active' | 'returned' | 'overdue';

export interface BookLoan {
  id: number;
  bookId: number;
  bookTitle: string;
  studentId: number;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
}

export interface BookListParams extends ListParams {
  category?: string;
  available?: boolean;
}

export interface LoanListParams extends ListParams {
  status?: string;
  studentId?: number;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  year: number;
  category: string;
  totalCopies: number;
  location: string;
}

export type UpdateBookDto = Partial<CreateBookDto>;

export interface CreateLoanDto {
  bookId: number;
  studentId: number;
  dueDate: string;
}

export interface BookQueueEntry {
  id: number;
  bookId: number;
  bookTitle: string;
  studentId: number;
  studentName: string;
  requestDate: string;
  position: number;
  estimatedAvailableDate?: string;
}

export interface CreateQueueEntryDto {
  bookId: number;
  studentId: number;
}

// ---------- Alumni types ----------

export type AlumniStatus = 'employed' | 'unemployed' | 'studying' | 'unknown';

export interface Alumni {
  id: number;
  fullName: string;
  graduationYear: number;
  faculty: string;
  specialty: string;
  workplace: string;
  position: string;
  phone: string;
  email: string;
  status: AlumniStatus;
}

export interface AlumniListParams extends ListParams {
  graduationYear?: number;
  facultyId?: number;
  status?: string;
}

export interface CreateAlumniDto {
  fullName: string;
  graduationYear: number;
  faculty: string;
  specialty: string;
  workplace?: string;
  position?: string;
  phone: string;
  email?: string;
}

export type UpdateAlumniDto = Partial<CreateAlumniDto>;

// ---------- Internship types ----------

export type InternshipType = 'production' | 'pre_diploma';
export type InternshipStatus = 'planned' | 'active' | 'completed';

export interface Internship {
  id: number;
  studentId: number;
  studentName: string;
  companyName: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  type: InternshipType;
  status: InternshipStatus;
  grade?: number;
  reportSubmitted: boolean;
}

export interface InternshipListParams extends ListParams {
  status?: string;
  type?: string;
  groupId?: number;
}

export interface CreateInternshipDto {
  studentId: number;
  companyName: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  type: InternshipType;
}

export type UpdateInternshipDto = Partial<CreateInternshipDto>;
