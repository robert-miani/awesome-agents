# Stakeholder Communications

## Description

Drafts and refines audience-tuned BA/PM stakeholder communications. The skill
owns templates for status updates, sprint and steering-committee briefs, change
requests, escalations, decision requests, and meeting summaries. Each template
leads with the point, is tuned to its audience (sponsors want outcomes and
impact; leadership wants risk and decisions; technical teams want specifics; and
business stakeholders want process impact), and forces every action and ask to
have a named owner and a date.

## When to Use

- Writing a recurring status update for a team, owner, or stakeholder group
- Preparing a steering-committee or sponsor brief that surfaces risk and requests
  decisions
- Drafting a change request with a structured impact assessment
- Escalating a time-critical blocker to the person who can unblock it
- Asking a named decision-maker for one specific decision
- Summarizing a workshop, review, or meeting into decisions and action items
- Tailoring an existing message for a different audience

## Usage

Activate this skill and describe the message you need. Provide as much context as
you have:

- The communication type, or the job the message must do (inform, request a
  decision, escalate, or record)
- The audience and the result you want from them
- The substance — progress, the change, the blocker, the decision, or what was
  agreed
- Owners, dates, and any metrics to quantify impact

The skill picks the matching template, applies the audience-awareness rules, and
returns a draft with the headline first and every ask owned and dated. Use the
**stakeholder-raci-mapping** skill to confirm who to inform or consult, and the
**gap-impact-analysis** skill to source the impact content for a change request.

## Example

**Input:** "Draft a sprint status update for Sprint 7 of the customer portal
project. Two stories done, one carrying over because a third-party API was late,
and we need a decision on the payment provider by Friday."

**Output:** A scannable status update that lists completed and carried-over
stories with the cause of the carry-over, calls out the payment-provider decision
near the top with a deadline and the cost of delay, and includes quantified
velocity and defect metrics.

## Requirements

- Enough context to identify the communication type, audience, owners, and dates
- The substance of the message (progress, change, blocker, decision, or outcome)
- Optional: the **stakeholder-raci-mapping** skill to resolve recipients
- Optional: the **gap-impact-analysis** skill to populate change-request impact
