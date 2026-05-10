import type { AnalyticsData, AnalyticsParams } from '@/types/admin';
import { AnalyticsMockService } from '../mock/analytics.mock';

export interface IAnalyticsService {
  getAnalytics(params: AnalyticsParams): Promise<AnalyticsData>;
}

export const analyticsService: IAnalyticsService = new AnalyticsMockService();
