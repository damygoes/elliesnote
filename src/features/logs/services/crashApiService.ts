import { CrashDaySchema, type CrashDay } from '../types/crash-day';

type GetToken = () => Promise<string | null>;

type ApiRow = {
  id: string;
  userId?: string;
  user_id?: string;
  date: string;
  createdAt?: string;
  created_at?: string;
};

function mapRowToCrashDay(row: ApiRow): CrashDay {
  const rawTs = row.createdAt ?? row.created_at ?? '';
  // Normalize PostgreSQL timestamp ("2026-05-14 18:36:26+00") to ISO 8601
  const normalized = rawTs.replace(' ', 'T').replace(/\+(\d{2})$/, '+$1:00');
  const createdAt = Date.parse(normalized);
  return {
    id: row.id,
    userId: row.userId ?? row.user_id ?? '',
    date: row.date.slice(0, 10),
    createdAt: isNaN(createdAt) ? Date.now() : createdAt,
  };
}

export const crashApiService = {
  async create(date: string, getToken: GetToken): Promise<CrashDay> {
    const token = await getToken();
    if (!token) throw new Error('No auth token');

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/crash-days`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Create crash day failed: ${res.status} ${body}`);
    }

    const json = await res.json();
    const row: ApiRow = json?.data ?? json;
    const parsed = CrashDaySchema.safeParse(mapRowToCrashDay(row));
    if (!parsed.success) throw new Error('Invalid crash day response');
    return parsed.data;
  },

  async remove(id: string, getToken: GetToken): Promise<void> {
    const token = await getToken();
    if (!token) throw new Error('No auth token');

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/crash-days/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Delete crash day failed: ${res.status} ${body}`);
    }
  },

  async fetchAll(getToken: GetToken): Promise<CrashDay[]> {
    const token = await getToken();
    if (!token) return [];

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/crash-days`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) return [];

    const json = await res.json();
    const rows: ApiRow[] = json?.data ?? [];
    return rows.map(mapRowToCrashDay);
  },
};
