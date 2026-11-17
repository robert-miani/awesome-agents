---
name: git-commit
description: Stages changes and creates a git commit with an AI-generated commit message. Use when asked to commit changes, create a commit, or save work to git.
allowed-tools: shell, editor
---

> 💡 **Recommended model:** This is a lightweight, deterministic skill. Consider switching to a faster/cheaper model (e.g. Claude Haiku) via `/model` before invoking it. A `model:` frontmatter field for per-skill configuration has been requested as a feature.

Follow these steps in order when this skill is invoked.

## Step 1 — Check git identity

Before doing anything else, verify that `user.name` and `user.email` are configured:

```bash
git config user.name
git config user.email
```

- If **either value is empty or missing**, ask the user to provide it explicitly. Do **not** infer values from commit history, conversation context, or any other source — ask for them directly, one at a time.
- Once both values are provided, set them for the local repository:
  ```bash
  git config user.name "<name provided by user>"
  git config user.email "<email provided by user>"
  ```
- If both values are already set, proceed without prompting the user.

## Step 2 — Check repository state

Run the following to understand what has changed:

```bash
git status
git diff --staged
git diff
```

If there are no changes at all (working tree clean, nothing staged), tell the user and stop.

## Step 3 — Determine what to stage

If the user explicitly listed files or paths to commit, stage only those:
```bash
git add <file1> <file2> ...
```

If the user said "all changes" or did not specify files, stage everything:
```bash
git add -A
```

After staging, run `git diff --staged --stat` to confirm what will be committed.
If the staged diff is empty, tell the user nothing was staged and stop.

## Step 4 — Generate commit message

Analyze the staged diff (`git diff --staged`) and generate a commit message following these rules:

- **Subject line** (first line): imperative mood, ≤ 72 characters, no period at the end.
  Examples: `Add user authentication`, `Fix null pointer in payment flow`, `Refactor config loading`
- **Body** (optional): separated from subject by a blank line; explain *what* and *why*, not *how*; wrap at 72 characters.
- Use conventional commit prefixes when appropriate: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `style:`, `perf:`.
- Always append a `Co-authored-by` trailer on its own line at the end, using only the **actual name of the current agent from the session context** — no email:
  ```
  Co-authored-by: <agent name>
  ```

Show the generated message to the user and ask for confirmation or edits before committing.

## Step 5 — Commit

Once the user approves the message, create the commit:

```bash
git commit -m "<subject>" -m "<body if any>" -m "Co-authored-by: <agent name>"
```

For multi-paragraph messages use a single `-m` with newlines, or write to a temp file and pass with `-F`:

```bash
git commit -F /tmp/commit_msg.txt
```

## Step 6 — Report result

Show the user the commit hash and subject line from `git log -1 --oneline`. Do not suggest pushing — let the user decide when to push.

## Error handling

- If `git commit` fails due to identity not configured, this should have been caught in Step 1. Re-run the identity check and ask the user for the missing values before retrying.
- If pre-commit hooks fail, show the hook output and ask the user how to proceed.
- If there are merge conflicts, stop and tell the user to resolve them first.
