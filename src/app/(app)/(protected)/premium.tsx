import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaywallScreen } from '@/features/subscription/components/PaywallScreen';
import { Colors } from '@/shared/constants/theme';

export default function PremiumModal() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <PaywallScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
