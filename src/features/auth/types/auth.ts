import { z } from 'zod';

export type AuthFlowStep = 'credentials' | 'verification' | 'complete';

export interface ClerkError {
  errors?: {
    message: string;
    longMessage?: string;
    code?: string;
  }[];
}

export const emailPasswordSchema = z.object({
  email: z.email('Please enter a valid email').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = z.object({
  email: z.email('Please enter a valid email').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 6, 'Code must be 6 digits'),
});

export type EmailPasswordInput = z.infer<typeof emailPasswordSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type VerificationCodeInput = z.infer<typeof verificationCodeSchema>;
