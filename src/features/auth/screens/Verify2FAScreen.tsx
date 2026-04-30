import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { BackButton } from '@/shared/components/BackButton';
import { Colors } from '@/shared/constants/theme';
import { useSignIn } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export function Verify2FAScreen() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const params = useLocalSearchParams<{
    strategy?: string;
    identifier?: string;
  }>();

  const strategy = (params.strategy ?? 'email_code') as 'email_code';
  const identifier = params.identifier ?? '';

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => code.trim().length >= 4, [code]);

  const onVerify = async () => {
    if (!isLoaded || !signIn) return;
    setError(null);
    setSubmitting(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy,
        code: code.trim(),
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return;
      }

      setError(`Verification incomplete: ${result.status}`);
    } catch (e: any) {
      setError(
        e?.errors?.[0]?.longMessage ||
          e?.errors?.[0]?.message ||
          e?.message ||
          'Failed to verify code.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!isLoaded || !signIn) return;
    setError(null);
    setResending(true);
    try {
      await signIn.prepareSecondFactor({ strategy });
    } catch (e: any) {
      setError(
        e?.errors?.[0]?.longMessage ||
          e?.errors?.[0]?.message ||
          e?.message ||
          'Failed to resend code.',
      );
    } finally {
      setResending(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <BackButton />
        <View style={styles.content}>
          <AuthHeader
            title="Verify your sign-in"
            subtitle={`Enter the code we sent to ${identifier || 'your email'}.`}
          />

          <View style={styles.card}>
            <FormField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="123456"
              placeholderTextColor={Colors.light.text_muted}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              variant="primary"
              onPress={onVerify}
              disabled={!canSubmit || submitting}
              loading={submitting}
            >
              Verify
            </Button>

            <Button
              variant="secondary"
              onPress={onResend}
              disabled={resending}
              loading={resending}
            >
              Resend code
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
