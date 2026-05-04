import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/constants/theme';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  if (!isLoaded || !userLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.light.primary} />
      </View>
    );
  }

  if (!isSignedIn || !user) {
    return <Redirect href="/(public)" />;
  }

  const onboardingComplete =
    (user.publicMetadata?.onboardingComplete as boolean | undefined) ?? false;

  if (!onboardingComplete) {
    return <Redirect href="/(app)/onboarding" />;
  }

  return <Redirect href="/(app)/(protected)/(tabs)/(home)/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background_primary,
  },
});
