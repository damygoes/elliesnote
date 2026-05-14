import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { formatDate } from '@/shared/utils/date';
import { useEntriesByDate } from '../store/useLogStore';
import { TodayEntryCard } from '../components/TodayEntryCard';

export const DayHistoryScreen = () => {
  const { date } = useLocalSearchParams<{ date: string }>();
  const entries = useEntriesByDate(date ?? '');

  const displayDate = date ? formatDate(new Date(date)) : '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{displayDate}</Text>
        <Text style={styles.subtitle}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      <View style={styles.list}>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <TodayEntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <Text style={styles.empty}>No entries for this day.</Text>
        )}
      </View>
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
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text_primary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
  list: {
    gap: Spacing.md,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
});
