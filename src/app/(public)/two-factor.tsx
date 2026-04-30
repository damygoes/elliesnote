import { TwoFactorAuthScreen } from '@/features/auth/screens/TwoFactorAuthScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TwoFactor() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TwoFactorAuthScreen />
    </SafeAreaView>
  );
}
