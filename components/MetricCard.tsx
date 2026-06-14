import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';

type Tone = 'danger' | 'warning' | 'success';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  tone: Tone;
}

export function MetricCard({ label, value, unit, tone }: MetricCardProps) {
  const colors = useColors();
  const toneColor = tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : colors.success;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: colors.radius - 4,
        },
      ]}
    >
      <View style={[styles.bar, { backgroundColor: toneColor }]} />
      <Text style={[styles.value, { color: toneColor }]}>
        {value}{unit ?? '%'}
      </Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    gap: 6,
  },
  bar: {
    width: 28,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
