import type { ListParams } from './common';

export interface Teacher {
  id: number;
  employeeId: number;
  fullName: string;
  shortName: string;
  department: string;
  departmentId: number;
  position: string;
  academicDegree: string;
  academicRank: string;
  subjects: string[];
  loadHours: number;
  maxLoadHours: number;
  phone: string;
  email: string;
  image?: string;
  employmentForm: 'shtatliy' | 'sovmestitel' | 'soatbay';
  status: 'active' | 'leave' | 'inactive';
}

export type TeacherListItem = Pick<
  Teacher,
  | 'id'
  | 'fullName'
  | 'shortName'
  | 'department'
  | 'position'
  | 'academicDegree'
  | 'academicRank'
  | 'employmentForm'
  | 'status'
  | 'image'
>;

export interface TeacherListParams extends ListParams {
  departmentId?: number;
  degreeCode?: string;
  rankCode?: string;
  employmentForm?: string;
}
