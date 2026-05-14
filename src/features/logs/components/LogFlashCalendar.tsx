import {
  fromDateId,
  toDateId,
  useCalendar,
  type CalendarDayMetadata,
} from '@marceloterreiro/flash-calendar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { toDateString } from '@/shared/utils/date';
import type { CalendarMarks, DayMark } from '../hooks/useCalendarMarkedDates';

const DAY_SIZE = 40;

type Props = {
  selectedDate: string;
  marks: CalendarMarks;
  onDayPress: (dateId: string) => void;
  isPremium: boolean;
};

type DayCellProps = {
  day: CalendarDayMetadata;
  mark?: DayMark;
  onPress: (id: string) => void;
};

const DayCell = ({ day, mark, onPress }: DayCellProps) => {
  if (day.isDifferentMonth) {
    return <View style={styles.emptyCell} />;
  }

  const isSelected = day.state === 'active';
  const isDisabled = day.state === 'disabled';
  const isMissed = mark?.isMissed ?? false;
  const entryCount = mark?.entryCount ?? 0;
  const hasEntries = entryCount > 0;

  return (
    <Pressable
      onPress={() => onPress(day.id)}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.dayCell,
        isSelected && styles.dayCellSelected,
        !isSelected && hasEntries && styles.dayCellHasEntries,
        !isSelected && !hasEntries && isMissed && styles.dayCellMissed,
        pressed && !isDisabled && styles.dayCellPressed,
      ]}
    >
      <Text
        style={[
          styles.dayText,
          isDisabled && styles.dayTextDisabled,
          day.isToday && !isSelected && styles.dayTextToday,
          isSelected && styles.dayTextSelected,
          !isSelected && hasEntries && styles.dayTextHasEntries,
        ]}
      >
        {day.displayLabel}
      </Text>

      {hasEntries && (
        <View style={[styles.badge, isSelected && styles.badgeOnSelected]}>
          <Text
            style={[styles.badgeText, isSelected && styles.badgeTextOnSelected]}
          >
            {entryCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export const LogFlashCalendar = ({
  selectedDate,
  marks,
  onDayPress,
  isPremium,
}: Props) => {
  const today = toDateString();
  const [currentMonthId, setCurrentMonthId] = useState(selectedDate);

  // Sync displayed month when selectedDate moves to a different month externally.
  // Functional update avoids adding currentMonthId to deps (which would cause the
  // month navigation to snap back on every navigation attempt).
  useEffect(() => {
    setCurrentMonthId((prev) => {
      if (selectedDate.slice(0, 7) !== prev.slice(0, 7)) return selectedDate;
      return prev;
    });
  }, [selectedDate]);

  const { calendarRowMonth, weeksList, weekDaysList } = useCalendar({
    calendarMonthId: currentMonthId,
    calendarMaxDateId: today,
    calendarActiveDateRanges: [{ startId: selectedDate, endId: selectedDate }],
    calendarFirstDayOfWeek: 'monday',
  });

  const isCurrentMonth = currentMonthId.slice(0, 7) >= today.slice(0, 7);

  const goToPrevMonth = () => {
    const d = fromDateId(currentMonthId);
    setCurrentMonthId(toDateId(new Date(d.getFullYear(), d.getMonth() - 1, 1)));
  };

  const goToNextMonth = () => {
    const d = fromDateId(currentMonthId);
    setCurrentMonthId(toDateId(new Date(d.getFullYear(), d.getMonth() + 1, 1)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        {isPremium ? (
          <Pressable
            onPress={goToPrevMonth}
            hitSlop={12}
            style={styles.navButton}
          >
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push('/(app)/(protected)/premium')}
            hitSlop={12}
            style={styles.navButton}
          >
            <Text style={styles.navArrowLocked}>🔒</Text>
          </Pressable>
        )}

        <Text style={styles.monthTitle}>{calendarRowMonth}</Text>

        {isCurrentMonth ? (
          <View style={styles.navButton} />
        ) : (
          <Pressable
            onPress={goToNextMonth}
            hitSlop={12}
            style={styles.navButton}
          >
            <Text style={styles.navArrow}>›</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.weekDaysRow}>
        {weekDaysList.map((day, i) => (
          <Text key={i} style={styles.weekDayName}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeksList.map((week, index) => (
          <View key={index} style={styles.weekRow}>
            {week.map((day) => (
              <DayCell
                key={day.id}
                day={day}
                mark={marks[day.id]}
                onPress={onDayPress}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.legendSwatchLogged]} />
          <Text style={styles.legendLabel}>Logged</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.legendSwatchMissed]} />
          <Text style={styles.legendLabel}>Missed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, styles.legendSwatchToday]} />
          <Text style={styles.legendLabel}>Today</Text>
        </View>
      </View>

      {!isPremium && (
        <Pressable
          onPress={() => router.push('/(app)/(protected)/premium')}
          style={styles.upgradeNudge}
        >
          <Text style={styles.upgradeNudgeText}>
            Missed days limited to 7 days · Upgrade ›
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: {
    ...Typography.label,
    color: Colors.light.text_primary,
  },
  navButton: {
    width: 32,
    alignItems: 'center',
  },
  navArrow: {
    fontSize: 24,
    lineHeight: 26,
    color: Colors.light.primary,
    fontWeight: '400',
  },
  navArrowLocked: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
  },
  weekDayName: {
    flex: 1,
    textAlign: 'center',
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  grid: {
    gap: Spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  emptyCell: {
    flex: 1,
    height: DAY_SIZE,
  },
  dayCell: {
    flex: 1,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  dayCellSelected: {
    backgroundColor: Colors.light.primary,
  },
  dayCellHasEntries: {
    backgroundColor: Colors.light.primary_soft,
  },
  dayCellMissed: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  dayCellPressed: {
    backgroundColor: Colors.light.border,
  },
  dayText: {
    ...Typography.body,
    color: Colors.light.text_primary,
  },
  dayTextDisabled: {
    color: Colors.light.text_secondary,
  },
  dayTextToday: {
    color: Colors.light.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  dayTextSelected: {
    color: Colors.light.on_primary,
    fontWeight: '700',
  },
  dayTextHasEntries: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    minWidth: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeOnSelected: {
    backgroundColor: Colors.light.on_primary,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.light.on_primary,
  },
  badgeTextOnSelected: {
    color: Colors.light.primary,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
  },
  legendSwatchLogged: {
    backgroundColor: Colors.light.primary_soft,
    borderColor: Colors.light.primary,
  },
  legendSwatchMissed: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  legendSwatchToday: {
    backgroundColor: Colors.light.primary,
  },
  legendLabel: {
    ...Typography.small,
    color: Colors.light.text_secondary,
  },
  upgradeNudge: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  upgradeNudgeText: {
    ...Typography.small,
    color: Colors.light.primary,
    textAlign: 'center',
  },
});
