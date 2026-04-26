export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogTransport = (
  level: LogLevel,
  tag: string,
  message: string,
  context?: unknown,
) => void;

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// In dev: all levels. In production: warn and error only.
const MIN_LEVEL: LogLevel = __DEV__ ? 'debug' : 'warn';

const consoleTransport: LogTransport = (level, tag, message, context) => {
  const text = `[${tag}] ${message}`;
  if (context !== undefined) {
    console[level](text, context);
  } else {
    console[level](text);
  }
};

const transports = new Set<LogTransport>([consoleTransport]);

const emit = (
  level: LogLevel,
  tag: string,
  message: string,
  context?: unknown,
): void => {
  if (LEVEL_RANK[level] < LEVEL_RANK[MIN_LEVEL]) return;
  transports.forEach((t) => t(level, tag, message, context));
};

export const logger = {
  debug: (tag: string, message: string, context?: unknown) =>
    emit('debug', tag, message, context),

  info: (tag: string, message: string, context?: unknown) =>
    emit('info', tag, message, context),

  warn: (tag: string, message: string, context?: unknown) =>
    emit('warn', tag, message, context),

  error: (tag: string, message: string, context?: unknown) =>
    emit('error', tag, message, context),

  // Register a crash reporter (Sentry, Crashlytics, etc.) as an additional transport.
  // The console transport stays active alongside it.
  addTransport: (transport: LogTransport): void => {
    transports.add(transport);
  },

  removeTransport: (transport: LogTransport): void => {
    transports.delete(transport);
  },
};
