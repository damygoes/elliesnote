import { useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { SettingsRow } from '../components/SettingsRow';

export const SettingsScreen = () => {
  const { signOut } = useClerk();

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Settings</Text>
      <View style={styles.contentWrapper}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Profile</Text>
          <View style={styles.card}>
            <SettingsRow
              label="Profile info"
              onPress={() => router.push('/settings/profile')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reminders</Text>
          <View style={styles.card}>
            <SettingsRow
              label="Notifications"
              onPress={() => router.push('/settings/reminders')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <SettingsRow
              label="Sign out"
              onPress={handleSignOut}
              showChevron={false}
            />
            <View style={styles.divider} />
            <SettingsRow
              label="Delete account"
              onPress={() => router.push('/settings/delete-account')}
              destructive
              showChevron={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    gap: Spacing.xl,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing['3xl'],
  },
  screenTitle: {
    fontSize: Typography.subtitle.fontSize,
    fontWeight: Typography.subtitle.fontWeight,
    color: Colors.light.text_primary,
  },
  section: {
    gap: Spacing.md,
    borderWidth: 0.8,
    borderColor: Colors.light.border,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.body,
    color: Colors.light.text_secondary,
    paddingHorizontal: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    shadowColor: Colors.light.text_primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.text_secondary,
  },
});
