---
name: storage
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

- Handle failures gracefully
- Never crash the app

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
