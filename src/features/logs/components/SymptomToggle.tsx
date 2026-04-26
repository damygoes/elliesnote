import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { Symptom } from '../types/log-entry';

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  fatigue: 'Fatigue',
  brain_fog: 'Brain fog',
  headache: 'Headache',
  muscle_pain: 'Muscle pain',
  joint_pain: 'Joint pain',
  sleep_disturbance: 'Sleep issues',
  dizziness: 'Dizziness',
  nausea: 'Nausea',
};

export type SymptomToggleProps = {
  symptom: Symptom;
  selected: boolean;
  onToggle: (symptom: Symptom) => void;
};

export const SymptomToggle = ({
  symptom,
  selected,
  onToggle,
}: SymptomToggleProps) => (
  <TouchableOpacity
    style={[styles.button, selected && styles.buttonSelected]}
    onPress={() => onToggle(symptom)}
    activeOpacity={0.7}
    accessibilityLabel={SYMPTOM_LABELS[symptom]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <Text style={[styles.buttonText, selected && styles.buttonTextSelected]}>
      {SYMPTOM_LABELS[symptom]}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: Colors.light.primary_soft,
    borderColor: Colors.light.primary,
  },
  buttonText: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.light.text_muted,
  },
  buttonTextSelected: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
