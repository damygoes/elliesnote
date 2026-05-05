import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';

const CACHE_KEY = '@elliesnote/history-entries';

export type HistoryEntry = {
  id: string;
  checkInDate: string | null;
  createdAt: string; // ISO timestamp
  energyLevel: number;
  symptoms: string[];
  notes: string | null;
};

async function readCache(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeCache(entries: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entries));
  } catch {}
}

export const useHistoryEntries = () => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const cached = await readCache();
      if (!cancelled && cached.length > 0) {
        setEntries(cached);
        setIsLoading(false);
      }

      try {
        const token = await getTokenRef.current();
        if (!token || cancelled) return;

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/check-ins/recent?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!res.ok || cancelled) return;

        const json = await res.json();
        const fresh: HistoryEntry[] = json?.data ?? [];

        if (!cancelled) {
          setEntries(fresh);
          writeCache(fresh);
        }
      } catch {
        // keep cached data on network failure
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { entries, isLoading };
};
