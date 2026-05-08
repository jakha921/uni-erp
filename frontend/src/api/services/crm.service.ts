import type {
  Lead,
  LeadListItem,
  LeadListParams,
  CreateLeadDto,
  UpdateLeadDto,
  LeadStatus,
  CrmStats,
} from '@/types/crm';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { CrmMockService } from '../mock/crm.mock';

export interface ICrmService {
  getLeads(params: LeadListParams): Promise<PaginatedResponse<LeadListItem>>;
  getLeadById(id: number): Promise<Lead>;
  createLead(data: CreateLeadDto): Promise<Lead>;
  updateLead(id: number, data: UpdateLeadDto): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  getStats(): Promise<CrmStats>;
  bulkUpdateStatus(ids: number[], status: LeadStatus): Promise<void>;
}

class CrmApiService implements ICrmService {
  async getLeads(params: LeadListParams): Promise<PaginatedResponse<LeadListItem>> {
    return apiClient.get<PaginatedResponse<LeadListItem>>(ENDPOINTS.crm.leads, {
      params: {
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
        status: params.status,
        source: params.source,
        assignee_id: params.assigneeId,
        date_from: params.dateFrom,
        date_to: params.dateTo,
        sort_by: params.sortBy,
        sort_order: params.sortOrder,
      },
    });
  }

  async getLeadById(id: number): Promise<Lead> {
    return apiClient.get<Lead>(ENDPOINTS.crm.leadDetail(id));
  }

  async createLead(data: CreateLeadDto): Promise<Lead> {
    return apiClient.post<Lead>(ENDPOINTS.crm.leads, data);
  }

  async updateLead(id: number, data: UpdateLeadDto): Promise<Lead> {
    return apiClient.patch<Lead>(ENDPOINTS.crm.leadDetail(id), data);
  }

  async deleteLead(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.crm.leadDetail(id));
  }

  async getStats(): Promise<CrmStats> {
    return apiClient.get<CrmStats>(ENDPOINTS.crm.stats);
  }

  async bulkUpdateStatus(ids: number[], status: LeadStatus): Promise<void> {
    await apiClient.post(ENDPOINTS.crm.bulkStatus, { ids, status });
  }
}

export const crmService: ICrmService = USE_MOCK
  ? new CrmMockService()
  : new CrmApiService();
