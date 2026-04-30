import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AUTH_LINKS } from '../constants/links';
import { ClerkErrorParser } from '../services/clerkErrorParser';
import type { EmailPasswordInput, VerificationCodeInput } from '../types/auth';

export function useSignUpFlow() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (data: EmailPasswordInput) => {
    if (!isLoaded || !signUp) {
      throw new Error('Clerk is not loaded');
    }

    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: ClerkErrorParser.parseSignUpError(error),
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (data: VerificationCodeInput) => {
    if (!isLoaded || !signUp) {
      throw new Error('Clerk is not loaded');
    }

    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return { success: true };
      }

      return {
        success: false,
        error:
          'Verification needs an additional step. Please try again or request a new code.',
      };
    } catch (error) {
      return {
        success: false,
        error: ClerkErrorParser.parseVerificationError(error),
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoaded,
    isSubmitting,
    pendingVerification,
    signUp: handleSignUp,
    verifyEmail: handleVerification,
  };
}
