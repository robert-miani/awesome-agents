# Eval: Appointment Booking Stories

Tests that the skill turns a vague, multi-need brief into a well-formed story set: correct story format, Gherkin acceptance criteria, INVEST-based splitting, MoSCoW priority, and explicit open questions / out-of-scope.

## Setup

Copy `fixture.md` to a scratch location:

```bash
cp evals/appointment-booking/fixture.md scratch/appointment-booking.md
```

---

## Running the Eval

### Claude Code

```
Use @skills/business-analysis/user-story-authoring/SKILL.md as skill to turn
scratch/appointment-booking.md into a set of user stories with acceptance criteria.
```

### GitHub Copilot CLI

```bash
copilot skill install user-story-authoring@awesome-agents
copilot chat --skill user-story-authoring
```

```
Turn scratch/appointment-booking.md into a set of user stories with acceptance criteria.
```

### Codex CLI

```bash
codex --instructions .codex/skills/user-story-authoring.md \
  "Turn scratch/appointment-booking.md into a set of user stories with acceptance criteria."
```

---

## Expected Outputs

After the agent completes, verify all of the following.

### Story format
- [ ] Every story uses `As a <persona>, I want <goal>, so that <benefit>` — none omits the "so that" benefit
- [ ] Personas use domain vocabulary (`patient`, `front-desk staff`), not generic "user"
- [ ] Every story has a unique, traceable ID (e.g. `US-001`)

### Decomposition (INVEST)
- [ ] The request is split into separate stories per operation — book, reschedule, cancel are not bundled into one story
- [ ] Phone booking by front-desk staff is its own story (split by persona)
- [ ] No story is split along technical layers ("build the API", "build the UI")

### Acceptance criteria
- [ ] Each story has 3–6 Gherkin (`Given/When/Then`) criteria, numbered (AC-1, AC-2, …)
- [ ] Criteria cover happy path, edge cases, AND error/edge states (e.g. slot taken, not signed in, late cancellation)
- [ ] Criteria use specific values, not vague terms ("less than 24 hours before", not "late")
- [ ] No implementation/solution language in stories or criteria

### Prioritization & scope
- [ ] Every story carries a MoSCoW priority; "Must have" is used sparingly
- [ ] The unresolved late-cancellation fee policy appears as an **open question**, NOT invented as a fact
- [ ] SMS reminders are placed in **out-of-scope** / "Won't have (this time)", not silently dropped or silently built
- [ ] Sign-in requirement is reflected (precondition or dependency)

### Reference
Compare the result against [expected.md](expected.md). The reference is one valid shape — exact wording and story count may differ, but every checklist item above must hold.
