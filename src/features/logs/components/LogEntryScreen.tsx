import { useUser } from '@clerk/clerk-expo';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { usePremium } from '@/features/subscription/hooks/usePremium';
import { Colors, Spacing } from '@/shared/constants/theme';
import { toDateString } from '@/shared/utils/date';
import { useCalendarMarkedDates } from '../hooks/useCalendarMarkedDates';
import { LogFlashCalendar } from './LogFlashCalendar';
import { LogEntryForm } from './LogEntryForm';

export const LogEntryScreen = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [selectedDate, setSelectedDate] = useState(toDateString());

  const { marks } = useCalendarMarkedDates();
  const { isPremium } = usePremium();

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
          firstName={user?.firstName ?? undefined}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  content: {
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: Spacing.xl,
  },
});
