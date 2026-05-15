export const SERIES_CONFIG = {
  hrv: { label: 'HRV', color: '#6B8FAB', unit: 'ms' },
  sleep_duration: { label: 'Sleep', color: '#7A6B9E', unit: 'h' },
  resting_heart_rate: { label: 'Resting HR', color: '#9E6B6B', unit: 'bpm' },
  steps: { label: 'Steps', color: '#6B9E7A', unit: 'k' },
  symptoms: { label: 'Symptoms', color: '#A0785A', unit: '' },
} as const;

export const HEALTH_SERIES_KEYS = [
  'hrv',
  'sleep_duration',
  'resting_heart_rate',
  'steps',
] as const;

export type HealthSeriesKey = (typeof HEALTH_SERIES_KEYS)[number];
export type SeriesKey = HealthSeriesKey | 'symptoms';

export const SERIES_ORDER: SeriesKey[] = [
  'symptoms',
  'hrv',
  'sleep_duration',
  'resting_heart_rate',
  'steps',
];
