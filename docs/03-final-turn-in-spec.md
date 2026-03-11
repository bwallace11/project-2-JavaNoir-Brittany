# Final Turn-In Specification

This is the final completion contract for Project 2.

## 1) Required Submission Links

Students must submit:

- [ ] Live GitHub Pages URL
- [ ] Public GitHub repository URL

Recommended:

- [ ] Portfolio page URL that links to this project

The README (in the repo) contains your project documentation and reflection; graders read it there.

Issue tracking must also be complete before final turn-in:

- [ ] All required Project 2 sub-issues are closed
- [ ] `Project 2 Master Checklist` is up to date and fully checked off

## 2) Core Build Requirements

### Story + Structure

- [ ] 6-8 total sections
- [ ] At least 5 JavaScript concepts represented
- [ ] Complete written narrative

### ScrollTrigger

Reference:
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

- [ ] 8+ total ScrollTrigger instances
- [ ] 5+ trigger-and-play reveals
- [ ] 2+ scrubbed interactions
- [ ] 1+ pinned showpiece section
- [ ] Pinned showpiece includes 3+ internal animation steps

### ScrollSmoother

Reference:
- [ScrollSmoother Docs](https://gsap.com/docs/v3/Plugins/ScrollSmoother/)

- [ ] One global ScrollSmoother setup with wrapper/content structure
- [ ] Smooth value tuned for readability
- [ ] 2+ smoother-enhanced moments
- [ ] Disabled or bypassed for reduced-motion users

If ScrollSmoother is unavailable:
- [ ] Instructor-approved alternative scroll-feel implementation

### GSAP Motion

References:
- [GSAP Core Docs](https://gsap.com/docs/v3/GSAP/)
- [GSAP Timeline Docs](https://gsap.com/docs/v3/GSAP/Timeline/)

- [ ] 10+ intentional GSAP tweens
- [ ] 2+ GSAP timelines
- [ ] 2+ distinct easing choices used intentionally
- [ ] Majority of motion uses performant properties (`transform`, `opacity`)

### Design System + Theme

- [ ] `tokens.css` exists and is used consistently
- [ ] Light mode implemented
- [ ] Dark mode implemented
- [ ] System mode implemented (`prefers-color-scheme`)
- [ ] Mode preference persists (for example with `localStorage`)

### Visual Assets

- [ ] 5+ SVG assets (custom or intentionally adapted), unless instructor-approved exception
- [ ] 3+ image/illustration assets supporting the narrative
- [ ] Images are optimized for web
- [ ] Non-decorative images use meaningful alt text

## 3) Accessibility + Quality

- [ ] `prefers-reduced-motion` support is fully implemented
- [ ] All content remains readable with motion disabled
- [ ] Keyboard navigation works across the full experience
- [ ] Semantic headings and landmarks are present
- [ ] Color contrast meets WCAG AA for body text
- [ ] No blocking console errors
- [ ] No `markers: true` in production

## 4) Testing Requirements

- [ ] Tested at one desktop width and one mobile width
- [ ] Tested in at least two browsers (Chrome + one other)
- [ ] Deployed build matches local final version
- [ ] No broken links or missing assets

## 4b) Issue Tracking Requirements

- [ ] All required Project 2 sub-issues are closed
- [ ] `Project 2 Master Checklist` reflects the final state of the project
- [ ] Final issue evidence is present where needed

## 5) README (Project Documentation + Reflection)

Your repo must include a **README.md** that serves as both project documentation and reflection. A separate reflection page (e.g. `reflection.html`) is optional; the required reflection content must live in the README.

README.md must include:

- [ ] **Project title** (as H1)
- [ ] **Optional:** Video Demo URL (if you created a walkthrough video)
- [ ] **Description:** Multiple paragraphs that explain what the project is and how it works, what the main files contain and do (e.g. `index.html`, `styles/`, `scripts/main.js`, tokens, motion approach), and key design choices and why you made them. Aim for at least several hundred words; in the neighborhood of 750 words is a good target.
- [ ] **Links:** Live site URL, repo URL (and optional portfolio link)
- [ ] **Tech stack:** HTML, CSS, JS, GSAP, ScrollTrigger, ScrollSmoother (or equivalents)
- [ ] **Reflection (in the README):**
  - [ ] Metaphor summary (1 paragraph)
  - [ ] One section you're most proud of, and why
  - [ ] One technical bug you solved, and how
  - [ ] One accessibility decision you made
  - [ ] What you would improve with more time

AI is allowed for drafting, but the final README and code explanations must reflect your own understanding.

**Optional template** — you may use this structure as a starting point:

```markdown
# YOUR PROJECT TITLE
#### Video Demo:  <optional URL>
#### Description:
[Multiple paragraphs: what the project is, what key files do, design choices. Aim for ~750 words or at least several hundred.]

#### Links
- Live site:
- Repo:

#### Tech stack
HTML, CSS, JavaScript, GSAP, ScrollTrigger, ScrollSmoother

#### Reflection
- **Metaphor summary:**
- **One section I'm most proud of:**
- **One technical bug I solved:**
- **One accessibility decision:**
- **What I'd improve with more time:**
```
