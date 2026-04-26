import { useMemo } from 'react';

import { userContext } from '@/services/userContext';
import { useEntries } from '../store/useLogStore';

export const useTodayEntry = () => {
  const entries = useEntries();
  const userId = userContext.getCurrentUserId();
  const today = new Date().toISOString().slice(0, 10);

  return useMemo(
    () =>
      entries.find(
        (entry) => entry.date.slice(0, 10) === today && entry.userId === userId,
      ),
    [entries, today, userId],
  );
};
