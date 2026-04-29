import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNotificationPreferences } from '@/features/notifications/hooks/useNotificationPreferences';
import { notificationService } from '@/features/notifications/services/notificationService';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

// --- HourStepper ---

const HourStepper = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.stepButton}
        onPress={() => onChange((value + 23) % 24)}
        accessibilityLabel={`Decrease ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.stepButtonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.value}>{value}:00</Text>

      <TouchableOpacity
        style={styles.stepButton}
        onPress={() => onChange((value + 1) % 24)}
        accessibilityLabel={`Increase ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.stepButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Screen ---

export const NotificationSettingsScreen = () => {
  const { preferences, updatePreferences, isLoading } =
    useNotificationPreferences();

  if (isLoading || !preferences) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  const handleMorningChange = (morningHour: number) => {
    updatePreferences({ ...preferences, morningHour });
    notificationService.scheduleReminders(morningHour, preferences.eveningHour);
  };

  const handleEveningChange = (eveningHour: number) => {
    updatePreferences({ ...preferences, eveningHour });
    notificationService.scheduleReminders(preferences.morningHour, eveningHour);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reminders</Text>

      <HourStepper
        label="Morning reminder"
        value={preferences.morningHour}
        onChange={handleMorningChange}
      />

      <HourStepper
        label="Evening reminder"
        value={preferences.eveningHour}
        onChange={handleEveningChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  title: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  section: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButton: {
    width: 44,
    height: 44,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.full,
  },
  stepButtonText: {
    fontSize: 24,
    lineHeight: 24,
    color: Colors.light.primary,
  },
  value: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  loading: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
});
