import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { WorkType } from '@/lib/mockData';

interface WorkTypePillProps {
  item: WorkType;
  selected: boolean;
  onPress: () => void;
}

export function WorkTypePill({ item, selected, onPress }: WorkTypePillProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.cardBorder,
          borderRadius: colors.radius - 4,
        },
      ]}
    >
      <Ionicons
        name={item.icon as any}
        size={18}
        color={selected ? '#fff' : colors.primary}
      />
      <Text style={[styles.label, { color: selected ? '#fff' : colors.foreground }]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
  },
});
