import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { formatDate } from '@/shared/utils/date';
import { TodayEmptyState } from '../components/TodayEmptyState';
import { TodayEntryCard } from '../components/TodayEntryCard';
import { useLogs } from '../hooks/useLogs';
import { useTodayEntry } from '../hooks/useTodayEntry';

export const TodayScreen = () => {
  const { isLoading } = useLogs();
  const todayEntry = useTodayEntry();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.date}>{formatDate(new Date())}</Text>

      {isLoading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : todayEntry ? (
        <TodayEntryCard
          entry={todayEntry}
          onEdit={() => router.navigate('/(tabs)/log')}
        />
      ) : (
        <TodayEmptyState />
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
});
