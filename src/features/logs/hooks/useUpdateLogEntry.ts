import { useState } from 'react';

import { logStorageService } from '../services/logStorageService';
import { useLogActions, useLogStore } from '../store/useLogStore';
import type { LogEntry } from '../types/log-entry';

export const useUpdateLogEntry = () => {
  const { updateEntry: applyUpdate } = useLogActions();
  const [isError, setIsError] = useState(false);

  const updateEntry = async (entry: LogEntry): Promise<void> => {
    setIsError(false);
    applyUpdate(entry);
    const nextEntries = useLogStore.getState().entries;
    const saved = await logStorageService.save(nextEntries);
    if (!saved) setIsError(true);
  };

  return { updateEntry, isError };
};
