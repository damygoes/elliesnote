import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HistoryScreen } from '@/features/history/screens/HistoryScreen';
import { Colors } from '@/shared/constants/theme';

export default function HistoryTab() {
  return (
    <SafeAreaView style={styles.container}>
      <HistoryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
