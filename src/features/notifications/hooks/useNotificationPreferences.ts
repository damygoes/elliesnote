import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

export type NotificationPreferences = {
  enabled: boolean;
  morningMinute: number;
  eveningMinute: number;
};

const CACHE_KEY = '@elliesnote/notification-preferences';

async function readCache(): Promise<NotificationPreferences | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as NotificationPreferences) : null;
  } catch {
    return null;
  }
}

async function writeCache(data: NotificationPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export const useNotificationPreferences = () => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Show cached preferences immediately — nearly instant
      const cached = await readCache();
      if (!cancelled && cached) {
        setPreferences(cached);
        setIsLoading(false);
      }

      // Background refresh from API
      try {
        const token = await getTokenRef.current();
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/me/notification-settings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok || cancelled) return;
        const json = await res.json();
        if (!cancelled) {
          setPreferences(json.data);
          writeCache(json.data);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const updatePreferences = useCallback(
    async (next: Partial<NotificationPreferences>) => {
      // Optimistic update + cache in one step
      setPreferences((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...next };
        writeCache(updated);
        return updated;
      });
      const token = await getTokenRef.current();
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/me/notification-settings`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(next),
        },
      );
    },
    [],
  );

  return { preferences, updatePreferences, isLoading };
};
