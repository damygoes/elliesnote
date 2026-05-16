import type { DailyHealthSnapshot, HealthMetricType } from '../types';
import { fetchDailySnapshot } from './healthKitService';

type GetToken = () => Promise<string | null>;

type SyncItem = {
  metricType: HealthMetricType;
  value: number;
  measuredAt: string; // ISO timestamp (local midnight)
};

function snapshotToItems(snapshot: DailyHealthSnapshot): SyncItem[] {
  // Use UTC midnight so the stored date matches the local date key used for
  // querying and chart attribution — avoids off-by-one-day shifts for UTC+ users.
  const measuredAt = `${snapshot.date}T00:00:00.000Z`;
  const items: SyncItem[] = [];

  if (snapshot.sleepMinutes !== null)
    items.push({
      metricType: 'sleep_duration',
      value: snapshot.sleepMinutes,
      measuredAt,
    });
  if (snapshot.restingHeartRate !== null)
    items.push({
      metricType: 'resting_heart_rate',
      value: snapshot.restingHeartRate,
      measuredAt,
    });
  if (snapshot.hrv !== null)
    items.push({ metricType: 'hrv', value: snapshot.hrv, measuredAt });
  if (snapshot.steps !== null)
    items.push({ metricType: 'steps', value: snapshot.steps, measuredAt });

  return items;
}

export async function syncHealthDays(
  days: string[],
  getToken: GetToken,
): Promise<void> {
  const token = await getToken();
  if (!token) return;

  const snapshots = await Promise.all(days.map(fetchDailySnapshot));
  const items = snapshots.flatMap(snapshotToItems);
  if (items.length === 0) return;

  await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/health-metrics/sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ snapshots: items }),
  });
}
