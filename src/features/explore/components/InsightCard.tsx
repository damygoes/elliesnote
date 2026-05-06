import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { InsightItem } from '../hooks/useExploreData';

type Props = {
  insights: InsightItem[];
  isLoading: boolean;
};

export const InsightCard = ({ insights, isLoading }: Props) => {
  if (isLoading) return null;

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
