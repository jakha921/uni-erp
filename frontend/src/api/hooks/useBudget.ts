import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BudgetListParams } from '@/types/finance';
import { budgetService } from '../services/budget.service';

const KEYS = {
  all: ['budget'] as const,
  categories: () => [...KEYS.all, 'categories'] as const,
  categoryList: (params: BudgetListParams) => [...KEYS.categories(), params] as const,
  summaries: () => [...KEYS.all, 'summary'] as const,
  summary: (year: number) => [...KEYS.summaries(), year] as const,
};

export function useBudgetCategories(params: BudgetListParams) {
  return useQuery({
    queryKey: KEYS.categoryList(params),
    queryFn: () => budgetService.getCategories(params),
  });
}

export function useBudgetSummary(year: number) {
  return useQuery({
    queryKey: KEYS.summary(year),
    queryFn: () => budgetService.getSummary(year),
  });
}

export function useUpdateBudgetCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, planned }: { id: number; planned: number }) => budgetService.updateCategory(id, planned),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: KEYS.categories() }); },
  });
}
