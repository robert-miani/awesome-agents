# Problem & Opportunity Brief — Field Templates and Tests

Use this reference only when drafting or evaluating a specific artifact. Each section lists the
required fields, a promotion or quality test, and the anti-patterns to reject.

## Problem Candidate

Use when signals may represent a real problem but are not yet ready for a Problem Brief.

Required fields:

- suspected_problem
- affected_outcome
- affected_persona_or_client_segment
- supporting_signals
- freshness
- confidence
- decision_assumptions
- discovery_questions
- reviewer_or_owner
- next_review_date

Promotion test:

- What decision would this support?
- What uncertainty blocks promotion?
- Is this one problem, several problems, or only a loose signal cluster?

## Discovery Question

Use when uncertainty blocks movement through the lifecycle.

Required fields:

- question
- artifact_it_informs
- decision_it_unlocks
- likely_evidence_sources
- strongest_possible_confirming_signal
- strongest_possible_disconfirming_signal
- planned_discovery_activity

Exit rule:

- Discovery is not complete until it produces a change in the project's discovery state or
  records an explicit no-change decision.

## Problem Brief

Use when a decision-relevant gap needs to be evaluated, shaped, or sent for implementation
context.

Required fields:

- problem_statement
- affected_outcome
- affected_personas
- affected_clients_or_segments
- evidence_summary
- source_links
- evidence_strength
- freshness
- severity_or_frequency
- counter_evidence
- decision_assumptions
- current_capability_hypothesis
- open_questions
- requested_next_decision
- development_assessment_request (if needed)

Quality tests:

- Does it describe the gap without prescribing the response?
- Does it identify who is harmed and why the outcome matters?
- Does it distinguish evidence from interpretation?
- Is the next decision clear?

Anti-patterns:

- "Build X so users can Y."
- "Client asked for X, therefore the problem is lack of X."
- "Improve engagement" without naming behaviour, user, outcome, and evidence.

## Strategic Thesis

Use when an Opportunity Brief is justified by top-down strategy rather than a linked Problem
Brief.

Required fields:

- thesis
- strategic_context
- affected_outcomes
- supporting_signals
- counter_signals
- decision_assumptions
- review_trigger

Quality test:

- Would this belief justify multiple opportunity candidates, not just one feature?

## Opportunity Candidate

Use when there may be a value-creating direction but it is not yet shaped enough for an
Opportunity Brief.

Required fields:

- possible_value_direction
- linked_problem_briefs_or_strategic_thesis
- affected_outcomes
- likely_users_or_clients
- supporting_signals
- decision_assumptions
- unknowns
- next_discovery_question

## Opportunity Brief

Use when there is a shaped strategic value thesis worth prioritizing, shaping, or assessing.

Required fields:

- opportunity_statement
- product_advantage_or_value_thesis
- linked_problem_briefs_or_strategic_thesis
- affected_outcomes
- target_personas
- target_clients_or_segments
- why_now
- supporting_evidence
- counter_evidence
- decision_assumptions
- possible_response_directions
- non_goals
- development_assessment_summary_or_request
- prioritization_rationale

Quality tests:

- Does it name a product advantage, not merely "solve the problem"?
- Could it generate multiple solution options?
- Is it tied to a Problem Brief or Strategic Thesis?
- Does it explain why this is attractive relative to alternatives?

Anti-patterns:

- Problem: "Users cannot find retirement content." Opportunity: "Improve retirement content
  findability." (Restates the problem; names no advantage.)
- Opportunity statement is a single predetermined feature.
- Opportunity has no stated advantage, timing, or alternative value path.

## Development Assessment Request

Use when a decision needs implementation context to route. Route the request to the
`development-assessment` skill.

Required fields:

- request_being_answered
- current_behavior
- relevant_capabilities_or_systems
- key_constraints
- feasibility_read
- risk_or_complexity_read
- decision_assumptions_challenged
- recommended_next_route

Use for:

- current product behaviour is unclear
- an existing capability may already address the problem
- feasibility or risk could change prioritization
- the issue might be content, configuration, operations, or implementation

Do not use as:

- a full estimate
- a technical design
- a substitute for deciding whether the problem matters

## First Questions

Use one at a time, each with a recommended answer:

- What artifact are we actually holding: signal, candidate, brief, thesis, or assessment request?
- What outcome would change if this were true?
- Who experiences this: which persona, client, segment, or buyer?
- What is the strongest evidence, and what is merely interpretation?
- What counter-evidence would make us stop?
- What decision does this artifact need to support?
- What assumption does this artifact depend on?
- What discovery question must be answered before promotion?
- Does this decision need implementation context, or can it proceed without it?
- If this is an opportunity, what advantage does it create beyond solving the named problem?
