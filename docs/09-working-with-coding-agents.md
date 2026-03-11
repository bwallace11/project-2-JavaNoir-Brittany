# Working with Coding Agents

**First time?** Follow the [step-by-step first run](09a-agent-workflow-first-run.md) to do one full cycle (improve issue → approve → work → verify → close), then use this doc as your reference.

## TL;DR

Give the agent your assignment docs, your repo, and the issue you want to work on.

Use the agent to improve the issue first. Approve the issue before any code is written. Then let the agent work one issue at a time, review the output in the browser and the diff, and close the issue only after verification.

GitHub is the shared workflow. Your agent can live in VS Code, Codespaces, Codex, Claude Code, Copilot, or another tool.

## The Core Loop

1. Capture the task as a GitHub issue.
2. Ask the agent to improve the issue without coding.
3. Approve or edit the improved issue.
4. Ask the agent to work the issue in the repo.
5. Review the result and test it.
6. Close the issue with evidence.

Your job is not to type every line yourself. Your job is to approve the plan and review the output.

## Give the Agent Good Context

Before you ask an agent to help, hand it the same materials you would hand a teammate:

- the assignment document or brief
- your repo URL or local repo
- the issue body or issue URL
- planning artifacts such as your Motion Map, Figma, or reference links

For this project, that usually means:

- Build 7-1 for structure, layout, and real content expectations
- Build 7-2 for GSAP, reduced-motion, and motion requirements
- Motion Map for what moves, how it moves, and which GSAP method you plan to use

Always say `Do not start coding yet` when you want the agent to improve the issue first.

## Prompt: Improve This Issue

```text
Here is my assignment context:
[paste the relevant assignment text or a short summary]

Here is my repo:
[paste the repo URL or say that the local repo is already open]

Here is my issue:
[paste the issue URL or the issue body]

Improve this issue so it is specific enough to build from.
- Rewrite the title if needed.
- Add a clear outcome.
- Turn the requirements into a Definition of Done checklist.
- Name likely files, selectors, links, and constraints.
- Add verification steps.

Do not start coding yet. I want the improved issue text first so I can review it.
```

## Review the Issue Before Any Code Is Written

Use these four checks before you approve an issue:

### Scope

Is this one job? If one issue tries to cover structure, content, animation, QA, and deployment at once, split it.

### Specificity

Does it name the actual files, selectors, methods, or artifacts? `Animate the hero` is vague. `.hero__title` fades up with `gsap.from()` is specific.

### Order

Does the issue make sense in sequence? Do not work on a ScrollTrigger interaction before GSAP is loaded and the target section exists.

### Completeness

Does the Definition of Done match the assignment requirements and evaluation criteria? If the rubric checks reduced motion, the issue should check reduced motion.

If the issue is not ready, edit it or re-prompt the agent. Do not move to code until the issue is clear enough to review against later.

## Prompt: Work This Issue

```text
Work this approved issue in my repo.

Follow the Goal, Definition of Done, Files / Links, Constraints, and Verification sections exactly.
- Work one issue at a time.
- Do not change files outside the listed scope without asking first.
- Keep the implementation aligned with the assignment requirements and linked references.

When you are done, report:
- What changed
- How you verified it
- Open risks or follow-ups

Do not close the issue for me until I verify it.
```

## Work One Issue at a Time

Default to one issue at a time, especially while you are still learning how to review agent output.

Good defaults:

- start with one open issue
- let the agent finish that issue only
- review the browser, console, and diff
- then move to the next issue

If you want tighter control, tell the agent to stop after each issue and wait for approval before continuing.

## Verify Before Closing

Do not close an issue because the code exists. Close it because you verified it.

Minimum review loop:

- open the browser and test the feature
- open DevTools and check the console
- read the diff
- compare the result against the issue checklist
- add evidence, then close

If the work is incomplete, reopen the issue or leave it open and revise the issue body.

## Prompt: Verify and Close This Issue

```text
Compare the current work against this issue.

- Check each Definition of Done item.
- List anything incomplete, unclear, or risky.
- Draft a completion comment using:
  - What changed
  - How I verified it
  - Open risks or follow-ups
  - Ready for human review

Only tell me to close the issue if all checks pass.
```

## Motion Tasks Need Extra Context

Agents can only follow the motion plan they can see.

If the issue depends on your Motion Map, do not assume the agent can open Milanote. Link the Motion Map in the issue, then paste the important notes directly into the issue body:

- which elements animate
- which selectors those elements use
- which GSAP methods apply
- the motion intent
- reduced-motion behavior
- any reference examples you want it to match

For example, instead of writing `animate the first section`, write:

- `.hero__title` enters with `gsap.from()` from `y: 40`
- `.hero__subtitle` enters second in the same timeline
- `#first-contact h2` slides in from the left
- `#variables p` uses a staggered reveal
- reduced-motion users should see the content immediately with no animation

## Worked Example: Build 7-1

Build 7-1 is mostly a structure and content problem. A good issue focuses on the live page structure, real content, and readable layout before polish.

Example issue shape:

- Goal: Build the full rough-cut page structure from the Figma blueprint.
- Definition of Done: linked CSS files, semantic sections, all chapters present, real content in every section, readable desktop and mobile layout.
- Files / Links: `index.html`, `styles/variables.css`, `styles/styles.css`, `scripts/main.js`, Figma blueprint.
- Constraints: use tokens instead of hardcoded repeated values, keep heading hierarchy intact, no placeholder text.
- Verification: browser check on desktop and mobile width, console check, screenshot of the full page flow.

## Worked Example: Build 7-2 Before and After

### Before

```text
Title: Animate hero and two sections

Make the site more animated with GSAP. Do the hero and two other sections.
```

This is too vague to review or build from.

### After

```text
Title: Build 7-2 hero and section entrance animations

Goal
Implement the Build 7-2 motion requirements for the hero and two content sections so the site has a clear page-load animation pass before ScrollTrigger is added next week.

Definition of Done
- [ ] GSAP is loaded before scripts/main.js
- [ ] All animation code is wrapped in a prefers-reduced-motion check
- [ ] .hero__title and .hero__subtitle animate in a gsap.timeline()
- [ ] #first-contact h2 and #first-contact p animate on page load
- [ ] #variables p uses a staggered reveal
- [ ] At least two easing values are used intentionally
- [ ] CSS initial states are present for animated elements
- [ ] Reduced-motion users see visible content with no animation
- [ ] No console errors

Files / Links
- Likely files: index.html, styles/styles.css, scripts/main.js
- Motion Map: [link]
- Build doc: Build 7-2

Constraints
- Use the motion notes from the Motion Map
- Prefer transform and opacity for motion
- Keep the movement subtle and readable
- Do not add ScrollTrigger yet

Verification
- [ ] Refresh the page and confirm the hero animation runs first
- [ ] Confirm the two additional sections animate on load
- [ ] Turn on prefers-reduced-motion and confirm the content appears with no animation
- [ ] Check the console
```

This version is specific enough to build, review, and close.

## Make Definition of Done Match the Rubric

Your issue checklist should mirror the assignment evaluation criteria. That way, the issue becomes the review sheet.

Build 7-2 is a good example. The evaluation checks:

- GSAP loaded correctly
- reduced-motion check implemented
- hero animation timeline
- two section animations
- easing and stagger usage
- CSS initial states and fallback
- animations reflect the Motion Map

A good Definition of Done uses those same ideas as checklist items. If the rubric checks it, the issue should check it too.

| Build 7-2 evaluation check | Matching issue checklist item |
| --- | --- |
| GSAP loaded correctly | `GSAP is loaded before scripts/main.js` |
| Reduced motion check implemented | `All animation code is wrapped in a prefers-reduced-motion check` |
| Hero animation timeline | `.hero__title and .hero__subtitle animate in a gsap.timeline()` |
| Two section animations | `#first-contact` and `#variables` animation items are listed explicitly |
| Easing and stagger usage | `At least two easing values are used intentionally` and `#variables p uses a staggered reveal` |
| CSS initial states and fallback | `CSS initial states are present` and `Reduced-motion users see visible content with no animation` |
| Animations reflect the Motion Map | `Use the motion notes from the Motion Map` |

## Completion Comment Format

Use the same completion comment shape every time:

```text
What changed
- Added the GSAP CDN before scripts/main.js
- Built a hero timeline for .hero__title and .hero__subtitle
- Added entrance animations for #first-contact and #variables
- Added reduced-motion fallback styles and logic

How I verified it
- Reloaded the page and confirmed the hero runs first
- Checked the console for errors
- Turned on prefers-reduced-motion and confirmed content appears without animation

Open risks or follow-ups
- Motion timing may need a final polish pass once ScrollTrigger is introduced

Ready for human review
- Yes
```

## What Can Go Wrong

### The issue is too vague

Ask the agent to rewrite it with named files, selectors, methods, and verification steps.

### The agent starts coding too early

Start the session with `Improve this issue` and keep the sentence `Do not start coding yet` in the prompt.

### The agent changes files you did not ask it to touch

Tell it to stay within the listed scope and stop if another file needs to change.

### The agent asks too many questions in the middle

The issue probably lacks details. Update the issue so the next pass has the missing information.

### The code works but misses the design intent

The agent only knows what is written down. Add motion intent, reference links, and tone notes to the issue.

## Direct GitHub-Write Workflows

This section is optional.

If your tool can read and write GitHub issues directly, you can let it:

- rewrite issue text after you review it
- add a completion comment
- close the issue after you verify the work

Do not grant write access by default if:

- you are still learning how to review diffs
- you are not checking the browser after each issue
- you do not understand what permissions the tool has

Even when the tool can edit or close issues, you are still responsible for:

- approving the issue before coding
- reviewing the output
- deciding whether the issue is actually done

## Final Reminder

Issues first. Code second. Review before closing.
