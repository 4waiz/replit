import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { WorkType } from '@/constants/workTypes';
import { Palette } from '@/constants/colors';

interface WorkTypePillProps {
  item: WorkType;
  selected: boolean;
  onPress: () => void;
}

export function WorkTypePill({ item, selected, onPress }: WorkTypePillProps) {
  const { palette } = useTheme();
  const styles = makeStyles(palette);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, selected && styles.pillSelected]}
    >
      <View style={[styles.icon, selected && styles.iconSelected]}>
        <Ionicons name={item.icon as any} size={18} color={selected ? '#0A0A0A' : palette.primary} />
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
    </TouchableOpacity>
  );
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    pill: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: p.glass,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 16,
      paddingVertical: 13,
      paddingHorizontal: 13,
      ...Platform.select({ web: { backdropFilter: 'blur(10px)' } as any, default: {} }),
    },
    pillSelected: { borderColor: p.primary, backgroundColor: `${p.primary}1A` },
    icon: {
      width: 34, height: 34, borderRadius: 10,
      backgroundColor: `${p.primary}1A`, alignItems: 'center', justifyContent: 'center',
    },
    iconSelected: { backgroundColor: p.primary },
    label: { flex: 1, color: p.textMuted, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
    labelSelected: { color: p.text, fontWeight: '700' },
  });
}
