import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

const KEYS = {
  all: ['dashboard'] as const,
  admin: () => [...KEYS.all, 'admin'] as const,
  buxgalter: () => [...KEYS.all, 'buxgalter'] as const,
  dekan: () => [...KEYS.all, 'dekan'] as const,
  oqituvchi: () => [...KEYS.all, 'oqituvchi'] as const,
  talaba: () => [...KEYS.all, 'talaba'] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: KEYS.admin(),
    queryFn: () => dashboardService.getAdminDashboard(),
  });
}

export function useBuxgalterDashboard() {
  return useQuery({
    queryKey: KEYS.buxgalter(),
    queryFn: () => dashboardService.getBuxgalterDashboard(),
  });
}

export function useDekanDashboard() {
  return useQuery({
    queryKey: KEYS.dekan(),
    queryFn: () => dashboardService.getDekanDashboard(),
  });
}

export function useOqituvchiDashboard() {
  return useQuery({
    queryKey: KEYS.oqituvchi(),
    queryFn: () => dashboardService.getOqituvchiDashboard(),
  });
}

export function useTalabaDashboard() {
  return useQuery({
    queryKey: KEYS.talaba(),
    queryFn: () => dashboardService.getTalabaDashboard(),
  });
}
