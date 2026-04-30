import { SignUpScreen } from '@/features/auth/screens/SignUpScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SignUpScreen />
    </SafeAreaView>
  );
}
