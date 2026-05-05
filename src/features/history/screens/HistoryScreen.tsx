import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { HistoryEntryRow } from '../components/HistoryEntryRow';
import { useHistoryEntries } from '../hooks/useHistoryEntries';
import type { HistoryEntry } from '../hooks/useHistoryEntries';

export const HistoryScreen = () => {
  const { entries, isLoading } = useHistoryEntries();

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
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HistoryEntryRow entry={item} onPress={handlePress} />
      )}
      ListHeaderComponent={<Text style={styles.title}>History</Text>}
      ListEmptyComponent={
        <Text style={styles.empty}>
          {isLoading ? 'Loading…' : 'Your logged entries will appear here'}
        </Text>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
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
    marginBottom: Spacing.md,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_muted,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  separator: {
    height: Spacing.md,
  },
});
