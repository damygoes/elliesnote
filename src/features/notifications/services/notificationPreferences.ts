import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { logger } from '@/services/logger';

const STORAGE_KEY = 'notifications:preferences';
const TAG = 'notificationPreferencesService';

// --- Schema ---

export const NotificationPreferencesSchema = z.object({
  morningHour: z.number().int().min(0).max(23),
  eveningHour: z.number().int().min(0).max(23),
});

export type NotificationPreferences = z.infer<
  typeof NotificationPreferencesSchema
>;

// --- Defaults ---

const DEFAULT_PREFERENCES: NotificationPreferences = {
  morningHour: 9,
  eveningHour: 20,
};

// --- Service ---

export const notificationPreferencesService = {
  load: async (): Promise<NotificationPreferences> => {
    let raw: string | null = null;
    try {
      raw = await AsyncStorage.getItem(STORAGE_KEY);
    } catch (e) {
      logger.warn(TAG, 'load: AsyncStorage.getItem failed', e);
      return DEFAULT_PREFERENCES;
    }

    if (!raw) return DEFAULT_PREFERENCES;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      logger.warn(TAG, 'load: JSON.parse failed', error);
      return DEFAULT_PREFERENCES;
    }

    const result = NotificationPreferencesSchema.safeParse(parsed);
    return result.success ? result.data : DEFAULT_PREFERENCES;
  },

  save: async (preferences: NotificationPreferences): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      logger.warn(TAG, 'save: AsyncStorage.setItem failed', e);
    }
  },
};
