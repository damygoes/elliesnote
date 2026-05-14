import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InsightsScreen } from '@/features/insights/screens/InsightsScreen';
import { Colors } from '@/shared/constants/theme';

export default function InsightsTab() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <InsightsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
