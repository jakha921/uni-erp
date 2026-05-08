import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RoleKey } from '@/types/auth';
import { canAccessRoute } from '@/lib/permissions';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  switchRole: (role: RoleKey) => void;
  can: (routeId: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ currentUser: user, token, isAuthenticated: true }),
      logout: () => set({ currentUser: null, token: null, isAuthenticated: false }),
      switchRole: (role) => {
        const user = get().currentUser;
        if (user) {
          set({ currentUser: { ...user, role } });
        }
      },
      can: (routeId) => {
        const user = get().currentUser;
        if (!user) return false;
        return canAccessRoute(routeId, user.role);
      },
    }),
    {
      name: 'uni-erp-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
