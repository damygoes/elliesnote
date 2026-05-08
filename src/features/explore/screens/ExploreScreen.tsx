import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HealthConnectCard } from '@/features/health/components/HealthConnectCard';
import { useHealthSync } from '@/features/health/hooks/useHealthSync';
import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { EnergyChart } from '../components/EnergyChart';
import { InsightCard } from '../components/InsightCard';
import { RangeSelector } from '../components/RangeSelector';
import { StreakCard } from '../components/StreakCard';
import { type Range, useExploreData } from '../hooks/useExploreData';

export const ExploreScreen = () => {
  const { isPremium } = usePremium();
  const [range, setRange] = useState<Range>(7);
  const { stats, days, streak, insights, isLoading, hasError, refresh } =
    useExploreData(range);

  useHealthSync(days);

  const prevIsPremiumRef = useRef(isPremium);
  useEffect(() => {
    if (!prevIsPremiumRef.current && isPremium) {
      refresh();
    }
    if (!isPremium && range > 7) setRange(7);
    prevIsPremiumRef.current = isPremium;
  }, [isPremium, range, refresh]);

  const isMounted = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (isMounted.current) refresh();
      else isMounted.current = true;
    }, [refresh]),
  );

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

      <RangeSelector value={range} onChange={setRange} isPremium={isPremium} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Streak</Text>
        <StreakCard streakDays={streak} isLoading={isLoading} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Energy</Text>
        <EnergyChart
          stats={stats}
          days={days}
          range={range}
          isLoading={isLoading}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Insights</Text>
        <InsightCard
          insights={insights}
          isLoading={isLoading}
          isPremium={isPremium}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Health</Text>
        <HealthConnectCard isPremium={isPremium} />
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
    gap: Spacing.xxl,
  },
  section: {
    gap: Spacing.md,
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
