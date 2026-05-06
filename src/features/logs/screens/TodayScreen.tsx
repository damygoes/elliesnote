import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { formatDate } from '@/shared/utils/date';
import { getGreeting } from '@/shared/utils/greeting';
import { TodayEmptyState } from '../components/TodayEmptyState';
import { TodayEntryCard } from '../components/TodayEntryCard';
import { useLogs } from '../hooks/useLogs';
import { useMissingDays } from '../hooks/useMissingDays';
import { useTodayEntries } from '../hooks/useTodayEntries';
import type { LogEntry } from '../types/log-entry';

export const TodayScreen = () => {
  const { user } = useUser();
  const { isLoading } = useLogs();
  const todayEntries = useTodayEntries();
  const missingDays = useMissingDays();

  const handleEdit = (entry: LogEntry) => {
    router.push({
      pathname: '/(app)/(protected)/today/edit',
      params: { id: entry.id },
    });
  };

  const handleEditMissingDay = (date: string) => {
    router.navigate({
      pathname: '/(app)/(protected)/(tabs)/log',
      params: { date },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(new Date())}</Text>
        <Text style={styles.greeting}>{getGreeting(user?.firstName)}</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : todayEntries.length > 0 ? (
        <View style={styles.entriesList}>
          {todayEntries.map((entry) => (
            <TodayEntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => handleEdit(entry)}
            />
          ))}
        </View>
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
  header: {
    gap: Spacing.xs,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text_primary,
  },
  date: {
    ...Typography.label,
    color: Colors.light.text_secondary,
  },
  loading: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
  entriesList: {
    gap: Spacing.md,
  },
  missedHint: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
  },
});
