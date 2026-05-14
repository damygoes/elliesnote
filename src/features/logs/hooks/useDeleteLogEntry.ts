import { useAuth } from '@clerk/clerk-expo';

import { logger } from '@/services/logger';
import { checkInApiService } from '../services/checkInApiService';
import { logStorageService } from '../services/logStorageService';
import { useDeleteEntry, useLogStore } from '../store/useLogStore';
import type { LogEntry } from '../types/log-entry';

export const useDeleteLogEntry = () => {
  const deleteEntry = useDeleteEntry();
  const { getToken } = useAuth();

  return async (entry: LogEntry): Promise<void> => {
    deleteEntry(entry.id);
    const next = useLogStore.getState().entries;
    logStorageService.save(next);

    checkInApiService.delete(entry.id, getToken).catch((error: Error) => {
      logger.warn(
        'Failed to delete log entry: ',
        JSON.stringify({ error: error.message }),
      );
    });
  };
};
