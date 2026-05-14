import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';

import { checkInApiService } from '../services/checkInApiService';
import { logStorageService } from '../services/logStorageService';
import { useEntries, useLogStore } from '../store/useLogStore';

export const useLogs = () => {
  const entries = useEntries();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;

  useEffect(() => {
    let active = true;

    async function load() {
      // Seed from local cache immediately so UI isn't blank
      const cached = await logStorageService.load();
      if (!active) return;
      if (cached.length > 0) {
        useLogStore.setState({ entries: cached });
        setIsLoading(false);
      }

      // Refresh from API and update cache
      try {
        const fresh = await checkInApiService.fetchAll(
          getTokenRef.current,
          userIdRef.current ?? '',
        );
        if (!active) return;
        // Preserve locally-added entries whose date isn't in the server response
        // yet (the fire-and-forget POST may still be in-flight).
        const serverDates = new Set(fresh.map((e) => e.date.slice(0, 10)));
        const pending = useLogStore
          .getState()
          .entries.filter((e) => !serverDates.has(e.date.slice(0, 10)));
        const merged = [...fresh, ...pending];
        useLogStore.setState({ entries: merged });
        logStorageService.save(merged);
      } catch {
        // keep cached data on network failure
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { entries, isLoading };
};
