import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { palette, riskColor as riskColorMap, bgGradient } from '@/constants/colors';
import { AgentRunCard } from '@/components/AgentRunCard';

const WEB = Platform.OS === 'web';

function hapticMedium() {
  if (!WEB) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { result, reset } = useApp();

  const topPad = WEB ? 56 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  function handleRescan() {
    hapticMedium();
    reset();
    router.replace('/');
  }

  if (!result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
        <Text style={styles.noResult}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.noResultBtn}>
          <Text style={styles.noResultLink}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color = riskColorMap[result.riskLevel] ?? palette.primary;

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={handleRescan} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RISK DASHBOARD</Text>
        {result.poweredByGroq ? (
          <View style={styles.groqBadge}>
            <Text style={styles.groqText}>Groq</Text>
          </View>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Risk Score */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreRing, { borderColor: color }]}>
            <View style={[styles.scoreInner, { borderColor: `${color}30` }]}>
              <Text style={[styles.scoreNumber, { color }]}>{result.riskScore}</Text>
              <Text style={[styles.scoreUnit, { color }]}>/ 100</Text>
            </View>
          </View>

          <View style={[styles.riskBadge, { backgroundColor: `${color}22`, borderColor: `${color}50` }]}>
            <Ionicons name="warning" size={14} color={color} />
            <Text style={[styles.riskBadgeText, { color }]}>
              {result.riskLevel} Risk · {result.workTypeLabel}
            </Text>
          </View>

          <Text style={styles.supervisorNote}>{result.supervisorAction}</Text>

          {result.reasoningSummary ? (
            <Text style={styles.reasoningText}>{result.reasoningSummary}</Text>
          ) : null}
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <MetricTile label="Heat Exp." value={result.risk.heatExposure} color={palette.critical} />
          <MetricTile label="Fatigue" value={result.risk.fatigueRisk} color={palette.primary} />
          <MetricTile label="Hydration" value={result.risk.hydrationUrgency} color={palette.amber} />
        </View>

        {/* Visual Checklist */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={18} color={color} />
            <Text style={styles.cardTitle}>Site Checklist</Text>
          </View>
          {result.visualChecklist.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.listDot, { backgroundColor: color }]} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Task Adjustment */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="create" size={18} color={palette.primary} />
            <Text style={styles.cardTitle}>Task Adjustment</Text>
          </View>
          <Text style={styles.bodyText}>{result.taskAdjustment}</Text>
        </View>

        {/* Break Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={18} color={palette.primary} />
            <Text style={styles.cardTitle}>Break Schedule</Text>
          </View>
          {result.breakSchedule.map((slot, i) => (
            <View key={i} style={styles.scheduleRow}>
              <Text style={styles.scheduleTime}>{slot.time}</Text>
              <Text style={styles.scheduleActivity}>{slot.activity}</Text>
            </View>
          ))}
        </View>

        {/* AI Agents */}
        <Text style={styles.sectionLabel}>SAFETY AGENTS</Text>
        {result.agents.map((agent) => (
          <AgentRunCard key={agent.id} agent={agent} state="complete" />
        ))}

        {/* Worker Alerts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubbles" size={18} color={palette.primary} />
            <Text style={styles.cardTitle}>Worker Safety Alerts</Text>
          </View>
          {result.workerAlerts.map((alert) => (
            <View key={alert.code} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View style={styles.codePill}>
                  <Text style={styles.codeText}>{alert.code}</Text>
                </View>
                <Text style={styles.langLabel}>{alert.language}</Text>
              </View>
              <Text style={[styles.alertText, { textAlign: alert.rtl ? 'right' : 'left' }]}>
                {alert.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 16 }]}>
        <TouchableOpacity onPress={handleRescan} activeOpacity={0.85} style={styles.rescanBtn}>
          <Ionicons name="scan" size={18} color={palette.primary} />
          <Text style={styles.rescanText}>Scan New Worksite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MetricTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.metricTile, { borderColor: `${color}40` }]}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricBarTrack}>
        <View style={[styles.metricBarFill, { width: `${value}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: palette.text, fontSize: 13, fontWeight: '800', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
  groqBadge: {
    backgroundColor: 'rgba(255,122,26,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,26,0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  groqText: { color: palette.primary, fontSize: 11, fontWeight: '800', fontFamily: 'Inter_700Bold' },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 8 },

  scoreSection: { alignItems: 'center', paddingVertical: 28 },
  scoreRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  scoreInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: { fontSize: 48, fontWeight: '900', fontFamily: 'Inter_700Bold', lineHeight: 52 },
  scoreUnit: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },

  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 14,
  },
  riskBadgeText: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },

  supervisorNote: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  reasoningText: {
    color: palette.textMuted,
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
    fontFamily: 'Inter_400Regular',
  },

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricTile: {
    flex: 1,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  metricValue: { fontSize: 26, fontWeight: '900', fontFamily: 'Inter_700Bold' },
  metricLabel: { color: palette.textMuted, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 8 },
  metricBarTrack: { height: 4, width: '100%', borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  metricBarFill: { height: 4, borderRadius: 2 },

  card: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({ web: { backdropFilter: 'blur(14px)' } as any, default: {} }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { color: palette.text, fontSize: 15, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },

  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  listText: { flex: 1, color: palette.textMuted, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  bodyText: { color: palette.textMuted, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8,
  },
  scheduleTime: { color: palette.primary, fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold', minWidth: 110 },
  scheduleActivity: { color: palette.textMuted, fontSize: 13, flex: 1, textAlign: 'right', fontFamily: 'Inter_400Regular' },

  sectionLabel: {
    color: palette.textFaint,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
  },

  alertCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 14,
    marginBottom: 10,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  codePill: {
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: { color: '#fff', fontSize: 11, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  langLabel: { color: palette.textMuted, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  alertText: { color: palette.text, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },

  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    backgroundColor: palette.bg,
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.glass,
    paddingVertical: 16,
    borderRadius: 18,
  },
  rescanText: { color: palette.primary, fontSize: 15, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },

  noResult: { color: palette.text, fontSize: 16, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  noResultBtn: { marginTop: 4 },
  noResultLink: { color: palette.primary, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
});
