import { create } from 'zustand';

import type { CrashDay } from '../types/crash-day';

type CrashState = {
  crashDays: CrashDay[];
};

type CrashActions = {
  addCrashDay: (day: CrashDay) => void;
  removeCrashDay: (id: string) => void;
  setCrashDays: (days: CrashDay[]) => void;
};

export const useCrashStore = create<CrashState & CrashActions>((set) => ({
  crashDays: [],

  addCrashDay: (day) =>
    set((state) => ({ crashDays: [...state.crashDays, day] })),

  removeCrashDay: (id) =>
    set((state) => ({
      crashDays: state.crashDays.filter((d) => d.id !== id),
    })),

  setCrashDays: (days) => set({ crashDays: days }),
}));

export const useCrashDays = () => useCrashStore((state) => state.crashDays);

export const useCrashDaysByDate = (date: string) =>
  useCrashStore((state) => state.crashDays.filter((d) => d.date === date));
