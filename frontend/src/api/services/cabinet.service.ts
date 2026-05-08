import type { StudentCabinetData, TeacherCabinetData } from '@/types/cabinet';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { CabinetMockService } from '../mock/cabinet.mock';

export interface ICabinetService {
  getStudentCabinet(): Promise<StudentCabinetData>;
  getTeacherCabinet(): Promise<TeacherCabinetData>;
}

class CabinetApiService implements ICabinetService {
  async getStudentCabinet() { return apiClient.get<StudentCabinetData>(ENDPOINTS.cabinets.student); }
  async getTeacherCabinet() { return apiClient.get<TeacherCabinetData>(ENDPOINTS.cabinets.teacher); }
}

export const cabinetService: ICabinetService = USE_MOCK
  ? new CabinetMockService()
  : new CabinetApiService();
