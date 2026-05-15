import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

type Props = {
  count: number;
  isLoading: boolean;
};

export const CrashCard = ({ count, isLoading }: Props) => (
  <View style={styles.card}>
    {isLoading ? (
      <Text style={styles.placeholder}>—</Text>
    ) : count === 0 ? (
      <Text style={styles.empty}>No crashes — great!</Text>
    ) : (
      <View style={styles.row}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.unit}>
          {count === 1 ? 'crash day' : 'crash days'}
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
    color: Colors.light.error,
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
