type DetectMissingDaysParams = {
  entries: { date: string }[];
  today?: string;
  windowDays?: number;
};

// Uses local date arithmetic — avoids UTC/toISOString timezone drift
const addDay = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const next = new Date(y, m - 1, d + 1);
  const ny = next.getFullYear();
  const nm = String(next.getMonth() + 1).padStart(2, '0');
  const nd = String(next.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
};

const localToday = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const detectMissingDays = ({
  entries,
  today,
  windowDays,
}: DetectMissingDaysParams): string[] => {
  if (entries.length === 0) return [];

  const loggedDates = new Set(entries.map((e) => e.date.slice(0, 10)));
  const sorted = [...loggedDates].sort();
  const firstDate = sorted[0];
  const todayStr = today ?? localToday();

  let windowStart: string | undefined;
  if (windowDays !== undefined) {
    const [ty, tm, td] = todayStr.split('-').map(Number);
    const d = new Date(ty, tm - 1, td - windowDays);
    windowStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const missing: string[] = [];
  let cursor = addDay(firstDate);

  while (cursor < todayStr) {
    if (!loggedDates.has(cursor) && (!windowStart || cursor >= windowStart)) {
      missing.push(cursor);
    }
    cursor = addDay(cursor);
  }

  return missing;
};
