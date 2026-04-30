import { logger } from '@/services/logger';
import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AUTH_LINKS } from '../constants/links';
import { parseSSOError } from '../services/parseSSOError';

export type OAuthProvider = 'oauth_google';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const redirectUrl = AuthSession.makeRedirectUri({
  scheme: 'elliesnote',
  path: 'sso-callback',
});

export function useOAuthFlow(provider: OAuthProvider) {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleOAuth = async () => {
    setIsLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: provider,
        redirectUrl: redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace(AUTH_LINKS.HOME);
        return { success: true };
      }

      return {
        success: false,
        error: 'Authentication was cancelled or incomplete.',
      };
    } catch (error) {
      logger.error(`${provider} SSO error:`, error as string);

      return {
        success: false,
        error: parseSSOError(
          error as Error,
          'OAuth authentication failed. Please try again.',
        ),
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    startOAuth: handleOAuth,
  };
}
