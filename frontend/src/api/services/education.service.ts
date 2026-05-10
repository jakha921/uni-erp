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
export type ScheduleDto = Omit<Schedule, 'id' | 'groupName' | 'subjectName' | 'teacherName'>;

export interface IEducationService {
  getSubjects(params?: SubjectListParams): Promise<PaginatedResponse<Subject>>;
  createSubject(dto: SubjectDto): Promise<Subject>;
  updateSubject(id: number, dto: SubjectDto): Promise<Subject>;
  deleteSubject(id: number): Promise<void>;
  getSchedules(params?: ScheduleListParams): Promise<PaginatedResponse<Schedule>>;
  createSchedule(dto: ScheduleDto): Promise<Schedule>;
  updateSchedule(id: number, dto: ScheduleDto): Promise<Schedule>;
  deleteSchedule(id: number): Promise<void>;
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
    const drf = await apiClient.get<{ count: number; results: Record<string, unknown>[] }>(ENDPOINTS.education.grades, {
      params: {
        page,
        page_size: pageSize,
        subject_id: params?.subjectId,
        semester_id: params?.semesterId,
        grade_type: params?.gradeType,
      },
    });
    const paginated = transformPaginated(drf, page, pageSize);
    return {
      ...paginated,
      data: paginated.data.map((g) => ({
        ...g,
        studentId: (g['studentId'] ?? g['student'] ?? 0) as number,
        studentName: (g['studentName'] ?? '') as string,
      })) as Grade[],
    };
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

  async createSchedule(dto: ScheduleDto): Promise<Schedule> {
    return apiClient.post<Schedule>(ENDPOINTS.education.schedules, dto);
  }

  async updateSchedule(id: number, dto: ScheduleDto): Promise<Schedule> {
    return apiClient.patch<Schedule>(`${ENDPOINTS.education.schedules}${id}/`, dto);
  }

  async deleteSchedule(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.education.schedules}${id}/`);
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
  private schedules: Schedule[] = [];
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
    return { data: this.schedules, total: this.schedules.length, page: 1, pageSize: 50, totalPages: 1 };
  }
  async createSchedule(dto: ScheduleDto): Promise<Schedule> {
    const s: Schedule = { ...dto, id: this.nextId++, groupName: '', subjectName: '', teacherName: '' };
    this.schedules.push(s);
    return s;
  }
  async updateSchedule(id: number, dto: ScheduleDto): Promise<Schedule> {
    const idx = this.schedules.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const updated = { ...this.schedules[idx]!, ...dto };
      this.schedules[idx] = updated;
      return updated;
    }
    return { ...dto, id, groupName: '', subjectName: '', teacherName: '' };
  }
  async deleteSchedule(id: number): Promise<void> {
    this.schedules = this.schedules.filter((s) => s.id !== id);
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
