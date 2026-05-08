import type {
  Contract,
  ContractListParams,
  CreateContractDto,
  CreatePaymentDto,
  CreateScholarshipDto,
  FinanceDashboardStats,
  Payment,
  PaymentListParams,
  Scholarship,
  ScholarshipType,
} from '@/types/finance';
import type { PaginatedResponse } from '@/types/common';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, transformPaginated } from '../client';
import { FinanceMockService } from '../mock/finance.mock';

export interface IFinanceService {
  // Contracts
  getContracts(params?: ContractListParams): Promise<PaginatedResponse<Contract>>;
  getContractById(id: string): Promise<Contract>;
  createContract(dto: CreateContractDto): Promise<Contract>;
  updateContract(id: string, patch: Partial<Contract>): Promise<Contract>;
  deleteContract(id: string): Promise<void>;

  // Payments
  getPayments(params?: PaymentListParams): Promise<PaginatedResponse<Payment>>;
  createPayment(dto: CreatePaymentDto): Promise<Payment>;
  deletePayment(id: string): Promise<void>;

  // Scholarships
  getScholarships(params?: { type?: ScholarshipType; status?: string }): Promise<Scholarship[]>;
  createScholarship(dto: CreateScholarshipDto): Promise<Scholarship>;
  updateScholarship(id: string, patch: Partial<Scholarship>): Promise<Scholarship>;
  deleteScholarship(id: string): Promise<void>;

  // Dashboard
  getDashboardStats(): Promise<FinanceDashboardStats>;
}

class FinanceApiService implements IFinanceService {
  async getContracts(params?: ContractListParams): Promise<PaginatedResponse<Contract>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Contract[] }>(ENDPOINTS.finance.contracts, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        faculty_id: params?.facultyId,
        status: params?.status,
        contract_type: params?.contractType,
        education_year: params?.educationYear,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async getContractById(id: string): Promise<Contract> {
    return apiClient.get<Contract>(ENDPOINTS.finance.contractDetail(id));
  }

  async createContract(dto: CreateContractDto): Promise<Contract> {
    return apiClient.post<Contract>(ENDPOINTS.finance.contracts, dto);
  }

  async updateContract(id: string, patch: Partial<Contract>): Promise<Contract> {
    return apiClient.patch<Contract>(ENDPOINTS.finance.contractDetail(id), patch);
  }

  async deleteContract(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.finance.contractDetail(id));
  }

  async getPayments(params?: PaymentListParams): Promise<PaginatedResponse<Payment>> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const drf = await apiClient.get<{ count: number; results: Payment[] }>(ENDPOINTS.finance.payments, {
      params: {
        page,
        page_size: pageSize,
        search: params?.search,
        faculty_id: params?.facultyId,
        payment_method: params?.paymentMethod,
        date_from: params?.dateFrom,
        date_to: params?.dateTo,
        period: params?.period,
      },
    });
    return transformPaginated(drf, page, pageSize);
  }

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    return apiClient.post<Payment>(ENDPOINTS.finance.payments, dto);
  }

  async deletePayment(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.finance.payments}/${id}`);
  }

  async getScholarships(params?: {
    type?: ScholarshipType;
    status?: string;
  }): Promise<Scholarship[]> {
    return apiClient.get<Scholarship[]>(ENDPOINTS.finance.scholarships, {
      params: { type: params?.type, status: params?.status },
    });
  }

  async createScholarship(dto: CreateScholarshipDto): Promise<Scholarship> {
    return apiClient.post<Scholarship>(ENDPOINTS.finance.scholarships, dto);
  }

  async updateScholarship(id: string, patch: Partial<Scholarship>): Promise<Scholarship> {
    return apiClient.patch<Scholarship>(`${ENDPOINTS.finance.scholarships}/${id}`, patch);
  }

  async deleteScholarship(id: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.finance.scholarships}/${id}`);
  }

  async getDashboardStats(): Promise<FinanceDashboardStats> {
    return apiClient.get<FinanceDashboardStats>(ENDPOINTS.finance.dashboard);
  }
}

export const financeService: IFinanceService = USE_MOCK
  ? new FinanceMockService()
  : new FinanceApiService();
