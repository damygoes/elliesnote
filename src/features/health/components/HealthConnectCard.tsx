import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { logger } from '@/services/logger';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { useHealthPermission } from '../hooks/useHealthPermission';
import { fetchDailySnapshot } from '../services/healthKitService';
import type { DailyHealthSnapshot } from '../types';

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatSleep(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

type PillProps = { value: string; label: string };

function Pill({ value, label }: PillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillValue}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

type Props = {
  isPremium: boolean;
};

export const HealthConnectCard = ({ isPremium }: Props) => {
  const { hasPermission } = useHealthPermission();
  const [snapshot, setSnapshot] = useState<DailyHealthSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasPermission !== true || Platform.OS !== 'ios' || !isPremium) return;
    setIsLoading(true);
    fetchDailySnapshot(getYesterdayKey())
      .then(setSnapshot)
      .catch((error: Error) => {
        logger.warn('Failed to fetch health snapshot', error.message, error);
      })
      .finally(() => setIsLoading(false));
  }, [hasPermission, isPremium]);

  if (Platform.OS !== 'ios') return null;

  if (!isPremium) {
    return (
      <TouchableOpacity
        style={styles.nudge}
        onPress={() => router.push('/premium')}
        activeOpacity={0.85}
      >
        <Text style={styles.nudgeText}>
          🔒 Connect Apple Health for sleep, HRV and activity insights
        </Text>
        <Text style={styles.nudgeLink}>Upgrade →</Text>
      </TouchableOpacity>
    );
  }

  // Not connected — passive nudge only
  if (hasPermission !== true) {
    return (
      <Pressable
        style={styles.nudge}
        onPress={() => router.push('/settings/integrations')}
      >
        <Text style={styles.nudgeText}>
          Connect health integrations for richer insights
        </Text>
        <Text style={styles.nudgeLink}>Set up →</Text>
      </Pressable>
    );
  }

  if (isLoading || snapshot === null) {
    return <View style={[styles.summaryCard, styles.skeleton]} />;
  }

  const { sleepMinutes, restingHeartRate, steps } = snapshot;
  const hasData =
    sleepMinutes !== null || restingHeartRate !== null || steps !== null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.header}>Yesterday</Text>
      {hasData ? (
        <View style={styles.pills}>
          {sleepMinutes !== null && (
            <Pill value={formatSleep(sleepMinutes)} label="Sleep" />
          )}
          {restingHeartRate !== null && (
            <Pill
              value={`${Math.round(restingHeartRate)} bpm`}
              label="Resting HR"
            />
          )}
          {steps !== null && (
            <Pill value={Math.round(steps).toLocaleString()} label="Steps" />
          )}
        </View>
      ) : (
        <Text style={styles.empty}>No health data for yesterday</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  nudge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  nudgeText: {
    ...Typography.small,
    color: Colors.light.primary,
    flex: 1,
  },
  nudgeLink: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.primary,
    marginLeft: Spacing.sm,
  },
  summaryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  skeleton: {
    height: 88,
    opacity: 0.4,
  },
  header: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pills: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pill: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pillValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text_primary,
  },
  pillLabel: {
    ...Typography.small,
    color: Colors.light.text_muted,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_muted,
  },
});
