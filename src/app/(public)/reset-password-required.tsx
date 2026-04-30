import { ResetPasswordRequiredScreen } from '@/features/auth/screens/ResetPasswordRequiredScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordRequired() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ResetPasswordRequiredScreen />;
    </SafeAreaView>
  );
}
