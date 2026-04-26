import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/shared/constants/theme';
import {
  ENERGY_COLORS,
  ENERGY_LEVELS,
  ENERGY_SOFT_COLORS,
  type EnergyLevel,
} from '../constants/energy';

export type EnergySelectorProps = {
  value: number | null;
  onChange: (level: number) => void;
};

const selectedButtonStyles = StyleSheet.create({
  level1: {
    backgroundColor: ENERGY_SOFT_COLORS[1],
    borderColor: ENERGY_COLORS[1],
  },
  level2: {
    backgroundColor: ENERGY_SOFT_COLORS[2],
    borderColor: ENERGY_COLORS[2],
  },
  level3: {
    backgroundColor: ENERGY_SOFT_COLORS[3],
    borderColor: ENERGY_COLORS[3],
  },
  level4: {
    backgroundColor: ENERGY_SOFT_COLORS[4],
    borderColor: ENERGY_COLORS[4],
  },
  level5: {
    backgroundColor: ENERGY_SOFT_COLORS[5],
    borderColor: ENERGY_COLORS[5],
  },
});

const selectedTextStyles = StyleSheet.create({
  level1: { color: ENERGY_COLORS[1] },
  level2: { color: ENERGY_COLORS[2] },
  level3: { color: ENERGY_COLORS[3] },
  level4: { color: ENERGY_COLORS[4] },
  level5: { color: ENERGY_COLORS[5] },
});

const SELECTED_BUTTON: Record<EnergyLevel, ViewStyle> = {
  1: selectedButtonStyles.level1,
  2: selectedButtonStyles.level2,
  3: selectedButtonStyles.level3,
  4: selectedButtonStyles.level4,
  5: selectedButtonStyles.level5,
};

const SELECTED_TEXT: Record<EnergyLevel, TextStyle> = {
  1: selectedTextStyles.level1,
  2: selectedTextStyles.level2,
  3: selectedTextStyles.level3,
  4: selectedTextStyles.level4,
  5: selectedTextStyles.level5,
};

export const EnergySelector = ({ value, onChange }: EnergySelectorProps) => (
  <View style={styles.row}>
    {ENERGY_LEVELS.map((level) => (
      <TouchableOpacity
        key={level}
        style={[styles.button, value === level && SELECTED_BUTTON[level]]}
        onPress={() => onChange(level)}
        activeOpacity={0.7}
        accessibilityLabel={`Energy level ${level}`}
        accessibilityRole="button"
        accessibilityState={{ selected: value === level }}
      >
        <Text
          style={[styles.buttonText, value === level && SELECTED_TEXT[level]]}
        >
          {level}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text_muted,
  },
});
