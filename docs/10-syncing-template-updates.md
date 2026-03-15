# Syncing Template Updates

## Why This Exists

If you already created your own repo from this template, new changes to the template do not appear in your repo automatically.

You do not need to start over. You do not need to create a new repo. You only need to copy the updated docs and issue templates into the repo you already use.

## Required Patch Update

If your instructor asks you to sync a patch:

1. Do not create a new repo.
2. Do not restart the project.
3. Sync the updated docs and issue templates into your existing repo.
4. Push one sync commit.
5. Post proof of the sync.

Preferred proof:

- comment on your existing `Project 2 Master Checklist` issue with the sync commit hash

Acceptable proof:

- submit the sync commit hash or repo link in Canvas

## Files Included in This Patch

If you are syncing the coding-agent workflow patch, copy these files:

```text
README.md
docs/01-start-here.md
docs/08-progress-tracking-options.md
docs/09-working-with-coding-agents.md
docs/09a-agent-workflow-first-run.md
docs/09b-assignment-agent-workflow-first-run.md
docs/10-syncing-template-updates.md
docs/11-assignment-final-turn-in.md
.github/workflows/setup-project-issues.yml
.github/ISSUE_TEMPLATE/project-2-master-checklist.md
.github/ISSUE_TEMPLATE/story-structure.md
.github/ISSUE_TEMPLATE/gsap-motion-foundation.md
.github/ISSUE_TEMPLATE/scrolltrigger-core.md
.github/ISSUE_TEMPLATE/pinned-showpiece.md
.github/ISSUE_TEMPLATE/scrollsmoother-setup.md
.github/ISSUE_TEMPLATE/tokens-and-theme-modes.md
.github/ISSUE_TEMPLATE/assets-accessibility-qa.md
.github/ISSUE_TEMPLATE/reflection-readme-submission.md
.github/ISSUE_TEMPLATE/blocker-report.md
```

## Recommended Path: Use GitHub Copilot to Apply the Patch

If you already use GitHub Copilot in VS Code, Codespaces, or another GitHub-supported editor, this is the fastest way to sync the patch into your repo.

Before you ask Copilot to make changes:

- make sure your project repo is open
- commit any unfinished work first
- keep the patch file list above nearby so Copilot stays in scope

Prompt Copilot with something like this:

```text
Compare my repo to this template repo:
https://github.com/sicxz/desn378-project-2-student-hub

Bring over only these files:
- README.md
- docs/01-start-here.md
- docs/08-progress-tracking-options.md
- docs/09-working-with-coding-agents.md
- docs/09a-agent-workflow-first-run.md
- docs/09b-assignment-agent-workflow-first-run.md
- docs/10-syncing-template-updates.md
- docs/11-assignment-final-turn-in.md
- .github/workflows/setup-project-issues.yml
- .github/ISSUE_TEMPLATE/project-2-master-checklist.md
- .github/ISSUE_TEMPLATE/story-structure.md
- .github/ISSUE_TEMPLATE/gsap-motion-foundation.md
- .github/ISSUE_TEMPLATE/scrolltrigger-core.md
- .github/ISSUE_TEMPLATE/pinned-showpiece.md
- .github/ISSUE_TEMPLATE/scrollsmoother-setup.md
- .github/ISSUE_TEMPLATE/tokens-and-theme-modes.md
- .github/ISSUE_TEMPLATE/assets-accessibility-qa.md
- .github/ISSUE_TEMPLATE/reflection-readme-submission.md
- .github/ISSUE_TEMPLATE/blocker-report.md

Do not change any project files outside this list.
Show me the diff before committing.
Then make one commit named: docs: sync coding-agent workflow patch
```

After Copilot proposes the changes:

1. Review the diff.
2. Confirm it only touches the files listed in this patch.
3. Commit and push.
4. Post proof of sync.

## Sync Path A: Terminal, VS Code, or Codespaces Without Copilot

Use this if you already work locally or in Codespaces.

If you have edited any of the files listed above, commit your work first so you can recover it if needed.

```bash
git remote add template https://github.com/sicxz/desn378-project-2-student-hub.git
git fetch template
git checkout template/main -- README.md docs/01-start-here.md docs/08-progress-tracking-options.md docs/09-working-with-coding-agents.md docs/09a-agent-workflow-first-run.md docs/09b-assignment-agent-workflow-first-run.md docs/10-syncing-template-updates.md docs/11-assignment-final-turn-in.md .github/workflows/setup-project-issues.yml .github/ISSUE_TEMPLATE/project-2-master-checklist.md .github/ISSUE_TEMPLATE/story-structure.md .github/ISSUE_TEMPLATE/gsap-motion-foundation.md .github/ISSUE_TEMPLATE/scrolltrigger-core.md .github/ISSUE_TEMPLATE/pinned-showpiece.md .github/ISSUE_TEMPLATE/scrollsmoother-setup.md .github/ISSUE_TEMPLATE/tokens-and-theme-modes.md .github/ISSUE_TEMPLATE/assets-accessibility-qa.md .github/ISSUE_TEMPLATE/reflection-readme-submission.md .github/ISSUE_TEMPLATE/blocker-report.md
git commit -m "docs: sync coding-agent workflow patch"
git push
```

If you already added a `template` remote earlier, skip the first command.

## Sync Path B: GitHub Web UI or Manual Copy

Use this if you do not want to use terminal commands.

1. Open the template repo in GitHub.
2. Open each file in the patch list above.
3. Copy the updated content into the matching file in your own repo.
4. Commit the changes in GitHub, VS Code, or your editor.
5. Push the commit and post proof of sync.

This takes longer, but it works.

## What About My Existing Issues?

You do not need to recreate your repo or reopen old issues.

Important details:

- issue templates only affect new issues you create after the update
- existing open issues stay open
- existing closed issues stay closed

If you want to use a coding agent on an issue you already opened, either:

- edit the issue body so it matches the new structure, or
- add a comment that works as an `Agent Handoff`

If you copied `.github/workflows/setup-project-issues.yml` into your existing repo, you can also go to `Actions` and run `Setup Project Issues`:

- use `create_missing` to create any issue that does not exist yet
- use `sync_open` to refresh the bodies of open issues from the latest templates

A good `Agent Handoff` comment includes:

- the goal
- the Definition of Done
- the files or links involved
- the constraints
- the verification steps

## Which Path Should I Use?

GitHub web UI is the baseline. GitHub Copilot is the recommended fast path if you already use it. Terminal sync is the next fastest option if you are comfortable in a repo. Manual copy still works if you want the safest, most explicit route.

Choose the path that fits the tools you already use.
