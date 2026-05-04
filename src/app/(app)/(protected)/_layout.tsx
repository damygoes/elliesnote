import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { useRegisterPushToken } from '@/features/notifications/hooks/useRegisterPushToken';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  useRegisterPushToken();

  return (
    <RequireAuth>
      <Stack screenOptions={{ headerShown: false }} />
    </RequireAuth>
  );
}
