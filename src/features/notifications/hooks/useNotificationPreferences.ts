import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

export type NotificationPreferences = {
  enabled: boolean;
  morningMinute: number;
  eveningMinute: number;
};

export const useNotificationPreferences = () => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = await getTokenRef.current();
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/me/notification-settings`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) setPreferences(json.data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []); // fetch once on mount; getToken is accessed via ref to stay current

  const updatePreferences = useCallback(
    async (next: Partial<NotificationPreferences>) => {
      setPreferences((prev) => (prev ? { ...prev, ...next } : null));
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
