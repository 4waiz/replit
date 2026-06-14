import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { agents } from '@/lib/mockData';
import { AgentCard } from '@/components/AgentCard';

function hapticMedium() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  function handleScan() {
    hapticMedium();
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

      <View
        style={[styles.content, { paddingTop: topPad + 14, paddingBottom: bottomPad + 18 }]}
      >
        {/* Header: status pill */}
        <View style={styles.statusRow}>
          <View style={styles.statusPill}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>HEAT SAFETY ACTIVE</Text>
          </View>
        </View>

        {/* Hero: mascot + title */}
        <View style={styles.hero}>
          <View style={styles.mascotWrap}>
            <View style={styles.glowRing} />
            <Image
              source={require('../assets/images/robot.png')}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>STARKZ AI</Text>
          <Text style={styles.subtitle}>
            AI safety agent for outdoor crews{'\n'}in extreme heat
          </Text>
        </View>

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
            colors={['#fb923c', '#ea580c']}
            style={styles.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="camera" size={22} color="#fff" />
            <Text style={styles.ctaText}>SCAN WORKSITE</Text>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.85)" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c0800',
    ...Platform.select({
      web: { minHeight: '100vh' } as any,
      default: {},
    }),
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },

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

  statusRow: { alignItems: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 100,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34d399',
    ...Platform.select({
      web: { boxShadow: '0 0 6px rgba(52,211,153,0.9)' } as any,
      default: {
        shadowColor: '#34d399',
        shadowOpacity: 0.9,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
      },
    }),
  },
  statusText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    fontFamily: 'Inter_600SemiBold',
  },

  hero: { alignItems: 'center' },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 6,
  },
  glowRing: {
    position: 'absolute',
    width: 158,
    height: 158,
    borderRadius: 79,
    backgroundColor: 'rgba(249,115,22,0.22)',
  },
  mascot: {
    width: 132,
    height: 150,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,237,213,0.72)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
    fontFamily: 'Inter_400Regular',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(253,186,116,0.85)',
    letterSpacing: 1.6,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  agentsWrap: {},

  ctaWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 10px 24px rgba(249,115,22,0.45)' } as any,
      default: {
        shadowColor: '#f97316',
        shadowOpacity: 0.45,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 10 },
      },
    }),
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
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
});
