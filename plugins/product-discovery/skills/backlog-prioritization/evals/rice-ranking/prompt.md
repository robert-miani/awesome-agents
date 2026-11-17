# Eval: RICE Ranking

Tests that the skill applies the RICE formula correctly and consistently, rounds away false precision, treats near-ties as ties, resists the high-reach/low-impact trap, and surfaces a guardrail item instead of silently burying it by score.

## Setup

Copy `fixture.md` to a scratch location:

```bash
cp evals/rice-ranking/fixture.md scratch/conversion-backlog.md
```

---

## Running the Eval

### Claude Code

```
Use @skills/project-management/backlog-prioritization/SKILL.md as skill to rank the backlog
in scratch/conversion-backlog.md with RICE.
```

### GitHub Copilot CLI

```bash
copilot skill install backlog-prioritization@awesome-agents
copilot chat --skill backlog-prioritization
```

```
Rank the backlog in scratch/conversion-backlog.md with RICE.
```

### Codex CLI

```bash
codex --instructions .codex/skills/backlog-prioritization.md \
  "Rank the backlog in scratch/conversion-backlog.md with RICE."
```

---

## Expected Outputs

After the agent completes, verify all of the following.

### Formula correctness
RICE score = (Reach × Impact × Confidence) / Effort, using the scales given in the fixture:
- [ ] Guided onboarding checklist: (8000 × 2 × 0.8) / 2 = **6,400**
- [ ] In-app upgrade prompt: (5000 × 2 × 1.0) / 2 = **5,000**
- [ ] SSO for enterprise trials: (1200 × 3 × 0.8) / 3 = **960**
- [ ] Dark mode: (9000 × 0.5 × 0.8) / 4 = **900**

### Table & ranking
- [ ] Output is a Markdown table sorted by score, highest first, with a Rank column
- [ ] Every scoring input (Reach, Impact, Confidence, Effort) is shown, not just the final score
- [ ] Each input is labelled `measured` / `estimated` / `assumed` (carried from the fixture notes)
- [ ] Scores are rounded — no false precision (e.g. `6400`, not `6400.00`)

### Judgement (the point of the eval)
- [ ] The onboarding checklist (6,400) and upgrade prompt (5,000) are flagged as a near-tie / close, with the order swappable on dependency — NOT split on the raw number alone
- [ ] Dark mode's high reach is called out as a trap: it tops on reach but scores low because impact on *this goal* is low
- [ ] SSO's sales/enterprise guardrail is surfaced as a trade-off for the stakeholder, not silently buried at its low rank
- [ ] No framework blending (pure RICE; MoSCoW/WSJF not mixed in)

### Reference
Compare against [expected.md](expected.md). Wording will vary, but the four scores, the sorted order, and every judgement point above must hold.
