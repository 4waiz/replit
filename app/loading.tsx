import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { agents, loadingSteps } from '@/lib/mockData';

const STEP_DURATION = 600;
const TOTAL_DURATION = loadingSteps.length * STEP_DURATION + 600;

export default function LoadingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeStep, setActiveStep] = useState<number>(-1);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  useEffect(() => {
    // Pulse the glow ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Step through loading items
    loadingSteps.forEach((_, i) => {
      setTimeout(() => setActiveStep(i), i * STEP_DURATION + 400);
    });

    // Navigate to result
    const timer = setTimeout(() => router.replace('/result'), TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0300', '#1c0800', '#431407']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={[styles.content, { paddingTop: topPad + 40, paddingBottom: bottomPad + 40 }]}>
        {/* Mascot with pulse */}
        <View style={styles.mascotWrap}>
          <Animated.View style={[styles.glowOuter, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.glowInner} />
          <Image
            source={require('../assets/images/robot.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Analyzing Worksite</Text>
        <Text style={styles.subtitle}>Starkz agents are on the job</Text>

        {/* Steps */}
        <View style={styles.steps}>
          {loadingSteps.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <View key={step} style={styles.step}>
                <View style={[
                  styles.stepIcon,
                  done && styles.stepIconDone,
                  active && styles.stepIconActive,
                ]}>
                  {done ? (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  ) : (
                    <View style={[
                      styles.stepDot,
                      active && styles.stepDotActive,
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  (done || active) && styles.stepTextActive,
                ]}>
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Agent pills */}
        <View style={styles.agentRow}>
          {agents.map((agent) => (
            <View key={agent.id} style={styles.agentPill}>
              <Ionicons name={agent.iconName as any} size={14} color="#fb923c" />
              <Text style={styles.agentName}>{agent.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: 180,
    height: 180,
  },
  glowOuter: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(249,115,22,0.18)',
  },
  glowInner: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(249,115,22,0.28)',
  },
  mascot: { width: 130, height: 150, zIndex: 1 },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: 'rgba(253,186,116,0.7)',
    fontSize: 14,
    marginBottom: 40,
    fontFamily: 'Inter_400Regular',
  },

  steps: { alignSelf: 'stretch', gap: 14, marginBottom: 36 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconDone: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  stepIconActive: {
    borderColor: '#f97316',
    backgroundColor: 'rgba(249,115,22,0.2)',
  },
  stepDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: { backgroundColor: '#f97316' },
  stepText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  stepTextActive: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Inter_500Medium',
  },

  agentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  agentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  agentName: {
    color: '#fb923c',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
