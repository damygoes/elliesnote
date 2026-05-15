import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Button } from '@/shared/components/ui/Button';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { useUserProfile } from '@/shared/hooks/useUserProfile';
import { formatDate } from '@/shared/utils/date';
import { getGreeting } from '@/shared/utils/greeting';
import { isIPad } from '@/shared/utils/isIPad';
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
  const { profile } = useUserProfile();
  const { isLoading } = useLogs();
  useCrashDays();
  const todayEntries = useTodayEntries();
  const { todayCrash, logCrash, undoCrash } = useTodayCrash();
  const { isPremium } = usePremium();
  const deleteLogEntry = useDeleteLogEntry();
  const [showBanner, setShowBanner] = useState(false);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogCrash = () => {
    logCrash();
    setShowBanner(true);
    bannerTimer.current = setTimeout(() => setShowBanner(false), 4000);
  };

  const handleUndoCrash = () => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    setShowBanner(false);
    undoCrash();
  };

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
        {todayCrash && showBanner && <CrashBanner onUndo={handleUndoCrash} />}

        <View style={styles.header}>
          <Text style={styles.date}>{formatDate(new Date())}</Text>
          <Text style={styles.greeting}>
            {getGreeting(profile.firstName || undefined)}
          </Text>
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
          <Button variant="danger" onPress={handleLogCrash}>
            I&apos;m Crashing Today
          </Button>
        )}

        {todayCrash && !showBanner && (
          <View style={styles.crashSettled}>
            <View style={styles.crashSettledInfo}>
              <Text style={styles.crashSettledLabel}>Crash day logged</Text>
              <Text style={styles.crashSettledSub}>
                Take it easy today. Rest is part of recovery.
              </Text>
            </View>
            <TouchableOpacity onPress={handleUndoCrash} hitSlop={8}>
              <Text style={styles.crashSettledUndo}>Undo</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: isIPad ? Spacing.xl : undefined,
  },
  content: {
    paddingHorizontal: isIPad ? Spacing.xxl : Spacing.xl,
    paddingTop: isIPad ? Spacing['3xl'] : Spacing.xxl,
    paddingBottom: isIPad ? Spacing.xl : Spacing.md,
    gap: isIPad ? Spacing.xxl : Spacing.xl,
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
    gap: Spacing.lg,
    backgroundColor: Colors.light.background_primary,
  },
  crashSettled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF0EE',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.error,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  crashSettledInfo: {
    flex: 1,
    gap: 2,
  },
  crashSettledLabel: {
    ...Typography.label,
    color: Colors.light.error,
    fontWeight: '600',
  },
  crashSettledSub: {
    ...Typography.small,
    color: Colors.light.error,
    opacity: 0.8,
  },
  crashSettledUndo: {
    ...Typography.caption,
    color: Colors.light.error,
    textDecorationLine: 'underline',
  },
});
