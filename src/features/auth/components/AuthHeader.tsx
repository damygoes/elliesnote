import { Colors, Fonts } from '@/shared/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: Colors.light.text_primary,
    fontFamily: Fonts?.sans,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text_muted,
    fontFamily: Fonts?.sans,
    maxWidth: 340,
  },
});
