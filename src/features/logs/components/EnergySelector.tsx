import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/shared/constants/theme';
import { ENERGY_LEVELS } from '../constants/energy';

export type EnergySelectorProps = {
  value: number | null;
  onChange: (level: number) => void;
};

export const EnergySelector = ({ value, onChange }: EnergySelectorProps) => (
  <View style={styles.row}>
    {ENERGY_LEVELS.map((level) => (
      <TouchableOpacity
        key={level}
        style={[styles.button, value === level && styles.buttonSelected]}
        onPress={() => onChange(level)}
        activeOpacity={0.7}
        accessibilityLabel={`Energy level ${level}`}
        accessibilityRole="button"
        accessibilityState={{ selected: value === level }}
      >
        <Text
          style={[
            styles.buttonText,
            value === level && styles.buttonTextSelected,
          ]}
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
  buttonSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text_muted,
  },
  buttonTextSelected: {
    color: Colors.light.on_primary,
  },
});
