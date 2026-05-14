import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getTzOffsetMinutes } from '@/shared/utils/tzOffset';

export type DataPoint = {
  dayKey: string;
  dayIndex: number;
  energyLevel: number;
};

export type InsightType =
  | 'summary'
  | 'energy_trend'
  | 'symptom'
  | 'day_of_week'
  | 'sleep'
  | 'activity'
  | 'hrv';

export type InsightItem = {
  type: InsightType;
  title: string;
  body: string;
  sampleCount: number;
};

export type InsightsData = {
  stats: DataPoint[];
  days: string[];
  streak: number;
  insights: InsightItem[];
};

export type Range = 7 | 14 | 30;

const cacheKey = (range: Range) => `@elliesnote/insights-v3-${range}`;

async function readCache(range: Range): Promise<InsightsData | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(range));
    return raw ? (JSON.parse(raw) as InsightsData) : null;
  } catch {
    return null;
  }
}

async function writeCache(range: Range, data: InsightsData): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(range), JSON.stringify(data));
  } catch {}
}

export const useInsightsData = (range: Range) => {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const [data, setData] = useState<InsightsData>({
    stats: [],
    days: [],
    streak: 0,
    insights: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);

      const cached = await readCache(range);
      if (!cancelled && cached) {
        setData({ ...cached, insights: cached.insights ?? [] });
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
            `${base}/api/check-ins/stats?range=${range}&tzOffsetMinutes=${tz}`,
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

        const fresh: InsightsData = {
          stats: statsJson?.data?.entries ?? [],
          days: statsJson?.data?.days ?? [],
          streak: Number(streakJson?.data?.streakDays ?? 0),
          insights: insightJson?.data?.insights ?? [],
        };

        setData(fresh);
        writeCache(range, fresh);
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [range, refreshKey]);

  return { ...data, isLoading, hasError, refresh };
};
