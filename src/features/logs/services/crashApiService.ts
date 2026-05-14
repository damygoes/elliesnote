import { CrashDaySchema, type CrashDay } from '../types/crash-day';

type GetToken = () => Promise<string | null>;

type ApiRow = {
  id: string;
  userId: string;
  date: string;
  createdAt: string;
};

function mapRowToCrashDay(row: ApiRow): CrashDay {
  return {
    id: row.id,
    userId: row.userId,
    date: row.date,
    createdAt: new Date(row.createdAt).getTime(),
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
    const parsed = CrashDaySchema.safeParse(mapRowToCrashDay(json));
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
