import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';

import { requestPermissions } from '../services/healthKitService';
import { useHealthPermissionStore } from '../store';

const PERMISSION_KEY = '@elliesnote/health-permission';

export function useHealthPermission() {
  const hasPermission = useHealthPermissionStore((s) => s.hasPermission);
  const setHasPermission = useHealthPermissionStore((s) => s.setHasPermission);

  // Load from AsyncStorage once — skipped if another instance already loaded it
  useEffect(() => {
    if (hasPermission !== null) return;
    AsyncStorage.getItem(PERMISSION_KEY).then((stored) => {
      setHasPermission(stored === 'true');
    });
  }, [hasPermission, setHasPermission]);

  const request = useCallback(async () => {
    const granted = await requestPermissions();
    await AsyncStorage.setItem(PERMISSION_KEY, String(granted));
    setHasPermission(granted);
  }, [setHasPermission]);

  const disconnect = useCallback(async () => {
    await AsyncStorage.removeItem(PERMISSION_KEY);
    setHasPermission(false);
  }, [setHasPermission]);

  return { hasPermission, request, disconnect };
}
