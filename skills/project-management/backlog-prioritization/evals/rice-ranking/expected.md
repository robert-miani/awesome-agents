# Reference output — RICE Ranking

Goal: increase trial-to-paid conversion. Framework: RICE. Effort in person-months
(carried from the sized backlog).

| Rank | Feature | Reach (users/qtr) | Impact | Confidence | Effort (pm) | RICE Score | Inputs |
|------|---------|-------------------|--------|------------|-------------|-----------|--------|
| 1 | Guided onboarding checklist | 8,000 | 2 | 80% | 2 | **6,400** | reach measured; impact estimated |
| 2 | In-app upgrade prompt | 5,000 | 2 | 100% | 2 | **5,000** | all measured (A/B test) |
| 3 | SSO for enterprise trials | 1,200 | 3 | 80% | 3 | **960** | reach assumed |
| 4 | Dark mode | 9,000 | 0.5 | 80% | 4 | **900** | reach measured; impact estimated |

Rationale: the onboarding checklist (6,400) and the upgrade prompt (5,000) are
within ~25% — treat them as a near-tie at the top and let the team swap their
order on dependencies rather than on the score's second digit. SSO and dark mode
score far lower against *this* goal.

Trade-offs to surface:
- **Dark mode is a reach trap.** It has the highest reach (9,000) but the lowest
  RICE score, because its impact on conversion is low. Ranking on reach alone
  would wrongly float it to the top.
- **SSO is a guardrail.** It ranks #3 on the math, but sales reports it blocks
  enterprise deals. Flag it for the stakeholder as a possible override — do not
  let the low score silently bury a deal-blocking dependency.

(Optional parallel `.csv` with the same columns may also be produced; never `.xlsx`.)
