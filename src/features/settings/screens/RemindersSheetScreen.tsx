import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotificationPreferences } from '@/features/notifications/hooks/useNotificationPreferences';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { SheetHeader } from '@/shared/components/SheetHeader';

function formatMinuteOfDay(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m.toString().padStart(2, '0');
  return `${displayHour}:${displayMin} ${period}`;
}

const STEP = 15;

const TimeStepper = ({
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
        onPress={() => onChange((value - STEP + 1440) % 1440)}
        accessibilityLabel={`Decrease ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.stepButtonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.value}>{formatMinuteOfDay(value)}</Text>

      <TouchableOpacity
        style={styles.stepButton}
        onPress={() => onChange((value + STEP) % 1440)}
        accessibilityLabel={`Increase ${label}`}
        accessibilityRole="button"
      >
        <Text style={styles.stepButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const RemindersSheetScreen = () => {
  const { preferences, updatePreferences, isLoading } =
    useNotificationPreferences();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Reminders" />

      {isLoading || !preferences ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Enable reminders</Text>
            <Switch
              value={preferences.enabled}
              onValueChange={(enabled) => updatePreferences({ enabled })}
              trackColor={{
                false: Colors.light.border,
                true: Colors.light.primary,
              }}
              thumbColor={Colors.light.on_primary}
            />
          </View>

          {preferences.enabled && (
            <>
              <TimeStepper
                label="Morning reminder"
                value={preferences.morningMinute}
                onChange={(morningMinute) =>
                  updatePreferences({ morningMinute })
                }
              />
              <TimeStepper
                label="Evening reminder"
                value={preferences.eveningMinute}
                onChange={(eveningMinute) =>
                  updatePreferences({ eveningMinute })
                }
              />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    ...Typography.body,
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
});
