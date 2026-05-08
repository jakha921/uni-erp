import type { RoleKey } from '@/types/auth';
import { MODULE_ACCESS } from '@/config/roles';

export function canAccessRoute(routeId: string, role: RoleKey): boolean {
  if (role === 'admin') return true;
  const allowed = MODULE_ACCESS[routeId];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function isRole(currentRole: RoleKey, ...roles: RoleKey[]): boolean {
  return roles.includes(currentRole);
}
