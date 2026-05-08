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

export const financeService: IFinanceService = new FinanceMockService();
