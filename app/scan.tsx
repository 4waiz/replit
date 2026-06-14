import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { workTypes } from '@/constants/workTypes';
import { WorkTypePill } from '@/components/WorkTypePill';
import { WeatherEvidenceCard } from '@/components/WeatherEvidenceCard';
import { Palette } from '@/constants/colors';

const WEB = Platform.OS === 'web';
function hapticSuccess() { if (!WEB) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
function hapticSelect() { if (!WEB) Haptics.selectionAsync(); }
function hapticHeavy() { if (!WEB) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); }

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setPhoto, setWorkTypeId, workTypeId, photo, weather } = useApp();
  const { palette, bgGradient } = useTheme();
  const styles = makeStyles(palette);

  const [localPhoto, setLocalPhoto] = useState<string | null>(photo);
  const [demoSite, setDemoSite] = useState(false);
  const [localWorkType, setLocalWorkType] = useState<string | null>(workTypeId);
  const [cameraOpen, setCameraOpen] = useState(false);

  const topPad = WEB ? 52 : insets.top;
  const bottomPad = WEB ? 28 : insets.bottom;
  const canAnalyze = !!localWorkType && (!!localPhoto || demoSite);

  function webFileInput(capture?: 'environment' | 'user') {
    return new Promise<string | null>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      if (capture) (input as any).capture = capture;
      input.onchange = (e: any) => {
        const file: File | undefined = e.target?.files?.[0];
        if (file) resolve(URL.createObjectURL(file));
        else resolve(null);
      };
      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  async function pickFromCamera() {
    if (WEB) {
      // Prefer a live in-app camera stream; fall back to the OS file/camera picker
      // (e.g. desktop without a webcam, or denied/unsupported getUserMedia).
      const md = (globalThis as any).navigator?.mediaDevices;
      if (md?.getUserMedia) {
        setCameraOpen(true);
        return;
      }
      const uri = await webFileInput('environment');
      if (uri) { setLocalPhoto(uri); setDemoSite(false); }
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera needed', 'Allow camera access to capture the worksite.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [4, 3] });
    if (!res.canceled && res.assets[0]) { setLocalPhoto(res.assets[0].uri); setDemoSite(false); hapticSuccess(); }
  }

  async function pickFromLibrary() {
    if (WEB) {
      const uri = await webFileInput();
      if (uri) { setLocalPhoto(uri); setDemoSite(false); }
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos needed', 'Allow photo access to upload a worksite photo.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 3] });
    if (!res.canceled && res.assets[0]) { setLocalPhoto(res.assets[0].uri); setDemoSite(false); hapticSuccess(); }
  }

  function onCaptured(uri: string) {
    setLocalPhoto(uri);
    setDemoSite(false);
    setCameraOpen(false);
    hapticSuccess();
  }

  function useDemoSite() { setDemoSite(true); setLocalPhoto(null); hapticSuccess(); }
  function selectWorkType(id: string) { setLocalWorkType(id); hapticSelect(); }

  function runAnalysis() {
    if (!canAnalyze || !localWorkType) return;
    hapticHeavy();
    setPhoto(localPhoto);
    setWorkTypeId(localWorkType);
    router.push('/loading');
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={bgGradient as any} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: topPad + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={palette.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SITE SCAN</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>STEP 1 · CAPTURE WORKSITE</Text>
        <View style={styles.scanFrame}>
          {localPhoto ? (
            <Image source={{ uri: localPhoto }} style={styles.preview} resizeMode="cover" />
          ) : demoSite ? (
            <LinearGradient colors={['#2A1505', '#120A04']} style={styles.demoFill}>
              <Ionicons name="business" size={42} color={palette.primary} />
              <Text style={styles.demoLabel}>Abu Dhabi Demo Site</Text>
              <Text style={styles.demoSub}>Construction zone · open exposure</Text>
            </LinearGradient>
          ) : (
            <View style={styles.emptyFill}>
              <Ionicons name="scan-outline" size={40} color={palette.textFaint} />
              <Text style={styles.emptyText}>Point at the worksite or upload a photo</Text>
            </View>
          )}
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />
          {(localPhoto || demoSite) && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setLocalPhoto(null); setDemoSite(false); }}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.captureRow}>
          <TouchableOpacity style={styles.captureBtn} onPress={pickFromCamera} activeOpacity={0.85}>
            <Ionicons name="camera" size={18} color={palette.primary} />
            <Text style={styles.captureText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureBtn} onPress={pickFromLibrary} activeOpacity={0.85}>
            <Ionicons name="images" size={18} color={palette.primary} />
            <Text style={styles.captureText}>Upload</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.demoBtn, demoSite && styles.demoBtnActive]} onPress={useDemoSite} activeOpacity={0.85}>
          <Ionicons name="flash" size={16} color={demoSite ? '#0A0A0A' : palette.amber} />
          <Text style={[styles.demoBtnText, demoSite && styles.demoBtnTextActive]}>Use Demo Site</Text>
        </TouchableOpacity>

        <Text style={[styles.step, { marginTop: 26 }]}>STEP 2 · WORK TYPE</Text>
        <View style={styles.grid}>
          {workTypes.map((wt) => (
            <WorkTypePill key={wt.id} item={wt} selected={localWorkType === wt.id} onPress={() => selectWorkType(wt.id)} />
          ))}
        </View>

        <Text style={[styles.step, { marginTop: 26 }]}>STEP 3 · SITE CONDITIONS</Text>
        <WeatherEvidenceCard weather={weather} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 14 }]}>
        <TouchableOpacity onPress={runAnalysis} disabled={!canAnalyze} activeOpacity={0.9} style={[styles.ctaWrap, !canAnalyze && { opacity: 0.45 }]}>
          <LinearGradient colors={[palette.amber, palette.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Ionicons name="pulse" size={20} color="#0A0A0A" />
            <Text style={styles.ctaText}>RUN SAFETY ANALYSIS</Text>
          </LinearGradient>
        </TouchableOpacity>
        {!canAnalyze && <Text style={styles.hint}>Add a photo (or demo site) and pick a work type</Text>}
      </View>

      {cameraOpen && WEB && (
        <LiveCamera
          palette={palette}
          onCapture={onCaptured}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </View>
  );
}

function LiveCamera({
  palette,
  onCapture,
  onClose,
}: {
  palette: Palette;
  onCapture: (uri: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const nav: any = (globalThis as any).navigator;
    nav?.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((stream: any) => {
        if (cancelled) { stream.getTracks().forEach((t: any) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play?.();
        }
      })
      .catch(() => { if (!cancelled) setError('Camera unavailable. Check browser permissions.'); });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks?.().forEach((t: any) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const doc: any = (globalThis as any).document;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 960;
    const canvas = doc.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    onCapture(canvas.toDataURL('image/jpeg', 0.85));
  }

  // Render the live preview via a raw <video> element on web.
  const Video: any = 'video';

  return (
    <View style={styles_camOverlay}>
      {error ? (
        <View style={styles_camCenter}>
          <Ionicons name="alert-circle-outline" size={40} color="#fff" />
          <Text style={styles_camError}>{error}</Text>
          <TouchableOpacity style={styles_camFallbackBtn} onPress={onClose}>
            <Text style={styles_camFallbackText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      <TouchableOpacity style={styles_camClose} onPress={onClose}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      {!error && (
        <View style={styles_camControls}>
          <TouchableOpacity style={styles_camShutterRing} onPress={capture} activeOpacity={0.8}>
            <View style={[styles_camShutterCore, { backgroundColor: palette.primary }]} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles_camOverlay: any = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: '#000', zIndex: 999,
  alignItems: 'center', justifyContent: 'center',
};
const styles_camCenter: any = { alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 30 };
const styles_camError: any = { color: '#fff', fontSize: 14, textAlign: 'center' };
const styles_camFallbackBtn: any = {
  marginTop: 8, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 14,
  borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
};
const styles_camFallbackText: any = { color: '#fff', fontSize: 14, fontWeight: '700' };
const styles_camClose: any = {
  position: 'absolute', top: 24, right: 20, width: 44, height: 44, borderRadius: 22,
  backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
};
const styles_camControls: any = { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' };
const styles_camShutterRing: any = {
  width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff',
  alignItems: 'center', justifyContent: 'center',
};
const styles_camShutterCore: any = { width: 58, height: 58, borderRadius: 29 };

function makeStyles(p: Palette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: p.bg, ...Platform.select({ web: { minHeight: '100vh' } as any, default: {} }) },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
    iconBtn: {
      width: 38, height: 38, borderRadius: 12, backgroundColor: p.glass,
      borderWidth: 1, borderColor: p.border, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { color: p.text, fontSize: 14, fontWeight: '800', letterSpacing: 2, fontFamily: 'Inter_700Bold' },
    content: { paddingHorizontal: 20, paddingTop: 6 },
    step: { color: p.textFaint, fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginBottom: 12, fontFamily: 'Inter_600SemiBold' },

    scanFrame: {
      height: 210, borderRadius: 22, overflow: 'hidden', position: 'relative',
      backgroundColor: p.bgRaised, borderWidth: 1, borderColor: p.border,
    },
    preview: { width: '100%', height: '100%' },
    demoFill: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
    demoLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', fontFamily: 'Inter_700Bold' },
    demoSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Inter_400Regular' },
    emptyFill: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 30 },
    emptyText: { color: p.textFaint, fontSize: 13, textAlign: 'center', fontFamily: 'Inter_400Regular' },
    corner: { position: 'absolute', width: 24, height: 24, borderColor: p.primary },
    cTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
    cTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
    cBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
    cBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
    clearBtn: {
      position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: 15,
      backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
    },

    captureRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    captureBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: p.glass, borderWidth: 1, borderColor: p.border, borderRadius: 14, paddingVertical: 13,
    },
    captureText: { color: p.text, fontSize: 14, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
    demoBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10,
      borderWidth: 1, borderColor: `${p.amber}55`, backgroundColor: `${p.amber}14`, borderRadius: 14, paddingVertical: 13,
    },
    demoBtnActive: { backgroundColor: p.amber, borderColor: p.amber },
    demoBtnText: { color: p.amber, fontSize: 14, fontWeight: '700', fontFamily: 'Inter_600SemiBold' },
    demoBtnTextActive: { color: '#0A0A0A' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },

    footer: {
      position: Platform.OS === 'web' ? ('sticky' as any) : 'absolute',
      left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12,
      backgroundColor: p.footerBg, borderTopWidth: 1, borderTopColor: p.border,
    },
    ctaWrap: { borderRadius: 18, overflow: 'hidden' },
    cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
    ctaText: { color: '#0A0A0A', fontSize: 15, fontWeight: '900', letterSpacing: 1.2, fontFamily: 'Inter_700Bold' },
    hint: { color: p.textFaint, fontSize: 12, textAlign: 'center', marginTop: 8, fontFamily: 'Inter_400Regular' },
  });
}
