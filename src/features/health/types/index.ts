export type HealthMetricType =
  | 'sleep_duration'
  | 'resting_heart_rate'
  | 'hrv'
  | 'steps';

export type DailyHealthSnapshot = {
  date: string; // 'YYYY-MM-DD'
  sleepMinutes: number | null;
  restingHeartRate: number | null;
  hrv: number | null;
  steps: number | null;
};
