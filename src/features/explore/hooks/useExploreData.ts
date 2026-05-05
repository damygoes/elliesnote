import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef, useState } from 'react';

import { getTzOffsetMinutes } from '@/shared/utils/tzOffset';

export type StatsSeries = {
  dayKey: string; // "YYYY-MM-DD"
  energyAvg: number | null;
};

export type ExploreData = {
  stats: StatsSeries[];
  streak: number;
  insight: string | null;
};

export type Range = 7 | 14 | 30;

const cacheKey = (range: Range) => `@elliesnote/explore-${range}`;

async function readCache(range: Range): Promise<ExploreData | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(range));
    return raw ? (JSON.parse(raw) as ExploreData) : null;
  } catch {
    return null;
  }
}

async function writeCache(range: Range, data: ExploreData): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(range), JSON.stringify(data));
  } catch {}
}

export const useExploreData = (range: Range) => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [data, setData] = useState<ExploreData>({
    stats: [],
    streak: 0,
    insight: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);

      const cached = await readCache(range);
      if (!cancelled && cached) {
        setData(cached);
        setIsLoading(false);
      }

      try {
        const token = await getTokenRef.current();
        if (!token || cancelled) return;

        const tz = getTzOffsetMinutes();
        const base = process.env.EXPO_PUBLIC_API_URL;
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, streakRes, insightRes] = await Promise.all([
          fetch(
            `${base}/api/check-ins/stats?range=${range}&bucket=day&tzOffsetMinutes=${tz}`,
            { headers },
          ),
          fetch(`${base}/api/check-ins/streak?tzOffsetMinutes=${tz}`, {
            headers,
          }),
          fetch(
            `${base}/api/check-ins/insight?rangeDays=${range}&tzOffsetMinutes=${tz}`,
            { headers },
          ),
        ]);

        if (cancelled) return;

        if (!statsRes.ok || !streakRes.ok) {
          if (!cancelled) setHasError(true);
          return;
        }

        const [statsJson, streakJson, insightJson] = await Promise.all([
          statsRes.json(),
          streakRes.json(),
          insightRes.ok ? insightRes.json() : null,
        ]);

        if (cancelled) return;

        // PostgreSQL AVG() returns numeric as a string through the pg driver —
        // normalize to number so the chart receives the correct type.
        const rawSeries: {
          dayKey: string;
          energyAvg: string | number | null;
        }[] = statsJson?.data?.series ?? [];

        const fresh: ExploreData = {
          stats: rawSeries.map((s) => ({
            dayKey: s.dayKey,
            energyAvg: s.energyAvg != null ? Number(s.energyAvg) : null,
          })),
          streak: Number(streakJson?.data?.streakDays ?? 0),
          insight: insightJson?.data?.message ?? null,
        };

        setData(fresh);
        writeCache(range, fresh);
      } catch (err) {
        console.log('[explore] fetch error:', err);
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [range]);

  return { ...data, isLoading, hasError };
};
