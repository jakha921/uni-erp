import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PayrollListParams } from '@/types/finance';
import { payrollService } from '../services/payroll.service';

const KEYS = {
  all: ['payroll'] as const,
  lists: () => [...KEYS.all, 'list'] as const,
  list: (params: PayrollListParams) => [...KEYS.lists(), params] as const,
  summaries: () => [...KEYS.all, 'summary'] as const,
  summary: (month: number, year: number) => [...KEYS.summaries(), month, year] as const,
};

export function usePayroll(params: PayrollListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => payrollService.getPayroll(params),
  });
}

export function usePayrollSummary(month: number, year: number) {
  return useQuery({
    queryKey: KEYS.summary(month, year),
    queryFn: () => payrollService.getPayrollSummary(month, year),
  });
}

export function useProcessPayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      payrollService.processPayroll(month, year),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      void queryClient.invalidateQueries({ queryKey: KEYS.summaries() });
    },
  });
}
