import type {
  Student,
  StudentListItem,
  StudentListParams,
  CreateStudentDto,
  UpdateStudentDto,
  StudentGrade,
  StudentAttendance,
  StudentDocument,
  StudentStatistics,
} from '@/types/student';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { StudentsMockService } from '../mock/students.mock';

export interface IStudentsService {
  getList(params: StudentListParams): Promise<PaginatedResponse<StudentListItem>>;
  getById(id: number): Promise<Student>;
  create(data: CreateStudentDto): Promise<Student>;
  update(id: number, data: UpdateStudentDto): Promise<Student>;
  delete(id: number): Promise<void>;
  getStatistics(): Promise<StudentStatistics>;
  getGrades(studentId: number): Promise<StudentGrade[]>;
  getAttendance(studentId: number): Promise<StudentAttendance[]>;
  getDocuments(studentId: number): Promise<StudentDocument[]>;
}

class StudentsApiService implements IStudentsService {
  async getList(params: StudentListParams): Promise<PaginatedResponse<StudentListItem>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: StudentListItem[] }>(ENDPOINTS.students.list, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        faculty_id: params.facultyId,
        department_id: params.departmentId,
        group_id: params.groupId,
        course: params.course,
        status: params.status,
        education_form: params.educationForm,
        payment_form: params.paymentForm,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getById(id: number): Promise<Student> {
    return apiClient.get<Student>(ENDPOINTS.students.detail(id));
  }

  async create(data: CreateStudentDto): Promise<Student> {
    return apiClient.post<Student>(ENDPOINTS.students.create, data);
  }

  async update(id: number, data: UpdateStudentDto): Promise<Student> {
    return apiClient.patch<Student>(ENDPOINTS.students.detail(id), data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.students.detail(id));
  }

  async getStatistics(): Promise<StudentStatistics> {
    return apiClient.get<StudentStatistics>(ENDPOINTS.students.statistics);
  }

  async getGrades(studentId: number): Promise<StudentGrade[]> {
    return apiClient.get<StudentGrade[]>(ENDPOINTS.students.grades(studentId));
  }

  async getAttendance(studentId: number): Promise<StudentAttendance[]> {
    return apiClient.get<StudentAttendance[]>(ENDPOINTS.students.attendance(studentId));
  }

  async getDocuments(studentId: number): Promise<StudentDocument[]> {
    return apiClient.get<StudentDocument[]>(ENDPOINTS.students.documents(studentId));
  }
}

export const studentsService: IStudentsService = USE_MOCK
  ? new StudentsMockService()
  : new StudentsApiService();
