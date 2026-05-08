import type { User, LoginRequest, LoginResponse } from '@/types/auth';
import { AuthMockService } from '../mock/auth.mock';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  me(): Promise<User>;
  forgotPassword(phone: string): Promise<void>;
  getDemoUsers(): User[];
}

export const authService: IAuthService = new AuthMockService();
