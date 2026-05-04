import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsRowProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
}

export const SettingsRow = ({
  label,
  onPress,
  destructive = false,
  showChevron = true,
}: SettingsRowProps) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={0.6}
    accessibilityRole="button"
  >
    <Text style={[styles.label, destructive && styles.destructiveLabel]}>
      {label}
    </Text>
    {showChevron && (
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    minHeight: 54,
    backgroundColor: Colors.light.surface,
  },
  label: {
    ...Typography.body,
    color: Colors.light.text_primary,
  },
  destructiveLabel: {
    color: Colors.light.error,
  },
  chevronContainer: {
    width: 24,
    alignItems: 'center',
  },
  chevron: {
    fontSize: 22,
    color: Colors.light.text_secondary,
    lineHeight: 24,
  },
});
