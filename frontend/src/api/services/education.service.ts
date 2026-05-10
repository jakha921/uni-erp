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

export type SubjectDto = Omit<Subject, 'id' | 'departmentName'>;

export interface IEducationService {
  getSubjects(params?: SubjectListParams): Promise<PaginatedResponse<Subject>>;
  createSubject(dto: SubjectDto): Promise<Subject>;
  updateSubject(id: number, dto: SubjectDto): Promise<Subject>;
  deleteSubject(id: number): Promise<void>;
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

  async createSubject(dto: SubjectDto): Promise<Subject> {
    return apiClient.post<Subject>(ENDPOINTS.education.subjects, dto);
  }

  async updateSubject(id: number, dto: SubjectDto): Promise<Subject> {
    return apiClient.patch<Subject>(`${ENDPOINTS.education.subjects}${id}/`, dto);
  }

  async deleteSubject(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.education.subjects}${id}/`);
  }

  async bulkAttendance(dto: BulkAttendanceDto): Promise<void> {
    await apiClient.post(ENDPOINTS.education.attendanceBulk, dto);
  }

  async bulkGrades(dto: BulkGradesDto): Promise<void> {
    await apiClient.post(ENDPOINTS.education.gradesBulk, dto);
  }
}

class EducationMockService implements IEducationService {
  private subjects: Subject[] = [];
  private nextId = 1;

  private empty<T>(): PaginatedResponse<T> {
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }
  async getSubjects(): Promise<PaginatedResponse<Subject>> {
    return { data: this.subjects, total: this.subjects.length, page: 1, pageSize: 20, totalPages: 1 };
  }
  async createSubject(dto: SubjectDto): Promise<Subject> {
    const subject: Subject = { ...dto, id: this.nextId++, departmentName: '' };
    this.subjects.push(subject);
    return subject;
  }
  async updateSubject(id: number, dto: SubjectDto): Promise<Subject> {
    const idx = this.subjects.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const updated = { ...this.subjects[idx]!, ...dto };
      this.subjects[idx] = updated;
      return updated;
    }
    return { ...dto, id, departmentName: '' };
  }
  async deleteSubject(id: number): Promise<void> {
    this.subjects = this.subjects.filter((s) => s.id !== id);
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
