import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { useEffect } from 'react';
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
      }).catch(() => {
        // Non-fatal: registration will be retried on next app launch
      });
    };

    register();
  }, [isSignedIn, getToken]);
}
