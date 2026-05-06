import { useAuth } from '@clerk/clerk-expo';
import { useRef, useState } from 'react';

import { checkInApiService } from '../services/checkInApiService';
import { logStorageService } from '../services/logStorageService';
import { useAddEntry, useLogStore } from '../store/useLogStore';
import type { LogEntry } from '../types/log-entry';

const SAVED_RESET_MS = 2000;

export const useCreateLogEntry = () => {
  const addEntry = useAddEntry();
  const { getToken } = useAuth();
  const [isError, setIsError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createEntry = async (entry: LogEntry): Promise<void> => {
    setIsError(false);
    setIsSaved(false);
    addEntry(entry);
    const nextEntries = useLogStore.getState().entries;
    const saved = await logStorageService.save(nextEntries);
    if (!saved) {
      setIsError(true);
      return;
    }
    setIsSaved(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setIsSaved(false), SAVED_RESET_MS);

    checkInApiService.create(entry, getToken).catch(() => {});
  };

  return { createEntry, isError, isSaved };
};
