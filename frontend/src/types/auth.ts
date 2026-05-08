export type RoleKey = 'admin' | 'buxgalter' | 'dekan' | 'oqituvchi' | 'talaba';

export interface RoleDef {
  id: RoleKey;
  label: string;
  short: string;
  color: string;
  bg: string;
  fg: string;
  icon: string;
  desc: string;
}

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: RoleKey;
  facultyId: number | null;
  facultyName?: string;
  departmentId: number | null;
  departmentName?: string;
  employeeId: number | null;
  studentId: number | null;
  avatar: string | null;
  position?: string;
  degree?: string;
  rank?: string;
  rate?: string;
  studentIdNumber?: string;
  groupName?: string;
  level?: string;
  specialty?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  branch?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refresh?: string;
}
