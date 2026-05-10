export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
}

export interface Faculty {
  id: number;
  name: string;
  code: string;
  branchId: number;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  facultyId: number;
  headId?: number;
  headName?: string;
  staffCount?: number;
  studentCount?: number;
  avgGrade?: number;
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

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Semester {
  id: number;
  name: string;
  academicYearId: number;
  number: 1 | 2;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
