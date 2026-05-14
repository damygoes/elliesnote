import { useAuth, useUser } from '@clerk/clerk-expo';
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
    () =>
      crashDays.find((d) => d.date === today && d.userId === userId) ?? null,
    [crashDays, today, userId],
  );

  const logCrash = async () => {
    if (todayCrash) return;

    const optimistic = {
      id: crypto.randomUUID(),
      userId,
      date: today,
      createdAt: Date.now(),
    };

    addCrashDay(optimistic);
    const next = useCrashStore.getState().crashDays;
    crashStorageService.save(next);

    try {
      const confirmed = await crashApiService.create(today, getToken);
      // Replace optimistic record with server-confirmed one
      removeCrashDay(optimistic.id);
      addCrashDay(confirmed);
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
