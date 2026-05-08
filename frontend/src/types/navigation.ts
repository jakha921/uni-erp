import type { RoleKey } from './auth';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles?: RoleKey[];
  count?: number;
  path: string;
}

export interface NavGroup {
  key: string;
  label: string | null;
  roles?: RoleKey[];
  items: NavItem[];
}
