import type {
  Teacher,
  TeacherListItem,
  TeacherListParams,
} from '@/types/teacher';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { TeacherMockService } from '../mock/teacher.mock';

export interface ITeacherService {
  getTeachers(params: TeacherListParams): Promise<PaginatedResponse<TeacherListItem>>;
  getTeacherById(id: number): Promise<Teacher>;
}

class TeacherApiService implements ITeacherService {
  async getTeachers(params: TeacherListParams): Promise<PaginatedResponse<TeacherListItem>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: TeacherListItem[] }>(ENDPOINTS.teachers.list, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        department_id: params.departmentId,
        degree_code: params.degreeCode,
        rank_code: params.rankCode,
        employment_form: params.employmentForm,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getTeacherById(id: number): Promise<Teacher> {
    return apiClient.get<Teacher>(ENDPOINTS.teachers.detail(id));
  }
}

export const teacherService: ITeacherService = USE_MOCK
  ? new TeacherMockService()
  : new TeacherApiService();
