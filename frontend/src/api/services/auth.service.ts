import type { User, LoginRequest, LoginResponse } from '@/types/auth';

export interface UpdateProfileDto {
  name: string;
  email: string;
  phone: string;
}
import { USE_MOCK, ENDPOINTS } from '@/config/api';
import { apiClient } from '../client';
import { AuthMockService } from '../mock/auth.mock';

export interface IAuthService {
  login(data: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  me(): Promise<User>;
  forgotPassword(phone: string): Promise<void>;
  verifyCode(phone: string, code: string): Promise<{ token: string }>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(currentPassword: string, newPassword: string): Promise<void>;
  updateProfile(dto: UpdateProfileDto): Promise<User>;
  getDemoUsers(): User[];
}

const DEMO_USERS: User[] = [
  { id: 1, name: 'Adminov Abdulla Akramovich', initials: 'AA', email: 'admin@bitu.uz', phone: '+998 (90) 123-45-67', role: 'admin', facultyId: null, departmentId: null, employeeId: null, studentId: null, avatar: null },
  { id: 2, name: 'Karimova Malika Baxtiyorovna', initials: 'KM', email: 'buxgalter@bitu.uz', phone: '+998 (90) 234-56-78', role: 'buxgalter', facultyId: null, departmentId: null, employeeId: 42, studentId: null, avatar: null },
  { id: 3, name: 'Rahimov Sardor Dilmurodovich', initials: 'RS', email: 'dekan@bitu.uz', phone: '+998 (90) 345-67-89', role: 'dekan', facultyId: 1, departmentId: null, employeeId: 15, studentId: null, avatar: null },
  { id: 4, name: "Toshmatov Raximberdi Qo'chqorovich", initials: 'TR', email: 'teacher@bitu.uz', phone: '+998 (90) 456-78-90', role: 'oqituvchi', facultyId: 1, departmentId: 3, employeeId: 8, studentId: null, avatar: null },
  { id: 5, name: 'Xolmatova Nodira Baxromovna', initials: 'XN', email: 'student@bitu.uz', phone: '+998 (90) 567-89-01', role: 'talaba', facultyId: 2, departmentId: 5, employeeId: null, studentId: 101, avatar: null },
];

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

  async verifyCode(phone: string, code: string): Promise<{ token: string }> {
    return apiClient.post<{ token: string }>(ENDPOINTS.auth.verifyCode, { phone, code });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post<void>(ENDPOINTS.auth.resetPassword, { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post<void>('/auth/change-password', { currentPassword, newPassword });
  }

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    return apiClient.patch<User>(ENDPOINTS.auth.me, dto);
  }

  getDemoUsers(): User[] {
    return DEMO_USERS;
  }
}

export const authService: IAuthService = USE_MOCK
  ? new AuthMockService()
  : new AuthApiService();
