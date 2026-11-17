# Mini spec — customer self-service portal

## Objectives
- OBJ-001: Reduce inbound support calls by letting customers self-serve account tasks.
- OBJ-002: Keep the portal fast and accessible.

## Requirements
- BR-001 (Business, Must, traces to OBJ-001): Self-service account management.
- FR-001 (Functional, Must, parent BR-001): Reset password via email link.
- FR-002 (Functional, Should, parent BR-001): Update contact details.
- FR-003 (Functional, Could, parent BR-001): Download account statement.
- NFR-001 (Non-Functional, Should, traces to OBJ-002): Every page loads in under 2 seconds.

## Backlog
- EP-001 groups the account-management work.
- US-010 implements FR-001 (reset password). Acceptance criterion AC-010-1.
- US-011 implements FR-002 (update contact details). Acceptance criterion AC-011-1.
- US-012 implements FR-003 (download statement). Acceptance criterion AC-012-1.
- US-060 lets customers export their data as CSV. (No requirement was written for this.)

## Tests
- TC-101 verifies US-010. Status: Passed. FR-001 is Done.
- TC-102 verifies US-011. Status: In progress. FR-002 is In QA.
- FR-003 / US-012 is In development; no test case exists yet.
- NFR-001 has no story yet and sits in the backlog.

Owner for all rows: J. Rivera. Source: stakeholder workshop unless noted. Target release: R1, except FR-003 and NFR-001 which are R2.
