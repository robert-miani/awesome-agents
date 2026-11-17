# Eval: Portal RTM

Tests that the skill builds a complete RTM as a Markdown table plus a byte-consistent parallel CSV, and runs coverage analysis that surfaces the delivery gap, the quality gap, and the orphan story planted in the fixture.

## Setup

Copy `fixture.md` to a scratch location:

```bash
cp evals/portal-rtm/fixture.md scratch/portal-spec.md
```

---

## Running the Eval

### Claude Code

```
Use @skills/business-analysis/requirements-traceability-matrix/SKILL.md as skill to build
a requirements traceability matrix from scratch/portal-spec.md, then run coverage analysis.
Write the RTM to scratch/specs/.
```

### GitHub Copilot CLI

```bash
copilot skill install requirements-traceability-matrix@awesome-agents
copilot chat --skill requirements-traceability-matrix
```

```
Build a requirements traceability matrix from scratch/portal-spec.md, then run coverage
analysis. Write the RTM to scratch/specs/.
```

### Codex CLI

```bash
codex --instructions .codex/skills/requirements-traceability-matrix.md \
  "Build a requirements traceability matrix from scratch/portal-spec.md, then run coverage analysis. Write the RTM to scratch/specs/."
```

---

## Expected Outputs

After the agent completes, verify all of the following.

### Files created
- [ ] An `rtm.md` (Markdown table) is written
- [ ] A parallel `rtm.csv` is written alongside it

### Columns
- [ ] The table has the canonical columns in order: Req ID, Title, Type, Priority, Objective, Parent, Epic, Stories, Acceptance Criteria, Test Cases, Test Status, Delivery Status, Release, Owner, Source, Notes

### Rows & IDs
- [ ] One row per requirement (BR-001, FR-001, FR-002, FR-003, NFR-001) — 5 rows minimum
- [ ] IDs from the fixture are reused verbatim (not renumbered)
- [ ] Parent/objective links match the fixture (FR-001..003 → BR-001; BR-001 → OBJ-001; NFR-001 → OBJ-002)

### Markdown ↔ CSV parity
- [ ] Same rows, same order, same IDs in both files
- [ ] CSV header column count matches every data row's column count
- [ ] Multi-ID cells in the CSV are quoted (e.g. `"US-010, US-011"`)
- [ ] Empty cells are blank in the CSV (consecutive commas) and `—` only in the Markdown

### Coverage analysis (the point of the eval)
- [ ] **Delivery gap** reported: NFR-001 has no story
- [ ] **Quality gap** reported: FR-003 / US-012 has no test case
- [ ] **Orphan story** reported: US-060 has no parent requirement
- [ ] Must-have status noted: BR-001 and FR-001 are Done and Passed
- [ ] Gaps are named in plain text (offending IDs listed), not conveyed by colour/formatting only

### Reference
Compare against [expected.md](expected.md). Cell wording may vary, but the structure, parity rules, and every coverage finding above must hold.
