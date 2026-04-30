import { SignInScreen } from '@/features/auth/screens/SignInScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignInScreen />
    </SafeAreaView>
  );
}
