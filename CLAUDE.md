# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm web            # Run in browser
pnpm lint           # Run ESLint (expo lint)
pnpm typecheck      # Run TypeScript type-check (tsc --noEmit)
pnpm format         # Run Prettier on all files
```

**Package manager: pnpm (>=10, Node >=20)**

The pre-commit hook runs `tsc --noEmit` and `lint-staged` (ESLint + Prettier on staged files). Commit messages must follow Conventional Commits — enforced by commitlint.

## Architecture

This is an **Expo SDK 54** React Native app using **expo-router v6** (file-based routing). The new React Native architecture is enabled (`newArchEnabled: true`), and the React Compiler experiment is on.

### Source layout

```
src/
  app/          # expo-router screens and layouts (file-based routes)
  features/     # Feature modules (e.g. logs/) — each self-contained
  shared/       # Cross-feature components, hooks, constants, utils
  hooks/        # Global hooks (color scheme, theme)
  providers/    # App-level React context providers
  services/     # Global services: notifications, storage, voice
```

All imports use the `@/` alias (maps to `src/`).

### Feature module structure

Each feature under `src/features/<name>/` follows this internal layout:

```ts
components/   # UI — presentation only
hooks/        # Logic hooks
services/     # Side effects (AsyncStorage, APIs)
store/        # Zustand store
types/        # TypeScript types + Zod schemas
```

**No cross-feature imports.** Anything shared across features belongs in `src/shared/`.

### Key patterns

- **State**: Zustand (one store per feature, no side effects inside stores, use selectors to avoid re-renders)
- **Validation**: Zod schemas alongside TypeScript types for all stored/external data
- **Storage**: AsyncStorage accessed only through service layer in `services/` — never directly in components or stores
- **Styling**: `StyleSheet` only — no inline styles
- **Exports**: Named exports everywhere; default exports only for screen components under `src/app/`
- **Components**: Functional only, small and focused, no mixed UI + business logic

### UX context (CFS)

This app targets users with Chronic Fatigue Syndrome. UI must minimize cognitive load: large touch targets, minimal decisions per screen, calm visuals, no dense layouts. Prefer tap over typing; reduce interaction steps wherever possible.
