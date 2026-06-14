import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, LayoutAnimation, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { palette, bgGradient, riskColor } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { RiskGauge } from '@/components/RiskGauge';
import { MetricBar } from '@/components/MetricBar';
import { WeatherEvidenceCard } from '@/components/WeatherEvidenceCard';
import { GlassPanel } from '@/components/GlassPanel';

const WEB = Platform.OS === 'web';
if (!WEB && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
function hapticLight() { if (!WEB) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { result, reset } = useApp();
  const [showWhy, setShowWhy] = useState(false);

  const topPad = WEB ? 52 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  if (!result) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
        <Text style={{ color: palette.text, fontSize: 16, marginBottom: 16 }}>No analysis found.</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={{ color: palette.primary, fontWeight: '700' }}>Back to home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color = riskColor[result.riskLevel];

  function toggleWhy() {
    hapticLight();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowWhy((s) => !s);
  }

  function newScan() {
    reset();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
      <View style={[styles.glowTop, { backgroundColor: color }]} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={newScan} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SAFETY DECISION</Text>
        {result.poweredByGroq ? (
          <View style={styles.groqTag}>
            <Text style={styles.groqText}>GROQ</Text>
          </View>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Gauge */}
        <View style={styles.gaugeWrap}>
          <RiskGauge score={result.riskScore} level={result.riskLevel} size={200} />
          <Text style={[styles.workTag, { color: palette.textMuted }]}>
            {result.workTypeLabel} · {result.weather.locationName.split('·')[0].trim()}
          </Text>
        </View>

        {/* Supervisor action */}
        <GlassPanel glow={color} style={styles.actionPanel} padding={18}>
          <View style={styles.actionHead}>
            <Ionicons name="warning" size={18} color={color} />
            <Text style={[styles.actionTitle, { color }]}>Supervisor Action</Text>
          </View>
          <Text style={styles.actionText}>{result.supervisorAction}</Text>
        </GlassPanel>

        {/* Sub-scores */}
        <GlassPanel style={styles.panel} padding={18}>
          <Text style={styles.panelTitle}>Risk Breakdown</Text>
          <MetricBar icon="flame" label="Heat exposure" value={result.risk.heatExposure} color={palette.critical} />
          <MetricBar icon="battery-half" label="Fatigue risk" value={result.risk.fatigueRisk} color={palette.primary} />
          <MetricBar icon="water" label="Hydration urgency" value={result.risk.hydrationUrgency} color={palette.amber} />
        </GlassPanel>

        {/* Weather evidence */}
        <WeatherEvidenceCard weather={result.weather} />

        {/* Break schedule */}
        <GlassPanel style={styles.panel} padding={18}>
          <View style={styles.panelHead}>
            <Ionicons name="time" size={17} color={palette.primary} />
            <Text style={styles.panelTitleInline}>Break & Hydration Schedule</Text>
          </View>
          {result.breakSchedule.map((slot) => (
            <View key={slot.time} style={styles.schedRow}>
              <Text style={styles.schedTime}>{slot.time}</Text>
              <Text style={styles.schedAct}>{slot.activity}</Text>
            </View>
          ))}
        </GlassPanel>

        {/* Task adjustment */}
        <GlassPanel style={styles.panel} padding={18}>
          <View style={styles.panelHead}>
            <Ionicons name="construct" size={17} color={palette.primary} />
            <Text style={styles.panelTitleInline}>Task Adjustment</Text>
          </View>
          <Text style={styles.bodyText}>{result.taskAdjustment}</Text>
        </GlassPanel>

        {/* Agent reasoning */}
        <GlassPanel style={styles.panel} padding={18}>
          <View style={styles.panelHead}>
            <Ionicons name="git-network" size={17} color={palette.primary} />
            <Text style={styles.panelTitleInline}>Agent Reasoning</Text>
          </View>
          {result.agents.map((a) => (
            <View key={a.id} style={styles.agentLine}>
              <View style={styles.agentDot} />
              <Text style={styles.agentText}>
                <Text style={styles.agentName}>{a.name.replace(' Agent', '')}: </Text>
                {a.decision} <Text style={styles.agentConf}>· {a.confidence}%</Text>
              </Text>
            </View>
          ))}
          <TouchableOpacity onPress={toggleWhy} style={styles.whyBtn} activeOpacity={0.8}>
            <Text style={styles.whyText}>{showWhy ? 'Hide explanation' : 'Why this decision?'}</Text>
            <Ionicons name={showWhy ? 'chevron-up' : 'chevron-down'} size={15} color={palette.primary} />
          </TouchableOpacity>
          {showWhy && <Text style={styles.whyBody}>{result.reasoningSummary}</Text>}
        </GlassPanel>

        {/* Worker alert link */}
        <TouchableOpacity onPress={() => router.push('/alert')} activeOpacity={0.9} style={styles.linkBtn}>
          <Ionicons name="chatbubbles" size={18} color={palette.primary} />
          <Text style={styles.linkText}>Worker Safety Alert</Text>
          <Ionicons name="chevron-forward" size={16} color={palette.textFaint} />
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 14 }]}>
        <TouchableOpacity onPress={() => router.push('/report')} activeOpacity={0.9} style={styles.ctaWrap}>
          <LinearGradient
            colors={[palette.amber, palette.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Ionicons name="document-text" size={19} color="#0A0A0A" />
            <Text style={styles.ctaText}>VIEW SAFETY REPORT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },
  centered: { alignItems: 'center', justifyContent: 'center' },
  glowTop: { position: 'absolute', top: -160, alignSelf: 'center', width: 320, height: 320, borderRadius: 160, opacity: 0.14 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: palette.glass, borderWidth: 1, borderColor: palette.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: palette.text, fontSize: 14, fontWeight: '800', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
  groqTag: { borderWidth: 1, borderColor: `${palette.safe}55`, backgroundColor: `${palette.safe}1A`, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  groqText: { color: palette.safe, fontSize: 9, fontWeight: '800', letterSpacing: 0.5, fontFamily: 'Inter_700Bold' },

  content: { paddingHorizontal: 20 },

  gaugeWrap: { alignItems: 'center', paddingVertical: 12 },
  workTag: { fontSize: 13, fontWeight: '600', marginTop: 12, fontFamily: 'Inter_500Medium' },

  actionPanel: { marginTop: 8, marginBottom: 14, borderColor: 'rgba(255,255,255,0.14)' },
  actionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  actionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, fontFamily: 'Inter_700Bold' },
  actionText: { color: palette.text, fontSize: 16, fontWeight: '700', lineHeight: 23, fontFamily: 'Inter_600SemiBold' },

  panel: { marginBottom: 14 },
  panelTitle: { color: palette.text, fontSize: 15, fontWeight: '700', marginBottom: 16, fontFamily: 'Inter_600SemiBold' },
  panelHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  panelTitleInline: { color: palette.text, fontSize: 15, fontWeight: '700', flex: 1, fontFamily: 'Inter_600SemiBold' },

  schedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: palette.border },
  schedTime: { color: palette.primary, fontSize: 13, fontWeight: '700', minWidth: 110, fontFamily: 'Inter_600SemiBold' },
  schedAct: { flex: 1, color: palette.text, fontSize: 13, textAlign: 'right', fontFamily: 'Inter_400Regular' },

  bodyText: { color: palette.text, fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },

  agentLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 10 },
  agentDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.primary, marginTop: 6 },
  agentText: { flex: 1, color: palette.textMuted, fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  agentName: { color: palette.text, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
  agentConf: { color: palette.safe, fontWeight: '700' },
  whyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.border },
  whyText: { color: palette.primary, fontSize: 13, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
  whyBody: { color: palette.textMuted, fontSize: 13, lineHeight: 20, marginTop: 10, fontFamily: 'Inter_400Regular' },

  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.glass,
    borderWidth: 1, borderColor: palette.border, borderRadius: 16, paddingVertical: 15,
    paddingHorizontal: 16, marginBottom: 14,
  },
  linkText: { flex: 1, color: palette.text, fontSize: 14, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },

  footer: {
    paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(7,7,7,0.92)',
    borderTopWidth: 1, borderTopColor: palette.border,
  },
  ctaWrap: { borderRadius: 18, overflow: 'hidden' },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
  ctaText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
});
