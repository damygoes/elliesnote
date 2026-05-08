import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SheetHeader } from '@/shared/components/SheetHeader';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { useMissingDays } from '../hooks/useMissingDays';

const MAX_BACKFILL_DAYS = 7;

function formatDayDisplay(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00Z`);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export const MissingDaysSheetScreen = () => {
  const allMissingDays = useMissingDays();
  const missingDays = allMissingDays.slice(0, MAX_BACKFILL_DAYS);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Fill in a missed day" />
      <ScrollView contentContainerStyle={styles.list}>
        {missingDays.map((date, index) => (
          <View key={date}>
            {index > 0 && <View style={styles.divider} />}
            <Pressable
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: '/(app)/(protected)/today/edit',
                  params: { date },
                })
              }
            >
              <Text style={styles.dayLabel}>{formatDayDisplay(date)}</Text>
              <Text style={styles.arrow}>Fill in →</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  list: {
    paddingVertical: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  dayLabel: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  arrow: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.xl,
  },
});
