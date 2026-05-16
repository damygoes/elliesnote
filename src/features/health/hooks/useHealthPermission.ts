import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';

import { requestPermissions } from '../services/healthKitService';
import { useHealthPermissionStore } from '../store';

const SCREENSHOT_MODE = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === '1';

const permissionKey = (userId: string) =>
  `@elliesnote/health-permission/${userId}`;

export function useHealthPermission() {
  const { user } = useUser();
  const userId = user?.id;

  const hasPermission = useHealthPermissionStore((s) => s.hasPermission);
  const setHasPermission = useHealthPermissionStore((s) => s.setHasPermission);

  useEffect(() => {
    if (!userId) {
      setHasPermission(null);
      return;
    }
    if (SCREENSHOT_MODE) {
      setHasPermission(true);
      return;
    }
    if (hasPermission !== null) return;
    AsyncStorage.getItem(permissionKey(userId)).then((stored) => {
      setHasPermission(stored === 'true');
    });
  }, [userId, hasPermission, setHasPermission]);

  const request = useCallback(async () => {
    if (!userId) return;
    const granted = await requestPermissions();
    await AsyncStorage.setItem(permissionKey(userId), String(granted));
    setHasPermission(granted);
  }, [userId, setHasPermission]);

  const disconnect = useCallback(async () => {
    if (!userId) return;
    await AsyncStorage.removeItem(permissionKey(userId));
    setHasPermission(false);
  }, [userId, setHasPermission]);

  return { hasPermission, request, disconnect };
}
