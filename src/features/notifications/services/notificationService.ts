import * as Notifications from 'expo-notifications';

const MORNING_HOUR = 9;
const EVENING_HOUR = 20;

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleDailyReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'How are you feeling today?',
        body: "Quick check-in when you're ready.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: MORNING_HOUR,
        minute: 0,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening check-in',
        body: 'Want to log how today went?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: EVENING_HOUR,
        minute: 0,
        repeats: true,
      },
    });
  },

  async rescheduleWithCustomTimes(morningHour: number, eveningHour: number) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning check-in',
        body: 'How are you feeling today?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: morningHour,
        minute: 0,
        repeats: true,
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening check-in',
        body: 'Want to reflect on today?',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: eveningHour,
        minute: 0,
        repeats: true,
      },
    });
  },
};
