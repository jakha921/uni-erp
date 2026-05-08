export const THEMES = {
  light: {
    primary: '#2DB976',
    text: '#0F172A',
    textMuted: '#64748B',
    background: '#F8FAFB',
    surface: '#FFFFFF',
    border: '#E2E8F0',
  },
  dark: {
    primary: '#34D399',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
  },
} as const;

export type ThemeMode = keyof typeof THEMES;
