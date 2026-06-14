import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from '@/constants/colors';

interface MetricBarProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

export function MetricBar({ icon, label, value, color }: MetricBarProps) {
  const { palette } = useTheme();
  const styles = makeStyles(palette);
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: Math.max(0, Math.min(100, value)),
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.labelRow}>
          <Ionicons name={icon as any} size={14} color={color} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, { color }]}>{Math.round(value)}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
    </View>
  );
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    wrap: { marginBottom: 14 },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    label: { color: p.text, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
    value: { fontSize: 14, fontWeight: '800', fontFamily: 'Inter_700Bold' },
    track: { height: 7, borderRadius: 4, backgroundColor: p.glass, overflow: 'hidden' },
    fill: { height: 7, borderRadius: 4 },
  });
}
