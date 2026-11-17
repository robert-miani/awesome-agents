# Stakeholder & RACI Mapping

## Description

Identifies and analyzes stakeholders and maps responsibilities for an initiative. The skill produces three connected artifacts: a **stakeholder register**, a **power/interest (influence/interest) grid** rendered as a Mermaid quadrant chart, and a **RACI matrix** (Responsible / Accountable / Consulted / Informed) delivered both as a Markdown table and a parallel, git-diffable `.csv`. It enforces the core RACI rules — one Accountable per row, at least one Responsible, no overloaded roles — and classifies each stakeholder's engagement need.

## When to Use

- Building a stakeholder register or stakeholder map for a project, program, or decision
- Positioning stakeholders on a power/interest (influence/interest) grid
- Creating a RACI matrix for activities, deliverables, or decisions
- Answering "who is responsible for", "who signs off", "who must be consulted", or "who should be informed"
- Reviewing an existing RACI for missing or duplicate accountability and overloaded roles

For the detailed engagement and communication plan that follows from this analysis, use the **stakeholder-communications** skill.

## Usage

Activate this skill and describe the initiative you are mapping. Provide as much context as you have:

- The project, program, or decision in scope
- The activities, deliverables, or decisions that need responsibility assignment
- The roles or named individuals involved (roles are fine when names are unknown)
- Any known power, interest, or attitude information per stakeholder

The skill will build the stakeholder register, classify stakeholders on power and interest, render the power/interest grid as a Mermaid quadrant chart, and produce the RACI matrix as both a Markdown table and a parallel `.csv` file. It validates the matrix against the RACI rules before returning.

## Example

**Input:** "Map the stakeholders and build a RACI for a website-redesign project."

**Output:**

- A stakeholder register table (Sponsor, Product Owner, Business Analyst, Delivery Lead, Content SME, Operations Lead, End Users) with interest, influence, impact, attitude, and engagement-need columns.
- A Mermaid power/interest quadrant chart positioning each stakeholder.
- A RACI matrix as a Markdown table plus a parallel `raci.csv`:

```csv
Activity,Sponsor,Product Owner,Business Analyst,Delivery Lead,Content SME,Operations Lead
Define requirements,A,C,R,C,C,I
Approve scope & budget,R/A,C,I,I,I,I
Design solution,I,C,C,R/A,C,I
Build & integrate,I,I,I,R/A,I,C
Migrate content,I,C,C,C,R/A,I
Go/No-Go decision,A,R,C,C,I,C
```

Each row has exactly one Accountable and at least one Responsible.

## Requirements

- A list of activities, deliverables, or decisions to assign responsibilities for
- The roles or named individuals involved (roles when names are unknown)
- Optional: the **common-mermaid-diagram** skill for rendering the power/interest quadrant chart
- Optional: the **stakeholder-communications** skill for the downstream engagement and communication plan
