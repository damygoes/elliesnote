import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';

import { crashApiService } from '../services/crashApiService';
import { crashStorageService } from '../services/crashStorageService';
import { useCrashStore } from '../store/useCrashStore';

export const useCrashDays = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    let active = true;

    async function load() {
      const cached = await crashStorageService.load();
      if (!active) return;
      if (cached.length > 0) {
        useCrashStore.setState({ crashDays: cached });
        setIsLoading(false);
      }

      const fetchStartedAt = Date.now();
      try {
        const fresh = await crashApiService.fetchAll(getTokenRef.current);
        if (!active) return;
        const serverDates = new Set(fresh.map((d) => d.date));
        // Only keep local records added AFTER this fetch began — those are genuine
        // in-flight optimistics. Anything older is superseded by the server response
        // (including records deleted from the server since the last sync).
        const pending = useCrashStore
          .getState()
          .crashDays.filter(
            (d) => d.createdAt > fetchStartedAt && !serverDates.has(d.date),
          );
        const merged = [...fresh, ...pending];
        useCrashStore.setState({ crashDays: merged });
        crashStorageService.save(merged);
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

  return { isLoading };
};
