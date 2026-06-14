// Starkz AI — dual-theme palette (dark command-center + light field mode).

export type Palette = {
  bg: string;
  bgRaised: string;
  bgElevated: string;
  primary: string;
  amber: string;
  critical: string;
  safe: string;
  glass: string;
  glassStrong: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  footerBg: string;
};

export const darkPalette: Palette = {
  bg: '#070707',
  bgRaised: '#0B0A08',
  bgElevated: '#121110',
  primary: '#FF7A1A',
  amber: '#FFB020',
  critical: '#FF3B1F',
  safe: '#34D399',
  glass: 'rgba(255,255,255,0.08)',
  glassStrong: 'rgba(255,255,255,0.12)',
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.20)',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.62)',
  textFaint: 'rgba(255,255,255,0.40)',
  footerBg: 'rgba(7,7,7,0.93)',
};

export const lightPalette: Palette = {
  bg: '#FFF7ED',
  bgRaised: '#FFEDD5',
  bgElevated: '#FED7AA',
  primary: '#EA6A0A',
  amber: '#D97706',
  critical: '#DC2626',
  safe: '#059669',
  glass: 'rgba(0,0,0,0.05)',
  glassStrong: 'rgba(0,0,0,0.09)',
  border: 'rgba(0,0,0,0.12)',
  borderStrong: 'rgba(0,0,0,0.22)',
  text: '#1C0A00',
  textMuted: 'rgba(28,10,0,0.65)',
  textFaint: 'rgba(28,10,0,0.42)',
  footerBg: 'rgba(255,247,237,0.96)',
};

// Backward-compat alias — screens migrated to useTheme() use the dynamic version.
export const palette = darkPalette;

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

// Static dark-mode risk colors kept for components that receive color as a prop.
export const riskColor: Record<RiskLevel, string> = {
  Low: darkPalette.safe,
  Moderate: darkPalette.amber,
  High: darkPalette.primary,
  Critical: darkPalette.critical,
};

export const darkBgGradient = ['#070707', '#0B0A08', '#161210'] as const;
export const lightBgGradient = ['#FFF7ED', '#FFEDD5', '#FED7AA'] as const;

// Kept for backward compat (dark only).
export const bgGradient = darkBgGradient;
export const heatGradient = ['#FF3B1F', '#FF7A1A', '#FFB020'] as const;

// Legacy useColors() shim.
export const darkColors = {
  background: darkPalette.bg,
  foreground: darkPalette.text,
  primary: darkPalette.primary,
  primaryForeground: '#0A0A0A',
  accent: darkPalette.amber,
  accentForeground: '#0A0A0A',
  card: darkPalette.glass,
  cardBorder: darkPalette.border,
  muted: 'rgba(255,255,255,0.05)',
  mutedForeground: darkPalette.textMuted,
  success: darkPalette.safe,
  warning: darkPalette.amber,
  danger: darkPalette.critical,
  divider: 'rgba(255,255,255,0.08)',
  radius: 22,
  shadow: 'rgba(0,0,0,0.55)',
};
export const lightColors = darkColors;
export type AppColors = typeof darkColors;
