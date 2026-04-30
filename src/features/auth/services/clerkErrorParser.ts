import type { ClerkError } from '../types/auth';

export class ClerkErrorParser {
  static parse(error: unknown, fallback: string): string {
    if (!error || typeof error !== 'object') {
      return fallback;
    }

    const clerkError = error as ClerkError;

    return (
      clerkError.errors?.[0]?.longMessage ||
      clerkError.errors?.[0]?.message ||
      fallback
    );
  }

  static parseSignUpError(error: unknown): string {
    return this.parse(
      error,
      'Could not create your account. Please try again.',
    );
  }

  static parseSignInError(error: unknown): string {
    return this.parse(
      error,
      'We could not sign you in. Please check your details and try again.',
    );
  }

  static parseVerificationError(error: unknown): string {
    return this.parse(error, 'Invalid code. Please check it and try again.');
  }
}
