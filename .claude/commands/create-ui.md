---
description: Design and build React Native UI with CFS-first UX thinking and a soft, low-cognitive-load aesthetic. Use when creating screens, components, or layouts.
---

# This command combines CFS UX design and React Native implementation into a single workflow

Always think through the user experience before writing any code.

---

## Step 1 — CFS UX Thinking (Before Any Code)

Answer these before designing:

- What is the user trying to do, and how exhausted might they be?
- Can this be completed in under 5 seconds?
- Can it be skipped or deferred without penalty?
- Does this require a decision? If yes, can it be eliminated or defaulted?

**Core principle: Design for the user's worst day, not their best.**

---

## Step 2 — Interaction Design

- 1-tap actions preferred
- Prefer tap over typing
- Backfill allowed (no rigid timelines or forced streaks)
- No guilt, no pressure, no failure states
- Use progressive disclosure — show only what's needed right now
- Avoid complex gestures

---

## Step 3 — Visual Design

- Soft spacing and gentle visual hierarchy
- Large touch targets
- Subtle contrast — avoid harsh colors
- Calm, supportive tone
- No clutter, no dense layouts
- Limit visible options at any one time

---

## Step 4 — Code Execution

- `StyleSheet` only — no inline styles
- Functional components only
- Each component in its own file — never define sub-components inline inside a parent file
- If a sub-component has its own props type or styles, it belongs in `ComponentName.tsx` in the same folder
- No business logic inside components
- Named exports only (default export for screen components under `src/app/`)
- **Escape special characters in JSX text** — use `&apos;` for apostrophes, never raw `'` inside JSX text content

---

## Step 5 — Theme Tokens

Always import from `@/shared/constants/theme` — never hardcode raw values in StyleSheet:

- **Colors** → `Colors.light.*` — e.g. `Colors.light.primary`, `Colors.light.border`
- **Spacing** → `Spacing.*` — e.g. `Spacing.md` for gap/padding/margin
- **Radius** → `Radius.*` — e.g. `Radius.full` for pills/circles, `Radius.md` for inputs
- **Typography** → spread `...Typography.*` — e.g. `...Typography.label`, `...Typography.button`

If a value has no matching token, add it to the theme first.

---

## Anti-Patterns

- Dense layouts or walls of text
- Complex forms with many fields
- Visual noise or decorative clutter
- Over-tracking or data overload
- Frequent interruptions or notifications
- Rigid workflows with no flexibility

---

## Output Format

- Component code with styles
- Brief explanation of each UX decision in terms of CFS constraints

---

## Goal

Build UI that feels effortless, calming, and fully usable even during fatigue or brain fog.
