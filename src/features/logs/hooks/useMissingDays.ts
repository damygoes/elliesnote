import { useMemo } from 'react';

import { userContext } from '@/services/userContext';
import { detectMissingDays } from '../domain/detectMissingDays';
import { useEntries } from '../store/useLogStore';

export const useMissingDays = () => {
  const entries = useEntries();
  const userId = userContext.getCurrentUserId();

  const userEntries = useMemo(() => {
    return entries.filter((e) => e.userId === userId);
  }, [entries, userId]);

  const missingDays = useMemo(() => {
    return detectMissingDays({ entries: userEntries });
  }, [userEntries]);

  return missingDays;
};
