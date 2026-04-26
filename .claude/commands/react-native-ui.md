---
description: Build high-quality React Native interfaces using StyleSheet with a soft, supportive aesthetic optimized for low cognitive load. Use when creating screens, components, or layouts.
---

This skill creates React Native UI components tailored for a **Soft Companion experience**, optimized for users with limited energy (CFS context).

---

## Design Thinking

Before coding, define:

- **Purpose**: What does this screen/component help the user do?
- **Energy Cost**: How much effort does interaction require?
- **Clarity**: Can this be understood instantly?

---

## UI Principles (CFS-Optimized)

- Minimal decisions
- Large touch targets
- Clear hierarchy
- No clutter
- Calm, supportive tone

---

## Visual Direction (Soft Companion)

- Soft spacing
- Subtle contrast
- Gentle visual hierarchy
- Avoid harsh colors or dense layouts

---

## Execution Rules

- Use `StyleSheet` only (no inline styles)
- Functional components only
- Each component in its own file — never define sub-components inline inside a parent file
- If a sub-component has its own props type or styles, it belongs in `ComponentName.tsx` in the same folder
- Keep components small and focused
- **Escape special characters in JSX text** — use `&apos;` for apostrophes, never raw `'` inside JSX text content

---

## Theme Tokens

Always import from `@/shared/constants/theme` — never hardcode raw values in StyleSheet:

- **Colors** → `Colors.light.*` — e.g. `Colors.light.primary`, `Colors.light.border`
- **Spacing** → `Spacing.*` — e.g. `Spacing.md` for gap/padding/margin
- **Radius** → `Radius.*` — e.g. `Radius.full` for pills/circles, `Radius.md` for inputs
- **Typography** → spread `...Typography.*` — e.g. `...Typography.label`, `...Typography.button`

If a value has no matching token, add it to the theme first.

---

## Interaction Design

- Prefer tap over typing
- Reduce steps wherever possible
- Avoid complex gestures

---

## Anti-Patterns

- Dense layouts
- Overuse of text
- Complex forms
- Visual noise

---

## Output Format

- Provide component code
- Include styles
- Briefly explain design choices

---

## Goal

Create UI that feels effortless, calming, and usable even during fatigue or brain fog.
