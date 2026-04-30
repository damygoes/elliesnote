import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function RequireAuth({ children }: Props) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  if (!isLoaded || !userLoaded) return null;

  if (!isSignedIn || !user) {
    return <Redirect href="/(public)" />;
  }

  const onboardingComplete =
    (user.publicMetadata?.onboardingComplete as boolean | undefined) ?? false;

  if (!onboardingComplete) {
    return <Redirect href="/(app)/onboarding" />;
  }

  return <>{children}</>;
}
