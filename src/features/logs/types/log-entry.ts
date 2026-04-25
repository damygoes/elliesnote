import { z } from 'zod';

// --- Symptom constants ---

export const SYMPTOMS = [
  'fatigue',
  'brain_fog',
  'headache',
  'muscle_pain',
  'joint_pain',
  'sleep_disturbance',
  'dizziness',
  'nausea',
] as const;

export type Symptom = (typeof SYMPTOMS)[number];

// --- Schema ---

export const LogEntrySchema = z.object({
  id: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  energyLevel: z.number().int().min(1).max(5),
  symptoms: z.array(z.enum(SYMPTOMS)).min(1),
  notes: z.string().trim().optional(),
  createdAt: z.number().int().positive(), // timestamp (ms)
});

// --- Type ---

export type LogEntry = z.infer<typeof LogEntrySchema>;
