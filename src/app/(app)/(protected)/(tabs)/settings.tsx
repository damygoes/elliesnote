import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import { Colors } from '@/shared/constants/theme';

export default function SettingsTab() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
