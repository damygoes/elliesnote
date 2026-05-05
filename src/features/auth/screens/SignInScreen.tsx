import { BackButton } from '@/shared/components/BackButton';
import { Button } from '@/shared/components/ui/Button';
import { FormField } from '@/shared/components/ui/FormField';
import { Colors } from '@/shared/constants/theme';
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
import { AuthFooterLink } from '../components/AuthFooterLink';
import { AuthHeader } from '../components/AuthHeader';
import { AUTH_LINKS } from '../constants/links';
import { AUTH_MESSAGES } from '../constants/messages';
import { useSignInFlow } from '../hooks/useSignInFlow';
import { signInSchema, type SignInInput } from '../types/auth';

export function SignInScreen() {
  const { isLoaded, isSubmitting, signIn } = useSignInFlow();
  const [serverError, setServerError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInInput) => {
    setServerError(null);
    const result = await signIn(data);
    if (!result.success && result.error) setServerError(result.error);
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
            title={AUTH_MESSAGES.SIGN_IN.title}
            subtitle={AUTH_MESSAGES.SIGN_IN.subtitle}
          />

          <View style={styles.card}>
            <Controller
              control={form.control}
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
              control={form.control}
              name="password"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <FormField
                  label="Password"
                  placeholder="At least 8 characters"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!visible}
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

            {serverError && <Text style={styles.errorText}>{serverError}</Text>}

            <Button
              variant="primary"
              onPress={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isValid}
              loading={isSubmitting}
            >
              {AUTH_MESSAGES.SIGN_IN.button}
            </Button>

            <AuthFooterLink
              text={AUTH_MESSAGES.SIGN_IN.footer}
              linkText={AUTH_MESSAGES.SIGN_IN.footerLink}
              href={AUTH_LINKS.SIGN_UP}
            />
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
