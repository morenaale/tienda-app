export const colors = {
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42DB',
  secondary: '#FF6B9D',
  secondaryLight: '#FF8DB5',
  secondaryDark: '#E0527F',
  accent: '#00D9A6',
  accentLight: '#33E3BC',
  accentDark: '#00B88A',

  background: '#FAFBFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F6FA',
  card: '#FFFFFF',

  text: '#1A1D2E',
  textSecondary: '#6B7394',
  textTertiary: '#9EA3BE',
  textInverse: '#FFFFFF',

  border: '#E8EAF2',
  borderLight: '#F0F1F7',
  divider: '#F0F1F7',

  success: '#00C48C',
  warning: '#FFB946',
  error: '#FF5757',
  info: '#4DA6FF',

  overlay: 'rgba(26, 29, 46, 0.5)',
  shadow: 'rgba(108, 99, 255, 0.08)',

  gradient: {
    primary: ['#6C63FF', '#8B85FF'] as const,
    secondary: ['#FF6B9D', '#FF8DB5'] as const,
    accent: ['#00D9A6', '#33E3BC'] as const,
    hero: ['#6C63FF', '#FF6B9D'] as const,
    dark: ['#1A1D2E', '#2D3154'] as const,
  },

  star: '#FFB946',
  badge: '#FF5757',
  skeleton: '#E8EAF2',
};

export type Colors = typeof colors;
