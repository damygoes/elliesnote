import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';

import { checkInApiService } from '../services/checkInApiService';
import { logStorageService } from '../services/logStorageService';
import { useUpdateEntry, useLogStore } from '../store/useLogStore';
import type { LogEntry } from '../types/log-entry';

export const useUpdateLogEntry = () => {
  const applyUpdate = useUpdateEntry();
  const { getToken } = useAuth();
  const [isError, setIsError] = useState(false);

  const updateEntry = async (entry: LogEntry): Promise<void> => {
    setIsError(false);
    applyUpdate(entry);
    const nextEntries = useLogStore.getState().entries;
    const saved = await logStorageService.save(nextEntries);
    if (!saved) setIsError(true);

    checkInApiService.update(entry, getToken).catch(() => {});
  };

  return { updateEntry, isError };
};
