---
name: Tokens + Theme Modes
about: Implement token system and light/dark/system modes.
title: "Tokens + Theme Modes - [Your Name]"
labels: "p1-required"
assignees: ""
---

## Goal

Implement a consistent token system and theme modes so the project can switch cleanly between light, dark, and system preferences without visual drift.

## Definition of Done

- [ ] `tokens.css` exists and is used consistently
- [ ] Light mode implemented
- [ ] Dark mode implemented
- [ ] System mode (`prefers-color-scheme`) implemented
- [ ] Theme preference persists (for example via `localStorage`)

## Files / Links

- Likely files:
  - `styles/tokens.css`
  - `styles/`
  - `scripts/`
- Preview URL:
- Figma:
- Related issue(s):

## Constraints

- Use tokens consistently instead of hardcoding repeated values.
- Keep theme controls readable and accessible.
- System mode should respect `prefers-color-scheme`.
- Persist user preference if the interface allows manual switching.

## Verification

- [ ] Light mode works in browser
- [ ] Dark mode works in browser
- [ ] System mode responds correctly
- [ ] Preference persists after reload when applicable
- [ ] Evidence added below

## Agent Handoff

Work this issue in my repo. Follow the Goal, Definition of Done, Files / Links, Constraints, and Verification sections. Do not change files outside the listed scope without approval. When done, report what changed, how you verified it, and any open risks before I close the issue.

## Evidence

- [ ] Commit(s) linked
- [ ] Screenshot(s) of light and dark mode
