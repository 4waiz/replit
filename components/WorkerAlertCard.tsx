import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { palette } from '@/constants/colors';
import { WorkerAlert } from '@/lib/agentEngine';

interface WorkerAlertCardProps {
  alert: WorkerAlert;
}

const CODE_COLORS: Record<string, string> = {
  EN: palette.primary,
  AR: palette.amber,
  HI: palette.safe,
  UR: '#A78BFA',
};

// One multilingual worker alert with RTL-aware text and copy/share actions.
export function WorkerAlertCard({ alert }: WorkerAlertCardProps) {
  const [copied, setCopied] = useState(false);
  const accent = CODE_COLORS[alert.code] ?? palette.primary;

  async function copy() {
    await Clipboard.setStringAsync(alert.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    if (Platform.OS === 'web') {
      await copy();
      return;
    }
    try {
      await Share.share({ message: alert.text });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.codePill, { backgroundColor: `${accent}22`, borderColor: `${accent}55` }]}>
          <Text style={[styles.code, { color: accent }]}>{alert.code}</Text>
        </View>
        <Text style={styles.lang}>{alert.language}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={copy} hitSlop={8} style={styles.iconBtn}>
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? palette.safe : palette.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={share} hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={16} color={palette.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[
          styles.text,
          { textAlign: alert.rtl ? 'right' : 'left', writingDirection: alert.rtl ? 'rtl' : 'ltr' },
        ]}
      >
        {alert.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...Platform.select({ web: { backdropFilter: 'blur(12px)' } as any, default: {} }),
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  codePill: { borderWidth: 1, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  code: { fontSize: 11, fontWeight: '800', fontFamily: 'Inter_700Bold' },
  lang: { flex: 1, color: palette.textMuted, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  actions: { flexDirection: 'row', gap: 4 },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  text: { color: palette.text, fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
});
