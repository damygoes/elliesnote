# Elliesnote

A daily energy and symptom tracker for people living with ME/CFS.

Logging takes a few taps: rate your energy from 1 to 5, mark any symptoms, add a note if you want. Over time the app shows trends, flags crash days, and can pull sleep, heart rate and activity from Apple Health so you can see what lines up with your bad days.

Everything is designed around low energy. Big touch targets, one decision per screen, calm colours, and as little typing as possible.

## Stack

- Expo SDK 54 / React Native 0.81 (new architecture)
- expo-router for navigation
- Zustand for state, Zod for validation
- Clerk for auth, RevenueCat for subscriptions, Sentry for error reporting
- react-native-health for Apple Health
- Victory Native + Skia for charts

## Getting started

You'll need Node 20+, pnpm 10+, and Xcode or Android Studio.

```bash
pnpm install
pnpm ios        # or: pnpm android
```

The app uses native modules (HealthKit, RevenueCat), so it won't run in Expo Go. `pnpm ios` / `pnpm android` build a development client.

### Environment

Create `.env.local` in the project root:

```bash
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=
EXPO_PUBLIC_SENTRY_DSN=
```

`EXPO_PUBLIC_API_URL` points at the Elliesnote backend, which lives in a separate repo.

HealthKit doesn't work on the iOS simulator. Set `EXPO_PUBLIC_SCREENSHOT_MODE=1` to fill it with generated data instead (handy for screenshots).

## Scripts

| Command          | What it does         |
| ---------------- | -------------------- |
| `pnpm start`     | Start the dev server |
| `pnpm ios`       | Run on iOS           |
| `pnpm android`   | Run on Android       |
| `pnpm lint`      | ESLint               |
| `pnpm typecheck` | `tsc --noEmit`       |
| `pnpm format`    | Prettier             |

## Project layout

```
src/
  app/        routes (expo-router)
  features/   auth, logs, history, insights, health, notifications, settings, subscription
  shared/     components, hooks and utils used across features
  services/   storage, notifications, logging, Sentry
```

Each feature keeps its own components, hooks, services, store and types. Features don't import from each other; anything shared goes in `src/shared/`.

## Contributing

A pre-commit hook runs the type-checker and lint-staged. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:` …).
