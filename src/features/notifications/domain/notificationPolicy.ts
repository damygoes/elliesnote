export const shouldNotifyToday = (lastEntryDate?: string) => {
  const today = new Date().toISOString().slice(0, 10);

  // Always allow check-ins for now (MVP)
  if (!lastEntryDate) return true;

  // If user already logged today → still allow gentle reminder (configurable later)
  return lastEntryDate !== today;
};
