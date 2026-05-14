import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SheetHeader } from '@/shared/components/SheetHeader';
import { Colors } from '@/shared/constants/theme';
import { LogEntryForm } from '../components/LogEntryForm';
import { useLogStore } from '../store/useLogStore';

export const EditTodayEntrySheet = () => {
  const { id, date } = useLocalSearchParams<{ id?: string; date?: string }>();
  const { user } = useUser();
  const userId = user?.id;

  const entry = useLogStore((state) =>
    id ? state.entries.find((e) => e.id === id) : undefined,
  );

  if (id && !entry) return null;

  const isBackfill = !id && !!date;
  const title = isBackfill ? 'Fill in missed day' : 'Edit Entry';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SheetHeader title={title} />
      <LogEntryForm
        existingEntry={entry}
        userId={userId}
        selectedDate={isBackfill ? date : entry?.date.slice(0, 10)}
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
