import { Circle, Line, Path, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { CartesianChart } from 'victory-native';

import {
  ENERGY_COLORS,
  type EnergyLevel,
} from '@/features/logs/constants/energy';
import type { CrashDay } from '@/features/logs/types/crash-day';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import {
  HEALTH_SERIES_KEYS,
  SERIES_CONFIG,
  type HealthSeriesKey,
  type SeriesKey,
} from '../constants/seriesConfig';
import type {
  DataPoint,
  HealthMetricSeries,
  Range,
} from '../hooks/useInsightsData';
import { normalizeSeries } from '../utils/normalizeSeries';

type ChartDatum = {
  x: number;
  y: number;
  hrv?: number;
  sleep_duration?: number;
  resting_heart_rate?: number;
  steps?: number;
};

type Props = {
  stats: DataPoint[];
  days: string[];
  range: Range;
  isLoading: boolean;
  activeSeries: Set<SeriesKey>;
  healthSeries: HealthMetricSeries;
  crashDays: CrashDay[];
};

const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

function getXLabel(dayKey: string, range: Range): string {
  const d = new Date(`${dayKey}T00:00:00`);
  if (range === 7) return DAY_ABBR[d.getDay()] ?? '';
  return String(d.getDate());
}

function dotColor(energyLevel: number): string {
  return (
    ENERGY_COLORS[Math.round(energyLevel) as EnergyLevel] ??
    Colors.light.primary
  );
}

function buildSmoothPath(pts: { x: number; y: number }[]) {
  const path = Skia.Path.Make();
  if (pts.length < 2) return path;
  path.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const cpx = (p0.x + p1.x) / 2;
    path.cubicTo(cpx, p0.y, cpx, p1.y, p1.x, p1.y);
  }
  return path;
}

function TrendLine({
  avgPoints,
  color,
  opacity = 0.35,
}: {
  avgPoints: { x: number; y: number }[];
  color: string;
  opacity?: number;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  if (avgPoints.length < 2) return null;
  return (
    <Path
      path={buildSmoothPath(avgPoints)}
      style="stroke"
      strokeWidth={1.5}
      strokeJoin="round"
      strokeCap="round"
      color={color}
      opacity={opacity}
      start={0}
      end={progress}
    />
  );
}

function MetricLine({
  skiaPoints,
  color,
}: {
  skiaPoints: { x: number | null | undefined; y: number | null | undefined }[];
  color: string;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const validPts = skiaPoints.filter(
    (p): p is { x: number; y: number } => p.x != null && p.y != null,
  );
  if (validPts.length < 2) return null;

  return (
    <Path
      path={buildSmoothPath(validPts)}
      style="stroke"
      strokeWidth={1.5}
      strokeJoin="round"
      strokeCap="round"
      color={color}
      opacity={0.6}
      start={0}
      end={progress}
    />
  );
}

export const TrendChart = ({
  stats,
  days,
  range,
  isLoading,
  activeSeries,
  healthSeries,
  crashDays,
}: Props) => {
  if (isLoading) {
    return <View style={[styles.container, styles.skeleton]} />;
  }

  if (stats.length === 0) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>No data yet</Text>
      </View>
    );
  }

  const rangeDays = days.length;

  // --- Normalized health series (data-space → [0, 5.5] chart domain) ---
  const normalizedHealth: Partial<
    Record<HealthSeriesKey, Map<number, number>>
  > = {};
  for (const key of HEALTH_SERIES_KEYS) {
    const points = healthSeries[key];
    if (!points || points.length === 0) continue;
    const normalized = normalizeSeries(points.map((p) => p.value));
    const norm = new Map<number, number>();
    for (let i = 0; i < points.length; i++) {
      norm.set(points[i].dayIndex, normalized[i]! * 5);
    }
    normalizedHealth[key] = norm;
  }

  // Active health keys that have data for this period
  const activeHealthKeys = HEALTH_SERIES_KEYS.filter(
    (key) => activeSeries.has(key) && (normalizedHealth[key]?.size ?? 0) > 0,
  );

  // --- Per-day energy averages ---
  const dayEnergyMap = new Map<string, { sum: number; count: number }>();
  for (const entry of stats) {
    const existing = dayEnergyMap.get(entry.dayKey);
    if (existing) {
      existing.sum += entry.energyLevel;
      existing.count++;
    } else {
      dayEnergyMap.set(entry.dayKey, { sum: entry.energyLevel, count: 1 });
    }
  }

  // --- Chart data (one row per day) ---
  const chartData: ChartDatum[] = days.map((dayKey, dayIndex) => {
    const dayEnergy = dayEnergyMap.get(dayKey);
    const energyAvg = dayEnergy ? dayEnergy.sum / dayEnergy.count : 0;

    return {
      x: dayIndex,
      y: energyAvg,
      hrv: normalizedHealth.hrv?.get(dayIndex),
      sleep_duration: normalizedHealth.sleep_duration?.get(dayIndex),
      resting_heart_rate: normalizedHealth.resting_heart_rate?.get(dayIndex),
      steps: normalizedHealth.steps?.get(dayIndex),
    };
  });

  // --- Crash day markers ---
  const crashDaySet = new Set(crashDays.map((d) => d.date));
  const crashDayIndices = days
    .map((dayKey, idx) => ({ dayKey, idx }))
    .filter(({ dayKey }) => crashDaySet.has(dayKey))
    .map(({ idx }) => idx);

  const hasCrashInRange = crashDayIndices.length > 0;

  const yKeys: (keyof ChartDatum)[] = ['y', ...activeHealthKeys];
  const labels = days.map((dayKey) => getXLabel(dayKey, range));
  const step = range === 30 ? 5 : 1;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CartesianChart<ChartDatum, 'x', keyof ChartDatum>
          data={chartData}
          xKey="x"
          yKeys={yKeys}
          domain={{ x: [-0.5, rangeDays - 0.5], y: [0, 5.5] }}
          padding={{ top: 12, bottom: 0, left: 4, right: 4 }}
        >
          {({ points, chartBounds }) => {
            // Energy trend line uses pixel-space averages (same pattern as before)
            const pixelDayMap = new Map<
              number,
              { x: number; ySum: number; count: number }
            >();
            for (let i = 0; i < points.y.length; i++) {
              const pt = points.y[i];
              if (pt.x == null || pt.y == null) continue;
              const dayIdx = chartData[i]?.x ?? 0;
              const yVal = chartData[i]?.y ?? 0;
              if (yVal === 0) continue; // skip no-data days
              const existing = pixelDayMap.get(dayIdx);
              if (existing) {
                existing.ySum += pt.y;
                existing.count++;
              } else {
                pixelDayMap.set(dayIdx, { x: pt.x, ySum: pt.y, count: 1 });
              }
            }
            const avgEnergyPoints = Array.from(pixelDayMap.entries())
              .sort(([a], [b]) => a - b)
              .map(([, v]) => ({ x: v.x, y: v.ySum / v.count }));

            return (
              <>
                {/* Energy trend line — always on */}
                <TrendLine
                  key={`energy-${stats.length}-${range}`}
                  avgPoints={avgEnergyPoints}
                  color={Colors.light.primary}
                  opacity={0.35}
                />

                {/* Health metric lines */}
                {activeHealthKeys.map((key) => (
                  <MetricLine
                    key={key}
                    skiaPoints={(points as any)[key] ?? []}
                    color={SERIES_CONFIG[key].color}
                  />
                ))}

                {/* Energy dots — one per day, only when data exists */}
                {points.y.map((point: any, i: number) => {
                  const yVal = chartData[i]?.y ?? 0;
                  if (yVal === 0 || point.x == null || point.y == null)
                    return null;
                  return (
                    <Circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r={4}
                      color={dotColor(yVal)}
                    />
                  );
                })}

                {/* Crash day vertical markers — always shown */}
                {crashDayIndices.map((dayIdx) => {
                  const x =
                    chartBounds.left +
                    ((dayIdx + 0.5) / rangeDays) *
                      (chartBounds.right - chartBounds.left);
                  return (
                    <Line
                      key={dayIdx}
                      p1={{ x, y: chartBounds.top }}
                      p2={{ x, y: chartBounds.bottom }}
                      color="#C97B6A"
                      strokeWidth={1}
                      opacity={0.4}
                    />
                  );
                })}
              </>
            );
          }}
        </CartesianChart>
      </View>

      <View style={styles.xAxis}>
        {labels.map((label, i) => (
          <Text
            key={i}
            style={[styles.xLabel, i % step !== 0 && styles.hidden]}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendLine,
              { backgroundColor: Colors.light.primary, opacity: 0.5 },
            ]}
          />
          <Text style={styles.legendLabel}>Energy</Text>
        </View>
        {activeHealthKeys.map((key) => (
          <View key={key} style={styles.legendItem}>
            <View
              style={[
                styles.legendLine,
                { backgroundColor: SERIES_CONFIG[key].color },
              ]}
            />
            <Text style={styles.legendLabel}>{SERIES_CONFIG[key].label}</Text>
          </View>
        ))}
        {hasCrashInRange && (
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendLine,
                { backgroundColor: '#C97B6A', opacity: 0.6 },
              ]}
            />
            <Text style={styles.legendLabel}>Crash</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  container: {
    height: 180,
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  skeleton: {
    opacity: 0.4,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.light.text_muted,
  },
  xAxis: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
  },
  xLabel: {
    flex: 1,
    textAlign: 'center',
    ...Typography.small,
    color: Colors.light.text_muted,
  },
  hidden: {
    opacity: 0,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  legendLabel: {
    ...Typography.small,
    color: Colors.light.text_muted,
  },
});
