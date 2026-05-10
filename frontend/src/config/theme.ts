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

export const BUDGET_CATEGORY_COLORS: Record<string, string> = {
  'Ish haqi': '#3B82F6',
  'Kommunal xizmatlar': '#F59E0B',
  "Ta'mirlash": '#2DB976',
  'Jihozlar': '#8B5CF6',
  'Transport': '#EC4899',
  'Stipendiya': '#06B6D4',
  'Boshqa xarajatlar': '#94A3B8',
};

export const BUDGET_CATEGORY_DEFAULT_COLOR = '#64748B';
