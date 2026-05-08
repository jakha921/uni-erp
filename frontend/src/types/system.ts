import type { ListParams } from './common';

export interface SystemUser {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  roles: SystemUserRole[];
  status: 'active' | 'blocked';
  lastLogin?: string;
  createdAt: string;
  image?: string;
}

export interface SystemUserRole {
  id: number;
  role: string;
  roleName: string;
  branchId: number;
  branchName: string;
}

export type SystemUserListItem = Pick<SystemUser, 'id' | 'fullName' | 'phone' | 'email' | 'roles' | 'status' | 'lastLogin' | 'image'>;

export interface SystemUserListParams extends ListParams {
  role?: string;
  status?: string;
  branchId?: number;
}

export interface CreateUserDto {
  firstName: string;
  secondName: string;
  phone: string;
  email?: string;
  password: string;
  roles: { role: string; branchId: number }[];
}

export interface UpdateUserDto {
  status?: string;
  roles?: { role: string; branchId: number }[];
}

export interface Role {
  id: string;
  name: string;
  nameUz: string;
  description: string;
  isSystem: boolean;
  permissions: Record<string, string[]>;
  userCount: number;
}

export interface CreateRoleDto {
  name: string;
  nameUz: string;
  description: string;
  permissions: Record<string, string[]>;
}

export interface AuditLogEntry {
  id: number;
  userId: number;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  module: string;
  objectType: string;
  objectId: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export interface AuditLogParams extends ListParams {
  action?: string;
  module?: string;
  severity?: string;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}
