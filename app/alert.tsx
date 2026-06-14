import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { WorkerAlertCard } from '@/components/WorkerAlertCard';
import { Palette } from '@/constants/colors';

const WEB = Platform.OS === 'web';

export default function WorkerAlertScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { result } = useApp();
  const { palette, bgGradient, riskColor } = useTheme();
  const styles = makeStyles(palette);

  const topPad = WEB ? 52 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;

  if (!result) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />
        <Text style={{ color: palette.text }}>No alert available.</Text>
      </View>
    );
  }

  const color = riskColor[result.riskLevel];

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORKER ALERT</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { borderColor: `${color}55`, backgroundColor: `${color}14` }]}>
          <Ionicons name="megaphone" size={22} color={color} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color }]}>{result.riskLevel} heat alert</Text>
            <Text style={styles.bannerSub}>Send this to the crew in their language</Text>
          </View>
        </View>

        {result.workerAlerts.map((alert) => (
          <WorkerAlertCard key={alert.code} alert={alert} />
        ))}

        <Text style={styles.note}>Tap copy or share on any card. RTL languages display right-to-left.</Text>
      </ScrollView>
    </View>
  );
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: p.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
    iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: p.glass, borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: p.text, fontSize: 14, fontWeight: '800', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
    content: { paddingHorizontal: 20, paddingTop: 6 },
    banner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 18 },
    bannerTitle: { fontSize: 16, fontWeight: '800', fontFamily: 'Inter_700Bold' },
    bannerSub: { color: p.textMuted, fontSize: 12.5, marginTop: 2, fontFamily: 'Inter_400Regular' },
    note: { color: p.textFaint, fontSize: 12, textAlign: 'center', marginTop: 8, fontFamily: 'Inter_400Regular' },
  });
}
