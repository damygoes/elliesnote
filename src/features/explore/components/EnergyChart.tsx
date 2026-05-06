import { Circle, Path, Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { CartesianChart } from 'victory-native';

import {
  ENERGY_COLORS,
  ENERGY_LEVELS,
  type EnergyLevel,
} from '@/features/logs/constants/energy';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { DataPoint, Range } from '../hooks/useExploreData';

type Props = {
  stats: DataPoint[];
  days: string[];
  range: Range;
  isLoading: boolean;
};

const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

function getXLabel(dayKey: string, range: Range): string {
  const d = new Date(`${dayKey}T00:00:00`);
  if (range === 7) return DAY_ABBR[d.getDay()] ?? '';
  return String(d.getDate());
}

function dotColor(energyLevel: number): string {
  return ENERGY_COLORS[energyLevel as EnergyLevel] ?? Colors.light.primary;
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

function TrendLine({ avgPoints }: { avgPoints: { x: number; y: number }[] }) {
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
      color={Colors.light.primary}
      opacity={0.35}
      start={0}
      end={progress}
    />
  );
}

export const EnergyChart = ({ stats, days, range, isLoading }: Props) => {
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
  const chartData = stats.map((p) => ({ x: p.dayIndex, y: p.energyLevel }));
  const labels = days.map((dayKey) => getXLabel(dayKey, range));
  const step = range === 30 ? 5 : 1;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['y']}
          domain={{ x: [-0.5, rangeDays - 0.5], y: [0, 5.5] }}
          padding={{ top: 12, bottom: 0, left: 4, right: 4 }}
        >
          {({ points }) => {
            const dayMap = new Map<
              number,
              { x: number; ySum: number; count: number }
            >();
            for (let i = 0; i < points.y.length; i++) {
              const pt = points.y[i];
              if (pt.x == null || pt.y == null) continue;
              const dayIdx = chartData[i]?.x ?? 0;
              const existing = dayMap.get(dayIdx);
              if (existing) {
                existing.ySum += pt.y;
                existing.count += 1;
              } else {
                dayMap.set(dayIdx, { x: pt.x, ySum: pt.y, count: 1 });
              }
            }

            const avgPoints = Array.from(dayMap.entries())
              .sort(([a], [b]) => a - b)
              .map(([, v]) => ({ x: v.x, y: v.ySum / v.count }));

            return (
              <>
                <TrendLine
                  key={`${stats.length}-${range}`}
                  avgPoints={avgPoints}
                />
                {points.y.map((point, i) => (
                  <Circle
                    key={i}
                    cx={point.x ?? 0}
                    cy={point.y ?? 0}
                    r={7}
                    color={dotColor(chartData[i]?.y ?? 1)}
                  />
                ))}
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
          <View style={styles.legendLineIcon} />
          <Text style={styles.legendLabel}>Daily avg.</Text>
        </View>
        <View style={styles.legendItem}>
          {ENERGY_LEVELS.map((lvl) => (
            <View
              key={lvl}
              style={[
                styles.legendDot,
                { backgroundColor: ENERGY_COLORS[lvl] },
              ]}
            />
          ))}
          <Text style={styles.legendLabel}>Energy</Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendLineIcon: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.light.primary,
    opacity: 0.5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...Typography.small,
    color: Colors.light.text_muted,
  },
});
