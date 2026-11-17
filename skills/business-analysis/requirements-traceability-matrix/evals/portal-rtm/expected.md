# Reference output — Portal RTM

## `scratch/specs/rtm.md`

```markdown
# Requirements Traceability Matrix

| Req ID | Title | Type | Priority | Objective | Parent | Epic | Stories | Acceptance Criteria | Test Cases | Test Status | Delivery Status | Release | Owner | Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BR-001 | Self-service account management | Business | Must | OBJ-001 | — | EP-001 | US-010, US-011 | AC-010-1, AC-011-1 | TC-101, TC-102 | In progress | In QA | R1 | J. Rivera | Stakeholder workshop | — |
| FR-001 | Reset password via email link | Functional | Must | OBJ-001 | BR-001 | EP-001 | US-010 | AC-010-1 | TC-101 | Passed | Done | R1 | J. Rivera | BR-001 | — |
| FR-002 | Update contact details | Functional | Should | OBJ-001 | BR-001 | EP-001 | US-011 | AC-011-1 | TC-102 | In progress | In QA | R1 | J. Rivera | BR-001 | — |
| FR-003 | Download account statement | Functional | Could | OBJ-001 | BR-001 | EP-001 | US-012 | AC-012-1 | — | Not started | In development | R2 | J. Rivera | BR-001 | No test case yet — quality gap |
| NFR-001 | Page load under 2s | Non-Functional | Should | OBJ-002 | — | EP-002 | — | — | — | Not started | Backlog | R2 | J. Rivera | Architecture review | No story yet — delivery gap |
```

> US-060 (CSV export) is an orphan story — it has no requirement, so it does not get an RTM row of its own; it is reported as a backward-traceability finding instead.

## `scratch/specs/rtm.csv`

```csv
Req ID,Title,Type,Priority,Objective,Parent,Epic,Stories,Acceptance Criteria,Test Cases,Test Status,Delivery Status,Release,Owner,Source,Notes
BR-001,Self-service account management,Business,Must,OBJ-001,,EP-001,"US-010, US-011","AC-010-1, AC-011-1","TC-101, TC-102",In progress,In QA,R1,J. Rivera,Stakeholder workshop,
FR-001,Reset password via email link,Functional,Must,OBJ-001,BR-001,EP-001,US-010,AC-010-1,TC-101,Passed,Done,R1,J. Rivera,BR-001,
FR-002,Update contact details,Functional,Should,OBJ-001,BR-001,EP-001,US-011,AC-011-1,TC-102,In progress,In QA,R1,J. Rivera,BR-001,
FR-003,Download account statement,Functional,Could,OBJ-001,BR-001,EP-001,US-012,AC-012-1,,Not started,In development,R2,J. Rivera,BR-001,No test case yet — quality gap
NFR-001,Page load under 2s,Non-Functional,Should,OBJ-002,,EP-002,,,,Not started,Backlog,R2,J. Rivera,Architecture review,No story yet — delivery gap
```

## Coverage analysis

```
Coverage analysis (5 requirements, 4 stories, 2 test cases):
- Delivery gaps: NFR-001 has no story
- Quality gaps: FR-003 (US-012) has no test case
- Orphan stories: US-060 (CSV export) — no parent requirement
- Status: FR-002 is In QA, test still In progress — acceptable
- Must-haves: all Must items (BR-001, FR-001) are Done and Passed
```
