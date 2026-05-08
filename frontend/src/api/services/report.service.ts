import type { ReportTemplate } from '@/types/operations';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { ReportMockService } from '../mock/report.mock';

export interface IReportService {
  getTemplates(): Promise<ReportTemplate[]>;
  generateReport(templateId: number, params: Record<string, string | number>): Promise<Blob>;
}

class ReportApiService implements IReportService {
  async getTemplates(): Promise<ReportTemplate[]> {
    return apiClient.get<ReportTemplate[]>(ENDPOINTS.operations.reports);
  }

  async generateReport(templateId: number, params: Record<string, string | number>): Promise<Blob> {
    return apiClient.post<Blob>(ENDPOINTS.operations.generateReport, {
      templateId,
      ...params,
    });
  }
}

export const reportService: IReportService = USE_MOCK
  ? new ReportMockService()
  : new ReportApiService();
