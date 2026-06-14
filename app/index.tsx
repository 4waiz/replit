import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { agents } from '@/lib/mockData';
import { AgentCard } from '@/components/AgentCard';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleScan() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/scan');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1c0800', '#431407', '#7c2d12', '#c2410c']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ambient glow blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobBottomLeft]} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: topPad + 20, paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status pill */}
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>HEAT SAFETY ACTIVE</Text>
          </View>
        </View>

        {/* Mascot */}
        <View style={styles.mascotWrap}>
          <View style={styles.glowRing} />
          <Image
            source={require('../assets/images/robot.png')}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>STARKZ AI</Text>
        <Text style={styles.subtitle}>
          AI safety agent for outdoor crews{'\n'}in extreme heat
        </Text>

        {/* Agents section */}
        <View style={styles.agentsWrap}>
          <Text style={styles.sectionLabel}>THREE AGENTS ON DUTY</Text>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} state="idle" />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleScan}
          activeOpacity={0.88}
          style={styles.ctaWrap}
        >
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="camera" size={22} color="#fff" />
            <Text style={styles.ctaText}>SCAN WORKSITE</Text>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footer}>Demo mode · Simulated AI analysis</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24 },

  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.25,
  },
  blobTopRight: {
    top: -40,
    right: -60,
    backgroundColor: '#f97316',
  },
  blobBottomLeft: {
    bottom: 60,
    left: -70,
    backgroundColor: '#fb923c',
  },

  statusRow: { alignItems: 'center', marginBottom: 24 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#22c55e',
  },
  statusText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    height: 200,
  },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(249,115,22,0.28)',
  },
  mascot: {
    width: 160,
    height: 180,
  },

  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,237,213,0.75)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    marginBottom: 36,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(253,186,116,0.8)',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  agentsWrap: { marginBottom: 32 },

  ctaWrap: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    textAlign: 'center',
  },

  footer: {
    textAlign: 'center',
    color: 'rgba(255,237,213,0.45)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
