import type { LegacyOrder, LegacyOrderListParams, StaffingPosition, StaffingListParams } from '@/types/legacy';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { LegacyMockService } from '../mock/legacy.mock';

export interface ILegacyService {
  getOrders(params: LegacyOrderListParams): Promise<PaginatedResponse<LegacyOrder>>;
  getStaffing(params: StaffingListParams): Promise<StaffingPosition[]>;
}

class LegacyApiService implements ILegacyService {
  async getOrders(params: LegacyOrderListParams) {
    return apiClient.get<PaginatedResponse<LegacyOrder>>(ENDPOINTS.legacy.orders, {
      params: { page: params.page, page_size: params.pageSize, search: params.search, type: params.type, status: params.status },
    });
  }
  async getStaffing(params: StaffingListParams) {
    return apiClient.get<StaffingPosition[]>(ENDPOINTS.legacy.staffing, {
      params: { department_id: params.departmentId },
    });
  }
}

export const legacyService: ILegacyService = USE_MOCK
  ? new LegacyMockService()
  : new LegacyApiService();
