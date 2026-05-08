import type { ListParams } from './common';

export type LeadStatus = 'new' | 'contacted' | 'interested' | 'applied' | 'enrolled' | 'rejected';
export type LeadSource = 'website' | 'telegram' | 'instagram' | 'referral' | 'event' | 'call';

export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  direction: string;
  source: LeadSource;
  status: LeadStatus;
  assigneeId: number;
  assigneeName: string;
  notes: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextContactDate?: string;
}

export type LeadListItem = Pick<
  Lead,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'direction'
  | 'source'
  | 'status'
  | 'assigneeName'
  | 'score'
  | 'createdAt'
>;

export interface LeadListParams extends ListParams {
  status?: LeadStatus;
  source?: LeadSource;
  assigneeId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  direction: string;
  source: LeadSource;
  notes?: string;
  assigneeId?: number;
}

export type UpdateLeadDto = Partial<CreateLeadDto> & {
  status?: LeadStatus;
  nextContactDate?: string;
};

export interface CrmStats {
  totalLeads: number;
  newLeads: number;
  enrolledLeads: number;
  conversionRate: number;
  bySource: { source: string; count: number }[];
  byStatus: { status: string; count: number }[];
  funnel: { stage: string; count: number; percent: number }[];
}
