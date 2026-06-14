import { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { workTypes, getAnalysis } from '@/lib/mockData';
import { WorkTypePill } from '@/components/WorkTypePill';
import { GlassCard } from '@/components/GlassCard';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { setPhoto, setWorkTypeId, setResult, workTypeId, photo } = useApp();
  const [localPhoto, setLocalPhoto] = useState<string | null>(photo);
  const [localWorkType, setLocalWorkType] = useState<string | null>(workTypeId);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const canAnalyze = !!localPhoto && !!localWorkType;

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to upload a worksite photo.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!res.canceled && res.assets[0]) {
      setLocalPhoto(res.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to capture the worksite.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!res.canceled && res.assets[0]) {
      setLocalPhoto(res.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function selectWorkType(id: string) {
    setLocalWorkType(id);
    Haptics.selectionAsync();
  }

  function handleAnalyze() {
    if (!canAnalyze || !localWorkType) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPhoto(localPhoto);
    setWorkTypeId(localWorkType);
    setResult(getAnalysis(localWorkType));
    router.push('/loading');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#1c0800', '#431407']}
        style={[styles.header, { paddingTop: topPad + 8 }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCAN WORKSITE</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Photo */}
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>STEP 1 · WORKSITE PHOTO</Text>

        {localPhoto ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: localPhoto }} style={styles.preview} resizeMode="cover" />
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setLocalPhoto(null)}
            >
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <GlassCard style={styles.uploadCard}>
            <View style={[styles.uploadZone, { borderColor: colors.cardBorder }]}>
              <View style={[styles.cameraCircle, { backgroundColor: colors.muted }]}>
                <Ionicons name="camera" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.uploadTitle, { color: colors.foreground }]}>
                Capture or upload worksite photo
              </Text>
              <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>
                JPG, PNG, WEBP · Max 25MB
              </Text>
            </View>
            <View style={styles.uploadBtns}>
              <TouchableOpacity
                style={[styles.uploadBtn, { backgroundColor: colors.primary }]}
                onPress={pickFromCamera}
                activeOpacity={0.85}
              >
                <Ionicons name="camera" size={18} color="#fff" />
                <Text style={styles.uploadBtnText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadBtnSecondary, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}
                onPress={pickFromLibrary}
                activeOpacity={0.85}
              >
                <Ionicons name="images" size={18} color={colors.primary} />
                <Text style={[styles.uploadBtnTextSecondary, { color: colors.foreground }]}>Library</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}

        {/* Step 2: Work Type */}
        <Text style={[styles.stepLabel, { color: colors.mutedForeground, marginTop: 28 }]}>
          STEP 2 · SELECT WORK TYPE
        </Text>
        <View style={styles.pillGrid}>
          {workTypes.map((wt) => (
            <WorkTypePill
              key={wt.id}
              item={wt}
              selected={localWorkType === wt.id}
              onPress={() => selectWorkType(wt.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky Analyze Button */}
      <View style={[styles.stickyFooter, { paddingBottom: bottomPad + 16, backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={!canAnalyze}
          activeOpacity={0.85}
          style={[styles.analyzeWrap, !canAnalyze && styles.disabledWrap]}
        >
          <LinearGradient
            colors={canAnalyze ? ['#f97316', '#ea580c'] : ['#d1d5db', '#9ca3af']}
            style={styles.analyzeBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.analyzeBtnText}>ANALYZE RISK</Text>
          </LinearGradient>
        </TouchableOpacity>
        {!canAnalyze && (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            Add a photo and select work type to continue
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'Inter_700Bold',
  },

  scroll: { flex: 1 },
  content: { padding: 20 },

  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },

  uploadCard: { overflow: 'hidden' },
  uploadZone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    padding: 28,
    gap: 10,
    marginBottom: 16,
  },
  cameraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  uploadTitle: { fontSize: 15, fontWeight: '600', textAlign: 'center', fontFamily: 'Inter_600SemiBold' },
  uploadSub: { fontSize: 12, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  uploadBtns: { flexDirection: 'row', gap: 10 },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  uploadBtnText: { color: '#fff', fontWeight: '700', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  uploadBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  uploadBtnTextSecondary: { fontWeight: '700', fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  previewWrap: { borderRadius: 20, overflow: 'hidden', position: 'relative', marginBottom: 4 },
  preview: { width: '100%', height: 220, borderRadius: 20 },
  clearBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 14,
  },

  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(194,65,12,0.15)',
  },
  analyzeWrap: { borderRadius: 18, overflow: 'hidden' },
  disabledWrap: { opacity: 0.6 },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  analyzeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'Inter_700Bold',
  },
  hint: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
});
