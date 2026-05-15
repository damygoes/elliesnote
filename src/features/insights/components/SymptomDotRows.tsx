import { StyleSheet, Text, View } from 'react-native';

import { SYMPTOMS, type Symptom } from '@/features/logs/types/log-entry';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { SERIES_CONFIG } from '../constants/seriesConfig';
import type { DataPoint, Range } from '../hooks/useInsightsData';

const SYMPTOM_LABEL: Record<Symptom, string> = {
  fatigue: 'Fatigue',
  brain_fog: 'Brain fog',
  headache: 'Headache',
  muscle_pain: 'Muscle pain',
  joint_pain: 'Joint pain',
  sleep_disturbance: 'Poor sleep',
  dizziness: 'Dizziness',
  nausea: 'Nausea',
};

const DAY_ABBR = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

function getDayLabel(dayKey: string, range: Range): string {
  const d = new Date(`${dayKey}T00:00:00`);
  if (range === 7) return DAY_ABBR[d.getDay()] ?? '';
  return String(d.getDate());
}

type Props = {
  stats: DataPoint[];
  days: string[];
  range: Range;
};

export function SymptomDotRows({ stats, days, range }: Props) {
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

  const activeSymptoms = SYMPTOMS.filter((symptom) =>
    [...symptomsByDay.values()].some((set) => set.has(symptom)),
  );

  if (activeSymptoms.length === 0) return null;

  const dotColor = SERIES_CONFIG.symptoms.color;

  return (
    <View style={styles.container}>
      {/* Day-header row */}
      <View style={styles.row}>
        <View style={styles.labelOffset} />
        <View style={styles.daysRow}>
          {days.map((dayKey) => (
            <Text key={dayKey} style={styles.dayHeader}>
              {getDayLabel(dayKey, range)}
            </Text>
          ))}
        </View>
      </View>

      {activeSymptoms.map((symptom) => (
        <View key={symptom} style={styles.row}>
          <Text style={styles.label}>{SYMPTOM_LABEL[symptom]}</Text>
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
    minHeight: 18,
  },
  labelOffset: {
    width: 80,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9,
    color: Colors.light.text_muted,
  },
  label: {
    ...Typography.small,
    color: Colors.light.text_muted,
    width: 80,
    fontSize: 10,
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
