# FINAL: Lost in the Scroll

For the full checklist in repo form, see [Final Turn-In Spec](03-final-turn-in-spec.md).

**Due:** Week 10 — Wednesday, March 11, 2026 (before presentations)  
**Points:** 200  
**Weight:** 50% of course grade

---

## Overview

This is your final submission for Project 2: Lost in the Scroll.

You've spent five weeks building a scrollytelling site that traces your JavaScript learning journey through a personal metaphor. This submission is the complete, deployed, polished version.

**What you are turning in:** A live, deployed scrollytelling site + public repository with a README that documents the project and includes your reflection.

---

## What to Submit

Paste both links into the Canvas text box:

1. **Live site URL** (GitHub Pages)
2. **Public GitHub repository URL**

Your README is in the repo; we will read it there.

Before you submit, make sure your Project 2 issue tracking is complete:

- all required Project 2 sub-issues are closed
- your `Project 2 Master Checklist` issue is updated and fully checked off

---

## Final Deliverable Requirements

### Story + Structure

- 6–8 total sections (hero + 5–7 story chapters)
- At least 5 JavaScript concepts represented as story chapters
- Complete written narrative — no placeholder text, no lorem ipsum
- A clear personal metaphor that maps code concepts to something you understand

### ScrollTrigger

- 8+ ScrollTrigger instances total
- 5+ trigger-and-play reveals (animation fires when element enters viewport)
- 2+ scrubbed interactions (scroll position controls animation progress)
- 1+ pinned showpiece section with 3+ internal animation steps

### ScrollSmoother

- One global ScrollSmoother setup using `#smooth-wrapper` / `#smooth-content` structure
- Smooth value tuned for readability
- 2+ smoother-enhanced moments (effects, speed-based depth, etc.)
- Disabled or bypassed for `prefers-reduced-motion` users

If ScrollSmoother was unavailable for your setup, you must have received instructor approval for an alternative.

### GSAP Motion

- 10+ intentional GSAP tweens across the site
- 2+ GSAP timelines used for sequencing
- 2+ distinct easing choices used intentionally (not all power2.out)
- Majority of motion uses performant properties (`transform`, `opacity`)

### Design System + Theme

- `tokens.css` (or `variables.css`) exists and is used consistently
- Light mode implemented
- Dark mode implemented
- System mode implemented (`prefers-color-scheme`)
- Mode preference persists via `localStorage`

### Visual Assets

- 5+ SVG assets (custom or intentionally adapted) — unless instructor-approved exception
- 3+ image/illustration assets supporting the narrative
- Images optimized for web
- Non-decorative images use meaningful alt text

### Accessibility + Quality

- `prefers-reduced-motion` fully implemented — all content readable with motion disabled
- Keyboard navigation works across the full experience
- Semantic headings and landmarks present
- Color contrast meets WCAG AA for body text
- No blocking console errors
- No `markers: true` left in production code

### Testing

- Tested at one desktop width and one mobile width
- Tested in at least two browsers (Chrome + one other)
- Deployed build matches your local final version
- No broken links or missing assets

### Issue Tracking

- All required Project 2 sub-issues are closed
- `Project 2 Master Checklist` reflects the final state of the project
- Final issue evidence is present where needed

### README (Project Documentation + Reflection)

Your repo must include a **README.md** that documents the project and includes your reflection. A separate reflection page (e.g. `reflection.html`) is optional; the required reflection content must be in the README.

README.md must include:

- **Project title** (as H1)
- **Optional:** Video Demo URL (if you created a walkthrough video)
- **Description:** Multiple paragraphs that explain what the project is and how it works, what the main files contain and do, and key design choices and why you made them. Aim for at least several hundred words; in the neighborhood of 750 words is a good target.
- **Links:** Live site URL, repo URL (and optional portfolio link)
- **Tech stack:** HTML, CSS, JS, GSAP, ScrollTrigger, ScrollSmoother (or equivalents)
- **Reflection (in the README):**
  - Metaphor summary (1 paragraph)
  - One section you're most proud of, and why
  - One technical bug you solved, and how
  - One accessibility decision you made
  - What you would improve with more time

Your reflection is part of the final submission and is considered in evaluation (e.g. under Story & Metaphor and Technical Execution).

---

## Presentation (Week 10 — In Class)

5–7 minutes per student:

1. **Live scroll-through** — show the full site, top to bottom
2. **Explain your metaphor** — what is it, why did you choose it
3. **Walk through ONE section's code** — pick your strongest, explain it line by line
4. **What surprised you?**
5. **What would you add with more time?**

The desk critique test applies: be ready to explain any line of code in your project.

---

## Evaluation Rubric


| Criteria             | Weight | Points | What I'm Looking For                                                                                                                                                                  |
| -------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Story & Metaphor     | 25%    | 50     | Does the metaphor work? Is the story clear, personal, and engaging? Would a non-coder follow the journey? Is the writing complete and intentional?                                    |
| Interaction & Motion | 35%    | 70     | Does scroll pacing feel right? Do animations serve the narrative — not just decorate it? Is there a showpiece section? Does easing have personality? Does the scrub feel intentional? |
| Technical Execution  | 30%    | 60     | GSAP + ScrollTrigger used correctly? ScrollSmoother configured? Tokens consistent? No major bugs? Deployed and matching local? Code is organized and readable?                        |
| Accessibility        | 10%    | 20     | Reduced-motion alternative works? Keyboard navigable? Color contrast passes? Semantic HTML? Content readable with all motion disabled?                                                |


**Total: 200 points**

---

## Grade Scale


| Level                      | Description                                                                                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exemplary (90–100%)**    | The metaphor is original and illuminating. Scroll pacing feels cinematic — you want to keep scrolling. Animations serve the story. Technically clean — no console errors, smooth performance. Accessible by default. Presentation is confident and clear. |
| **Proficient (80–89%)**    | Metaphor works and story is complete. Motion supports the narrative with minor pacing issues. Technical requirements met with small bugs. Accessibility basics covered.                                                                                   |
| **Developing (70–79%)**    | Metaphor is present but thin. Story has gaps or placeholder content. Some ScrollTrigger patterns implemented but not all requirements met. Accessibility partially addressed.                                                                             |
| **Beginning (60–69%)**     | Metaphor is unclear or disconnected. Major sections incomplete. Fewer than half the technical requirements met. Accessibility not addressed.                                                                                                              |
| **Incomplete (below 60%)** | Site not deployed, major sections missing, or no evidence of scroll-driven motion.                                                                                                                                                                        |

