import { createContext, useContext, useState, ReactNode } from 'react';
import { darkPalette, lightPalette, darkBgGradient, lightBgGradient, Palette, RiskLevel } from '@/constants/colors';

export type Theme = 'dark' | 'light';

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
  palette: Palette;
  bgGradient: readonly string[];
  riskColor: Record<RiskLevel, string>;
};

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const palette = theme === 'dark' ? darkPalette : lightPalette;
  const bgGradient = theme === 'dark' ? darkBgGradient : lightBgGradient;
  const riskColor: Record<RiskLevel, string> = {
    Low: palette.safe,
    Moderate: palette.amber,
    High: palette.primary,
    Critical: palette.critical,
  };

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, bgGradient, riskColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
