---
name: state-management
description: Implement clean, efficient Zustand stores with clear boundaries and minimal re-renders. Use when managing application state.
---

This skill ensures predictable and scalable state handling.

---

## State Thinking

Before creating a store:

- What state is truly global?
- What can remain local?
- What derived values should not be stored?

---

## Rules

- One store per feature
- No side effects inside store
- Keep state minimal
- Store holds **state + mutations only** — no query or getter logic
- Derived reads (e.g. find by id/date) belong in selector hooks outside the store, not as store methods

---

## Selectors

- Expose derived reads as standalone hooks: `export const useEntryByDate = (date: string) => useLogStore(...)`
- Do **not** add getter methods (functions that only call `get()`) inside the store
- Do **not** use `useShallow` — Zustand v5 already shallow-compares selector outputs; it is redundant
- **Never select multiple actions into a plain object** — returning `{ addEntry, updateEntry }` from a selector always produces a new reference, causing an infinite render loop. Select each action individually:

  ```ts
  // WRONG — infinite loop
  export const useLogActions = () =>
    useLogStore((state) => ({
      addEntry: state.addEntry,
      updateEntry: state.updateEntry,
    }));

  // CORRECT — stable references
  export const useAddEntry = () => useLogStore((state) => state.addEntry);
  export const useUpdateEntry = () => useLogStore((state) => state.updateEntry);
  ```

---

## Performance

- Use selectors to prevent re-renders
- Avoid storing computed values

---

## Actions

- Clearly named
- Single responsibility

---

## Output Format

- Zustand store implementation
- Brief explanation

---

## Goal

Maintain clean, predictable, and efficient state management.
