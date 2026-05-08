import type { AnalyticsData, AnalyticsParams } from '@/types/admin';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { AnalyticsMockService } from '../mock/analytics.mock';

export interface IAnalyticsService {
  getAnalytics(params: AnalyticsParams): Promise<AnalyticsData>;
}

class AnalyticsApiService implements IAnalyticsService {
  async getAnalytics(params: AnalyticsParams) {
    return apiClient.get<AnalyticsData>(ENDPOINTS.admin.analytics, {
      params: { period: params.period, year_from: params.yearFrom, year_to: params.yearTo },
    });
  }
}

export const analyticsService: IAnalyticsService = USE_MOCK
  ? new AnalyticsMockService()
  : new AnalyticsApiService();
