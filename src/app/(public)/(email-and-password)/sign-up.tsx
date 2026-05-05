import { SignUpScreen } from '@/features/auth/screens/SignUpScreen';
import { Colors } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  return (
    <SafeAreaView style={styles.screen}>
      <SignUpScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
