import { Verify2FAScreen } from '@/features/auth/screens/Verify2FAScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Verify2FA() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Verify2FAScreen />
    </SafeAreaView>
  );
}
