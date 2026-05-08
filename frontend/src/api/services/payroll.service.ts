import type {
  PayrollEmployee,
  PayrollListParams,
  PayrollSummary,
} from '@/types/finance';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { PayrollMockService } from '../mock/payroll.mock';

export interface IPayrollService {
  getPayroll(params: PayrollListParams): Promise<PaginatedResponse<PayrollEmployee>>;
  getPayrollSummary(month: number, year: number): Promise<PayrollSummary>;
  processPayroll(month: number, year: number): Promise<{ processed: number }>;
}

class PayrollApiService implements IPayrollService {
  async getPayroll(params: PayrollListParams): Promise<PaginatedResponse<PayrollEmployee>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: PayrollEmployee[] }>(ENDPOINTS.payroll.list, {
      params: {
        page,
        page_size: pageSize,
        search: params.search,
        month: params.month,
        year: params.year,
        department_id: params.departmentId,
        status: params.status,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getPayrollSummary(month: number, year: number): Promise<PayrollSummary> {
    return apiClient.get<PayrollSummary>(ENDPOINTS.payroll.summary, {
      params: { month, year },
    });
  }

  async processPayroll(month: number, year: number): Promise<{ processed: number }> {
    return apiClient.post<{ processed: number }>(ENDPOINTS.payroll.process, {
      month,
      year,
    });
  }
}

export const payrollService: IPayrollService = USE_MOCK
  ? new PayrollMockService()
  : new PayrollApiService();
