import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { RiskLevel } from '@/constants/colors';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export function RiskGauge({ score, level, size = 200 }: RiskGaugeProps) {
  const { palette, riskColor } = useTheme();
  const color = riskColor[level];
  const stroke = size * 0.07;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: Math.max(0, Math.min(100, score)),
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [score]);

  const rightRotate = progress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0deg', '180deg', '180deg'],
  });
  const leftRotate = progress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  const half = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: half, borderWidth: stroke, borderColor: palette.glass },
        ]}
      />

      <View style={[styles.clip, { width: half, height: size, right: 0 }]}>
        <Animated.View
          style={[
            styles.halfRing,
            { width: size, height: size, borderRadius: half, borderWidth: stroke, borderColor: color, right: 0, transform: [{ rotate: rightRotate }] },
          ]}
        />
      </View>

      <View style={[styles.clip, { width: half, height: size, left: 0 }]}>
        <Animated.View
          style={[
            styles.halfRing,
            { width: size, height: size, borderRadius: half, borderWidth: stroke, borderColor: color, left: 0, transform: [{ rotate: leftRotate }] },
          ]}
        />
      </View>

      <View style={styles.center}>
        <Text style={[styles.score, { color, fontSize: size * 0.26 }]}>{Math.round(score)}</Text>
        <Text style={[styles.outOf, { color: palette.textFaint }]}>/ 100</Text>
        <View style={[styles.levelPill, { borderColor: `${color}66`, backgroundColor: `${color}22` }]}>
          <View style={[styles.levelDot, { backgroundColor: color }]} />
          <Text style={[styles.levelText, { color }]}>{level.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  clip: { position: 'absolute', overflow: 'hidden', top: 0 },
  halfRing: { position: 'absolute', top: 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
  score: { fontWeight: '900', fontFamily: 'Inter_700Bold' },
  outOf: { fontSize: 13, fontWeight: '600', marginTop: -2, fontFamily: 'Inter_500Medium' },
  levelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, marginTop: 10,
  },
  levelDot: { width: 7, height: 7, borderRadius: 3.5 },
  levelText: { fontSize: 12, fontWeight: '800', letterSpacing: 1, fontFamily: 'Inter_700Bold' },
});
