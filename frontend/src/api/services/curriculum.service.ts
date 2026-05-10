import type {
  Curriculum,
  CurriculumListParams,
  CreateCurriculumDto,
  UpdateCurriculumDto,
} from '@/types/education';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { CurriculumMockService } from '../mock/curriculum.mock';

export interface ICurriculumService {
  getCurriculums(params?: CurriculumListParams): Promise<Curriculum[]>;
  getCurriculumById(id: number): Promise<Curriculum>;
  createCurriculum(data: CreateCurriculumDto): Promise<Curriculum>;
  updateCurriculum(id: number, data: UpdateCurriculumDto): Promise<Curriculum>;
  deleteCurriculum(id: number): Promise<void>;
}

class CurriculumApiService implements ICurriculumService {
  async getCurriculums(params?: CurriculumListParams): Promise<Curriculum[]> {
    return apiClient.get<Curriculum[]>(ENDPOINTS.curriculum.list, {
      params: {
        specialty_id: params?.specialtyId,
        year: params?.year,
      },
    });
  }

  async getCurriculumById(id: number): Promise<Curriculum> {
    return apiClient.get<Curriculum>(ENDPOINTS.curriculum.detail(id));
  }

  async createCurriculum(data: CreateCurriculumDto): Promise<Curriculum> {
    return apiClient.post<Curriculum>(ENDPOINTS.curriculum.list, data);
  }

  async updateCurriculum(id: number, data: UpdateCurriculumDto): Promise<Curriculum> {
    return apiClient.patch<Curriculum>(ENDPOINTS.curriculum.detail(id), data);
  }
  async deleteCurriculum(id: number): Promise<void> {
    return apiClient.delete<void>(ENDPOINTS.curriculum.detail(id));
  }
}

export const curriculumService: ICurriculumService = USE_MOCK
  ? new CurriculumMockService()
  : new CurriculumApiService();
