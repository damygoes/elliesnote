import { ClerkProvider, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useNotificationTapHandler } from '@/features/notifications/hooks/useNotificationTapHandler';
import { initPurchases } from '@/features/subscription/services/purchasesService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logger } from '@/services/logger';
import {
  clearSentryUser,
  initSentry,
  sentryTransport,
  setSentryUser,
} from '@/services/sentry';

SplashScreen.preventAutoHideAsync();
initSentry();
logger.addTransport(sentryTransport);
initPurchases();

// Show notifications when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function SentryUserSync() {
  const { user } = useUser();
  useEffect(() => {
    if (user) setSentryUser(user.id);
    else clearSentryUser();
  }, [user, user?.id]);
  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useNotificationTapHandler();

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SentryUserSync />
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="dark" animated />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(public)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
