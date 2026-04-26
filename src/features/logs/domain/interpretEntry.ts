import type { LogEntry } from '../types/log-entry';

export const interpretEntry = (entry: LogEntry): string => {
  if (entry.energyLevel <= 2) {
    return 'Today seems like a low-energy day. Take things slowly.';
  }

  if (entry.energyLevel === 3) {
    return 'Energy looks moderate today. Pace yourself.';
  }

  return 'You seem to have a bit more energy today. Be mindful not to overdo it.';
};
