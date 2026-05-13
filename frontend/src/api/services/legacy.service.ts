import type { LegacyOrder, LegacyOrderListParams, StaffingPosition, StaffingListParams } from '@/types/legacy';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated, drfListToArray } from '../client';
import { LegacyMockService } from '../mock/legacy.mock';

export interface ILegacyService {
  getOrders(params: LegacyOrderListParams): Promise<PaginatedResponse<LegacyOrder>>;
  getStaffing(params: StaffingListParams): Promise<StaffingPosition[]>;
}

class LegacyApiService implements ILegacyService {
  async getOrders(params: LegacyOrderListParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: LegacyOrder[] }>(ENDPOINTS.legacy.orders, {
      params: { page, page_size: pageSize, search: params.search, type: params.type, status: params.status },
    });
    return transformPaginated(drf, page, pageSize);
  }
  async getStaffing(params: StaffingListParams) {
    const res = await apiClient.get<{ count: number; next: null; previous: null; results: StaffingPosition[] } | StaffingPosition[]>(ENDPOINTS.legacy.staffing, {
      params: { department_id: params.departmentId },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: StaffingPosition[] });
  }
}

export const legacyService: ILegacyService = USE_MOCK
  ? new LegacyMockService()
  : new LegacyApiService();
