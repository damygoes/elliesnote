import { toDateString } from '@/shared/utils/date';

type DetectMissingDaysParams = {
  entries: { date: string }[];
  today?: string; // optional override for testing
};

export const detectMissingDays = ({
  entries,
  today,
}: DetectMissingDaysParams): string[] => {
  if (entries.length === 0) return [];

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const missingDays: string[] = [];

  const getDate = (d: string) => new Date(d);

  const format = toDateString;

  const addDays = (date: Date, days: number) => {
    const day = new Date(date);
    day.setDate(day.getDate() + days);
    return day;
  };

  const lastLoggedDate = getDate(sorted[sorted.length - 1].date);

  const currentDate = today ? getDate(today) : new Date();

  let cursor = addDays(lastLoggedDate, 1);

  while (format(cursor) < format(currentDate)) {
    missingDays.push(format(cursor));
    cursor = addDays(cursor, 1);
  }

  return missingDays;
};
