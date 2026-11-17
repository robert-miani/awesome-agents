# Requirements Source Ingestion

## Description

Turns existing source materials into structured, traceable requirements. The
skill catalogues every input, applies a per-source-type extraction pattern,
cross-references multiple sources to surface agreement and contradiction, assigns
confidence levels, documents change deltas against prior specs, and closes with a
Questions & Gaps log. Every produced requirement carries a citation back to its
source — document and section, speaker and timestamp, or wiki page and
last-modified date.

It owns the *ingestion* step only. Story and acceptance-criteria format belongs
to `user-story-authoring`, formal coverage artifacts to
`requirements-traceability-matrix`, and change-impact analysis against an
existing baseline to `gap-impact-analysis`.

## When to Use

- The user uploads documents and says "based on this", "use this as input",
  "here's the existing spec", or "build a spec from these".
- The user provides call or meeting transcripts, interview notes, or recordings.
- The user references wiki pages, Confluence/SharePoint/Notion exports, or PRDs.
- The user asks to "update" or "build on" an existing specification.
- Multiple source documents need to be synthesised into one requirements set.

## Usage

Activate the skill and attach or reference the source materials. The skill will:

1. Produce a Source Inventory Table and show it for confirmation before
   extracting, flagging staleness, missing versions, and apparent contradictions.
2. Deep-read each source with the matching extraction pattern (specs/design docs,
   transcripts, wiki/PRDs), assigning a stable ID to every extraction.
3. Build a Cross-Reference Matrix when two or more sources are provided.
4. Produce structured requirements, each with a Source Reference and a confidence
   level (Confirmed / Likely / Inferred / Uncertain) and a change delta where a
   prior requirement is being modified.
5. Close with a Questions & Gaps Log of unanswered points, contradictions, and
   assumptions.

## Example

**Input:** "Build a requirements set from these — we're refreshing the platform,"
attaching an old functional spec (`Platform Spec v2.3`) and a discovery workshop
transcript.

**Output:**

- A **Source Inventory Table** rating each input's relevance and freshness.
- **Extractions** such as `EXT-001` (a carry-forward business rule from the spec)
  and `TR-001`/`TR-002` (interpreted requirements from the transcript with
  speaker and timestamp).
- A **Cross-Reference Matrix** showing, e.g., that the spec and workshop disagree
  on an approval threshold and that a single-screen view is a new request.
- **Structured requirements** with source citations and confidence levels — for
  example `FR-045` (changed, with a documented delta), `FR-046` (new, Confirmed),
  `FR-047` (new, Likely).
- A **Questions & Gaps Log** capturing the unapproved threshold, the undefined
  "follow-up" scope, and the missing exception-handling coverage.

## Requirements

- One or more source materials: uploaded documents, prior specs/design docs, call
  or meeting transcripts, wiki/Confluence/Notion exports, or PRDs.
- Enough metadata to assess each source (ideally date/version and authorship) so
  freshness and authority can be rated.
- Optional companions: `user-story-authoring` (story/AC format),
  `requirements-traceability-matrix` (formal traceability), and
  `gap-impact-analysis` (impact of changes when updating an existing spec).
