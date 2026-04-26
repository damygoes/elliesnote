---
description: Implement reliable local data persistence using AsyncStorage with validation and error handling. Use when storing or retrieving data.
---

This skill ensures safe and consistent data persistence.

---

## Storage Thinking

- What data needs persistence?
- How often is it accessed?
- What happens if it fails?

---

## Rules

- Always use a service layer
- Never access AsyncStorage directly in UI
- Validate data before saving/loading

---

## Error Handling

- Handle failures gracefully — never crash the app
- **Never use empty catch blocks** — always use `logger.warn(tag, message, error)` from `@/services/logger`; never call `console.warn` directly
- **Wrap `JSON.parse` in its own inner try-catch** — it throws on malformed strings independently of AsyncStorage errors; a single outer catch is not sufficient
- Schema validation failures are silent fallbacks (return `[]`), but AsyncStorage and parse failures must be logged

---

## Data Integrity

- Use Zod validation on load
- Provide fallback behavior

---

## Output Format

- Storage service implementation
- Brief explanation

---

## Goal

Ensure stable and safe data persistence.
