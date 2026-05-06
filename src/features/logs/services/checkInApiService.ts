import { userContext } from '@/services/userContext';
import { SYMPTOMS, type LogEntry, type Symptom } from '../types/log-entry';

type GetToken = () => Promise<string | null>;

type ApiRow = {
  id: string;
  checkInDate: string | null;
  energyLevel: number;
  symptoms: string[];
  notes: string | null;
  createdAt: string;
};

function mapRowToEntry(row: ApiRow): LogEntry {
  return {
    id: row.id,
    userId: userContext.getCurrentUserId(),
    date: row.checkInDate ? `${row.checkInDate}T00:00:00.000Z` : row.createdAt,
    energyLevel: row.energyLevel,
    symptoms: row.symptoms.filter((s): s is Symptom =>
      (SYMPTOMS as readonly string[]).includes(s),
    ),
    notes: row.notes ?? undefined,
    createdAt: new Date(row.createdAt).getTime(),
  };
}

export const checkInApiService = {
  async create(entry: LogEntry, getToken: GetToken): Promise<void> {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/check-ins`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          energyLevel: entry.energyLevel,
          symptoms: entry.symptoms,
          notes: entry.notes,
          checkInDate: entry.date.slice(0, 10),
          createdAt: new Date(entry.createdAt).toISOString(),
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Create failed: ${res.status} ${body}`);
    }
  },

  async update(entry: LogEntry, getToken: GetToken): Promise<void> {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/check-ins/${entry.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          energyLevel: entry.energyLevel,
          symptoms: entry.symptoms,
          notes: entry.notes,
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Update failed: ${res.status} ${body}`);
    }
  },

  async fetchAll(getToken: GetToken): Promise<LogEntry[]> {
    const token = await getToken();
    if (!token) return [];

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/check-ins?limit=50`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) return [];

    const json = await res.json();
    const rows: ApiRow[] = json?.data ?? [];
    return rows.map(mapRowToEntry);
  },
};
