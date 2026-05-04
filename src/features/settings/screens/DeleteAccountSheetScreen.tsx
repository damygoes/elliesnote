import { useAuth, useClerk } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/ui/Button';
import { Colors, Spacing, Typography } from '@/shared/constants/theme';
import { SheetHeader } from '../components/SheetHeader';

export const DeleteAccountSheetScreen = () => {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await signOut();
      router.replace('/');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Delete account" />

      <View style={styles.content}>
        <Text style={styles.warning}>
          This will permanently delete your account and all your check-in data.
          This action cannot be undone.
        </Text>

        <View style={styles.buttons}>
          <Button variant="secondary" onPress={() => router.back()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleDelete}
            loading={isDeleting}
            style={styles.deleteButton}
          >
            Delete account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xxl,
  },
  warning: {
    ...Typography.body,
    color: Colors.light.text_muted,
    lineHeight: 24,
  },
  buttons: {
    gap: Spacing.lg,
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
    borderColor: Colors.light.error,
  },
});
