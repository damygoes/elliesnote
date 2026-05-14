import type { ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { ENERGY_COLORS, type EnergyLevel } from '../constants/energy';
import type { LogEntry } from '../types/log-entry';
import { SYMPTOM_LABELS } from './SymptomToggle';

type Props = {
  entry: LogEntry;
  onEdit?: () => void;
  onDelete?: () => void;
};

const dotStyles = StyleSheet.create({
  level1: { backgroundColor: ENERGY_COLORS[1] },
  level2: { backgroundColor: ENERGY_COLORS[2] },
  level3: { backgroundColor: ENERGY_COLORS[3] },
  level4: { backgroundColor: ENERGY_COLORS[4] },
  level5: { backgroundColor: ENERGY_COLORS[5] },
});

const ENERGY_DOT: Record<EnergyLevel, ViewStyle> = {
  1: dotStyles.level1,
  2: dotStyles.level2,
  3: dotStyles.level3,
  4: dotStyles.level4,
  5: dotStyles.level5,
};

export const TodayEntryCard = ({ entry, onEdit, onDelete }: Props) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.metaLabel}>Energy</Text>
      <View style={styles.energyRow}>
        <View
          style={[styles.dot, ENERGY_DOT[entry.energyLevel as EnergyLevel]]}
        />
        <Text style={styles.energyValue}>{entry.energyLevel} / 5</Text>
      </View>
    </View>

    {entry.symptoms.length > 0 ? (
      <>
        <View style={styles.divider} />
        <Text style={styles.metaLabel}>Symptoms</Text>
        <View style={styles.pillRow}>
          {entry.symptoms.map((symptom) => (
            <View key={symptom} style={styles.pill}>
              <Text style={styles.pillText}>{SYMPTOM_LABELS[symptom]}</Text>
            </View>
          ))}
        </View>
      </>
    ) : null}

    {entry.notes ? (
      <>
        <View style={styles.divider} />
        <Text style={styles.metaLabel}>Notes</Text>
        <Text style={styles.notes}>{entry.notes}</Text>
      </>
    ) : null}

    {onEdit || onDelete ? (
      <>
        {(entry.symptoms.length > 0 || !!entry.notes) && (
          <View style={styles.divider} />
        )}
        <View style={styles.actionRow}>
          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              activeOpacity={0.6}
              style={styles.editPush}
              accessibilityLabel="Edit this entry"
              accessibilityRole="button"
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              activeOpacity={0.6}
              accessibilityLabel="Delete this entry"
              accessibilityRole="button"
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    ) : null}
  </View>
);

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
  metaLabel: {
    ...Typography.small,
    color: Colors.light.text_secondary,
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
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
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
  notes: {
    ...Typography.body,
    color: Colors.light.text_primary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  editPush: {
    marginLeft: 'auto',
  },
  editText: {
    ...Typography.caption,
    color: Colors.light.primary,
  },
  deleteText: {
    ...Typography.caption,
    color: Colors.light.error,
  },
});
