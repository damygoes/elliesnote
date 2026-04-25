---
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
