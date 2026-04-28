export const NOTIFICATION_TYPES = [
  'morning_check_in',
  'evening_check_in',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
