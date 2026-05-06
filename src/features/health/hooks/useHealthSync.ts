import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { useHealthPermission } from './useHealthPermission';
import { syncHealthDays } from '../services/healthSyncService';

export function useHealthSync(days: string[]) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const daysRef = useRef(days);
  daysRef.current = days;

  const { hasPermission } = useHealthPermission();
  const [isSyncing, setIsSyncing] = useState(false);
  const syncingRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (
        hasPermission !== true ||
        daysRef.current.length === 0 ||
        syncingRef.current
      )
        return;

      syncingRef.current = true;
      setIsSyncing(true);

      syncHealthDays(daysRef.current, () => getTokenRef.current())
        .catch(() => {})
        .finally(() => {
          syncingRef.current = false;
          setIsSyncing(false);
        });
    }, [hasPermission]),
  );

  return { isSyncing };
}
