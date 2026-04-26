import { LogEntryForm } from './LogEntryForm';

type Props = {
  onSave?: () => void;
};

export const LogEntryScreen = ({ onSave }: Props) => (
  <LogEntryForm onSave={onSave} />
);
