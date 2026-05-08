import type { ListParams } from './common';

export type EmployeeStatus = 'active' | 'leave' | 'business_trip' | 'inactive';
export type OrderType =
  | 'hire'
  | 'fire'
  | 'transfer'
  | 'promotion'
  | 'salary_change'
  | 'leave'
  | 'business_trip'
  | 'bonus'
  | 'penalty';
export type OrderStatus = 'draft' | 'review' | 'signed' | 'cancelled';
export type LeaveType =
  | 'annual'
  | 'sick'
  | 'maternity'
  | 'unpaid'
  | 'business_trip'
  | 'study';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type DepartmentType = 'rektorat' | 'fakultet' | 'kafedra' | 'bolim';

export interface HrDepartment {
  id: number;
  name: string;
  code: string;
  type: DepartmentType;
  parentId: number | null;
  headId: number | null;
  headName: string | null;
  employeeCount: number;
}

export interface Position {
  code: string;
  name: string;
}

export interface Employee {
  id: number;
  employeeIdNumber: string;
  fullName: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  shortName: string;
  gender: { code: string; name: string };
  birthDate: string;
  department: HrDepartment;
  position: Position;
  academicDegree: { code: string; name: string };
  academicRank: { code: string; name: string };
  employmentForm: { code: string; name: string };
  hireDate: string;
  contractDate: string;
  contractNumber: string;
  phone: string;
  email: string;
  passport: string;
  pinfl: string;
  salary: number;
  experience: { years: number; months: number };
  status: EmployeeStatus;
  image: string | null;
}

export type EmployeeListItem = Pick<
  Employee,
  | 'id'
  | 'fullName'
  | 'shortName'
  | 'employeeIdNumber'
  | 'department'
  | 'position'
  | 'academicDegree'
  | 'academicRank'
  | 'status'
  | 'image'
>;

export interface EmployeeListParams extends ListParams {
  departmentId?: number;
  positionCode?: string;
  degreeCode?: string;
  status?: EmployeeStatus;
}

export interface CreateEmployeeDto {
  firstName: string;
  secondName: string;
  thirdName: string;
  gender: string;
  birthDate: string;
  departmentId: number;
  positionCode: string;
  academicDegree: string;
  academicRank: string;
  employmentForm: string;
  hireDate: string;
  phone: string;
  email: string;
  passport: string;
  pinfl: string;
  salary: number;
}

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

export interface HrOrder {
  id: string;
  number: string;
  type: OrderType;
  typeLabel: string;
  typeColor: string;
  title: string;
  employeeId: number;
  employeeName: string;
  date: string;
  effectiveDate: string;
  signer: string;
  basis: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderDto {
  type: OrderType;
  employeeId: number;
  effectiveDate: string;
  basis: string;
  title: string;
}

export interface Leave {
  id: string;
  employeeId: number;
  employeeName: string;
  departmentName: string;
  type: LeaveType;
  typeLabel: string;
  startDate: string;
  endDate: string;
  days: number;
  destination: string | null;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface CreateLeaveDto {
  employeeId: number;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  destination?: string;
}

export interface EmployeeAttendanceDay {
  date: string;
  status:
    | 'present'
    | 'absent'
    | 'leave'
    | 'sick'
    | 'business_trip'
    | 'weekend';
}

export interface EmployeeAttendanceRow {
  employeeId: number;
  employeeName: string;
  department: string;
  days: EmployeeAttendanceDay[];
}

export interface HrDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  onBusinessTrip: number;
  pendingOrders: number;
  pendingLeaves: number;
  byDepartment: { department: string; count: number; type?: string }[];
  byAge: { range: string; count: number }[];
  recentOrders: HrOrder[];
  scienceStats?: { dsc: number; phd: number; professor: number; dotsent: number };
}
