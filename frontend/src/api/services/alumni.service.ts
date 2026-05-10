import type {
  Alumni,
  AlumniListParams,
  CreateAlumniDto,
  UpdateAlumniDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { AlumniMockService } from '../mock/alumni.mock';

export interface IAlumniService {
  getAlumni(params?: AlumniListParams): Promise<PaginatedResponse<Alumni>>;
  getAlumniById(id: number): Promise<Alumni>;
  createAlumni(data: CreateAlumniDto): Promise<Alumni>;
  updateAlumni(id: number, data: UpdateAlumniDto): Promise<Alumni>;
  deleteAlumni(id: number): Promise<void>;
}

class AlumniApiService implements IAlumniService {
  async getAlumni(params?: AlumniListParams): Promise<PaginatedResponse<Alumni>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Alumni[] }>(ENDPOINTS.alumni.list, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        graduation_year: params?.graduationYear,
        faculty_id: params?.facultyId,
        status: params?.status,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getAlumniById(id: number): Promise<Alumni> {
    return apiClient.get<Alumni>(ENDPOINTS.alumni.detail(id));
  }

  async createAlumni(data: CreateAlumniDto): Promise<Alumni> {
    return apiClient.post<Alumni>(ENDPOINTS.alumni.list, data);
  }

  async updateAlumni(id: number, data: UpdateAlumniDto): Promise<Alumni> {
    return apiClient.patch<Alumni>(ENDPOINTS.alumni.detail(id), data);
  }

  async deleteAlumni(id: number): Promise<void> {
    return apiClient.delete(ENDPOINTS.alumni.detail(id));
  }
}

export const alumniService: IAlumniService = USE_MOCK
  ? new AlumniMockService()
  : new AlumniApiService();
