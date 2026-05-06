import { useUser } from '@clerk/clerk-expo';
import { userContext } from '@/services/userContext';
import { toDateString } from '@/shared/utils/date';
import { useLocalSearchParams } from 'expo-router';
import { LogEntryForm } from './LogEntryForm';

type Props = {
  onSave?: () => void;
};

export const LogEntryScreen = ({ onSave }: Props) => {
  const { date } = useLocalSearchParams();
  const { user } = useUser();
  const userId = userContext.getCurrentUserId();
  const selectedDate = typeof date === 'string' ? date : toDateString();

  return (
    <LogEntryForm
      userId={userId}
      selectedDate={selectedDate}
      firstName={user?.firstName ?? undefined}
      onSave={onSave}
    />
  );
};
