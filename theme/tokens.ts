export const colors = {
  maroon: '#6B0010',
  maroonDeep: '#4A000B',
  blush: '#FFDDDD',
  blushSoft: '#FFEDED',
  ink: '#1E1E1E',
  rule: '#0D0D0D',
  ruleLight: 'rgba(107, 0, 16, 0.2)',
  ruleDark: 'rgba(255, 221, 221, 0.2)',
  ok: '#2E7D5B',
  warn: '#C98A00',
  danger: '#B3261E',
  teal: '#2A9D8F',
  white: '#FFFFFF',
  textMutedLight: 'rgba(107, 0, 16, 0.7)',
  textMutedDark: 'rgba(255, 221, 221, 0.7)',
};

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillText: string;
  rule: string;
  watermark: string;
  tint: string;
  tabActive: string;
  tabInactive: string;
}

export const lightTheme: ThemeColors = {
  background: colors.blush,
  cardBg: colors.blushSoft,
  cardBorder: colors.maroon,
  text: colors.maroon,
  textMuted: colors.textMutedLight,
  pillBg: colors.ink,
  pillText: colors.blush,
  rule: colors.rule,
  watermark: 'rgba(107, 0, 16, 0.08)',
  tint: colors.maroon,
  tabActive: colors.maroon,
  tabInactive: 'rgba(107, 0, 16, 0.45)',
};

export const darkTheme: ThemeColors = {
  background: colors.maroon,
  cardBg: colors.maroonDeep,
  cardBorder: colors.blush,
  text: colors.blush,
  textMuted: colors.textMutedDark,
  pillBg: colors.ink,
  pillText: colors.blush,
  rule: 'rgba(255, 221, 221, 0.3)',
  watermark: 'rgba(74, 0, 11, 0.6)',
  tint: colors.blush,
  tabActive: colors.blush,
  tabInactive: 'rgba(255, 221, 221, 0.45)',
};
