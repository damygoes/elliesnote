import * as Sentry from '@sentry/react-native';

import type { LogTransport } from './logger';

export function initSentry(): void {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: __DEV__ ? 0 : 0.2,
    enabled: true,
  });
}

export function setSentryUser(userId: string): void {
  Sentry.setUser({ id: userId });
}

export function clearSentryUser(): void {
  Sentry.setUser(null);
}

export const sentryTransport: LogTransport = (level, tag, message, context) => {
  if (level === 'error') {
    const error = context instanceof Error ? context : new Error(message);
    Sentry.captureException(error, {
      extra: { tag, ...(!(context instanceof Error) && { context }) },
    });
  } else if (level === 'warn') {
    Sentry.captureMessage(`[${tag}] ${message}`, 'warning');
  }
};
