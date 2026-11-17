# Evals — PlantUML Diagram Skill

Each subfolder is a self-contained eval scenario: a fixture document in its initial state, a prompt to issue to the agent, and a checklist of expected outputs to verify manually. Run evals whenever the skill changes to confirm it still behaves correctly.

---

## Structure

```
evals/
└── <scenario-name>/
    ├── prompt.md      ← setup instructions, per-tool prompt, pass/fail checklist
    ├── fixture.md     ← target document in its initial state (reset before each run)
    ├── expected.puml  ← reference diagram source
    └── expected.svg   ← rendered reference visual
```

---

## Available Scenarios

| Scenario | What it tests |
|---|---|
| [gantt-sprint-plan](gantt-sprint-plan/prompt.md) | Gantt diagram with 5 sequential 2-week sprints embedded into an existing markdown file |

---

## Running an Eval

1. Copy the fixture to a scratch location:
   ```bash
   cp evals/<scenario>/fixture.md /tmp/<scenario>.md
   ```
2. Open `evals/<scenario>/prompt.md` and issue the prompt for your tool (Claude Code, Copilot, or Codex).
3. Work through the checklist at the bottom of `prompt.md` to verify the outputs.
