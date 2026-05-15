import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken';
import { useInitSubscription } from '@/features/subscription/hooks/useInitSubscription';
import { Colors } from '@/shared/constants/theme';
import { isIPad } from '@/shared/utils/isIPad';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  useRegisterPushToken();
  useInitSubscription();

  return (
    <RequireAuth>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.light.background_primary },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="premium"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings/profile"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.65],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="settings/reminders"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.65],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="settings/integrations"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.65],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="settings/delete-account"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [0.6] : [0.45],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="history/entry"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.75],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="today/edit"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.95],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="today/missing-days"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.65],
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="log/day-history"
          options={{
            presentation: 'formSheet',
            headerShown: false,
            sheetAllowedDetents: isIPad ? [1] : [0.75],
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </RequireAuth>
  );
}
