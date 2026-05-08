import type {
  Alumni,
  AlumniListParams,
  CreateAlumniDto,
  UpdateAlumniDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { AlumniMockService } from '../mock/alumni.mock';

export interface IAlumniService {
  getAlumni(params?: AlumniListParams): Promise<PaginatedResponse<Alumni>>;
  getAlumniById(id: number): Promise<Alumni>;
  createAlumni(data: CreateAlumniDto): Promise<Alumni>;
  updateAlumni(id: number, data: UpdateAlumniDto): Promise<Alumni>;
}

class AlumniApiService implements IAlumniService {
  async getAlumni(params?: AlumniListParams): Promise<PaginatedResponse<Alumni>> {
    return apiClient.get<PaginatedResponse<Alumni>>(ENDPOINTS.alumni.list, {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        graduation_year: params?.graduationYear,
        faculty_id: params?.facultyId,
        status: params?.status,
      },
    });
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
}

export const alumniService: IAlumniService = USE_MOCK
  ? new AlumniMockService()
  : new AlumniApiService();
