import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotificationSetup = () => {
  useEffect(() => {
    const init = async () => {
      const granted = await notificationService.requestPermissions();

      if (!granted) return;

      await notificationService.scheduleDailyReminders();
    };

    init();
  }, []);
};
