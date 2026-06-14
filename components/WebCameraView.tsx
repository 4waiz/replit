import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onCapture: (uri: string) => void;
  onClose: () => void;
  accent: string;
}

// Live camera preview for web using getUserMedia.
// Appends a <video> element directly into the View's DOM node.
export function WebCameraView({ onCapture, onClose, accent }: Props) {
  const wrapRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let dead = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        if (dead) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;

        const el: HTMLElement | null = wrapRef.current;
        if (!el) return;

        const vid = document.createElement('video');
        vid.srcObject = stream;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.muted = true;
        vid.style.cssText =
          'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;pointer-events:none;';
        el.appendChild(vid);
        videoRef.current = vid;

        vid.addEventListener('loadedmetadata', () => {
          if (!dead) setReady(true);
        });
      } catch (e: any) {
        if (!dead) setErr(e?.message ?? 'Camera unavailable');
      }
    })();

    return () => {
      dead = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      videoRef.current?.remove();
    };
  }, []);

  function snap() {
    const vid = videoRef.current;
    if (!vid) return;
    const canvas = document.createElement('canvas');
    canvas.width = vid.videoWidth || 640;
    canvas.height = vid.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(vid, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg', 0.88));
  }

  return (
    <View ref={wrapRef} style={styles.wrap}>
      {err ? (
        <View style={styles.errBox}>
          <Ionicons name="camera-off-outline" size={28} color="rgba(255,255,255,0.45)" />
          <Text style={styles.errText}>{err}</Text>
          <TouchableOpacity onPress={onClose} style={styles.errClose}>
            <Text style={styles.errCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.controls}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
            <Ionicons name="close" size={17} color="#fff" />
          </TouchableOpacity>
          {ready && (
            <TouchableOpacity onPress={snap} style={styles.snapOuter} activeOpacity={0.85}>
              <View style={[styles.snapInner, { backgroundColor: accent }]} />
            </TouchableOpacity>
          )}
          {!ready && !err && (
            <Text style={styles.loadingText}>Starting camera…</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  errBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  errText: { color: 'rgba(255,255,255,0.55)', fontSize: 12.5, textAlign: 'center' },
  errClose: { marginTop: 4 },
  errCloseText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  controls: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  snapOuter: {
    width: 62, height: 62, borderRadius: 31, borderWidth: 3,
    borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  snapInner: { width: 46, height: 46, borderRadius: 23 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
});
