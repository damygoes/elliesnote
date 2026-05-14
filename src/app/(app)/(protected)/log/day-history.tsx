import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { Colors } from '@/shared/constants/theme';
import { DayHistoryScreen } from '@/features/logs/screens/DayHistoryScreen';

export default function DayHistoryRoute() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <DayHistoryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
