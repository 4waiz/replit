import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  radius?: number;
  glow?: string;
}

export function GlassPanel({ children, style, padding = 16, radius = 20, glow }: GlassPanelProps) {
  const { palette } = useTheme();

  const panelStyle: ViewStyle = {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    padding,
    borderRadius: radius,
    ...Platform.select({ web: { backdropFilter: 'blur(16px)' } as any, default: {} }),
  };

  const glowExtra = glow ? glowStyle(glow) : undefined;

  return (
    <View style={[panelStyle, glowExtra, style as ViewStyle]}>
      {children}
    </View>
  );
}

function glowStyle(color: string): ViewStyle {
  return Platform.select({
    web: { boxShadow: `0 8px 30px ${color}33` } as any,
    default: {
      shadowColor: color,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
  }) as ViewStyle;
}
