import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import {
  ENERGY_COLORS,
  type EnergyLevel,
} from '@/features/logs/constants/energy';
import type { HistoryEntry } from '../hooks/useHistoryEntries';

const SYMPTOM_LABELS: Record<string, string> = {
  fatigue: 'Fatigue',
  brain_fog: 'Brain fog',
  headache: 'Headache',
  muscle_pain: 'Muscle pain',
  joint_pain: 'Joint pain',
  sleep_disturbance: 'Sleep issues',
  dizziness: 'Dizziness',
  nausea: 'Nausea',
};

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatEntryDate(entry: HistoryEntry): string {
  const src = entry.checkInDate
    ? `${entry.checkInDate}T00:00:00`
    : entry.createdAt;
  const d = new Date(src);
  return `${DAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

type Props = {
  entry: HistoryEntry;
  onPress: (entry: HistoryEntry) => void;
};

export const HistoryEntryRow = ({ entry, onPress }: Props) => {
  const dotColor =
    ENERGY_COLORS[entry.energyLevel as EnergyLevel] ?? Colors.light.border;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(entry)}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={styles.row}>
        <Text style={styles.date}>{formatEntryDate(entry)}</Text>
        <View style={styles.energyRow}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.energyValue}>{entry.energyLevel} / 5</Text>
        </View>
      </View>

      {entry.symptoms.length > 0 && (
        <View style={styles.pillRow}>
          {entry.symptoms.map((s) => (
            <View key={s} style={styles.pill}>
              <Text style={styles.pillText}>
                {SYMPTOM_LABELS[s] ?? s.replace(/_/g, ' ')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  energyValue: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primary_soft,
  },
  pillText: {
    ...Typography.small,
    color: Colors.light.primary,
  },
});
