import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { palette, bgGradient } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { runAnalysis, AnalysisResult } from '@/lib/agentEngine';
import { MascotAssistant } from '@/components/MascotAssistant';
import { AgentRunCard, AgentRunState } from '@/components/AgentRunCard';

const WEB = Platform.OS === 'web';
const REVEAL_MS = 750; // delay between each agent completing

export default function AnalysisScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { weather, workTypeId, photo, setResult } = useApp();

  const topPad = WEB ? 56 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  // -1 = nothing revealed yet; index = that agent is the latest completed.
  const [completedUpTo, setCompletedUpTo] = useState(-1);
  const resultRef = useRef<AnalysisResult | null>(null);
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(ring, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })).start();

    let cancelled = false;

    async function go() {
      // Kick off the real analysis (Groq + engine) in parallel with the reveal.
      const analysisPromise = runAnalysis(weather, workTypeId ?? 'construction', !!photo);

      // Reveal agents one at a time for the cinematic feel.
      for (let i = 0; i < 4; i++) {
        await new Promise((r) => setTimeout(r, REVEAL_MS));
        if (cancelled) return;
        setCompletedUpTo(i);
      }

      const result = await analysisPromise;
      if (cancelled) return;
      resultRef.current = result;

      // Hold a beat on the last agent, then go to the dashboard.
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;
      setResult(result);
      router.replace('/result');
    }

    go();
    return () => { cancelled = true; };
  }, []);

  const spin = ring.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // Placeholder agent shells (names shown before Groq text lands isn't needed —
  // we reveal full cards as each completes, using deterministic-or-Groq text).
  const previewAgents = resultRef.current?.agents ?? PLACEHOLDER_AGENTS;

  function stateFor(i: number): AgentRunState {
    if (i <= completedUpTo) return 'complete';
    if (i === completedUpTo + 1) return 'scanning';
    return 'idle';
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
      <View style={[styles.blob, styles.blobTop]} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: bottomPad + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot + scanning ring */}
        <View style={styles.heroWrap}>
          <Animated.View style={[styles.scanRing, { transform: [{ rotate: spin }] }]} />
          <MascotAssistant size={120} glow />
        </View>
        <Text style={styles.title}>Starkz AI is analyzing the site</Text>
        <Text style={styles.subtitle}>
          {completedUpTo < 3 ? 'Agents reasoning over live conditions…' : 'Compiling safety decision…'}
        </Text>

        {/* Agent pipeline */}
        <View style={styles.agents}>
          {previewAgents.map((agent, i) => (
            <AgentRunCard key={agent.id} agent={agent} state={stateFor(i)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Shown until the real (Groq or deterministic) result resolves; the cards only
// expand their reasoning once `state === 'complete'`, by which point the real
// result has typically landed.
const PLACEHOLDER_AGENTS = [
  { id: 'weather' as const, name: 'Weather Risk Agent', icon: 'thermometer', evidence: '', decision: '', confidence: 90 },
  { id: 'workload' as const, name: 'Workload Agent', icon: 'barbell', evidence: '', decision: '', confidence: 86 },
  { id: 'schedule' as const, name: 'Schedule Agent', icon: 'time', evidence: '', decision: '', confidence: 90 },
  { id: 'comms' as const, name: 'Communication Agent', icon: 'chatbubbles', evidence: '', decision: '', confidence: 95 },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },
  blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.16 },
  blobTop: { top: -120, alignSelf: 'center', backgroundColor: palette.primary },
  content: { paddingHorizontal: 22, alignItems: 'stretch' },
  heroWrap: { alignItems: 'center', justifyContent: 'center', height: 150, alignSelf: 'center' },
  scanRing: {
    position: 'absolute',
    width: 138,
    height: 138,
    borderRadius: 69,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: palette.primary,
    borderRightColor: palette.amber,
  },
  title: { color: palette.text, fontSize: 21, fontWeight: '800', textAlign: 'center', marginTop: 8, fontFamily: 'Inter_700Bold' },
  subtitle: { color: palette.textMuted, fontSize: 13.5, textAlign: 'center', marginTop: 6, marginBottom: 24, fontFamily: 'Inter_400Regular' },
  agents: { alignSelf: 'stretch' },
});
