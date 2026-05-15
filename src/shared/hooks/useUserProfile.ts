import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
};

const CACHE_KEY = '@elliesnote/profile';

async function readCache(): Promise<Partial<UserProfile>> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Partial<UserProfile>) : {};
  } catch {
    return {};
  }
}

async function writeCache(data: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

export const useUserProfile = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;
  const userRef = useRef(user);
  userRef.current = user;

  // Option A: seed firstName/lastName from Clerk immediately — already in memory
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Option B: load username from AsyncStorage cache — nearly instant
      const cached = await readCache();
      if (!cancelled && cached.username !== undefined) {
        setProfile((prev) => ({ ...prev, username: cached.username! }));
      }

      // Background refresh: fetch full profile from API and update cache
      try {
        const token = await getTokenRef.current();
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok || cancelled) return;
        const json = await res.json();
        const fresh: UserProfile = {
          firstName: json.data.firstName ?? '',
          lastName: json.data.lastName ?? '',
          username: json.data.username ?? '',
        };
        if (!cancelled) {
          setProfile(fresh);
          writeCache(fresh);
        }
      } catch {}
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(
    async (updates: Partial<UserProfile>): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const token = await getTokenRef.current();
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to save');
        setProfile((prev) => {
          const next = { ...prev, ...updates };
          writeCache(next);
          return next;
        });
        // Sync firstName/lastName to Clerk so useUser() reflects the change everywhere
        if (updates.firstName !== undefined || updates.lastName !== undefined) {
          await userRef.current?.update({
            firstName: updates.firstName ?? userRef.current?.firstName ?? '',
            lastName: updates.lastName ?? userRef.current?.lastName ?? '',
          });
        }
        return true;
      } catch {
        setError('Could not save changes. Please try again.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return { profile, save, isSaving, error };
};
