import { logger } from '@/services/logger';
import { useSignInWithApple } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform } from 'react-native';
import { AUTH_LINKS } from '../constants/links';
import { parseSSOError } from '../services/parseSSOError';

export function useAppleOAuthFlow() {
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const startOAuth = async () => {
    if (Platform.OS !== 'ios') {
      return {
        success: false,
        error: 'Apple Sign-In is only available on iOS.',
      };
    }

    setIsLoading(true);

    try {
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return { success: true };
      }

      return {
        success: false,
        error: 'Authentication was cancelled or incomplete.',
      };
    } catch (error: any) {
      if (error?.code === 'ERR_REQUEST_CANCELED') {
        return { success: false };
      }

      logger.error('Apple SSO error:', error);

      return {
        success: false,
        error: parseSSOError(
          error,
          'Apple authentication failed. Please try again.',
        ),
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, startOAuth };
}
