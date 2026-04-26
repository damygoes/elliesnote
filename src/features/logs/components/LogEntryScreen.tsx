import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { v4 as uuid } from 'uuid';
import { userContext } from '@/services/userContext';
import { useCreateLogEntry } from '../hooks/useCreateLogEntry';
import { SYMPTOMS, type Symptom } from '../types/log-entry';
import { EnergySelector } from './EnergySelector';
import { SymptomToggle } from './SymptomToggle';

type Props = {
  onSave?: () => void;
};

export const LogEntryScreen = ({ onSave }: Props) => {
  const { createEntry, isError, isSaved } = useCreateLogEntry();

  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const canSave = energyLevel !== null;

  const handleSave = async () => {
    if (!canSave) return;

    const now = new Date();

    await createEntry({
      id: uuid(),
      userId: userContext.getCurrentUserId(),
      date: now.toISOString(),
      energyLevel,
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined,
      createdAt: now.getTime(),
    });

    onSave?.();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.label}>How&apos;s your energy today?</Text>
        <Text style={styles.hint}>1 = very low · 5 = good</Text>
        <EnergySelector value={energyLevel} onChange={setEnergyLevel} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Any symptoms?</Text>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((symptom) => (
            <SymptomToggle
              key={symptom}
              symptom={symptom}
              selected={selectedSymptoms.includes(symptom)}
              onToggle={toggleSymptom}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          Notes <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything else worth noting…"
          placeholderTextColor={Colors.light.text_secondary}
          multiline
          textAlignVertical="top"
        />
      </View>

      {isSaved && <Text style={styles.savedText}>Saved</Text>}

      {isError && (
        <Text style={styles.errorText}>
          Couldn&apos;t save — please try again.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!canSave}
        activeOpacity={0.8}
        accessibilityLabel="Save log entry"
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: 48,
    gap: Spacing.xxl,
  },
  section: {
    gap: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  hint: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  optional: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.light.text_primary,
    backgroundColor: Colors.light.surface,
    minHeight: 88,
  },
  savedText: {
    ...Typography.caption,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.light.error,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.lg,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.primary_disabled,
  },
  saveButtonText: {
    ...Typography.button,
    color: Colors.light.on_primary,
    letterSpacing: 0.3,
  },
});
