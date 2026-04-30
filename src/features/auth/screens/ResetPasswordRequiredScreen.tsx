import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { BackButton } from '@/shared/components/BackButton';
import { Colors } from '@/shared/constants/theme';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthHeader } from '../components/AuthHeader';
import { AUTH_LINKS } from '../constants/links';
import { ClerkErrorParser } from '../services/clerkErrorParser';

export function ResetPasswordRequiredScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => password.trim().length >= 8 && !isSubmitting,
    [password, isSubmitting],
  );

  if (!isLoaded || !signIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const submit = async () => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await signIn.resetPassword({ password: password.trim() });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return;
      }

      setServerError(`Password reset not complete: ${result.status}`);
    } catch (e) {
      setServerError(ClerkErrorParser.parseSignInError(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <BackButton />
        <View style={styles.content}>
          <AuthHeader
            title="Update your password"
            subtitle="Your account requires a password update before you can continue."
          />

          <View style={styles.card}>
            <FormField
              label="New password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={Colors.light.text_muted}
              secureTextEntry
            />

            {serverError && <Text style={styles.errorText}>{serverError}</Text>}

            <Button
              variant="primary"
              onPress={submit}
              disabled={!canSubmit}
              loading={isSubmitting}
            >
              Continue
            </Button>

            <Button
              variant="ghost"
              onPress={() => router.replace(AUTH_LINKS.SIGN_IN)}
              disabled={isSubmitting}
            >
              Back to sign in
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    justifyContent: 'center',
    gap: 32,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 32,
  },
  card: {
    gap: 18,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    lineHeight: 16,
  },
});
