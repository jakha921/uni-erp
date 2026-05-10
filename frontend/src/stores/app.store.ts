import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'uz' | 'ru' | 'en';
type Theme = 'light' | 'dark';

interface AppState {
  lang: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  institutionName: string;
  setLang: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setInstitutionName: (name: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'uz',
      theme: 'light',
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      institutionName: 'NIU Universiteti',
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      setInstitutionName: (name) => set({ institutionName: name }),
    }),
    {
      name: 'uni-erp-app',
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        institutionName: state.institutionName,
      }),
    },
  ),
);
