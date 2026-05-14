import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { InsightItem } from '../hooks/useInsightsData';

type Props = {
  insights: InsightItem[];
  isLoading: boolean;
  isPremium: boolean;
};

export const InsightCard = ({ insights, isLoading, isPremium }: Props) => {
  if (isLoading) return null;

  if (!isPremium) {
    return (
      <TouchableOpacity
        style={styles.lockedCard}
        onPress={() => router.push('/premium')}
        activeOpacity={0.85}
      >
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockedTitle}>Unlock Insights</Text>
        <Text style={styles.lockedBody}>
          See what&apos;s draining your energy — symptom patterns, day-of-week
          trends, and how sleep affects your next day.
        </Text>
        <View style={styles.lockedCta}>
          <Text style={styles.lockedCtaText}>Start free trial →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (insights.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.empty}>
          Keep logging — insights unlock after a few more days
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {insights.map((insight, index) => (
        <View key={insight.type}>
          {index > 0 && <View style={styles.divider} />}
          <Text style={styles.label}>{insight.title}</Text>
          <Text style={styles.body}>{insight.body}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  lockedCard: {
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
  },
  lockedTitle: {
    ...Typography.label,
    fontWeight: '600',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  lockedBody: {
    ...Typography.body,
    color: Colors.light.text_secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  lockedCta: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primary,
  },
  lockedCtaText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.light.on_primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.primary,
    opacity: 0.25,
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
  },
  body: {
    ...Typography.body,
    color: Colors.light.text_primary,
    lineHeight: 22,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_secondary,
    lineHeight: 22,
  },
});
