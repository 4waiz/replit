// Starkz AI — premium field-safety command center palette.
// Graphite black base, heat-orange/amber accents, heat-map risk gradients.

export const palette = {
  // Base / graphite black
  bg: '#070707',
  bgRaised: '#0B0A08',
  bgElevated: '#121110',

  // Heat accents
  primary: '#FF7A1A', // heat orange
  amber: '#FFB020',
  critical: '#FF3B1F', // critical red-orange
  safe: '#34D399', // safe green

  // Glass surfaces
  glass: 'rgba(255,255,255,0.08)',
  glassStrong: 'rgba(255,255,255,0.12)',
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.20)',

  // Text
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.62)',
  textFaint: 'rgba(255,255,255,0.40)',
} as const;

// Risk-level → color mapping (heat-map ramp)
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export const riskColor: Record<RiskLevel, string> = {
  Low: palette.safe,
  Moderate: palette.amber,
  High: palette.primary,
  Critical: palette.critical,
};

// Heat-map gradient stops used for gauges / hero washes
export const heatGradient = ['#FF3B1F', '#FF7A1A', '#FFB020'] as const;
export const bgGradient = ['#070707', '#0B0A08', '#161210'] as const;

// ── Legacy shim ───────────────────────────────────────────────
// Older screens/components consume a `useColors()` object with these keys.
// Keep it mapped onto the new dark palette so nothing breaks during the rebuild.
export const darkColors = {
  background: palette.bg,
  foreground: palette.text,
  primary: palette.primary,
  primaryForeground: '#0A0A0A',
  accent: palette.amber,
  accentForeground: '#0A0A0A',
  card: palette.glass,
  cardBorder: palette.border,
  muted: 'rgba(255,255,255,0.05)',
  mutedForeground: palette.textMuted,
  success: palette.safe,
  warning: palette.amber,
  danger: palette.critical,
  divider: 'rgba(255,255,255,0.08)',
  radius: 22,
  shadow: 'rgba(0,0,0,0.55)',
};

export const lightColors = darkColors; // force dark — this app is dark-only

export type AppColors = typeof darkColors;
