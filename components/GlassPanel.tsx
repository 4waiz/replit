import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { palette } from '@/constants/colors';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  radius?: number;
  glow?: string; // optional accent glow color
}

// Frosted glass surface for the dark command-center UI.
export function GlassPanel({ children, style, padding = 16, radius = 20, glow }: GlassPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        { padding, borderRadius: radius },
        glow ? glowStyle(glow) : null,
        style as ViewStyle,
      ]}
    >
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

const styles = StyleSheet.create({
  panel: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    ...Platform.select({
      web: { backdropFilter: 'blur(16px)' } as any,
      default: {},
    }),
  },
});
