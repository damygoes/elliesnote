import { toDateString } from '@/shared/utils/date';

export const shouldNotifyToday = (lastEntryDate?: string) => {
  const today = toDateString();

  // Always allow check-ins for now (MVP)
  if (!lastEntryDate) return true;

  // If user already logged today → still allow gentle reminder (configurable later)
  return lastEntryDate !== today;
};
