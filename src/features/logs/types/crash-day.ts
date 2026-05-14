import { z } from 'zod';

export const CrashDaySchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(), // 'YYYY-MM-DD'
  createdAt: z.number().int().positive(),
});

export type CrashDay = z.infer<typeof CrashDaySchema>;
