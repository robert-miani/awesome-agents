# Evals — Backlog Prioritization

Each subfolder is a self-contained eval scenario: a fixture backlog in its initial state, a prompt to issue to the agent, a reference output, and a checklist of expected behaviours to verify manually. Run evals whenever the skill changes to confirm it still behaves correctly.

---

## Structure

```
evals/
└── <scenario-name>/
    ├── prompt.md      ← setup instructions, per-tool prompt, pass/fail checklist
    ├── fixture.md     ← candidate backlog with scoring inputs in its initial state
    └── expected.md    ← reference ranking + rationale to compare against
```

---

## Available Scenarios

| Scenario | What it tests |
|---|---|
| [rice-ranking](rice-ranking/prompt.md) | RICE scoring of a candidate backlog — correct formula, consistent scales, near-tie handling, the high-reach/low-impact trap, and a guardrail item surfaced rather than buried |

---

## Running an Eval

1. Copy the fixture to a scratch location:
   ```bash
   cp evals/<scenario>/fixture.md scratch/<scenario>.md
   ```
2. Open `evals/<scenario>/prompt.md` and issue the prompt for your tool (Claude Code, Copilot, or Codex).
3. Work through the checklist at the bottom of `prompt.md` to verify the output against `expected.md`.
