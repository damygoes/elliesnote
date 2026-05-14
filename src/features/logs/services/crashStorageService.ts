import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { logger } from '@/services/logger';
import { CrashDaySchema, type CrashDay } from '../types/crash-day';

const STORAGE_KEY = 'logs:crash-days';

const CrashDaysSchema = z.array(CrashDaySchema);

export const crashStorageService = {
  save: async (days: CrashDay[]): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(days));
      return true;
    } catch (error) {
      logger.warn(
        'crashStorageService.save',
        'Failed to save crash days',
        error,
      );
      return false;
    }
  },

  load: async (): Promise<CrashDay[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        logger.warn('crashStorageService.load', 'JSON parse failed', error);
        return [];
      }

      const result = CrashDaysSchema.safeParse(parsed);
      return result.success ? result.data : [];
    } catch (error) {
      logger.warn(
        'crashStorageService.load',
        'Failed to load crash days',
        error,
      );
      return [];
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logger.warn(
        'crashStorageService.clear',
        'Failed to clear crash days',
        error,
      );
    }
  },
};
