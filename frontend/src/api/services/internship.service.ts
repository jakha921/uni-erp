import type {
  Internship,
  InternshipListParams,
  CreateInternshipDto,
  UpdateInternshipDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { InternshipMockService } from '../mock/internship.mock';

export interface IInternshipService {
  getInternships(params?: InternshipListParams): Promise<PaginatedResponse<Internship>>;
  getInternshipById(id: number): Promise<Internship>;
  createInternship(data: CreateInternshipDto): Promise<Internship>;
  updateInternship(id: number, data: UpdateInternshipDto): Promise<Internship>;
}

class InternshipApiService implements IInternshipService {
  async getInternships(params?: InternshipListParams): Promise<PaginatedResponse<Internship>> {
    return apiClient.get<PaginatedResponse<Internship>>(ENDPOINTS.internship.list, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        status: params?.status,
        type: params?.type,
        group_id: params?.groupId,
      },
    });
  }

  async getInternshipById(id: number): Promise<Internship> {
    return apiClient.get<Internship>(ENDPOINTS.internship.detail(id));
  }

  async createInternship(data: CreateInternshipDto): Promise<Internship> {
    return apiClient.post<Internship>(ENDPOINTS.internship.list, data);
  }

  async updateInternship(id: number, data: UpdateInternshipDto): Promise<Internship> {
    return apiClient.patch<Internship>(ENDPOINTS.internship.detail(id), data);
  }
}

export const internshipService: IInternshipService = USE_MOCK
  ? new InternshipMockService()
  : new InternshipApiService();
