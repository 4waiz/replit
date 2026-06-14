import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { SafetyReportCard } from '@/components/SafetyReportCard';
import { Palette } from '@/constants/colors';

const WEB = Platform.OS === 'web';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { result, reset } = useApp();
  const { palette, bgGradient } = useTheme();
  const styles = makeStyles(palette);

  const topPad = WEB ? 52 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  if (!result) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
        <Text style={{ color: palette.text }}>No report available.</Text>
      </View>
    );
  }

  function newScan() {
    if (!WEB) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reset();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SAFETY REPORT</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 110 }]} showsVerticalScrollIndicator={false}>
        <SafetyReportCard result={result} />
        <Text style={styles.note}>Screenshot this card to share the full safety decision.</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 14 }]}>
        <TouchableOpacity onPress={newScan} activeOpacity={0.9} style={styles.ctaWrap}>
          <LinearGradient colors={[palette.amber, palette.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Ionicons name="scan" size={19} color="#0A0A0A" />
            <Text style={styles.ctaText}>SCAN NEW SITE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: p.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
    iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: p.glass, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: p.text, fontSize: 14, fontWeight: '800', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
    content: { paddingHorizontal: 20, paddingTop: 10 },
    note: { color: p.textFaint, fontSize: 12, textAlign: 'center', marginTop: 16, fontFamily: 'Inter_400Regular' },
    footer: {
      position: WEB ? ('sticky' as any) : 'absolute', left: 0, right: 0, bottom: 0,
      paddingHorizontal: 20, paddingTop: 12, backgroundColor: p.footerBg, borderTopWidth: 1, borderTopColor: p.border,
    },
    ctaWrap: { borderRadius: 18, overflow: 'hidden' },
    cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
    ctaText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
  });
}
