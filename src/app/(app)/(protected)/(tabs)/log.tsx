import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogEntryScreen } from '@/features/logs/components/LogEntryScreen';
import { Colors } from '@/shared/constants/theme';

export default function LogTab() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LogEntryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
