import type {
  SystemUser, SystemUserListItem, SystemUserListParams,
  CreateUserDto, UpdateUserDto,
  Role, CreateRoleDto,
  AuditLogEntry, AuditLogParams,
} from '@/types/system';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { SystemMockService } from '../mock/system.mock';

export interface ISystemService {
  getUsers(params: SystemUserListParams): Promise<PaginatedResponse<SystemUserListItem>>;
  getUserById(id: number): Promise<SystemUser>;
  createUser(data: CreateUserDto): Promise<SystemUser>;
  updateUser(id: number, data: UpdateUserDto): Promise<SystemUser>;
  blockUser(id: number): Promise<void>;
  getRoles(): Promise<Role[]>;
  getRoleById(id: string): Promise<Role>;
  createRole(data: CreateRoleDto): Promise<Role>;
  updateRole(id: string, data: CreateRoleDto): Promise<Role>;
  getAuditLog(params: AuditLogParams): Promise<PaginatedResponse<AuditLogEntry>>;
}

class SystemApiService implements ISystemService {
  async getUsers(params: SystemUserListParams) {
    return apiClient.get<PaginatedResponse<SystemUserListItem>>(ENDPOINTS.system.users, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, role: params.role, status: params.status, branch_id: params.branchId },
    });
  }
  async getUserById(id: number) { return apiClient.get<SystemUser>(ENDPOINTS.system.userDetail(id)); }
  async createUser(data: CreateUserDto) { return apiClient.post<SystemUser>(ENDPOINTS.system.users, data); }
  async updateUser(id: number, data: UpdateUserDto) { return apiClient.patch<SystemUser>(ENDPOINTS.system.userDetail(id), data); }
  async blockUser(id: number) { return apiClient.patch<void>(ENDPOINTS.system.userDetail(id), { status: 'blocked' }); }
  async getRoles() { return apiClient.get<Role[]>(ENDPOINTS.system.roles); }
  async getRoleById(id: string) { return apiClient.get<Role>(ENDPOINTS.system.roleDetail(id)); }
  async createRole(data: CreateRoleDto) { return apiClient.post<Role>(ENDPOINTS.system.roles, data); }
  async updateRole(id: string, data: CreateRoleDto) { return apiClient.patch<Role>(ENDPOINTS.system.roleDetail(id), data); }
  async getAuditLog(params: AuditLogParams) {
    return apiClient.get<PaginatedResponse<AuditLogEntry>>(ENDPOINTS.system.auditLog, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, action: params.action, module: params.module, severity: params.severity, date_from: params.dateFrom, date_to: params.dateTo },
    });
  }
}

export const systemService: ISystemService = USE_MOCK
  ? new SystemMockService()
  : new SystemApiService();
