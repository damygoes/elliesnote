import { useMemo } from 'react';

import { toDateString } from '@/shared/utils/date';
import { useEntries } from '../store/useLogStore';

export const useTodayEntries = () => {
  const entries = useEntries();
  const today = toDateString();

  return useMemo(
    () =>
      entries
        .filter((e) => e.date.slice(0, 10) === today)
        .sort((a, b) => b.createdAt - a.createdAt),
    [entries, today],
  );
};
