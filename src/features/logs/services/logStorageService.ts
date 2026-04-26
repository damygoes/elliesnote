import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { logger } from '@/services/logger';
import { LogEntrySchema, type LogEntry } from '../types/log-entry';

const STORAGE_KEY = 'logs:entries';

const LogEntriesSchema = z.array(LogEntrySchema);

export const logStorageService = {
  save: async (entries: LogEntry[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      logger.warn('logStorageService.save', 'Failed to save entries', error);
    }
  },

  load: async (): Promise<LogEntry[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        logger.warn('logStorageService.load', 'JSON parse failed', error);
        return [];
      }

      const result = LogEntriesSchema.safeParse(parsed);
      return result.success ? result.data : [];
    } catch (error) {
      logger.warn('logStorageService.load', 'Failed to load entries', error);
      return [];
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logger.warn('logStorageService.clear', 'Failed to clear entries', error);
    }
  },
};
