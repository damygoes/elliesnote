import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { HistoryEntryRow } from '../components/HistoryEntryRow';
import { useHistoryEntries } from '../hooks/useHistoryEntries';
import type { HistoryEntry } from '../hooks/useHistoryEntries';

type Section = {
  title: string;
  data: HistoryEntry[];
};

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatSectionDate(dayKey: string): string {
  const d = new Date(`${dayKey}T00:00:00`);
  return `${DAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

function groupByDay(entries: HistoryEntry[]): Section[] {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const key = entry.checkInDate ?? entry.createdAt.slice(0, 10);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      map.set(key, [entry]);
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([title, data]) => ({ title, data }));
}

export const HistoryScreen = () => {
  const { entries, isLoading, isLoadingMore, hasMore, loadMore, refresh } =
    useHistoryEntries();

  const isMounted = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (isMounted.current) refresh();
      else isMounted.current = true;
    }, [refresh]),
  );

  const sections = groupByDay(entries);

  const handlePress = (entry: HistoryEntry) => {
    router.push({
      pathname: '/(app)/(protected)/history/entry',
      params: {
        id: entry.id,
        checkInDate: entry.checkInDate ?? '',
        createdAt: entry.createdAt,
        energyLevel: String(entry.energyLevel),
        symptoms: JSON.stringify(entry.symptoms),
        notes: entry.notes ?? '',
      },
    });
  };

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HistoryEntryRow entry={item} onPress={handlePress} />
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {formatSectionDate(section.title)}
          </Text>
        </View>
      )}
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      ListHeaderComponent={<Text style={styles.title}>History</Text>}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {isLoading ? 'Loading…' : 'Your logged entries will appear here'}
        </Text>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator
            style={styles.footer}
            color={Colors.light.text_secondary}
          />
        ) : null
      }
      onEndReached={hasMore ? loadMore : undefined}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
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
  },
  title: {
    fontSize: Typography.subtitle.fontSize,
    fontWeight: Typography.subtitle.fontWeight,
    color: Colors.light.text_primary,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionSeparator: {
    height: Spacing.sm,
  },
  itemSeparator: {
    height: Spacing.sm,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_muted,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  footer: {
    paddingVertical: Spacing.xl,
  },
});
