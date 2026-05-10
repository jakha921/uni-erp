import type { CodeName, ListParams } from './common';

export interface Faculty {
  id: number;
  name: string;
  code: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  facultyId: number;
}

export interface Specialty {
  id: number;
  name: string;
  code: string;
  departmentId: number;
}

export interface Group {
  id: number;
  name: string;
  code: string;
  specialtyId: number;
  course: number;
  capacity: number;
  currentCount: number;
}

export type StudentStatus =
  | 'active'
  | 'academic_leave'
  | 'expelled'
  | 'graduated'
  | 'transferred';

export interface Student {
  id: number;
  fullName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  shortName: string;
  studentIdNumber: string;
  gender: CodeName;
  birthDate: string;
  faculty: Faculty;
  department: Department;
  specialty: Specialty;
  group: Group;
  course: number;
  level: CodeName;
  educationForm: CodeName;
  educationType: CodeName;
  paymentForm: CodeName;
  status: StudentStatus;
  educationYear: string;
  address: string;
  phone: string;
  email: string;
  passport: string;
  pinfl: string;
  avgGrade: number;
  image: string | null;
  createdAt: string;
}

export type StudentListItem = Pick<
  Student,
  | 'id'
  | 'fullName'
  | 'shortName'
  | 'studentIdNumber'
  | 'faculty'
  | 'group'
  | 'course'
  | 'status'
  | 'avgGrade'
  | 'image'
  | 'paymentForm'
  | 'educationForm'
>;

export interface StudentListParams extends ListParams {
  facultyId?: number;
  departmentId?: number;
  course?: number;
  status?: StudentStatus;
  educationForm?: string;
  paymentForm?: string;
  groupId?: number;
}

export interface CreateStudentDto {
  firstName: string;
  secondName: string;
  thirdName: string;
  gender: string;
  birthDate: string;
  facultyId: number;
  departmentId: number;
  specialtyId: number;
  groupId: number;
  level: string;
  educationForm: string;
  educationType: string;
  paymentForm: string;
  phone: string;
  email: string;
  passport: string;
  pinfl: string;
  address: string;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;

export interface StudentGrade {
  id: number;
  subjectName: string;
  subjectCode: string;
  gradeType: 'midterm' | 'final' | 'coursework';
  gradeTypeLabel: string;
  score: number;
  maxScore: number;
  semester: number;
  date: string;
  teacherName: string;
}

export interface StudentAttendance {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subjectName: string;
}

export interface StudentDocument {
  id: number;
  name: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface StudentStatistics {
  totalStudents: number;
  byFaculty: { faculty: string; count: number }[];
  byCourse: { course: number; count: number }[];
  byGender: { gender: string; count: number }[];
  byEducationForm: { form: string; count: number }[];
  byPaymentForm: { form: string; count: number }[];
  byStatus: { status: string; count: number }[];
}
