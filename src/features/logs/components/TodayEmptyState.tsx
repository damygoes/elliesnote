import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';

export const TodayEmptyState = () => (
  <View style={styles.container}>
    <Text style={styles.message}>Nothing logged yet today</Text>
    <Text style={styles.hint}>Head to the Log tab when you&apos;re ready</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.light.text_primary,
  },
  hint: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
});
