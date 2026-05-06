import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SheetHeader } from '@/shared/components/SheetHeader';
import { userContext } from '@/services/userContext';
import { Colors } from '@/shared/constants/theme';
import { LogEntryForm } from '../components/LogEntryForm';
import { useLogStore } from '../store/useLogStore';

export const EditTodayEntrySheet = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const userId = userContext.getCurrentUserId();

  const entry = useLogStore((state) => state.entries.find((e) => e.id === id));

  if (!entry || entry.userId !== userId) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title="Edit Entry" />
      <LogEntryForm
        existingEntry={entry}
        userId={userId}
        selectedDate={entry.date.slice(0, 10)}
        firstName={user?.firstName ?? undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
