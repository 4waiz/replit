import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

function hapticMedium() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { agents } from '@/lib/mockData';
import { GlassCard } from '@/components/GlassCard';
import { AgentCard } from '@/components/AgentCard';
import { MetricCard } from '@/components/MetricCard';

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { result, reset } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleRescan() {
    hapticMedium();
    reset();
    router.replace('/');
  }

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.foreground, fontSize: 16 }}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const riskColor = result.riskLevel === 'Critical' ? colors.danger : colors.warning;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#1c0800', '#431407']}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <TouchableOpacity onPress={handleRescan} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RISK DASHBOARD</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Risk Score */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreRing, { borderColor: riskColor }]}>
            <View style={[styles.scoreInner, { borderColor: `${riskColor}30` }]}>
              <Text style={[styles.scoreNumber, { color: riskColor }]}>{result.riskScore}</Text>
              <Text style={[styles.scoreUnit, { color: riskColor }]}>/ 100</Text>
            </View>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: `${riskColor}22`, borderColor: `${riskColor}50` }]}>
            <Ionicons name="warning" size={14} color={riskColor} />
            <Text style={[styles.riskBadgeText, { color: riskColor }]}>{result.riskLevel} Risk · {result.workType}</Text>
          </View>
          <Text style={[styles.primaryAction, { color: colors.foreground }]}>
            {result.primaryAction}
          </Text>
          <Text style={[styles.supervisorNote, { color: colors.mutedForeground }]}>
            {result.supervisorAction}
          </Text>
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          <MetricCard label="Heat Exp." value={result.heatExposure} tone="danger" />
          <MetricCard label="Fatigue" value={result.fatigueRisk} tone="warning" />
          <MetricCard label="Hydration" value={72} tone="success" />
        </View>

        {/* Top Risks */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Top Risks</Text>
          </View>
          {result.topRisks.map((risk) => (
            <View key={risk} style={styles.listItem}>
              <View style={[styles.listDot, { backgroundColor: colors.danger }]} />
              <Text style={[styles.listText, { color: colors.foreground }]}>{risk}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Task Adjustment */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="create" size={18} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Task Adjustment</Text>
          </View>
          <Text style={[styles.bodyText, { color: colors.foreground }]}>{result.taskAdjustment}</Text>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          {result.mitigation.map((m) => (
            <View key={m} style={styles.listItem}>
              <View style={[styles.listDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.listText, { color: colors.foreground }]}>{m}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Break Schedule */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={18} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Break Schedule</Text>
          </View>
          {result.breakSchedule.map((slot) => (
            <View key={slot.time} style={[styles.scheduleRow, { borderColor: colors.cardBorder, backgroundColor: colors.muted }]}>
              <Text style={[styles.scheduleTime, { color: colors.primary }]}>{slot.time}</Text>
              <Text style={[styles.scheduleActivity, { color: colors.foreground }]}>{slot.activity}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Agents */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SAFETY AGENTS</Text>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} state="done" />
        ))}

        {/* Multilingual Messages */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubbles" size={18} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Worker Safety Message</Text>
          </View>
          {result.workerMessages.map((msg) => (
            <View
              key={msg.code}
              style={[styles.msgCard, { backgroundColor: colors.muted, borderColor: colors.cardBorder }]}
            >
              <View style={styles.msgHeader}>
                <View style={[styles.codePill, { backgroundColor: colors.primary }]}>
                  <Text style={styles.codeText}>{msg.code}</Text>
                </View>
                <Text style={[styles.langLabel, { color: colors.mutedForeground }]}>{msg.language}</Text>
              </View>
              <Text style={[
                styles.msgText,
                { color: colors.foreground, textAlign: msg.rtl ? 'right' : 'left' }
              ]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </GlassCard>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 16, backgroundColor: colors.background, borderTopColor: colors.divider }]}>
        <TouchableOpacity
          onPress={handleRescan}
          activeOpacity={0.85}
          style={[styles.rescanBtn, { backgroundColor: colors.muted, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={[styles.rescanText, { color: colors.primary }]}>Scan New Worksite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'Inter_700Bold',
  },

  scroll: { flex: 1 },
  content: { padding: 20 },

  scoreSection: { alignItems: 'center', paddingVertical: 24 },
  scoreRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'Inter_700Bold',
    lineHeight: 52,
  },
  scoreUnit: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_500Medium',
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
  },
  riskBadgeText: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
  primaryAction: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  supervisorNote: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    fontFamily: 'Inter_400Regular',
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  card: { marginBottom: 16 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  listText: { flex: 1, fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  bodyText: { fontSize: 13, lineHeight: 20, marginBottom: 14, fontFamily: 'Inter_400Regular' },
  divider: { height: 1, marginBottom: 14 },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  scheduleTime: { fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold', minWidth: 100 },
  scheduleActivity: { fontSize: 13, flex: 1, textAlign: 'right', fontFamily: 'Inter_400Regular' },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
  },

  msgCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  msgHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  codePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: { color: '#fff', fontSize: 11, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  langLabel: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  msgText: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 18,
  },
  rescanText: { fontSize: 15, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
});
