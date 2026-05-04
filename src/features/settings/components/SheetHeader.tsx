import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '@/shared/constants/theme';

interface SheetHeaderProps {
  title: string;
}

export const SheetHeader = ({ title }: SheetHeaderProps) => (
  <View style={styles.wrapper}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityLabel="Close"
        accessibilityRole="button"
        hitSlop={8}
      >
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.divider} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text_primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.border,
    borderRadius: 16,
  },
  closeIcon: {
    fontSize: 13,
    color: Colors.light.text_secondary,
    lineHeight: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.border,
  },
});
