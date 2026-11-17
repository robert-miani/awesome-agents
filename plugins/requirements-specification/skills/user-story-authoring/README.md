# User Story Authoring

## Description

Drafts, refines, splits, prioritizes, and reviews user stories, epics, and
themes together with their acceptance criteria. This is the canonical reference
in the library for story and acceptance-criteria format: the
"As a &lt;persona&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;" template,
Given/When/Then (Gherkin) acceptance criteria, MoSCoW prioritization,
INVEST-based granularity and story splitting, and explicit
open-questions/out-of-scope discipline. Other skills defer to it for story and
criteria format. It is industry-neutral — personas and examples use whatever
domain vocabulary the project supplies.

## When to Use

- Writing new user stories, epics, or themes
- Writing or reviewing acceptance criteria in Given/When/Then format
- Turning a stakeholder request, feature idea, or PRD into backlog items
- Splitting a story that is too large to fit a sprint (INVEST)
- Prioritizing a backlog with MoSCoW
- Reviewing existing stories for testability, granularity, and gaps
- Capturing open questions and out-of-scope boundaries for a feature

## Usage

Activate this skill and describe the capability you want to specify. Provide as
much context as you have:

- The business problem and who is affected
- The personas/roles involved
- Any known constraints, dependencies, or success measures
- Existing stories or a feature description to refine or split

The skill identifies the personas, decomposes the request into independently
testable stories at the right granularity, writes Gherkin acceptance criteria
covering happy path and edge cases, assigns MoSCoW priorities, and lists open
questions and out-of-scope items. For traceability IDs and matrices it points
to the `requirements-traceability-matrix` skill; for building stories from
existing documents or transcripts it points to `requirements-source-ingestion`.

## Example

**Input:** "We want logged-in shoppers to be able to save items for later."

**Output:** A structured set of backlog items, for example:

```
US-001  As a signed-in shopper, I want to save an item to a "saved for later"
        list, so that I can find it again without searching.
        AC-1 … AC-4 (Gherkin, covering save, unsave, not-signed-in, list-full)
        Priority: Must have

US-002  As a signed-in shopper, I want to view my saved list on any device,
        so that I can continue shopping where I left off.
        AC-1 … AC-2 (Gherkin, covering cross-device sync, unavailable item)
        Priority: Should have

Open Questions: stock reservation? price-change behavior? expiry?
Out of Scope: list sharing; guest saved lists; price-drop notifications.
```

The larger need is split into two sprint-sized, independently valuable stories,
each with independently testable criteria. See `SKILL.md` for the full worked
example.

## Requirements

- A business need, feature idea, stakeholder request, or existing stories to
  work from
- The relevant personas/roles, or enough context to infer them
- Optional: the project's domain glossary for accurate persona naming
- Optional: the `requirements-traceability-matrix` skill when stories need
  formal upstream/downstream traceability, and `requirements-source-ingestion`
  when stories are derived from existing documents, transcripts, or PRDs
