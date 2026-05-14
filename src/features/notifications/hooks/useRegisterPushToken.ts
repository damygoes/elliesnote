import { logger } from '@/services/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { notificationService } from '../services/notificationService';

export function useRegisterPushToken() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const register = async () => {
      const token = await notificationService.getExpoPushToken();
      if (!token) return;

      const authToken = await getToken();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me/push-token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expoPushToken: token,
          platform: Platform.OS,
          timezone,
        }),
      }).catch((error: Error) => {
        // Non-fatal: registration will be retried on next app launch
        logger.warn(
          'Failed to register push token',
          JSON.stringify({ error: error.message }),
        );
      });
    };

    register();
  }, [isSignedIn, getToken]);
}
