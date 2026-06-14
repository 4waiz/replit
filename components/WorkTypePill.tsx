import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '@/constants/colors';
import { WorkType } from '@/constants/workTypes';

interface WorkTypePillProps {
  item: WorkType;
  selected: boolean;
  onPress: () => void;
}

// Selectable work-type chip for the scan screen.
export function WorkTypePill({ item, selected, onPress }: WorkTypePillProps) {
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

const styles = StyleSheet.create({
  pill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 13,
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } as any, default: {} }),
  },
  pillSelected: {
    borderColor: palette.primary,
    backgroundColor: 'rgba(255,122,26,0.12)',
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,122,26,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: { backgroundColor: palette.primary },
  label: { flex: 1, color: palette.textMuted, fontSize: 13, fontWeight: '600', fontFamily: 'Inter_500Medium' },
  labelSelected: { color: palette.text, fontWeight: '700' },
});
