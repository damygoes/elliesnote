import { logger } from '@/services/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { syncHealthDays } from '../services/healthSyncService';
import { useHealthPermission } from './useHealthPermission';

export function useHealthSync(days: string[]) {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const daysRef = useRef(days);
  daysRef.current = days;

  const { hasPermission } = useHealthPermission();
  const hasPermissionRef = useRef(hasPermission);
  hasPermissionRef.current = hasPermission;

  const [isSyncing, setIsSyncing] = useState(false);
  const syncingRef = useRef(false);
  const lastSyncedDaysKeyRef = useRef('');
  const isFocusedRef = useRef(false);

  // Stored in a ref so the .finally() callback always calls the latest version
  // without needing it as a useCallback dependency.
  const runSyncRef = useRef<() => void>(() => {});
  runSyncRef.current = () => {
    const currentDays = daysRef.current;
    const currentKey = currentDays.join(',');
    if (
      !isFocusedRef.current ||
      hasPermissionRef.current !== true ||
      currentDays.length === 0 ||
      syncingRef.current ||
      lastSyncedDaysKeyRef.current === currentKey
    )
      return;

    lastSyncedDaysKeyRef.current = currentKey;
    syncingRef.current = true;
    setIsSyncing(true);

    syncHealthDays(currentDays, () => getTokenRef.current())
      .catch((error: Error) => {
        logger.warn(
          'Failed to sync health days: ',
          JSON.stringify({ error: error.message }),
        );
      })
      .finally(() => {
        syncingRef.current = false;
        setIsSyncing(false);
        // Re-check in case days changed while this sync was running
        runSyncRef.current();
      });
  };

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true;
      runSyncRef.current();
      return () => {
        isFocusedRef.current = false;
        // Reset so the next visit always re-syncs the current range
        lastSyncedDaysKeyRef.current = '';
      };
    }, []),
  );

  // Also sync when days changes while the screen is already focused.
  // This handles the case where the fresh API response arrives after
  // useFocusEffect already fired with stale cached days.
  useEffect(() => {
    runSyncRef.current();
  }, [days]);

  return { isSyncing };
}
