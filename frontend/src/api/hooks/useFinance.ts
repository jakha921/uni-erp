import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeService } from '../services/finance.service';
import type {
  Contract,
  ContractListParams,
  CreateContractDto,
  CreatePaymentDto,
  CreateScholarshipDto,
  PaymentListParams,
  Scholarship,
  ScholarshipType,
} from '@/types/finance';

const KEYS = {
  contracts: ['finance', 'contracts'] as const,
  contractList: (params?: ContractListParams) => ['finance', 'contracts', 'list', params] as const,
  contractDetail: (id: string) => ['finance', 'contracts', id] as const,
  payments: ['finance', 'payments'] as const,
  paymentList: (params?: PaymentListParams) => ['finance', 'payments', 'list', params] as const,
  scholarships: ['finance', 'scholarships'] as const,
  scholarshipList: (params?: { type?: ScholarshipType; status?: string }) =>
    ['finance', 'scholarships', 'list', params] as const,
  dashboard: ['finance', 'dashboard'] as const,
};

// ---- Contracts ----

export function useContracts(params?: ContractListParams) {
  return useQuery({
    queryKey: KEYS.contractList(params),
    queryFn: () => financeService.getContracts(params),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: KEYS.contractDetail(id),
    queryFn: () => financeService.getContractById(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateContractDto) => financeService.createContract(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.contracts });
      void qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useUpdateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Contract> }) =>
      financeService.updateContract(id, patch),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.contracts });
      void qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useDeleteContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deleteContract(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.contracts });
      void qc.invalidateQueries({ queryKey: KEYS.payments });
      void qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ---- Payments ----

export function usePayments(params?: PaymentListParams) {
  return useQuery({
    queryKey: KEYS.paymentList(params),
    queryFn: () => financeService.getPayments(params),
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePaymentDto) => financeService.createPayment(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.payments });
      void qc.invalidateQueries({ queryKey: KEYS.contracts });
      void qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deletePayment(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.payments });
      void qc.invalidateQueries({ queryKey: KEYS.contracts });
      void qc.invalidateQueries({ queryKey: KEYS.dashboard });
    },
  });
}

// ---- Scholarships ----

export function useScholarships(params?: { type?: ScholarshipType; status?: string }) {
  return useQuery({
    queryKey: KEYS.scholarshipList(params),
    queryFn: () => financeService.getScholarships(params),
  });
}

export function useCreateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateScholarshipDto) => financeService.createScholarship(dto),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.scholarships });
    },
  });
}

export function useUpdateScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Scholarship> }) =>
      financeService.updateScholarship(id, patch),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.scholarships });
    },
  });
}

export function useDeleteScholarship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deleteScholarship(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.scholarships });
    },
  });
}

// ---- Dashboard ----

export function useFinanceDashboard() {
  return useQuery({
    queryKey: KEYS.dashboard,
    queryFn: () => financeService.getDashboardStats(),
  });
}
