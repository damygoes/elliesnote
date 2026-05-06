import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

const CACHE_KEY = '@elliesnote/history-entries';

export type HistoryEntry = {
  id: string;
  checkInDate: string | null;
  createdAt: string;
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const cursorRef = useRef<string | null>(null);

  const fetchPage = useCallback(async (cursor: string | null) => {
    const token = await getTokenRef.current();
    if (!token) return null;

    const url = new URL(
      `${process.env.EXPO_PUBLIC_API_URL}/api/check-ins/recent`,
    );
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const data: HistoryEntry[] = json?.data ?? [];
    const meta: { hasMore: boolean; nextCursor: string | null } =
      json?.meta ?? { hasMore: false, nextCursor: null };

    cursorRef.current = meta.nextCursor;
    setHasMore(meta.hasMore);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    cursorRef.current = null;

    const init = async () => {
      setIsLoading(true);

      const cached = await readCache();
      if (!cancelled && cached.length > 0) {
        setEntries(cached);
        setIsLoading(false);
      }

      try {
        const fresh = await fetchPage(null);
        if (!cancelled && fresh) {
          setEntries(fresh);
          writeCache(fresh);
        }
      } catch {
        // keep cached data on failure
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, fetchPage]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !cursorRef.current) return;
    setIsLoadingMore(true);
    try {
      const more = await fetchPage(cursorRef.current);
      if (more) {
        setEntries((prev) => {
          const next = [...prev, ...more];
          writeCache(next);
          return next;
        });
      }
    } catch {
      // ignore — user can retry by scrolling again
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, fetchPage]);

  return { entries, isLoading, isLoadingMore, hasMore, loadMore, refresh };
};
