import { NativeModules, Platform } from 'react-native';
import type { HealthValue } from 'react-native-health';

import type { DailyHealthSnapshot } from '../types';

// react-native-health's index.js uses Object.assign({}, NativeModules.AppleHealthKit, ...)
// which drops prototype-based native methods under the new architecture.
// Access the native module directly to guarantee all methods are callable.

const HK: Record<string, any> =
  (NativeModules as Record<string, any>)['AppleHealthKit'] ?? {};

// ---------------------------------------------------------------------------
// Screenshot / demo mode
// Set EXPO_PUBLIC_SCREENSHOT_MODE=1 in .env.local before running on simulator
// to inject realistic-looking health data for App Store screenshots.
// ---------------------------------------------------------------------------
const SCREENSHOT_MODE = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === '1';

// DJB2-inspired hash — deterministic, varied output per date string.
function dateHash(seed: string): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) & 0xffff;
  }
  return Math.abs(h);
}

function mockSnapshot(date: string): DailyHealthSnapshot {
  // Four independent hashes so metrics don't correlate with each other.
  const h1 = dateHash(date);
  const h2 = dateHash(date + 'r');
  const h3 = dateHash(date + 'v');
  const h4 = dateHash(date + 's');
  return {
    date,
    sleepMinutes: 300 + (h1 % 240), // 5 h – 9 h
    restingHeartRate: 57 + (h2 % 14), // 57 – 70 bpm
    hrv: 22 + (h3 % 50), // 22 – 71 ms
    steps: 1800 + (h4 % 7000), // 1 800 – 8 800
  };
}

type DateWindow = { startDate: string; endDate: string };

const PERMISSIONS = {
  permissions: {
    read: [
      'SleepAnalysis',
      'RestingHeartRate',
      'HeartRateVariability',
      'StepCount',
    ],
    write: [] as string[],
  },
};

// Sleep window: prior evening (18:00) to midday (12:00) — captures overnight session
function sleepWindow(date: string): DateWindow {
  const d = new Date(`${date}T00:00:00`);
  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  prev.setHours(18, 0, 0, 0);
  const end = new Date(d);
  end.setHours(12, 0, 0, 0);
  return { startDate: prev.toISOString(), endDate: end.toISOString() };
}

function dayWindow(date: string): DateWindow {
  return {
    startDate: new Date(`${date}T00:00:00`).toISOString(),
    endDate: new Date(`${date}T23:59:59`).toISOString(),
  };
}

// The native module returns value as a string, not the HealthKit integer enum.
// iOS 16+ Apple Watch writes both an umbrella "ASLEEP" record and granular stage
// records ("CORE", "DEEP", "REM") covering the same period — summing all would
// double-count. Priority: stages → ASLEEP → INBED (last resort for apps that
// only record in-bed intervals).
function sumSleepMinutes(samples: HealthValue[]): number {
  const val = (s: HealthValue) => String(s.value);

  const stages = samples.filter((s) => {
    const v = val(s);
    return v === 'CORE' || v === 'DEEP' || v === 'REM';
  });
  const asleep = samples.filter((s) => val(s) === 'ASLEEP');
  const inBed = samples.filter((s) => val(s) === 'INBED');

  const toSum = stages.length > 0 ? stages : asleep.length > 0 ? asleep : inBed;

  let totalMs = 0;
  for (const s of toSum) {
    const ms = new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
    if (ms > 0) totalMs += ms;
  }
  return Math.round(totalMs / 60_000);
}

function averageValue(samples: HealthValue[]): number | null {
  if (samples.length === 0) return null;
  return samples.reduce((sum, s) => sum + s.value, 0) / samples.length;
}

function getSamples(method: string, opts: DateWindow): Promise<HealthValue[]> {
  return new Promise((resolve) => {
    if (typeof HK[method] !== 'function') return resolve([]);
    HK[method](opts, (err: unknown, results: unknown) => {
      if (err || !Array.isArray(results)) resolve([]);
      else resolve(results as HealthValue[]);
    });
  });
}

function getSingle(
  method: string,
  opts: DateWindow,
): Promise<HealthValue | null> {
  return new Promise((resolve) => {
    if (typeof HK[method] !== 'function') return resolve(null);
    HK[method](opts, (err: unknown, result: unknown) => {
      if (err || result == null) resolve(null);
      else resolve(result as HealthValue);
    });
  });
}

export function requestPermissions(): Promise<boolean> {
  if (SCREENSHOT_MODE) return Promise.resolve(true);
  if (Platform.OS !== 'ios') return Promise.resolve(false);
  if (typeof HK['initHealthKit'] !== 'function') return Promise.resolve(false);
  return new Promise((resolve) => {
    HK['initHealthKit'](PERMISSIONS, (error: unknown) => {
      resolve(!error);
    });
  });
}

const NULL_SNAPSHOT = (date: string): DailyHealthSnapshot => ({
  date,
  sleepMinutes: null,
  restingHeartRate: null,
  hrv: null,
  steps: null,
});

export async function fetchDailySnapshot(
  date: string,
): Promise<DailyHealthSnapshot> {
  if (SCREENSHOT_MODE) return mockSnapshot(date);
  if (Platform.OS !== 'ios') return NULL_SNAPSHOT(date);

  const [sleepSamples, restingHRSamples, hrvSamples, stepsResult] =
    await Promise.all([
      getSamples('getSleepSamples', sleepWindow(date)),
      getSamples('getRestingHeartRate', dayWindow(date)),
      getSamples('getHeartRateVariabilitySamples', dayWindow(date)),
      getSingle('getStepCount', dayWindow(date)),
    ]);

  return {
    date,
    sleepMinutes:
      sleepSamples.length > 0 ? sumSleepMinutes(sleepSamples) : null,
    restingHeartRate: restingHRSamples[0]?.value ?? null,
    hrv: averageValue(hrvSamples),
    steps: stepsResult?.value ?? null,
  };
}
