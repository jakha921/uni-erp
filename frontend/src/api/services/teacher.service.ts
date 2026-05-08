import type {
  Teacher,
  TeacherListItem,
  TeacherListParams,
} from '@/types/teacher';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { TeacherMockService } from '../mock/teacher.mock';

export interface ITeacherService {
  getTeachers(params: TeacherListParams): Promise<PaginatedResponse<TeacherListItem>>;
  getTeacherById(id: number): Promise<Teacher>;
}

class TeacherApiService implements ITeacherService {
  async getTeachers(params: TeacherListParams): Promise<PaginatedResponse<TeacherListItem>> {
    return apiClient.get<PaginatedResponse<TeacherListItem>>(ENDPOINTS.teachers.list, {
      params: {
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
        department_id: params.departmentId,
        degree_code: params.degreeCode,
        rank_code: params.rankCode,
        employment_form: params.employmentForm,
      },
    });
  }

  async getTeacherById(id: number): Promise<Teacher> {
    return apiClient.get<Teacher>(ENDPOINTS.teachers.detail(id));
  }
}

export const teacherService: ITeacherService = USE_MOCK
  ? new TeacherMockService()
  : new TeacherApiService();
