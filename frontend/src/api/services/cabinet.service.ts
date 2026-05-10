import type { StudentCabinetData, TeacherCabinetData } from '@/types/cabinet';
import { CabinetMockService } from '../mock/cabinet.mock';

export interface ICabinetService {
  getStudentCabinet(): Promise<StudentCabinetData>;
  getTeacherCabinet(): Promise<TeacherCabinetData>;
}

export const cabinetService: ICabinetService = new CabinetMockService();
