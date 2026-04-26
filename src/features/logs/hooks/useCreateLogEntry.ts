import { useState } from 'react';

import { logStorageService } from '../services/logStorageService';
import { useLogActions, useLogStore } from '../store/useLogStore';
import type { LogEntry } from '../types/log-entry';

export const useCreateLogEntry = () => {
  const { addEntry } = useLogActions();
  const [isError, setIsError] = useState(false);

  const createEntry = async (entry: LogEntry): Promise<void> => {
    setIsError(false);
    addEntry(entry);
    const nextEntries = useLogStore.getState().entries;
    const saved = await logStorageService.save(nextEntries);
    if (!saved) setIsError(true);
  };

  return { createEntry, isError };
};
