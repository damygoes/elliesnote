import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';

import { checkInApiService } from '../services/checkInApiService';
import { logStorageService } from '../services/logStorageService';
import { useEntries, useLogStore } from '../store/useLogStore';

export const useLogs = () => {
  const entries = useEntries();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

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
        const fresh = await checkInApiService.fetchAll(getTokenRef.current);
        if (!active) return;
        useLogStore.setState({ entries: fresh });
        logStorageService.save(fresh);
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
