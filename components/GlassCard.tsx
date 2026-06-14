import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: colors.radius,
          padding,
          ...(Platform.OS === 'web'
            ? { boxShadow: `0px 6px 20px ${colors.shadow}` }
            : {
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 1,
                shadowRadius: 20,
                elevation: 6,
              }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
