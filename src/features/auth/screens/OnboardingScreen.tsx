import { Button } from '@/shared/components/ui/Button';
import { APP_INFO } from '@/shared/constants/appInfo';
import { Colors, Typography } from '@/shared/constants/theme';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AUTH_LINKS } from '../constants/links';

export function OnboardingScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{APP_INFO.NAME}</Text>
          <Text style={styles.subtitle}>
            Welcome! You&apos;re all set to start tracking your energy and
            symptoms with gentle daily check-ins.
          </Text>
        </View>

        <Button
          variant="primary"
          onPress={() => router.replace(AUTH_LINKS.HOME)}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background_primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.light.text_primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.text_muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
