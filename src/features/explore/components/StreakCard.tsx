import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

type Props = {
  streakDays: number;
  isLoading: boolean;
};

export const StreakCard = ({ streakDays, isLoading }: Props) => (
  <View style={styles.card}>
    {isLoading ? (
      <Text style={styles.placeholder}>—</Text>
    ) : streakDays === 0 ? (
      <Text style={styles.empty}>Log today to start your streak</Text>
    ) : (
      <View style={styles.row}>
        <Text style={styles.count}>{streakDays}</Text>
        <Text style={styles.unit}>
          {streakDays === 1 ? 'day streak' : 'day streak'}
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  count: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.primary,
    lineHeight: 44,
  },
  unit: {
    ...Typography.body,
    color: Colors.light.text_secondary,
  },
  placeholder: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.border,
  },
  empty: {
    ...Typography.body,
    color: Colors.light.text_muted,
  },
});
