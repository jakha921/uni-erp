import type {
  BudgetCategory,
  BudgetListParams,
  BudgetSummary,
} from '@/types/finance';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { BudgetMockService } from '../mock/budget.mock';

export interface IBudgetService {
  getCategories(params: BudgetListParams): Promise<BudgetCategory[]>;
  getSummary(year: number): Promise<BudgetSummary>;
  updateCategory(id: number, planned: number): Promise<BudgetCategory>;
}

class BudgetApiService implements IBudgetService {
  async getCategories(params: BudgetListParams): Promise<BudgetCategory[]> {
    return apiClient.get<BudgetCategory[]>(ENDPOINTS.budget.categories, {
      params: { year: params.year, quarter: params.quarter },
    });
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
