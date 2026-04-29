import { useCallback, useEffect, useState } from 'react';

import {
  type NotificationPreferences,
  notificationPreferencesService,
} from '../services/notificationPreferences';

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);

  useEffect(() => {
    notificationPreferencesService.load().then(setPreferences);
  }, []);

  const updatePreferences = useCallback(
    async (next: NotificationPreferences) => {
      setPreferences(next);
      await notificationPreferencesService.save(next);
    },
    [],
  );

  return {
    preferences,
    updatePreferences,
    isLoading: !preferences,
  };
};
