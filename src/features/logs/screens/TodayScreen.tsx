import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { formatDate } from '@/shared/utils/date';
import { TodayEmptyState } from '../components/TodayEmptyState';
import { TodayEntryCard } from '../components/TodayEntryCard';
import { useLogs } from '../hooks/useLogs';
import { useMissingDays } from '../hooks/useMissingDays';
import { useTodayEntry } from '../hooks/useTodayEntry';

export const TodayScreen = () => {
  const { isLoading } = useLogs();
  const todayEntry = useTodayEntry();
  const missingDays = useMissingDays();

  const handleEditToday = () => {
    router.navigate('/(tabs)/log');
  };

  const handleEditMissingDay = (date: string) => {
    router.navigate({
      pathname: '/(tabs)/log',
      params: { date },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.date}>{formatDate(new Date())}</Text>

      {isLoading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : todayEntry ? (
        <TodayEntryCard entry={todayEntry} onEdit={handleEditToday} />
      ) : (
        <TodayEmptyState />
      )}
      {missingDays.length > 0 && (
        <TouchableOpacity onPress={() => handleEditMissingDay(missingDays[0])}>
          <Text style={styles.missedHint}>
            You can fill in previous days anytime
          </Text>
        </TouchableOpacity>
      )}
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
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  date: {
    ...Typography.label,
    color: Colors.light.text_secondary,
  },
  loading: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
  missedHint: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
});
