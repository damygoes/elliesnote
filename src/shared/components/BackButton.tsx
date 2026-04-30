import { Colors, Typography } from '@/shared/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export function BackButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.back()}
      accessibilityLabel="Go back"
      hitSlop={8}
    >
      <Ionicons
        name="chevron-back"
        size={28}
        color={Colors.light.text_primary}
      />
      <Text style={styles.label}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
    marginBottom: 8,
  },
  label: {
    color: Colors.light.text_primary,
    marginLeft: 4,
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.label.fontWeight,
  },
});
