import type {
  AdminDashboardData,
  BuxgalterDashboardData,
  DekanDashboardData,
  OqituvchiDashboardData,
  TalabaDashboardData,
} from '@/types/dashboard';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { DashboardMockService } from '../mock/dashboard.mock';

export interface IDashboardService {
  getAdminDashboard(): Promise<AdminDashboardData>;
  getBuxgalterDashboard(): Promise<BuxgalterDashboardData>;
  getDekanDashboard(): Promise<DekanDashboardData>;
  getOqituvchiDashboard(): Promise<OqituvchiDashboardData>;
  getTalabaDashboard(): Promise<TalabaDashboardData>;
}

class DashboardApiService implements IDashboardService {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    return apiClient.get<AdminDashboardData>(ENDPOINTS.dashboard.admin);
  }

  async getBuxgalterDashboard(): Promise<BuxgalterDashboardData> {
    return apiClient.get<BuxgalterDashboardData>(ENDPOINTS.dashboard.buxgalter);
  }

  async getDekanDashboard(): Promise<DekanDashboardData> {
    return apiClient.get<DekanDashboardData>(ENDPOINTS.dashboard.dekan);
  }

  async getOqituvchiDashboard(): Promise<OqituvchiDashboardData> {
    return apiClient.get<OqituvchiDashboardData>(ENDPOINTS.dashboard.oqituvchi);
  }

  async getTalabaDashboard(): Promise<TalabaDashboardData> {
    return apiClient.get<TalabaDashboardData>(ENDPOINTS.dashboard.talaba);
  }
}

export const dashboardService: IDashboardService = USE_MOCK
  ? new DashboardMockService()
  : new DashboardApiService();
