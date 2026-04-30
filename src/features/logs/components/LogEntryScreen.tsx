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

  const userId = userContext.getCurrentUserId();

  const selectedDate = typeof date === 'string' ? date : toDateString();

  const entryForDate = useEntryByDate(selectedDate);
  const existingEntry =
    entryForDate?.userId === userId ? entryForDate : undefined;

  return (
    <LogEntryForm
      existingEntry={existingEntry}
      userId={userId}
      selectedDate={selectedDate}
      onSave={onSave}
    />
  );
};
