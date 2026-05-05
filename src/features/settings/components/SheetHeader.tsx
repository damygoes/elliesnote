import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SheetHeaderProps {
  title: string;
}

export const SheetHeader = ({ title }: SheetHeaderProps) => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityLabel="Close"
        accessibilityRole="button"
        hitSlop={8}
      >
        <Ionicons name="close" size={24} color={Colors.light.text_secondary} />
      </TouchableOpacity>
    </View>
    <View style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.subtitle.fontSize,
    fontWeight: Typography.subtitle.fontWeight,
    lineHeight: 28,
    color: Colors.light.text_primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.border,
  },
});
