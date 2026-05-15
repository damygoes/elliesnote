import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { Colors, Spacing } from '@/shared/constants/theme';
import { isIPad } from '@/shared/utils/isIPad';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BackButton } from '../../../shared/components/BackButton';
import { AuthFooterLink } from '../components/AuthFooterLink';
import { AuthHeader } from '../components/AuthHeader';
import { AUTH_LINKS } from '../constants/links';
import { AUTH_MESSAGES } from '../constants/messages';
import { useSignUpFlow } from '../hooks/useSignUpFlow';
import {
  emailPasswordSchema,
  verificationCodeSchema,
  type EmailPasswordInput,
  type VerificationCodeInput,
} from '../types/auth';

export function SignUpScreen() {
  const { isLoaded, isSubmitting, pendingVerification, signUp, verifyEmail } =
    useSignUpFlow();
  const [serverError, setServerError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const signUpForm = useForm<EmailPasswordInput>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const verificationForm = useForm<VerificationCodeInput>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const onSignUpSubmit = async (data: EmailPasswordInput) => {
    setServerError(null);
    const result = await signUp(data);

    if (!result.success && result.error) {
      setServerError(result.error);
    }
  };

  const onVerificationSubmit = async (data: VerificationCodeInput) => {
    setServerError(null);
    const result = await verifyEmail(data);

    if (!result.success && result.error) {
      setServerError(result.error);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const messages = pendingVerification
    ? AUTH_MESSAGES.VERIFICATION
    : AUTH_MESSAGES.SIGN_UP;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <BackButton />
        <View style={styles.content}>
          <AuthHeader title={messages.title} subtitle={messages.subtitle} />

          <View style={styles.card}>
            {pendingVerification && (
              <>
                <Controller
                  control={verificationForm.control}
                  name="code"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => {
                    const handleChange = (text: string) => {
                      const digits = text.replace(/\D/g, '').slice(0, 6);
                      onChange(digits);
                    };

                    return (
                      <FormField
                        ref={ref}
                        label="Verification code"
                        value={value || ''}
                        onChangeText={handleChange}
                        onBlur={onBlur}
                        keyboardType="number-pad"
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize="none"
                        disabled={isSubmitting}
                        error={error?.message}
                        icon={
                          <Ionicons
                            name="key-outline"
                            size={24}
                            color={Colors.light.text_muted}
                          />
                        }
                      />
                    );
                  }}
                />

                {serverError && (
                  <Text style={styles.errorText}>{serverError}</Text>
                )}

                <Button
                  variant="primary"
                  loading={isSubmitting}
                  disabled={!verificationForm.formState.isValid}
                  onPress={verificationForm.handleSubmit(onVerificationSubmit)}
                >
                  {AUTH_MESSAGES.VERIFICATION.button}
                </Button>

                <Text style={styles.helperText}>
                  {AUTH_MESSAGES.VERIFICATION.helper}
                </Text>
              </>
            )}
            {!pendingVerification && (
              <>
                <Controller
                  control={signUpForm.control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <FormField
                      label="Email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.light.text_muted}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon={
                        <Ionicons
                          name="mail-outline"
                          size={24}
                          color={Colors.light.text_muted}
                        />
                      }
                      iconPosition="start"
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={signUpForm.control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <FormField
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="At least 8 characters"
                      placeholderTextColor={Colors.light.text_muted}
                      secureTextEntry={!visible}
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoCorrect={false}
                      icon={
                        visible ? (
                          <Ionicons
                            name="eye-off-outline"
                            size={24}
                            color={Colors.light.text_muted}
                          />
                        ) : (
                          <Ionicons
                            name="eye-outline"
                            size={24}
                            color={Colors.light.text_muted}
                          />
                        )
                      }
                      iconPosition="end"
                      onIconPress={() => setVisible((v) => !v)}
                      iconAccessibilityLabel={
                        visible ? 'Hide password' : 'Show password'
                      }
                      error={error?.message}
                    />
                  )}
                />

                {serverError && (
                  <Text style={styles.errorText}>{serverError}</Text>
                )}

                <Button
                  variant="primary"
                  loading={isSubmitting}
                  disabled={!signUpForm.formState.isValid}
                  onPress={signUpForm.handleSubmit(onSignUpSubmit)}
                >
                  {AUTH_MESSAGES.SIGN_UP.button}
                </Button>

                <AuthFooterLink
                  text={AUTH_MESSAGES.SIGN_UP.footer}
                  linkText={AUTH_MESSAGES.SIGN_UP.footerLink}
                  href={AUTH_LINKS.SIGN_IN}
                />
              </>
            )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: isIPad ? Spacing['5xl'] : Spacing.xl,
    paddingTop: isIPad ? Spacing['5xl'] : Spacing.xl,
    paddingBottom: Spacing.lg,
    justifyContent: 'center',
    gap: isIPad ? Spacing['5xl'] : Spacing.xl,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: isIPad ? Spacing['5xl'] : Spacing.xl,
  },
  card: {
    gap: isIPad ? Spacing.xxl : Spacing.lg,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    lineHeight: 16,
  },
  helperText: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.light.text_muted,
    lineHeight: 16,
  },
});
