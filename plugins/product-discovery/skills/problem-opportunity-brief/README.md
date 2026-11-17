# Problem & Opportunity Brief

## Description

Grills product, design, operations, and strategy leads into high-quality discovery artifacts —
problem briefs, opportunity briefs, discovery questions, and implementation-context requests.
The skill owns the discovery lifecycle (Observation → Problem Candidate → Discovery Question →
Discovery Activity → Problem Brief; Problem Brief / Strategic Thesis → Opportunity Candidate →
Opportunity Brief), classifies fuzzy ideas into the right artifact, and enforces a quality bar:
a Problem Brief states the gap without prescribing the solution, and an Opportunity Brief names a
distinct product advantage rather than restating the problem. It uses the same one-question-at-a-time
interview style as `requirements-grilling`.

## When to Use

- Turning a fuzzy idea, complaint, or request into a classified discovery artifact
- Writing or pressure-testing a Problem Brief, Opportunity Brief, or Discovery Question
- Deciding whether something is a real, decision-relevant problem or just a signal
- Framing an opportunity so it names an advantage, not a restated problem
- Preparing an implementation-context (Development Assessment) request during discovery
- Shaping roadmap inputs before they harden into PRD scope

## Usage

Activate the skill and describe the idea, signal, or draft you want to shape. The skill will:

1. Classify what you are holding (observation, candidate, brief, thesis, or assessment request)
   and default earlier in the lifecycle when unsure.
2. Read available project context (`AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `CONTEXT-MAP.md`,
   docs, ADRs) before asking what the docs can answer.
3. Interview one question at a time, each with a recommended answer and reasoning, walking
   artifact type → outcome → persona → evidence → counter-evidence → decision.
4. Hold the brief to the quality bar — gap without solution for a problem; named advantage for
   an opportunity — and reach for `references/brief-templates.md` for the field list and tests.
5. Route the settled artifact: to `prd-authoring` for scope, to `issue-decomposition` for
   tickets, or to `development-assessment` when a decision needs implementation truth.

## Example

**Input:** "Customers keep emailing support to ask where their report went. We should build a
notifications centre."

**Output:** The skill classifies this as a *Problem Candidate*, not a brief — "build a
notifications centre" is a solution, and the signal isn't yet sized. It grills the gap one
question at a time (is the gap status-visibility, report-not-produced, or no-ready-signal?),
then drafts a Problem Brief skeleton that names the affected outcome, persona, evidence, and
counter-evidence — and deliberately omits any UI or channel choice, leaving response directions
to a later Opportunity Brief or PRD.

## Requirements

- A described idea, signal, complaint, request, or draft to shape
- Optional but recommended: project context and vocabulary files (`AGENTS.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, docs, ADRs) so the interview uses the project's own language
- Optional: access to supporting evidence (support tickets, analytics, transcripts, research)
- Related skills: `requirements-grilling` (shared grilling style and docs-vs-code modes),
  `prd-authoring` (synthesizes scope once a brief is settled), `development-assessment`
  (answers implementation-context requests), `issue-decomposition` (brief/PRD → vertical-slice
  tickets)
