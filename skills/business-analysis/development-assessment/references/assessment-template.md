# Development Assessment Reference

Use this reference when drafting the final assessment or deciding whether human
escalation is needed. Adapt every artifact name to the project's local vocabulary.

## Assessment Template

```md
# Development Assessment: {short title}

## Request

- Source artifact:
- Assessment question:
- Decision this should route:

## Current Behavior

- What the product appears to do today:
- What is directly evidenced:
- What is inferred:
- What contradicts the stated assumption:

## Relevant Files and Systems

- `{path}` - why it matters
- `{path}` - why it matters

## Constraints and Dependencies

- Product/configuration constraints:
- Permission/entitlement constraints:
- Data/model constraints:
- Integration/job/analytics constraints:
- Release/flag/migration constraints:

## Feasibility Read

- Plausible paths:
- Non-obvious blockers:
- Things that appear easier than expected:
- Things that appear harder than expected:

## Risk and Complexity

- Complexity read:
- Main risks:
- Unknowns:

## Decision Assumptions Challenged

- Assumption:
  - Codebase evidence:
  - Effect on the decision:

## Confidence

- Confidence: High | Medium | Low
- Why:

## Recommended Next Route

One or two sentences routing the decision.

## Human Escalation

- Needed: Yes | No
- If yes, ask this specific question:
- Best target role/person if known:
```

## Confidence Rubric

**High confidence**

- The relevant behavior is directly visible in code or trusted docs.
- The flow has been traced across the main affected surfaces.
- The answer does not depend on undocumented operational judgment.

**Medium confidence**

- The main path is supported by code evidence, but one or more integrations,
  configs, flags, deployments, or data assumptions remain unverified.
- The answer can route the decision but should be checked before a delivery
  commitment.

**Low confidence**

- The relevant repo, service, config, data, or runtime behavior cannot be located.
- Evidence is contradictory.
- The answer depends on why something was built, on production behavior not
  represented locally, or on ownership judgment.
- Human developer escalation is needed before the decision owner relies on the
  assessment.

## Escalation Triggers

Escalate to a human developer only when one or more apply:

- Codebase search cannot locate the owning system.
- The repo shows multiple plausible owners or behaviors.
- Runtime configuration, tenant data, or production flags determine the answer.
- The question requires intent behind prior implementation decisions.
- Security, compliance, migration, or data-loss risk requires accountable technical
  approval.
- Feasibility depends on services or repos not available locally.
- The assessment confidence is Low after reasonable codebase exploration.

Do not escalate just because the question is technical. First inspect code and docs.

## Codebase Exploration Checklist

- Search exact product terms, route labels, page names, API names, event names, and
  permission names.
- Search synonyms from `CONTEXT.md`, `INDEX.md`, docs, and UI copy.
- Identify entry points: routes, components, controllers, handlers, jobs, services,
  schemas, migrations, config files.
- Trace outward to permissions, feature flags, tenant configuration, data models,
  APIs, background jobs, analytics, and external integrations.
- Record file references and distinguish direct evidence from inference.
- Stop when the remaining uncertainty is not answerable from local artifacts.

## Recommended Next Route Examples

- "Treat this as a content/configuration issue before considering software work."
- "Current behavior already supports the assumption; the team should validate
  awareness or setup gaps."
- "The code contradicts the assumption; revise the brief before shaping an
  opportunity."
- "A technical spike is warranted because feasibility depends on tenant-level
  configuration not visible locally."
- "This is a plausible delivery candidate, but the team should confirm the affected
  persona and success metric first."
- "Escalate to the service owner because runtime flags and production data determine
  the answer."

## Anti-Patterns

- Producing a full technical design when the decision owner only needs routing
  context.
- Treating a developer conversation as the first step.
- Reporting "not found" without listing searched terms and surfaces.
- Collapsing product value judgment into engineering feasibility.
- Using confidence language without explaining what evidence supports it.
