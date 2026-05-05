import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { EnergyChart } from '../components/EnergyChart';
import { InsightCard } from '../components/InsightCard';
import { RangeSelector } from '../components/RangeSelector';
import { StreakCard } from '../components/StreakCard';
import { type Range, useExploreData } from '../hooks/useExploreData';

export const ExploreScreen = () => {
  const [range, setRange] = useState<Range>(7);
  const { stats, streak, insight, isLoading, hasError } = useExploreData(range);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Explore</Text>

      {hasError && (
        <Text style={styles.errorBanner}>
          Unable to load data. Check your connection.
        </Text>
      )}

      <RangeSelector value={range} onChange={setRange} />

      <Text style={styles.sectionLabel}>Streak</Text>
      <StreakCard streakDays={streak} isLoading={isLoading} />

      <Text style={styles.sectionLabel}>Energy</Text>
      <EnergyChart series={stats} range={range} isLoading={isLoading} />

      <InsightCard message={insight} isLoading={isLoading} />
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
    gap: Spacing.lg,
  },
  title: {
    fontSize: Typography.subtitle.fontSize,
    fontWeight: Typography.subtitle.fontWeight,
    color: Colors.light.text_primary,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.text_secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
  errorBanner: {
    ...Typography.small,
    color: Colors.light.error,
    textAlign: 'center',
  },
});
