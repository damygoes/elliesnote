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
      const granted = await notificationService.requestPermissions();
      logger.info('PushToken', `Permission granted: ${granted}`);
      if (!granted) return;

      const token = await notificationService.getExpoPushToken();
      if (!token) {
        logger.warn(
          'PushToken',
          'getExpoPushToken returned null — token not registered',
        );
        return;
      }
      logger.info('PushToken', `Token obtained: ${token.slice(0, 40)}...`);

      const authToken = await getToken();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      logger.info('PushToken', `Registering with timezone: ${timezone}`);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/me/push-token`,
        {
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
        },
      ).catch((error: Error) => {
        // Non-fatal: registration will be retried on next app launch
        logger.warn(
          'PushToken',
          `Failed to register push token: ${error.message}`,
        );
        return null;
      });

      if (res) {
        logger.info('PushToken', `API response status: ${res.status}`);
      }
    };

    register();
  }, [isSignedIn, getToken]);
}
