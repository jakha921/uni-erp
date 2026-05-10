import { describe, expect, it, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';
import type { User } from '@/types/auth';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  initials: 'TU',
  email: 'test@example.com',
  phone: '+998901234567',
  role: 'admin',
  facultyId: null,
  departmentId: null,
  employeeId: null,
  studentId: null,
  avatar: null,
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      currentUser: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.currentUser).toBeNull();
    expect(state.token).toBeNull();
  });

  it('login sets user and tokens', () => {
    useAuthStore.getState().login(mockUser, 'test-token', 'refresh-token');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('test-token');
    expect(state.refreshToken).toBe('refresh-token');
    expect(state.currentUser?.name).toBe('Test User');
  });

  it('login without refreshToken sets it to null', () => {
    useAuthStore.getState().login(mockUser, 'test-token');

    const state = useAuthStore.getState();
    expect(state.refreshToken).toBeNull();
  });

  it('logout clears state', () => {
    useAuthStore.getState().login(mockUser, 'test-token', 'refresh-token');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.currentUser).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
  });

  it('switchRole changes user role', () => {
    useAuthStore.getState().login(mockUser, 'test-token');
    useAuthStore.getState().switchRole('dekan');

    const state = useAuthStore.getState();
    expect(state.currentUser?.role).toBe('dekan');
  });

  it('switchRole does nothing if no user', () => {
    useAuthStore.getState().switchRole('dekan');
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it('setToken updates access token', () => {
    useAuthStore.getState().setToken('new-token');
    expect(useAuthStore.getState().token).toBe('new-token');
  });
});
