import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '@/constants/colors';
import { AgentReport } from '@/lib/agentEngine';

export type AgentRunState = 'idle' | 'scanning' | 'complete';

interface AgentRunCardProps {
  agent: AgentReport;
  state: AgentRunState;
}

// One agent in the analysis pipeline. Shows live status, evidence, decision and
// a confidence bar. Reveals reasoning only once the agent is complete.
export function AgentRunCard({ agent, state }: AgentRunCardProps) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    }
    if (state === 'complete') {
      Animated.timing(fill, {
        toValue: agent.confidence,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  }, [state]);

  const active = state !== 'idle';
  const done = state === 'complete';

  const statusColor = done ? palette.safe : state === 'scanning' ? palette.amber : palette.textFaint;

  return (
    <View style={[styles.card, active && styles.cardActive, done && styles.cardDone]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { borderColor: done ? `${palette.safe}55` : palette.border }]}>
          <Ionicons name={agent.icon as any} size={18} color={done ? palette.safe : palette.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{agent.name}</Text>
          <View style={styles.statusRow}>
            {state === 'scanning' && (
              <Animated.View style={[styles.statusDot, { backgroundColor: statusColor, opacity: pulse }]} />
            )}
            {done && <Ionicons name="checkmark-circle" size={13} color={palette.safe} />}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {done ? 'Complete' : state === 'scanning' ? 'Analyzing…' : 'Queued'}
            </Text>
          </View>
        </View>
        {done && <Text style={styles.confNum}>{agent.confidence}%</Text>}
      </View>

      {done && (
        <View style={styles.body}>
          <Text style={styles.evidence}>{agent.evidence}</Text>
          <View style={styles.decisionRow}>
            <Ionicons name="arrow-forward" size={12} color={palette.primary} />
            <Text style={styles.decision}>{agent.decision}</Text>
          </View>
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                { width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({ web: { backdropFilter: 'blur(14px)' } as any, default: {} }),
  },
  cardActive: { borderColor: 'rgba(255,176,32,0.35)' },
  cardDone: { borderColor: 'rgba(52,211,153,0.30)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,122,26,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: palette.text, fontSize: 14, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  confNum: { color: palette.safe, fontSize: 15, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  body: { marginTop: 12 },
  evidence: { color: palette.textMuted, fontSize: 12.5, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  decisionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8 },
  decision: { flex: 1, color: palette.text, fontSize: 13, fontWeight: '600', lineHeight: 18, fontFamily: 'Inter_500Medium' },
  barTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 12,
    overflow: 'hidden',
  },
  barFill: { height: 4, borderRadius: 2, backgroundColor: palette.safe },
});
