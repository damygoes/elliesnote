import { useMemo } from 'react';

import { userContext } from '@/services/userContext';
import { toDateString } from '@/shared/utils/date';
import { useEntries } from '../store/useLogStore';

export const useTodayEntries = () => {
  const entries = useEntries();
  const userId = userContext.getCurrentUserId();
  const today = toDateString();

  return useMemo(
    () =>
      entries
        .filter((e) => e.date.slice(0, 10) === today && e.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [entries, today, userId],
  );
};
