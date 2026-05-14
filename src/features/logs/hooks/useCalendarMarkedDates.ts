import { useMemo } from 'react';

import { useEntries } from '../store/useLogStore';
import { useMissingDays } from './useMissingDays';

export type DayMark = {
  isMissed?: boolean;
  entryCount?: number;
};

export type CalendarMarks = Record<string, DayMark>;

export const useCalendarMarkedDates = () => {
  const entries = useEntries();
  const missingDays = useMissingDays();

  const marks = useMemo<CalendarMarks>(() => {
    const result: CalendarMarks = {};

    for (const entry of entries) {
      const dateKey = entry.date.slice(0, 10);
      const existing = result[dateKey];
      result[dateKey] = {
        isMissed: existing?.isMissed,
        entryCount: (existing?.entryCount ?? 0) + 1,
      };
    }

    for (const date of missingDays) {
      const existing = result[date];
      result[date] = {
        isMissed: true,
        entryCount: existing?.entryCount,
      };
    }

    return result;
  }, [entries, missingDays]);

  return { marks };
};
