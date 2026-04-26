import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TodayScreen } from '@/features/logs/screens/TodayScreen';
import { Colors } from '@/shared/constants/theme';

export default function TodayTab() {
  return (
    <SafeAreaView style={styles.container}>
      <TodayScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
