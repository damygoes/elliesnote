import { create } from 'zustand';

import type { LogEntry } from '../types/log-entry';

// --- Types ---

type LogState = {
  entries: LogEntry[];
};

type LogActions = {
  addEntry: (entry: LogEntry) => void;
  updateEntry: (entry: LogEntry) => void;
  deleteEntry: (id: string) => void;
};

// --- Store ---

export const useLogStore = create<LogState & LogActions>((set) => ({
  entries: [],

  addEntry: (entry) =>
    set((state) => {
      const existingIndex = state.entries.findIndex(
        (e) => e.date === entry.date,
      );

      if (existingIndex !== -1) {
        // overwrite existing entry for that date
        const updated = [...state.entries];
        updated[existingIndex] = entry;
        return { entries: updated };
      }

      return { entries: [...state.entries, entry] };
    }),

  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
}));

// --- Selectors ---

export const useEntries = () => useLogStore((state) => state.entries);

export const useAddEntry = () => useLogStore((state) => state.addEntry);
export const useUpdateEntry = () => useLogStore((state) => state.updateEntry);
export const useDeleteEntry = () => useLogStore((state) => state.deleteEntry);

export const useEntryByDate = (date: string) =>
  useLogStore((state) => state.entries.find((entry) => entry.date === date));
