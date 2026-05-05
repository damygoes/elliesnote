import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { Range } from '../hooks/useExploreData';

const RANGES: Range[] = [7, 14, 30];

type Props = {
  value: Range;
  onChange: (range: Range) => void;
};

export const RangeSelector = ({ value, onChange }: Props) => (
  <View style={styles.row}>
    {RANGES.map((range) => (
      <TouchableOpacity
        key={range}
        style={[styles.pill, value === range && styles.pillActive]}
        onPress={() => onChange(range)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: value === range }}
      >
        <Text style={[styles.label, value === range && styles.labelActive]}>
          {range}d
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pillActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  label: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.light.text_secondary,
  },
  labelActive: {
    color: Colors.light.on_primary,
    fontWeight: '600',
  },
});
