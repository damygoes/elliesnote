import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { ENERGY_COLORS, type EnergyLevel } from '../constants/energy';
import type { LogEntry } from '../types/log-entry';

type Props = {
  entries: LogEntry[];
};

export const TodaySummaryCard = ({ entries }: Props) => {
  const avgRaw =
    entries.reduce((sum, e) => sum + e.energyLevel, 0) / entries.length;
  const avgEnergy = Math.round(avgRaw * 10) / 10;
  const nearestLevel = Math.round(avgRaw) as EnergyLevel;

  const uniqueSymptoms = new Set(entries.flatMap((e) => e.symptoms));
  const symptomCount = uniqueSymptoms.size;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today&apos;s Summary</Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Avg Energy</Text>
          <View style={styles.energyRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: ENERGY_COLORS[nearestLevel] },
              ]}
            />
            <Text style={styles.statValue}>{avgEnergy} / 5</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Symptoms</Text>
          <Text style={styles.statValue}>
            {symptomCount === 0 ? 'None' : `${symptomCount} logged`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Entries</Text>
          <Text style={styles.statValue}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
      </View>
    </View>
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
  title: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  stat: {
    flex: 1,
    gap: Spacing.xs,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  statValue: {
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
    borderRadius: 999,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
});
