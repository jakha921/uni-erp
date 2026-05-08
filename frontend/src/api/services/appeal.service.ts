import type {
  Appeal,
  AppealListParams,
  CreateAppealDto,
  AppealStatus,
  AppealComment,
} from '@/types/operations';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { AppealMockService } from '../mock/appeal.mock';

export interface IAppealService {
  getList(params: AppealListParams): Promise<PaginatedResponse<Appeal>>;
  getById(id: number): Promise<Appeal>;
  create(data: CreateAppealDto): Promise<Appeal>;
  updateStatus(id: number, status: AppealStatus): Promise<Appeal>;
  addComment(id: number, content: string): Promise<AppealComment>;
  delete(id: number): Promise<void>;
}

class AppealApiService implements IAppealService {
  async getList(params: AppealListParams): Promise<PaginatedResponse<Appeal>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Appeal[] }>(ENDPOINTS.operations.appeals, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        status: params.status,
        category: params.category,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getById(id: number): Promise<Appeal> {
    return apiClient.get<Appeal>(ENDPOINTS.operations.appealDetail(id));
  }

  async create(data: CreateAppealDto): Promise<Appeal> {
    return apiClient.post<Appeal>(ENDPOINTS.operations.appeals, data);
  }

  async updateStatus(id: number, status: AppealStatus): Promise<Appeal> {
    return apiClient.patch<Appeal>(ENDPOINTS.operations.appealDetail(id), { status });
  }

  async addComment(id: number, content: string): Promise<AppealComment> {
    return apiClient.post<AppealComment>(`${ENDPOINTS.operations.appealDetail(id)}/comments`, { content });
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.operations.appealDetail(id));
  }
}

export const appealService: IAppealService = USE_MOCK
  ? new AppealMockService()
  : new AppealApiService();
