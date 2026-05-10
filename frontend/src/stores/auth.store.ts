import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RoleKey } from '@/types/auth';
import { canAccessRoute } from '@/lib/permissions';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  switchRole: (role: RoleKey) => void;
  setToken: (token: string) => void;
  patchCurrentUser: (patch: Partial<User>) => void;
  can: (routeId: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, token, refreshToken) => set({ currentUser: user, token, refreshToken: refreshToken ?? null, isAuthenticated: true }),
      logout: () => set({ currentUser: null, token: null, refreshToken: null, isAuthenticated: false }),
      switchRole: (role) => {
        const user = get().currentUser;
        if (user) {
          set({ currentUser: { ...user, role } });
        }
      },
      setToken: (token) => set({ token }),
      patchCurrentUser: (patch) => {
        const user = get().currentUser;
        if (user) set({ currentUser: { ...user, ...patch } });
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
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
