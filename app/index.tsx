import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { palette, bgGradient } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { MascotAssistant } from '@/components/MascotAssistant';

function hapticMedium() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

const WEB = Platform.OS === 'web';

export default function WakeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { weather, weatherLoading } = useApp();

  const topPad = WEB ? 56 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  const float = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  function startScan() {
    hapticMedium();
    router.push('/scan');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
      {/* Heat wash blobs */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <View style={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 18 }]}>
        {/* Top status bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoDot}>
              <Ionicons name="flame" size={15} color="#0A0A0A" />
            </View>
            <Text style={styles.brand}>STARKZ AI</Text>
          </View>
          <View style={styles.onlinePill}>
            <Animated.View style={[styles.onlineDot, { opacity: pulse }]} />
            <Text style={styles.onlineText}>Agent online</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            <MascotAssistant size={172} />
          </Animated.View>

          <Text style={styles.title}>Starkz AI</Text>
          <Text style={styles.tagline}>Field safety agent for extreme-heat worksites</Text>

          {/* Live weather chip */}
          <View style={styles.weatherChip}>
            {weatherLoading ? (
              <>
                <ActivityIndicator size="small" color={palette.amber} />
                <Text style={styles.weatherText}>Reading site conditions…</Text>
              </>
            ) : (
              <>
                <Ionicons name="thermometer" size={15} color={palette.amber} />
                <Text style={styles.weatherText}>
                  {weather.locationName.split('·')[0].trim()} · {weather.tempC}°C · UV {weather.uvIndex}
                </Text>
                <View style={[styles.liveTag, { borderColor: weather.isLive ? `${palette.safe}55` : palette.border }]}>
                  <Text style={[styles.liveTagText, { color: weather.isLive ? palette.safe : palette.amber }]}>
                    {weather.isLive ? 'LIVE' : 'DEMO'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={startScan} activeOpacity={0.9} style={styles.ctaWrap}>
            <LinearGradient colors={[palette.amber, palette.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
              <Ionicons name="scan" size={20} color="#0A0A0A" />
              <Text style={styles.ctaText}>START SITE SCAN</Text>
              <Ionicons name="arrow-forward" size={18} color="rgba(0,0,0,0.65)" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.hint}>One scan → real risk intelligence → action plan</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.bg,
    ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }),
  },
  content: { flex: 1, paddingHorizontal: 22, justifyContent: 'space-between' },

  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 160, opacity: 0.18 },
  blobTop: { top: -120, right: -100, backgroundColor: palette.primary },
  blobBottom: { bottom: -100, left: -120, backgroundColor: palette.critical, opacity: 0.12 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: palette.text, fontSize: 15, fontWeight: '900', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 100,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: palette.safe },
  onlineText: { color: palette.textMuted, fontSize: 11, fontWeight: '600', fontFamily: 'Inter_500Medium' },

  hero: { alignItems: 'center' },
  title: { color: palette.text, fontSize: 40, fontWeight: '900', letterSpacing: 1, marginTop: 6, fontFamily: 'Inter_700Bold' },
  tagline: {
    color: palette.textMuted,
    fontSize: 14.5,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
    maxWidth: 280,
    fontFamily: 'Inter_400Regular',
  },
  weatherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    marginTop: 22,
    ...Platform.select({ web: { backdropFilter: 'blur(14px)' } as any, default: {} }),
  },
  weatherText: { color: palette.text, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  liveTag: { borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginLeft: 2 },
  liveTagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, fontFamily: 'Inter_700Bold' },

  footer: { gap: 12 },
  ctaWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 12px 30px rgba(255,122,26,0.4)' } as any,
      default: { shadowColor: palette.primary, shadowOpacity: 0.45, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
    }),
  },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  ctaText: { color: '#0A0A0A', fontSize: 16, fontWeight: '900', letterSpacing: 1.5, fontFamily: 'Inter_700Bold' },
  hint: { color: palette.textFaint, fontSize: 12, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});
