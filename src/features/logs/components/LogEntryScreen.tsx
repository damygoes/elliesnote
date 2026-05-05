import { useUser } from '@clerk/clerk-expo';
import { userContext } from '@/services/userContext';
import { toDateString } from '@/shared/utils/date';
import { useLocalSearchParams } from 'expo-router';
import { useEntryByDate } from '../store/useLogStore';
import { LogEntryForm } from './LogEntryForm';

type Props = {
  onSave?: () => void;
};

export const LogEntryScreen = ({ onSave }: Props) => {
  const { date } = useLocalSearchParams();
  const { user } = useUser();

  const userId = userContext.getCurrentUserId();

  const hasDateParam = typeof date === 'string';
  const selectedDate = hasDateParam ? date : toDateString();

  const entryForDate = useEntryByDate(selectedDate);
  const existingEntry =
    hasDateParam && entryForDate?.userId === userId ? entryForDate : undefined;

  return (
    <LogEntryForm
      existingEntry={existingEntry}
      userId={userId}
      selectedDate={selectedDate}
      firstName={user?.firstName ?? undefined}
      onSave={onSave}
    />
  );
};
