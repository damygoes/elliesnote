import { Bar, CartesianChart } from 'victory-native';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import type { Range, StatsSeries } from '../hooks/useExploreData';

type Props = {
  series: StatsSeries[];
  range: Range;
  isLoading: boolean;
};

type ChartPoint = { x: number; value: number };

const DAY_ABBR = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

function getXLabel(dayKey: string, range: Range): string {
  const d = new Date(`${dayKey}T00:00:00`);
  if (range === 7) return DAY_ABBR[d.getDay()] ?? '';
  return String(d.getDate());
}

export const EnergyChart = ({ series, range, isLoading }: Props) => {
  if (isLoading) {
    return <View style={[styles.container, styles.skeleton]} />;
  }

  if (series.length === 0) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>No data yet</Text>
      </View>
    );
  }

  const hasData = series.some((s) => s.energyAvg !== null && s.energyAvg > 0);
  if (!hasData) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>No data yet</Text>
      </View>
    );
  }

  const chartData: ChartPoint[] = series.map((item, i) => ({
    x: i,
    value: item.energyAvg != null ? Number(item.energyAvg) : 0,
  }));

  const labels = series.map((item) => getXLabel(item.dayKey, range));
  const step = range === 30 ? 5 : 1;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['value']}
          domain={{ y: [0, 5] }}
          domainPadding={{ left: 12, right: 12 }}
          padding={{ top: 12, bottom: 0, left: 4, right: 4 }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.value}
              chartBounds={chartBounds}
              color={Colors.light.primary}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
              animate={{ type: 'spring', duration: 300 }}
            />
          )}
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
});
