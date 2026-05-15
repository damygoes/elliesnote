import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { SheetHeader } from '@/shared/components/SheetHeader';
import { useUserProfile } from '@/shared/hooks/useUserProfile';

export const ProfileSheetScreen = () => {
  const { profile, save, isSaving, error } = useUserProfile();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [username, setUsername] = useState(profile.username);

  // Once the user starts typing we stop syncing draft from background updates
  const hasEdited = useRef(false);

  useEffect(() => {
    if (!hasEdited.current) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setUsername(profile.username);
    }
  }, [profile]);

  const isDirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    username !== profile.username;

  async function handleSave() {
    const ok = await save({ firstName, lastName, username });
    if (ok) {
      hasEdited.current = false;
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Profile" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <FormField
          label="First name"
          value={firstName}
          onChangeText={(v) => {
            hasEdited.current = true;
            setFirstName(v);
          }}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <FormField
          label="Last name"
          value={lastName}
          onChangeText={(v) => {
            hasEdited.current = true;
            setLastName(v);
          }}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <FormField
          label="Username"
          value={username}
          onChangeText={(v) => {
            hasEdited.current = true;
            setUsername(v);
          }}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.md,
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
