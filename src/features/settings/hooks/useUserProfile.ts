import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
};

export const useUserProfile = () => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = await getTokenRef.current();
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled) {
          setProfile({
            firstName: json.data.firstName ?? '',
            lastName: json.data.lastName ?? '',
            username: json.data.username ?? '',
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (updates: Partial<UserProfile>) => {
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
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch {
      setError('Could not save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { profile, isLoading, save, isSaving, error };
};
