import type {
  Subject,
  Schedule,
  Grade,
  BulkAttendanceDto,
  BulkGradesDto,
  SubjectListParams,
  ScheduleListParams,
  GradeListParams,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';

export interface IEducationService {
  getSubjects(params?: SubjectListParams): Promise<PaginatedResponse<Subject>>;
  getSchedules(params?: ScheduleListParams): Promise<PaginatedResponse<Schedule>>;
  getGrades(params?: GradeListParams): Promise<PaginatedResponse<Grade>>;
  bulkAttendance(dto: BulkAttendanceDto): Promise<void>;
  bulkGrades(dto: BulkGradesDto): Promise<void>;
}

class EducationApiService implements IEducationService {
  async getSubjects(params?: SubjectListParams): Promise<PaginatedResponse<Subject>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Subject[] }>(ENDPOINTS.education.subjects, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        department_id: params?.departmentId,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getSchedules(params?: ScheduleListParams): Promise<PaginatedResponse<Schedule>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Schedule[] }>(ENDPOINTS.education.schedules, {
      params: {
        page,
        page_size: pageSize,
        group: params?.groupId,
        teacher: params?.teacherId,
        semester: params?.semesterId,
        day_of_week: params?.dayOfWeek,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getGrades(params?: GradeListParams): Promise<PaginatedResponse<Grade>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Grade[] }>(ENDPOINTS.education.grades, {
      params: {
        page,
        page_size: pageSize,
        subject_id: params?.subjectId,
        semester_id: params?.semesterId,
        grade_type: params?.gradeType,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async bulkAttendance(dto: BulkAttendanceDto): Promise<void> {
    await apiClient.post(ENDPOINTS.education.attendanceBulk, dto);
  }

  async bulkGrades(dto: BulkGradesDto): Promise<void> {
    await apiClient.post(ENDPOINTS.education.gradesBulk, dto);
  }
}

class EducationMockService implements IEducationService {
  private empty<T>(): PaginatedResponse<T> {
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }
  async getSubjects(): Promise<PaginatedResponse<Subject>> {
    return this.empty();
  }
  async getSchedules(): Promise<PaginatedResponse<Schedule>> {
    return this.empty();
  }
  async getGrades(): Promise<PaginatedResponse<Grade>> {
    return this.empty();
  }
  async bulkAttendance(): Promise<void> {}
  async bulkGrades(): Promise<void> {}
}

export const educationService: IEducationService = USE_MOCK
  ? new EducationMockService()
  : new EducationApiService();
