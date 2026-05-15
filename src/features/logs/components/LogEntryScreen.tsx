import { useUserProfile } from '@/shared/hooks/useUserProfile';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/theme';
import { toDateString } from '@/shared/utils/date';
import { isIPad } from '@/shared/utils/isIPad';
import { useCalendarMarkedDates } from '../hooks/useCalendarMarkedDates';
import { useEntriesByDate } from '../store/useLogStore';
import { LogEntryForm } from './LogEntryForm';
import { LogFlashCalendar } from './LogFlashCalendar';

export const LogEntryScreen = () => {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const userId = user?.id;
  const [selectedDate, setSelectedDate] = useState(toDateString());

  const { marks } = useCalendarMarkedDates();
  const { isPremium } = usePremium();
  const dayEntries = useEntriesByDate(selectedDate);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <LogFlashCalendar
          selectedDate={selectedDate}
          marks={marks}
          onDayPress={setSelectedDate}
          isPremium={isPremium}
        />

        <View style={styles.divider} />

        <LogEntryForm
          noScroll
          userId={userId}
          selectedDate={selectedDate}
          firstName={profile.firstName || undefined}
        />
      </ScrollView>

      {dayEntries.length > 0 && (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() =>
            router.push({
              pathname: '/(app)/(protected)/log/day-history',
              params: { date: selectedDate },
            })
          }
        >
          <Text style={styles.fabText}>
            View {dayEntries.length}{' '}
            {dayEntries.length === 1 ? 'entry' : 'entries'} for this day
          </Text>
          <Text style={styles.fabArrow}>›</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
    padding: isIPad ? Spacing['5xl'] : undefined,
  },
  content: {
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.full,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.light.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.85,
  },
  fabText: {
    ...Typography.label,
    color: Colors.light.on_primary,
  },
  fabArrow: {
    fontSize: 20,
    color: Colors.light.on_primary,
    lineHeight: 22,
  },
});
