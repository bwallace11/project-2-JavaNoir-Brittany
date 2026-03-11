---
name: ScrollSmoother Setup
about: Configure ScrollSmoother with reduced-motion safe behavior.
title: "ScrollSmoother Setup - [Your Name]"
labels: "p1-required,motion"
assignees: ""
---

## Goal

Configure ScrollSmoother so the global scrolling feel is intentional and readable while still respecting reduced-motion preferences.

## Definition of Done

- [ ] Global smoother setup with `#smooth-wrapper` and `#smooth-content`
- [ ] Smooth value tuned for readability
- [ ] 2+ smoother-enhanced moments
- [ ] Reduced-motion users bypass smoother/effects

## Files / Links

- Likely files:
  - `index.html`
  - `styles/`
  - `scripts/main.js`
- Preview URL:
- Motion Map:
- Related issue(s):

## Constraints

- Keep ScrollSmoother global setup clean and easy to disable.
- Tune the smooth value for readability, not maximum effect.
- Reduced-motion users must bypass smoother effects.

## References

- [GSAP Scroll](https://gsap.com/scroll/)
- [ScrollSmoother Docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/)

## Verification

- [ ] `#smooth-wrapper` and `#smooth-content` are in place
- [ ] Smooth value tested in browser and noted below
- [ ] Reduced-motion behavior bypasses smoother and related effects
- [ ] Console checked for blocking errors
- [ ] Evidence added below

## Agent Handoff

Work this issue in my repo. Follow the Goal, Definition of Done, Files / Links, Constraints, and Verification sections. Do not change files outside the listed scope without approval. When done, report what changed, how you verified it, and any open risks before I close the issue.

## Evidence

- [ ] Commit(s) linked
- [ ] Brief note on smooth value and why it was chosen
