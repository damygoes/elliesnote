import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Button } from '@/shared/components/ui/Button';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { formatDate } from '@/shared/utils/date';
import { getGreeting } from '@/shared/utils/greeting';
import { CrashBanner } from '../components/CrashBanner';
import { TodayEmptyState } from '../components/TodayEmptyState';
import { TodayEntryCard } from '../components/TodayEntryCard';
import { TodaySummaryCard } from '../components/TodaySummaryCard';
import { useCrashDays } from '../hooks/useCrashDays';
import { useDeleteLogEntry } from '../hooks/useDeleteLogEntry';
import { useLogs } from '../hooks/useLogs';
import { useTodayCrash } from '../hooks/useTodayCrash';
import { useTodayEntries } from '../hooks/useTodayEntries';
import type { LogEntry } from '../types/log-entry';

export const TodayScreen = () => {
  const { user } = useUser();
  const { isLoading } = useLogs();
  useCrashDays();
  const todayEntries = useTodayEntries();
  const { todayCrash, logCrash, undoCrash } = useTodayCrash();
  const { isPremium } = usePremium();
  const deleteLogEntry = useDeleteLogEntry();

  const handleEdit = (entry: LogEntry) => {
    router.push({
      pathname: '/(app)/(protected)/today/edit',
      params: { id: entry.id },
    });
  };

  const handleDelete = (entry: LogEntry) => {
    if (!isPremium) {
      router.push('/(app)/(protected)/premium');
      return;
    }
    Alert.alert('Delete entry?', 'This entry will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteLogEntry(entry),
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {todayCrash && <CrashBanner onUndo={undoCrash} />}

        <View style={styles.header}>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
          <Text style={styles.greeting}>{getGreeting(user?.firstName)}</Text>
        </View>

        {isLoading ? (
          <Text style={styles.loading}>Loading…</Text>
        ) : todayEntries.length > 0 ? (
          <>
            <TodaySummaryCard entries={todayEntries} />
            <View style={styles.entriesSection}>
              <Text style={styles.sectionTitle}>
                Today&apos;s Entries ({todayEntries.length})
              </Text>
              <View style={styles.entriesList}>
                {todayEntries.map((entry) => (
                  <TodayEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={() => handleEdit(entry)}
                    onDelete={() => handleDelete(entry)}
                  />
                ))}
              </View>
            </View>
          </>
        ) : (
          <TodayEmptyState />
        )}
      </ScrollView>

      <View style={styles.actions}>
        <Button
          variant="primary"
          onPress={() => router.navigate('/(app)/(protected)/(tabs)/log')}
        >
          Log Entry
        </Button>

        {!todayCrash && (
          <Button variant="danger" onPress={logCrash}>
            I&apos;m Crashing Today
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
    gap: Spacing.xl,
  },
  header: {
    gap: Spacing.xs,
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
  entriesSection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.light.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  entriesList: {
    gap: Spacing.md,
  },
  actions: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.light.background_primary,
  },
});
