import { useEffect } from 'react';

import { notificationPreferencesService } from '../services/notificationPreferences';
import { notificationService } from '../services/notificationService';

export const useNotificationSetup = () => {
  useEffect(() => {
    const init = async () => {
      const granted = await notificationService.requestPermissions();
      if (!granted) return;

      const preferences = await notificationPreferencesService.load();
      await notificationService.scheduleReminders(
        preferences.morningHour,
        preferences.eveningHour,
      );
    };

    init();
  }, []);
};
