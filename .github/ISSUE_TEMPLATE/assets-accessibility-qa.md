---
name: Assets + Accessibility + QA
about: Complete visual asset, accessibility, and final QA requirements.
title: "Assets + Accessibility + QA - [Your Name]"
labels: "p1-required,a11y,deploy"
assignees: ""
---

## Goal

Finish the asset, accessibility, and QA requirements so the project is ready for final review on real devices and in production conditions.

## Definition of Done

- [ ] 5+ SVG assets (or instructor-approved exception)
- [ ] 3+ image/illustration assets
- [ ] Non-decorative images include meaningful alt text
- [ ] `prefers-reduced-motion` fully implemented
- [ ] Keyboard navigation validated
- [ ] Contrast checked (WCAG AA body text)
- [ ] No blocking console errors
- [ ] No `markers: true` in production
- [ ] Tested desktop + mobile width
- [ ] Tested Chrome + one additional browser

## Files / Links

- Likely files:
  - `index.html`
  - `styles/`
  - `scripts/`
  - `assets/`
- Preview URL:
- Accessibility report or notes:
- Related issue(s):

## Constraints

- Alt text should describe meaningful content, not repeat nearby headings.
- Reduced-motion behavior must be complete across the project.
- Final QA should stay within this issue scope instead of reopening unrelated build work unless needed.

## Verification

- [ ] Keyboard navigation tested
- [ ] Contrast checked for body text
- [ ] Desktop and mobile widths tested
- [ ] Chrome and one additional browser tested
- [ ] Console checked for blocking errors
- [ ] Evidence added below

## Agent Handoff

Work this issue in my repo. Follow the Goal, Definition of Done, Files / Links, Constraints, and Verification sections. Do not change files outside the listed scope without approval. When done, report what changed, how you verified it, and any open risks before I close the issue.

## Evidence

- [ ] Commit(s) linked
- [ ] Lighthouse/accessibility screenshot(s)
