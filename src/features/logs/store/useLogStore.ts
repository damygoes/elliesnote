import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

import type { LogEntry } from '../types/log-entry';

// --- Types ---

type LogState = {
  entries: LogEntry[];
};

type LogActions = {
  addEntry: (entry: LogEntry) => void;
  updateEntry: (entry: LogEntry) => void;
  deleteEntry: (id: string) => void;
  getEntryByDate: (date: string) => LogEntry | undefined;
};

// --- Store ---

export const useLogStore = create<LogState & LogActions>((set, get) => ({
  entries: [],

  addEntry: (entry) => set((state) => ({ entries: [...state.entries, entry] })),

  updateEntry: (entry) =>
    set((state) => ({
      entries: state.entries.map((e) => (e.id === entry.id ? entry : e)),
    })),

  deleteEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

  getEntryByDate: (date) => get().entries.find((e) => e.date === date),
}));

// --- Selectors ---

export const useEntries = () => useLogStore((state) => state.entries);

export const useLogActions = () =>
  useLogStore(
    useShallow((state) => ({
      addEntry: state.addEntry,
      updateEntry: state.updateEntry,
      deleteEntry: state.deleteEntry,
      getEntryByDate: state.getEntryByDate,
    })),
  );
