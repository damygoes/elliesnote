import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExploreScreen } from '@/features/explore/screens/ExploreScreen';
import { Colors } from '@/shared/constants/theme';

export default function ExploreTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ExploreScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
});
