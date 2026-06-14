import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '@/constants/colors';
import { Weather } from '@/lib/weatherService';

interface WeatherEvidenceCardProps {
  weather: Weather;
  compact?: boolean;
}

type Metric = { icon: string; label: string; value: string };

// Live weather evidence strip — the real data behind the decision.
export function WeatherEvidenceCard({ weather, compact }: WeatherEvidenceCardProps) {
  const metrics: Metric[] = [
    { icon: 'thermometer', label: 'Temp', value: `${weather.tempC}°C` },
    { icon: 'sunny', label: 'UV', value: `${weather.uvIndex}` },
    { icon: 'water', label: 'Humidity', value: `${weather.humidity}%` },
    { icon: 'navigate', label: 'Wind', value: `${weather.windKph} km/h` },
  ];

  return (
    <View style={[styles.card, compact && styles.compact]}>
      <View style={styles.head}>
        <View style={styles.locRow}>
          <Ionicons name="location" size={14} color={palette.primary} />
          <Text style={styles.loc}>{weather.locationName}</Text>
        </View>
        <View style={[styles.tag, { borderColor: weather.isLive ? `${palette.safe}55` : palette.border }]}>
          <View style={[styles.dot, { backgroundColor: weather.isLive ? palette.safe : palette.amber }]} />
          <Text style={[styles.tagText, { color: weather.isLive ? palette.safe : palette.amber }]}>
            {weather.isLive ? 'LIVE' : 'DEMO'}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {metrics.map((m) => (
          <View key={m.label} style={styles.metric}>
            <Ionicons name={m.icon as any} size={16} color={palette.amber} />
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    padding: 16,
    ...Platform.select({ web: { backdropFilter: 'blur(16px)' } as any, default: {} }),
  },
  compact: { padding: 14 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  loc: { color: palette.text, fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 100,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, fontFamily: 'Inter_700Bold' },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'center', flex: 1, gap: 3 },
  metricValue: { color: palette.text, fontSize: 16, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  metricLabel: { color: palette.textFaint, fontSize: 10, fontWeight: '600', fontFamily: 'Inter_500Medium' },
});
