import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { SheetHeader } from '../components/SheetHeader';
import { useUserProfile } from '../hooks/useUserProfile';

export const ProfileSheetScreen = () => {
  const { profile, isLoading, save, isSaving, error } = useUserProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setUsername(profile.username);
    }
  }, [profile]);

  const isDirty =
    profile !== null &&
    (firstName !== profile.firstName ||
      lastName !== profile.lastName ||
      username !== profile.username);

  async function handleSave() {
    await save({ firstName, lastName, username });
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Profile" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <FormField
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <FormField
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <FormField
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            variant="primary"
            onPress={handleSave}
            disabled={!isDirty}
            loading={isSaving}
          >
            Save changes
          </Button>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  error: {
    ...Typography.small,
    color: Colors.light.error,
  },
});
