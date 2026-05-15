import { StyleSheet, Text, View } from 'react-native';

import { SYMPTOMS, type Symptom } from '@/features/logs/types/log-entry';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { SERIES_CONFIG } from '../constants/seriesConfig';
import type { DataPoint } from '../hooks/useInsightsData';

const SYMPTOM_SHORT: Record<Symptom, string> = {
  fatigue: 'FAT',
  brain_fog: 'FOG',
  headache: 'HA',
  muscle_pain: 'MUS',
  joint_pain: 'JNT',
  sleep_disturbance: 'SLP',
  dizziness: 'DIZ',
  nausea: 'NAU',
};

type Props = {
  stats: DataPoint[];
  days: string[];
};

export function SymptomDotRows({ stats, days }: Props) {
  // Build dayKey → set of symptoms present that day
  const symptomsByDay = new Map<string, Set<string>>();
  for (const entry of stats) {
    let set = symptomsByDay.get(entry.dayKey);
    if (!set) {
      set = new Set();
      symptomsByDay.set(entry.dayKey, set);
    }
    for (const s of entry.symptoms) {
      set.add(s);
    }
  }

  // Only render rows for symptoms that appear at least once in the period
  const activeSymptoms = SYMPTOMS.filter((symptom) =>
    [...symptomsByDay.values()].some((set) => set.has(symptom)),
  );

  if (activeSymptoms.length === 0) return null;

  const dotColor = SERIES_CONFIG.symptoms.color;

  return (
    <View style={styles.container}>
      {activeSymptoms.map((symptom) => (
        <View key={symptom} style={styles.row}>
          <Text style={styles.label}>{SYMPTOM_SHORT[symptom]}</Text>
          <View style={styles.daysRow}>
            {days.map((dayKey) => {
              const hasSymptom =
                symptomsByDay.get(dayKey)?.has(symptom) ?? false;
              return (
                <View key={dayKey} style={styles.dayCell}>
                  {hasSymptom && (
                    <View style={[styles.dot, { backgroundColor: dotColor }]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 14,
  },
  label: {
    ...Typography.small,
    color: Colors.light.text_muted,
    width: 28,
    fontSize: 9,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
