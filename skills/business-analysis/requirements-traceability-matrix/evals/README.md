# Evals — Requirements Traceability Matrix

Each subfolder is a self-contained eval scenario: a fixture spec in its initial state, a prompt to issue to the agent, a reference output, and a checklist of expected behaviours to verify manually. Run evals whenever the skill changes to confirm it still behaves correctly.

---

## Structure

```
evals/
└── <scenario-name>/
    ├── prompt.md      ← setup instructions, per-tool prompt, pass/fail checklist
    ├── fixture.md     ← mini spec (objectives, requirements, stories, tests) in its initial state
    └── expected.md    ← reference RTM + coverage analysis to compare against
```

---

## Available Scenarios

| Scenario | What it tests |
|---|---|
| [portal-rtm](portal-rtm/prompt.md) | Building an RTM (Markdown + parallel CSV) from a mini spec, with forward/backward coverage analysis that detects a delivery gap, a quality gap, and an orphan story |

---

## Running an Eval

1. Copy the fixture to a scratch location:
   ```bash
   cp evals/<scenario>/fixture.md scratch/<scenario>.md
   ```
2. Open `evals/<scenario>/prompt.md` and issue the prompt for your tool (Claude Code, Copilot, or Codex).
3. Work through the checklist at the bottom of `prompt.md` to verify the output against `expected.md`.
