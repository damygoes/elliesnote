import { Colors } from '@/shared/constants/theme';
import { StyleSheet, View } from 'react-native';
import { AuthLandingContent } from '../components/AuthLandingContent';
import { InfiniteScrollHeader } from '../components/InfiniteScrollHeader';

export function AuthScreen() {
  return (
    <View style={styles.container}>
      <InfiniteScrollHeader />
      <AuthLandingContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: Colors.light.primary_soft,
  },
});
