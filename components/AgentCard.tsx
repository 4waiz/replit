import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Agent } from '@/lib/mockData';

type AgentState = 'idle' | 'working' | 'done';

interface AgentCardProps {
  agent: Agent;
  state: AgentState;
}

export function AgentCard({ agent, state }: AgentCardProps) {
  const colors = useColors();

  const statusColor =
    state === 'done' ? colors.success :
    state === 'working' ? colors.primary :
    colors.mutedForeground;

  const statusLabel =
    state === 'done' ? 'Done' :
    state === 'working' ? 'Working...' :
    'Ready';

  const statusIcon =
    state === 'done' ? 'checkmark-circle' :
    state === 'working' ? 'radio-button-on' :
    'ellipse-outline';

  return (
    <View style={[styles.row, styles.glass, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={agent.iconName as any}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]}>{agent.name}</Text>
        <Text style={[styles.role, { color: colors.mutedForeground }]}>{agent.role}</Text>
      </View>
      <View style={styles.status}>
        <Ionicons name={statusIcon as any} size={14} color={statusColor} />
        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    gap: 12,
    marginBottom: 10,
  },
  glass: Platform.select({
    web: { backdropFilter: 'blur(14px)' } as any,
    default: {},
  }),
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,115,22,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.28)',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  role: {
    fontSize: 12,
    marginTop: 2,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
