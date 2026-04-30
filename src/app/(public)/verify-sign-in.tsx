import { VerifySignInScreen } from '@/features/auth/screens/VerifySignInScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifySignIn() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VerifySignInScreen />
    </SafeAreaView>
  );
}
