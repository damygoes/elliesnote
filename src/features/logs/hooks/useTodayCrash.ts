import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ExpoCrypto from 'expo-crypto';
import { useMemo } from 'react';

import { toDateString } from '@/shared/utils/date';
import { crashApiService } from '../services/crashApiService';
import { crashStorageService } from '../services/crashStorageService';
import { useCrashStore } from '../store/useCrashStore';

export const useTodayCrash = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const crashDays = useCrashStore((state) => state.crashDays);
  const { addCrashDay, removeCrashDay } = useCrashStore();
  const today = toDateString();
  const userId = user?.id ?? '';

  const todayCrash = useMemo(
    () => crashDays.find((d) => d.date.slice(0, 10) === today) ?? null,
    [crashDays, today],
  );

  const logCrash = async () => {
    if (todayCrash) return;

    const optimistic = {
      id: ExpoCrypto.randomUUID(),
      userId,
      date: today,
      createdAt: Date.now(),
    };

    addCrashDay(optimistic);
    const next = useCrashStore.getState().crashDays;
    crashStorageService.save(next);

    try {
      const confirmed = await crashApiService.create(today, getToken);
      // Atomic replace: swap optimistic for server-confirmed in one update
      useCrashStore.setState((state) => ({
        crashDays: state.crashDays.map((d) =>
          d.id === optimistic.id ? confirmed : d,
        ),
      }));
      const updated = useCrashStore.getState().crashDays;
      crashStorageService.save(updated);
    } catch {
      // optimistic record stays; will sync on next app open
    }
  };

  const undoCrash = async () => {
    if (!todayCrash) return;

    removeCrashDay(todayCrash.id);
    const next = useCrashStore.getState().crashDays;
    crashStorageService.save(next);

    try {
      await crashApiService.remove(todayCrash.id, getToken);
    } catch {
      // local removal stands; will be reconciled on next API fetch
    }
  };

  return { todayCrash, logCrash, undoCrash };
};
