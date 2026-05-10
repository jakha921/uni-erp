import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SystemUserListParams, CreateUserDto, UpdateUserDto, CreateRoleDto, AuditLogParams } from '@/types/system';
import { systemService } from '../services/system.service';

const KEYS = {
  all: ['system'] as const,
  users: () => [...KEYS.all, 'users'] as const,
  userList: (params: SystemUserListParams) => [...KEYS.users(), params] as const,
  userDetail: (id: number) => [...KEYS.users(), 'detail', id] as const,
  roles: () => [...KEYS.all, 'roles'] as const,
  roleDetail: (id: string) => [...KEYS.roles(), id] as const,
  auditLog: () => [...KEYS.all, 'audit-log'] as const,
  auditLogList: (params: AuditLogParams) => [...KEYS.auditLog(), params] as const,
};

export function useSystemUsers(params: SystemUserListParams) {
  return useQuery({ queryKey: KEYS.userList(params), queryFn: () => systemService.getUsers(params) });
}

export function useSystemUser(id: number) {
  return useQuery({ queryKey: KEYS.userDetail(id), queryFn: () => systemService.getUserById(id), enabled: id > 0 });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateUserDto) => systemService.createUser(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.users() }); } });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) => systemService.updateUser(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.users() }); } });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => systemService.blockUser(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.users() }); } });
}

export function useRoles() {
  return useQuery({ queryKey: KEYS.roles(), queryFn: () => systemService.getRoles(), staleTime: 5 * 60 * 1000 });
}

export function useRole(id: string) {
  return useQuery({ queryKey: KEYS.roleDetail(id), queryFn: () => systemService.getRoleById(id), enabled: !!id });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: CreateRoleDto) => systemService.createRole(data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.roles() }); } });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: CreateRoleDto }) => systemService.updateRole(id, data), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.roles() }); } });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => systemService.deleteRole(id), onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.roles() }); } });
}

export function useUpdateRolePermissions() {
  return useMutation({
    mutationFn: ({ roleId, moduleId, verb, granted }: { roleId: string; moduleId: string; verb: string; granted: boolean }) =>
      systemService.updateRolePermissions(roleId, moduleId, verb, granted),
  });
}

export function useAuditLog(params: AuditLogParams) {
  return useQuery({ queryKey: KEYS.auditLogList(params), queryFn: () => systemService.getAuditLog(params) });
}
