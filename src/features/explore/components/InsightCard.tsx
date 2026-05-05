import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';

type Props = {
  message: string | null;
  isLoading: boolean;
};

export const InsightCard = ({ message, isLoading }: Props) => {
  if (isLoading) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Insight</Text>
      <Text style={styles.text}>
        {message ?? 'Keep logging — insights unlock after a few more days'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.primary_soft,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  header: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  text: {
    ...Typography.body,
    color: Colors.light.text_primary,
    lineHeight: 22,
  },
});
