import { useMemo } from 'react';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { detectMissingDays } from '../domain/detectMissingDays';
import { useEntries } from '../store/useLogStore';

export const useMissingDays = () => {
  const entries = useEntries();
  const { isPremium } = usePremium();
  const windowDays = isPremium ? 30 : 7;

  return useMemo(
    () => detectMissingDays({ entries, windowDays }),
    [entries, windowDays],
  );
};
