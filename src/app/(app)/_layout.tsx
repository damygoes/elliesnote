import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <RequireAuth>
      <Stack screenOptions={{ headerShown: false }} />
    </RequireAuth>
  );
}
