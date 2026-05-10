import { delay } from './delay';
import { generateName, generatePhone, generateEmail, pick, rnum } from './shared-data';
import type {
  SystemUser, SystemUserListItem, SystemUserListParams,
  CreateUserDto, UpdateUserDto,
  Role, CreateRoleDto,
  AuditLogEntry, AuditLogParams,
} from '@/types/system';
import type { PaginatedResponse } from '@/types/common';
import type { ISystemService } from '../services/system.service';

const ROLE_NAMES = ['admin', 'buxgalter', 'dekan', 'oqituvchi', 'talaba'];
const ROLE_LABELS: Record<string, string> = { admin: 'Administrator', buxgalter: 'Buxgalter', dekan: 'Dekan', oqituvchi: "O'qituvchi", talaba: 'Talaba' };

const USERS: SystemUser[] = Array.from({ length: 25 }, (_, i) => {
  const name = generateName(i + 500, 0.45);
  const role = pick(ROLE_NAMES, i + 2);
  return {
    id: i + 1,
    fullName: name.full,
    phone: generatePhone(i + 502),
    email: generateEmail(name),
    roles: [{ id: 1, role, roleName: ROLE_LABELS[role] ?? role, branchId: 1, branchName: 'Bosh ofis' }],
    status: i === 20 ? 'blocked' as const : 'active' as const,
    lastLogin: `2026-0${rnum(i, 1, 5)}-${String(rnum(i + 3, 1, 28)).padStart(2, '0')}T10:${rnum(i, 0, 59)}:00`,
    createdAt: '2025-09-01',
  };
});

const ROLES: Role[] = ROLE_NAMES.map((name, i) => ({
  id: name,
  name,
  nameUz: ROLE_LABELS[name] ?? name,
  description: `${ROLE_LABELS[name]} roli`,
  isSystem: i < 3,
  permissions: { students: ['view', 'edit'], finance: ['view'], hr: ['view'] },
  userCount: 3 + rnum(i, 1, 10),
}));

const ACTIONS: AuditLogEntry['action'][] = ['create', 'update', 'delete', 'login', 'logout'];
const MODULES = ['students', 'finance', 'hr', 'education', 'auth', 'system'];
const SEVERITIES: AuditLogEntry['severity'][] = ['info', 'warning', 'critical'];

const AUDIT_LOG: AuditLogEntry[] = Array.from({ length: 50 }, (_, i) => {
  const name = generateName(i + 700, 0.4);
  return {
    id: i + 1,
    userId: rnum(i, 1, 25),
    userName: name.short,
    action: pick(ACTIONS, i + 1),
    module: pick(MODULES, i + 2),
    objectType: 'record',
    objectId: String(rnum(i + 3, 1, 200)),
    details: `${pick(ACTIONS, i + 1)} action on ${pick(MODULES, i + 2)}`,
    ipAddress: `192.168.1.${rnum(i, 1, 254)}`,
    severity: pick(SEVERITIES, i + 5),
    createdAt: `2026-0${rnum(i, 1, 5)}-${String(rnum(i, 1, 28)).padStart(2, '0')}T${String(rnum(i, 8, 18)).padStart(2, '0')}:${String(rnum(i + 1, 0, 59)).padStart(2, '0')}:00`,
  };
});

export class SystemMockService implements ISystemService {
  async getUsers(params: SystemUserListParams): Promise<PaginatedResponse<SystemUserListItem>> {
    await delay(300);
    let data = [...USERS];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter((u) => u.fullName.toLowerCase().includes(q) || u.phone.includes(q));
    }
    if (params.role) data = data.filter((u) => u.roles.some((r) => r.role === params.role));
    if (params.status) data = data.filter((u) => u.status === params.status);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }
  async getUserById(id: number) { await delay(200); const u = USERS.find((u) => u.id === id); if (!u) throw new Error('Not found'); return u; }
  async createUser(data: CreateUserDto) { await delay(300); return { id: USERS.length + 1, fullName: `${data.secondName} ${data.firstName}`, phone: data.phone, email: data.email ?? '', roles: [], status: 'active' as const, createdAt: new Date().toISOString() }; }
  async updateUser(id: number, _data: UpdateUserDto) { await delay(300); const u = USERS.find((u) => u.id === id); if (!u) throw new Error('Not found'); return u; }
  async blockUser(_id: number) { await delay(200); }
  async getRoles() { await delay(200); return ROLES; }
  async getRoleById(id: string) { await delay(200); const r = ROLES.find((r) => r.id === id); if (!r) throw new Error('Not found'); return r; }
  async createRole(data: CreateRoleDto) { await delay(300); return { ...data, id: `custom-${Date.now()}`, isSystem: false, userCount: 0 }; }
  async updateRole(id: string, data: CreateRoleDto) { await delay(300); return { ...data, id, isSystem: false, userCount: 0 }; }
  async updateRolePermissions(_roleId: string, _moduleId: string, _verb: string, _granted: boolean) { await delay(200); }
  async deleteRole(_id: string) { await delay(200); }
  async getAuditLog(params: AuditLogParams): Promise<PaginatedResponse<AuditLogEntry>> {
    await delay(300);
    let data = [...AUDIT_LOG];
    if (params.search) { const q = params.search.toLowerCase(); data = data.filter((e) => e.userName.toLowerCase().includes(q) || e.details.toLowerCase().includes(q)); }
    if (params.action) data = data.filter((e) => e.action === params.action);
    if (params.module) data = data.filter((e) => e.module === params.module);
    if (params.severity) data = data.filter((e) => e.severity === params.severity);
    const page = params.page ?? 1;
    const size = params.pageSize ?? 20;
    return { data: data.slice((page - 1) * size, page * size), total: data.length, page, pageSize: size, totalPages: Math.ceil(data.length / size) };
  }
}
