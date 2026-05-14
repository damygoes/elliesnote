import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, Spacing, Typography } from '@/shared/constants/theme';

type Props = {
  onUndo: () => void;
};

export const CrashBanner = ({ onUndo }: Props) => (
  <View style={styles.banner}>
    <Text style={styles.message}>⚠️ Crash day logged</Text>
    <TouchableOpacity onPress={onUndo} hitSlop={8}>
      <Text style={styles.undo}>Undo</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF0EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  message: {
    ...Typography.caption,
    color: Colors.light.error,
    fontWeight: '600',
  },
  undo: {
    ...Typography.caption,
    color: Colors.light.error,
    textDecorationLine: 'underline',
  },
});
