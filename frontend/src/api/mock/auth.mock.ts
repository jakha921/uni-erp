import { delay } from './delay';
import type { User, LoginRequest, LoginResponse } from '@/types/auth';
import type { IAuthService, UpdateProfileDto } from '../services/auth.service';

const DEMO_USERS: User[] = [
  {
    id: 1,
    name: 'Adminov Abdulla Akramovich',
    initials: 'AA',
    email: 'admin@bitu.uz',
    phone: '+998 (90) 123-45-67',
    role: 'admin',
    facultyId: null,
    departmentId: null,
    employeeId: null,
    studentId: null,
    avatar: null,
  },
  {
    id: 2,
    name: 'Karimova Malika Baxtiyorovna',
    initials: 'KM',
    email: 'buxgalter@bitu.uz',
    phone: '+998 (90) 234-56-78',
    role: 'buxgalter',
    facultyId: null,
    departmentId: null,
    employeeId: 42,
    studentId: null,
    avatar: null,
  },
  {
    id: 3,
    name: 'Rahimov Sardor Dilmurodovich',
    initials: 'RS',
    email: 'dekan@bitu.uz',
    phone: '+998 (90) 345-67-89',
    role: 'dekan',
    facultyId: 1,
    departmentId: null,
    employeeId: 15,
    studentId: null,
    avatar: null,
  },
  {
    id: 4,
    name: "Toshmatov Raximberdi Qo'chqorovich",
    initials: 'TR',
    email: 'teacher@bitu.uz',
    phone: '+998 (90) 456-78-90',
    role: 'oqituvchi',
    facultyId: 1,
    departmentId: 3,
    employeeId: 8,
    studentId: null,
    avatar: null,
  },
  {
    id: 5,
    name: 'Xolmatova Nodira Baxromovna',
    initials: 'XN',
    email: 'student@bitu.uz',
    phone: '+998 (90) 567-89-01',
    role: 'talaba',
    facultyId: 2,
    departmentId: 5,
    employeeId: null,
    studentId: 101,
    avatar: null,
  },
];

export class AuthMockService implements IAuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    await delay(500);
    const normalized = data.phone.replace(/\D/g, '');
    const user = DEMO_USERS.find((u) => u.phone.replace(/\D/g, '').includes(normalized));
    if (!user) throw new Error("Telefon raqami yoki parol noto'g'ri");
    return { user, token: `mock-token-${user.id}-${Date.now()}` };
  }

  async logout(): Promise<void> {
    await delay(200);
  }

  async me(): Promise<User> {
    await delay(200);
    const first = DEMO_USERS[0];
    if (!first) throw new Error('No demo users available');
    return first;
  }

  async forgotPassword(_phone: string): Promise<void> {
    await delay(500);
  }

  async verifyCode(_phone: string, _code: string): Promise<{ token: string }> {
    await delay(600);
    return { token: 'mock-reset-token' };
  }

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    await delay(600);
  }

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await delay(600);
  }

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    await delay(500);
    const first = DEMO_USERS[0];
    if (!first) throw new Error('No demo users');
    return { ...first, ...dto };
  }

  getDemoUsers(): User[] {
    return DEMO_USERS;
  }
}
