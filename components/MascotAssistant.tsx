import { View, Image, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface MascotAssistantProps {
  size?: number;
  glow?: boolean;
  style?: ViewStyle;
}

export function MascotAssistant({ size = 120, glow = true, style }: MascotAssistantProps) {
  const { palette } = useTheme();

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      {glow && (
        <View
          style={[
            styles.glow,
            {
              width: size * 1.05,
              height: size * 1.05,
              borderRadius: size,
              backgroundColor: `${palette.primary}2E`,
              ...Platform.select({
                web: { boxShadow: `0 0 60px ${palette.primary}55` } as any,
                default: {
                  shadowColor: palette.primary,
                  shadowOpacity: 0.5,
                  shadowRadius: 40,
                  shadowOffset: { width: 0, height: 0 },
                },
              }),
            },
          ]}
        />
      )}
      <Image
        source={require('../assets/images/robot.png')}
        style={{ width: size * 0.82, height: size * 0.92 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute' },
});
