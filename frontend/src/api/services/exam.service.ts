import type {
  Exam,
  ExamListParams,
  CreateExamDto,
  UpdateExamDto,
} from '@/types/education';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { ExamMockService } from '../mock/exam.mock';

export interface IExamService {
  getExams(params?: ExamListParams): Promise<PaginatedResponse<Exam>>;
  getExamById(id: number): Promise<Exam>;
  createExam(data: CreateExamDto): Promise<Exam>;
  updateExam(id: number, data: UpdateExamDto): Promise<Exam>;
  deleteExam(id: number): Promise<void>;
}

class ExamApiService implements IExamService {
  async getExams(params?: ExamListParams): Promise<PaginatedResponse<Exam>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Exam[] }>(ENDPOINTS.exams.list, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        semester_id: params?.semesterId,
        group_id: params?.groupId,
        subject_id: params?.subjectId,
        type: params?.type,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getExamById(id: number): Promise<Exam> {
    return apiClient.get<Exam>(ENDPOINTS.exams.detail(id));
  }

  async createExam(data: CreateExamDto): Promise<Exam> {
    return apiClient.post<Exam>(ENDPOINTS.exams.list, data);
  }

  async updateExam(id: number, data: UpdateExamDto): Promise<Exam> {
    return apiClient.patch<Exam>(ENDPOINTS.exams.detail(id), data);
  }

  async deleteExam(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.exams.detail(id));
  }
}

export const examService: IExamService = USE_MOCK
  ? new ExamMockService()
  : new ExamApiService();
