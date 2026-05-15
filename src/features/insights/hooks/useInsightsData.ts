import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useHealthPermissionStore } from '@/features/health/store';
import { getTzOffsetMinutes } from '@/shared/utils/tzOffset';
import {
  HEALTH_SERIES_KEYS,
  type HealthSeriesKey,
  type SeriesKey,
} from '../constants/seriesConfig';

export type DataPoint = {
  dayKey: string;
  dayIndex: number;
  energyLevel: number;
  symptoms: string[];
};

export type HealthMetricPoint = {
  dayKey: string;
  dayIndex: number;
  value: number;
};

export type HealthMetricSeries = Partial<
  Record<HealthSeriesKey, HealthMetricPoint[]>
>;

export type { HealthSeriesKey, SeriesKey };

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
  healthSeries: HealthMetricSeries;
};

export type Range = 7 | 14 | 30;

const cacheKey = (range: Range) => `@elliesnote/insights-v4-${range}`;

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

async function fetchHealthSeries(
  days: string[],
  token: string,
  base: string,
): Promise<HealthMetricSeries> {
  const hasPermission = useHealthPermissionStore.getState().hasPermission;
  if (!hasPermission || days.length === 0) return {};

  const from = days[0];
  const to = days[days.length - 1];
  const dayIndexMap = new Map(days.map((d, i) => [d, i]));
  const headers = { Authorization: `Bearer ${token}` };

  const results = await Promise.allSettled(
    HEALTH_SERIES_KEYS.map((metricType) =>
      fetch(
        `${base}/api/me/health-metrics?metricType=${metricType}&from=${from}&to=${to}&limit=200`,
        { headers },
      ).then((r) => (r.ok ? r.json() : null)),
    ),
  );

  const series: HealthMetricSeries = {};
  for (let i = 0; i < HEALTH_SERIES_KEYS.length; i++) {
    const key = HEALTH_SERIES_KEYS[i];
    const result = results[i];
    if (result.status !== 'fulfilled' || !result.value?.data) continue;

    const rows: { measuredAt: string; value: number }[] = result.value.data;
    // rows are desc by measuredAt — take first (latest) per UTC date
    const seen = new Set<string>();
    const points: HealthMetricPoint[] = [];

    for (const row of rows) {
      const dateStr = row.measuredAt.slice(0, 10);
      if (seen.has(dateStr)) continue;
      seen.add(dateStr);
      const dayIndex = dayIndexMap.get(dateStr);
      if (dayIndex === undefined) continue;
      points.push({ dayKey: dateStr, dayIndex, value: row.value });
    }

    if (points.length > 0) {
      series[key] = points.sort((a, b) => a.dayIndex - b.dayIndex);
    }
  }

  return series;
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
    healthSeries: {},
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
        setData({
          ...cached,
          insights: cached.insights ?? [],
          healthSeries: cached.healthSeries ?? {},
        });
        setIsLoading(false);
      }

      try {
        const token = await getTokenRef.current();
        if (!token || cancelled) return;

        const tz = getTzOffsetMinutes();
        const base = process.env.EXPO_PUBLIC_API_URL ?? '';
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

        const days: string[] = statsJson?.data?.days ?? [];
        const healthSeries = await fetchHealthSeries(days, token, base);

        if (cancelled) return;

        const fresh: InsightsData = {
          stats: statsJson?.data?.entries ?? [],
          days,
          streak: Number(streakJson?.data?.streakDays ?? 0),
          insights: insightJson?.data?.insights ?? [],
          healthSeries,
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
