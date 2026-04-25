---
name: feature-implementation
description: Implement complete application features end-to-end using clean architecture, TypeScript, and React Native best practices. Use when building new features such as logging, tracking, or integrations.
---

This skill guides the structured implementation of production-grade features in a React Native application.

The user provides a feature requirement (e.g., logging system, notifications, integrations). You must implement it fully across all layers.

---

## Implementation Thinking

Before coding, define:

- **Feature Scope**: What exactly is included (avoid overbuilding)
- **Data Flow**: Input → processing → storage → output
- **Boundaries**:
  - UI (presentation)
  - Hooks (logic)
  - Store (state)
  - Services (side effects)

---

## Execution Strategy

Implement in this strict order:

1. Types (TypeScript + Zod schema)
2. Store (Zustand)
3. Services (storage, APIs, etc.)
4. Hooks (logic abstraction)
5. UI Components (presentation layer)

Each layer must be modular and isolated.

---

## Architecture Rules

- Feature must live inside its own folder
- No cross-feature imports
- No business logic inside components
- No side effects inside store

---

## Code Requirements

- TypeScript only (no `any`)
- Named exports only
- Small, focused files
- No duplication

---

## Output Format

- Provide complete code for the requested layer(s)
- Follow project structure
- Include brief rationale for decisions

---

## Goal

Produce a clean, scalable, production-ready feature that integrates seamlessly into the system.
