import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AUTH_LINKS } from '../constants/links';
import { ClerkErrorParser } from '../services/clerkErrorParser';
import type { SignInInput } from '../types/auth';

export function useSignInFlow() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (data: SignInInput) => {
    if (!isLoaded || !signIn) throw new Error('Clerk is not loaded');

    setIsSubmitting(true);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return { success: true as const };
      }

      if (result.status === 'needs_second_factor') {
        const factor = result.supportedSecondFactors?.find(
          (f: any) => f.strategy === 'email_code',
        );

        if (!factor) {
          return {
            success: false as const,
            error: 'Second factor required, but no supported method found.',
          };
        }

        await signIn.prepareSecondFactor({ strategy: 'email_code' });

        router.push({
          pathname: AUTH_LINKS.VERIFY_2FA,
          params: {
            strategy: 'email_code',
            identifier: (factor as any).safeIdentifier ?? data.email,
          },
        });

        return { success: false as const };
      }

      if (result.status === 'needs_first_factor') {
        router.push(AUTH_LINKS.VERIFY_SIGN_IN);
        return {
          success: false as const,
          error: 'Verification required to continue.',
        };
      }

      if (result.status === 'needs_new_password') {
        router.push(AUTH_LINKS.RESET_PASSWORD_REQUIRED);
        return { success: false as const, error: 'Password update required.' };
      }

      return {
        success: false as const,
        error: `Sign-in not complete: ${result.status}`,
      };
    } catch (error) {
      return {
        success: false as const,
        error: ClerkErrorParser.parseSignInError(error),
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isLoaded, isSubmitting, signIn: handleSignIn };
}
