# Agent Workflow: Step-by-Step First Run

This tutorial walks you through **one full cycle** of the issue-driven agent workflow. You will improve one issue with an agent, approve it, have the agent implement it, verify the result, and close the issue with evidence.

For prompts, troubleshooting, and the full reference, see [Working with Coding Agents](09-working-with-coding-agents.md).

---

## Before You Start

- You have already created your Project 2 repo and your master issue + sub-issues (see [Start Here](01-start-here.md)).
- You have at least one **open** sub-issue to work on (e.g. GSAP Motion Foundation).
- You have an agent available: Cursor, Claude Code, Copilot, Codespaces, or similar.
- You know your repo URL (e.g. `https://github.com/your-username/your-repo`).

---

## Step 1: Pick One Open Issue

1. Open your repo on GitHub and go to **Issues**.
2. Choose **one** open sub-issue (e.g. **GSAP Motion Foundation**).
3. Copy the **issue URL** (from the browser address bar) or open the issue and copy the **issue body** (Goal, Definition of Done, etc.).

**Checkpoint:** You have one issue URL or the full issue text ready to paste into the agent.

---

## Step 2: Ask the Agent to Improve the Issue (No Coding Yet)

1. Open your agent (Cursor, Claude Code, Copilot, etc.).
2. If the agent does not already have your repo, tell it your repo URL or that the project is open locally.
3. Paste the **Improve this issue** prompt and fill in the placeholders.

Use the exact prompt from [Working with Coding Agents — Improve This Issue](09-working-with-coding-agents.md#prompt-improve-this-issue). It looks like this:

```text
Here is my assignment context:
[paste the relevant assignment text or a short summary — e.g. Build 7-2 for motion, or the issue template name]

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

4. Send the message and wait for the agent to return **improved issue text** (not code).

**Checkpoint:** The agent has returned a revised issue with Goal, Definition of Done, Files/Links, Constraints, and Verification. No code has been written yet.

---

## Step 3: Update the Issue on GitHub and Approve It

1. Copy the improved issue text from the agent (Goal, Definition of Done, Files/Links, Constraints, Verification).
2. On GitHub, open the same issue and click **Edit**.
3. Replace or merge the issue body with the improved text. Keep the structure clear.
4. Review using the **four checks** from [Working with Coding Agents — Review the Issue](09-working-with-coding-agents.md#review-the-issue-before-any-code-is-written):
   - **Scope:** Is this one job?
   - **Specificity:** Does it name actual files, selectors, or methods?
   - **Order:** Does it make sense in sequence with your other issues?
   - **Completeness:** Does the Definition of Done match the assignment rubric?
5. If something is missing or wrong, edit the issue or re-prompt the agent. Do not proceed until you are satisfied.
6. Click **Update comment** to save.

**Checkpoint:** The issue on GitHub now has a full, specific Definition of Done and verification steps. You have approved it (or edited it until it is ready).

---

## Step 4: Ask the Agent to Work the Issue

1. In the same agent session (or a new one), paste the **Work this issue** prompt.

Use the exact prompt from [Working with Coding Agents — Work This Issue](09-working-with-coding-agents.md#prompt-work-this-issue). It looks like this:

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

2. Make sure the agent knows which issue to work on (paste the issue URL or body again if needed).
3. Let the agent implement. When it reports done, it should list what changed, how it verified, and any follow-ups.

**Checkpoint:** The agent has made changes and reported back. You have not closed the issue yet.

---

## Step 5: Verify the Work Yourself

1. Open your project in the **browser** (local or GitHub Pages).
2. Run through the **Verification** steps from the issue (e.g. refresh and confirm animations run, check console, test reduced motion).
3. Open **DevTools** and check the console for errors.
4. Read the **diff** (e.g. `git diff` or the changes in your editor). Confirm only the expected files were changed.
5. Compare the result to the issue’s **Definition of Done** checklist.

If something is wrong or incomplete, tell the agent what to fix or leave the issue open and revise. Do not close the issue until you are satisfied.

**Checkpoint:** You have tested the feature in the browser, checked the console, and confirmed the work matches the issue.

---

## Step 6: Add a Completion Comment and Close the Issue

1. On GitHub, open the issue and scroll to the comment box.
2. Add a **completion comment** using the format from [Working with Coding Agents — Completion Comment Format](09-working-with-coding-agents.md#completion-comment-format):

   - **What changed** — Short list of what was added or modified.
   - **How I verified it** — What you did in the browser and console.
   - **Open risks or follow-ups** — Anything to polish later or watch for.
   - **Ready for human review** — Yes.

3. Submit the comment.
4. **Close the issue.**

**Checkpoint:** The issue is closed with a completion comment and evidence. You can check it off in your master issue and move to the next one.

---

## What’s Next?

- Use the same 6 steps for every issue you want the agent to help with.
- Keep using [Working with Coding Agents](09-working-with-coding-agents.md) for prompt text, Motion Map tips, and troubleshooting.
- If the agent changes files you didn’t ask for, or the issue was too vague, update the issue or re-prompt with clearer scope.

Issues first. Code second. Review before closing.
