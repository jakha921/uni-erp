import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'uz' | 'ru' | 'en';
type Theme = 'light' | 'dark';

interface AppState {
  lang: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  setLang: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'uz',
      theme: 'light',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
    }),
    {
      name: 'uni-erp-app',
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
