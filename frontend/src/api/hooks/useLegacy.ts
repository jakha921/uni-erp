import { useQuery } from '@tanstack/react-query';
import type { LegacyOrderListParams, StaffingListParams } from '@/types/legacy';
import { legacyService } from '../services/legacy.service';

const KEYS = {
  all: ['legacy'] as const,
  orders: (params: LegacyOrderListParams) => [...KEYS.all, 'orders', params] as const,
  staffing: (params: StaffingListParams) => [...KEYS.all, 'staffing', params] as const,
};

export function useLegacyOrders(params: LegacyOrderListParams) {
  return useQuery({ queryKey: KEYS.orders(params), queryFn: () => legacyService.getOrders(params) });
}

export function useStaffing(params: StaffingListParams) {
  return useQuery({ queryKey: KEYS.staffing(params), queryFn: () => legacyService.getStaffing(params) });
}
