import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import {
  SERIES_CONFIG,
  SERIES_ORDER,
  type HealthSeriesKey,
  type SeriesKey,
} from '../constants/seriesConfig';
import type { HealthMetricSeries } from '../hooks/useInsightsData';

type Props = {
  activeSeries: Set<SeriesKey>;
  onToggle: (key: SeriesKey) => void;
  healthSeries: HealthMetricSeries;
  hasHealthPermission: boolean;
};

function hexWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function SeriesFilterPills({
  activeSeries,
  onToggle,
  healthSeries,
  hasHealthPermission,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {SERIES_ORDER.map((key) => {
        const config = SERIES_CONFIG[key];
        const active = activeSeries.has(key);
        const isHealthKey = key !== 'symptoms';
        const hasData =
          !isHealthKey ||
          (healthSeries[key as HealthSeriesKey]?.length ?? 0) > 0;

        // When Apple Health is connected but this specific metric has no data
        // (e.g. HRV on Garmin), hide the pill entirely rather than greying it out.
        // When Apple Health is not connected at all, keep health pills visible but
        // disabled so users know the feature exists.
        if (isHealthKey && hasHealthPermission && !hasData) return null;

        const disabled = isHealthKey && !hasHealthPermission;

        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.pill,
              active && {
                borderColor: config.color,
                backgroundColor: hexWithOpacity(config.color, 0.1),
              },
              disabled && styles.pillDisabled,
            ]}
            onPress={() => {
              if (!disabled) onToggle(key);
            }}
            activeOpacity={disabled ? 1 : 0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: active, disabled }}
            accessibilityLabel={config.label}
          >
            {active && (
              <View style={[styles.dot, { backgroundColor: config.color }]} />
            )}
            <Text
              style={[
                styles.label,
                active && { color: config.color, fontWeight: '600' },
              ]}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pillDisabled: {
    opacity: 0.35,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...Typography.caption,
    fontWeight: '500',
    color: Colors.light.text_secondary,
  },
});
