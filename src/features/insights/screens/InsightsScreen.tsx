import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HealthConnectCard } from '@/features/health/components/HealthConnectCard';
import { useHealthPermission } from '@/features/health/hooks/useHealthPermission';
import { useHealthSync } from '@/features/health/hooks/useHealthSync';
import { useCrashDays } from '@/features/logs/hooks/useCrashDays';
import { useCrashStore } from '@/features/logs/store/useCrashStore';
import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { isIPad } from '@/shared/utils/isIPad';
import { CrashCard } from '../components/CrashCard';
import { InsightCard } from '../components/InsightCard';
import { RangeSelector } from '../components/RangeSelector';
import { SeriesFilterPills } from '../components/SeriesFilterPills';
import { StreakCard } from '../components/StreakCard';
import { SymptomDotRows } from '../components/SymptomDotRows';
import { TrendChart } from '../components/TrendChart';
import {
  type Range,
  type SeriesKey,
  useInsightsData,
} from '../hooks/useInsightsData';

export const InsightsScreen = () => {
  const { isPremium } = usePremium();
  const [range, setRange] = useState<Range>(7);
  const {
    stats,
    days,
    streak,
    insights,
    healthSeries,
    isLoading,
    hasError,
    refresh,
  } = useInsightsData(range);

  useCrashDays();
  const crashDays = useCrashStore((state) => state.crashDays);
  const daysSet = useMemo(() => new Set(days), [days]);
  const crashDaysInRange = useMemo(
    () => crashDays.filter((d) => daysSet.has(d.date)),
    [crashDays, daysSet],
  );
  const { hasPermission } = useHealthPermission();
  const [activeSeries, setActiveSeries] = useState<Set<SeriesKey>>(new Set());

  useHealthSync(days);

  const handleSeriesToggle = useCallback((key: SeriesKey) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

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
      <Text style={styles.title}>Insights</Text>

      {hasError && (
        <Text style={styles.errorBanner}>
          Unable to load data. Check your connection.
        </Text>
      )}

      <RangeSelector value={range} onChange={setRange} isPremium={isPremium} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Streak</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <StreakCard streakDays={streak} isLoading={isLoading} />
          </View>
          <View style={styles.statItem}>
            <CrashCard count={crashDaysInRange.length} isLoading={isLoading} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Trends</Text>
        <SeriesFilterPills
          activeSeries={activeSeries}
          onToggle={handleSeriesToggle}
          healthSeries={healthSeries}
          hasHealthPermission={hasPermission === true}
        />
        <TrendChart
          stats={stats}
          days={days}
          range={range}
          isLoading={isLoading}
          activeSeries={activeSeries}
          healthSeries={healthSeries}
          crashDays={crashDays}
        />
        {activeSeries.has('symptoms') && (
          <SymptomDotRows stats={stats} days={days} range={range} />
        )}
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
    padding: isIPad ? Spacing['5xl'] : undefined,
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
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
