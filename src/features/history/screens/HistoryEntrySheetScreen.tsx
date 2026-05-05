import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ENERGY_COLORS,
  type EnergyLevel,
} from '@/features/logs/constants/energy';
import { SheetHeader } from '@/shared/components/SheetHeader';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

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

const DAY_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function formatFullDate(checkInDate: string, createdAt: string): string {
  const src = checkInDate ? `${checkInDate}T00:00:00` : createdAt;
  const d = new Date(src);
  return `${DAY_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_FULL[d.getMonth()]}`;
}

export const HistoryEntrySheetScreen = () => {
  const { checkInDate, createdAt, energyLevel, symptoms, notes } =
    useLocalSearchParams<{
      checkInDate: string;
      createdAt: string;
      energyLevel: string;
      symptoms: string;
      notes: string;
    }>();

  const parsedSymptoms: string[] = (() => {
    try {
      return JSON.parse(symptoms ?? '[]');
    } catch {
      return [];
    }
  })();

  const energy = Number(energyLevel);
  const dotColor = ENERGY_COLORS[energy as EnergyLevel] ?? Colors.light.border;
  const title = formatFullDate(checkInDate ?? '', createdAt ?? '');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title={title} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Energy</Text>
          <View style={styles.energyRow}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.energyValue}>{energy} / 5</Text>
          </View>
        </View>

        {parsedSymptoms.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.pillRow}>
              {parsedSymptoms.map((s) => (
                <View key={s} style={styles.pill}>
                  <Text style={styles.pillText}>
                    {SYMPTOM_LABELS[s] ?? s.replace(/_/g, ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.notes}>{notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  energyValue: {
    ...Typography.body,
    color: Colors.light.text_primary,
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
    lineHeight: 22,
  },
});
