import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

function handleNotificationResponse(
  response: Notifications.NotificationResponse,
) {
  const url = response.notification.request.content.data?.url as
    | string
    | undefined;
  if (url) {
    router.push(url as never);
  }
}

export function useNotificationTapHandler() {
  useEffect(() => {
    // Handle tap while app is open or in background
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    // Handle tap that cold-launched the app
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) handleNotificationResponse(response);
    });

    return () => subscription.remove();
  }, []);
}
