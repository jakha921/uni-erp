import type { User, LoginRequest, LoginResponse } from '@/types/auth';
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { AuthMockService } from '../mock/auth.mock';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  me(): Promise<User>;
  forgotPassword(phone: string): Promise<void>;
  getDemoUsers(): User[];
}

class AuthApiService implements IAuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>(ENDPOINTS.auth.login, data);
    return res;
  }

  async logout(): Promise<void> {
    await apiClient.post<void>(ENDPOINTS.auth.logout);
  }

  async me(): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.auth.me);
  }

  async forgotPassword(phone: string): Promise<void> {
    await apiClient.post<void>(ENDPOINTS.auth.forgotPassword, { phone });
  }

  getDemoUsers(): User[] {
    return [];
  }
}

export const authService: IAuthService = USE_MOCK
  ? new AuthMockService()
  : new AuthApiService();
