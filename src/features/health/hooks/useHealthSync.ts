import { logger } from '@/services/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { syncHealthDays } from '../services/healthSyncService';
import { useHealthPermission } from './useHealthPermission';

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
        .catch((error: Error) => {
          logger.warn(
            'Failed to sync health days: ',
            JSON.stringify({ error: error.message }),
          );
        })
        .finally(() => {
          syncingRef.current = false;
          setIsSyncing(false);
        });
    }, [hasPermission]),
  );

  return { isSyncing };
}
