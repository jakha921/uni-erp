import { useQuery } from '@tanstack/react-query';
import type { AnalyticsParams } from '@/types/admin';
import { analyticsService } from '../services/analytics.service';

const KEYS = {
  all: ['analytics'] as const,
  data: (params: AnalyticsParams) => [...KEYS.all, params] as const,
};

export function useAnalytics(params: AnalyticsParams) {
  return useQuery({ queryKey: KEYS.data(params), queryFn: () => analyticsService.getAnalytics(params) });
}
