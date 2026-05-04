import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async getExpoPushToken(): Promise<string | null> {
    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      const result = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      return result.data;
    } catch {
      return null;
    }
  },
};
