import type { ListParams } from './common';

export interface LegacyOrder {
  id: number;
  number: string;
  date: string;
  type: 'hire' | 'fire' | 'reward' | 'leave' | 'penalty';
  typeLabel: string;
  employeeName: string;
  department: string;
  content: string;
  status: 'active' | 'archived';
}

export interface StaffingPosition {
  id: number;
  departmentId: number;
  departmentName: string;
  positionName: string;
  totalSlots: number;
  filledSlots: number;
  salary: number;
}

export interface LegacyOrderListParams extends ListParams {
  type?: string;
  status?: string;
}

export interface StaffingListParams extends ListParams {
  departmentId?: number;
}
