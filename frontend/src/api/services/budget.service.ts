import type {
  BudgetCategory,
  BudgetListParams,
  BudgetSummary,
} from '@/types/finance';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient, drfListToArray } from '../client';
import { BudgetMockService } from '../mock/budget.mock';

export interface IBudgetService {
  getCategories(params: BudgetListParams): Promise<BudgetCategory[]>;
  getSummary(year: number): Promise<BudgetSummary>;
  updateCategory(id: number, planned: number): Promise<BudgetCategory>;
}

class BudgetApiService implements IBudgetService {
  async getCategories(params: BudgetListParams): Promise<BudgetCategory[]> {
    const res = await apiClient.get<{ count: number; next: null; previous: null; results: BudgetCategory[] } | BudgetCategory[]>(ENDPOINTS.budget.categories, {
      params: { year: params.year, quarter: params.quarter },
    });
    return drfListToArray(res as { count: number; next: null; previous: null; results: BudgetCategory[] });
  }

  async getSummary(year: number): Promise<BudgetSummary> {
    return apiClient.get<BudgetSummary>(ENDPOINTS.budget.summary, {
      params: { year },
    });
  }
  async updateCategory(id: number, planned: number): Promise<BudgetCategory> {
    return apiClient.patch<BudgetCategory>(`${ENDPOINTS.budget.categories}${id}/`, { planned });
  }
}

export const budgetService: IBudgetService = USE_MOCK
  ? new BudgetMockService()
  : new BudgetApiService();
