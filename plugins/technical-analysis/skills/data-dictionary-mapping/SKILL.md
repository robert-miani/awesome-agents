---
name: data-dictionary-mapping
description: Author data dictionaries and source-to-target (S2T) mappings. Owns the field catalogue (name, type, length, nullability, description, valid values), enumerations, entity relationships, and S2T mapping with transformation rules. Use when the user mentions a data dictionary, field spec, field catalogue, enumerations or reference data, an entity relationship summary, a source to target mapping, S2T, data migration mapping, or transformation rules; or asks to define data elements, document allowed values, or specify how fields move and transform between systems.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Data Dictionary & Mapping

## Overview

Define data precisely. This skill produces two related deliverables:

1. **Data dictionary** — a field-level catalogue of every data element: logical and physical name, type, length, nullability, allowed values, validation rules, and business meaning, plus enumeration sheets and an entity relationship summary.
2. **Source-to-target (S2T) mapping** — how data moves field by field between systems, with transformation rules, defaults, and fallbacks.

Use this skill when the task is to define, catalogue, map, or review data elements and how they transform between systems. Keep deliverables domain-neutral unless the project supplies its own domain vocabulary.

## Output Format

This repository does **not** produce `.xlsx`. Where a data dictionary or mapping would traditionally be a multi-sheet workbook, produce instead:

- **One Markdown table per "sheet"** — field catalogue, enumerations, entity relationships, and S2T mapping — in a single Markdown document, each under its own heading.
- **A parallel `.csv` file per table** — Excel-openable and git-diffable — named after the table.

Markdown is for review and diffing; the CSVs are the machine-readable copy. Keep the two in sync: every column in the Markdown table is a column in the CSV.

### File placement

Resolve the target directory in this order:

1. Path specified in the project's `CLAUDE.md` — always check first
2. `/docs/data/` — if it exists in the current repo
3. `/docs/data/` — create it if inside a git repo (`git rev-parse --show-toplevel` succeeds)
4. `.claude/drafts/` — fallback when not in a git repo and no `CLAUDE.md` override

Suggested layout:

```
docs/
  data/
    data-dictionary.md          ← all four Markdown tables
    field-catalogue.csv
    enumerations.csv
    entity-relationships.csv
    s2t-mapping.csv
```

## Workflow

1. Gather the minimum context needed:
   - the entities and systems in scope
   - the source(s) of each data element and the target system(s)
   - whether this is a one-time migration or an ongoing integration
   - any existing schema, sample data, or reference-data lists
2. If the user supplied an existing dictionary or mapping, read it first and mirror its column set and tone.
3. Identify the entities before listing fields. Sketch the entity relationship summary first so field assignment is unambiguous.
4. Catalogue fields one entity at a time. For each field, fill every column — do not leave type, length, or nullability blank.
5. Extract every coded field into the enumeration table. A field whose values come from a fixed set must reference an enum by name.
6. Build the S2T mapping only after the dictionary stabilises, so source and target types are already defined.
7. Classify each mapping row by transformation category and write a concrete, testable transformation rule.
8. Emit the Markdown document and the parallel CSV files. Check both against the Gotchas before returning.

## Field Catalogue Structure

One row per data element. Use these columns in this order:

| Column | Meaning | Example |
|---|---|---|
| Field ID | Unique identifier | FLD-001 |
| Entity | Parent entity/table | Customer |
| Field name (logical) | Business-friendly name | Email Address |
| Field name (physical) | System/database name | customer_email |
| Data type | String, Integer, Date, Decimal, Boolean, Enum | String |
| Format / mask | Expected format | RFC 5322 |
| Length / precision | Max length or decimal places | 254 chars |
| Required? | Mandatory / Optional / Conditional | Mandatory |
| Conditional logic | If conditional, when is it required? | — |
| Default value | Default if not supplied | NULL |
| Allowed values / enum | Valid value set or enum name | — |
| Validation rules | Testable rules for valid data | Must contain `@`; unique per customer |
| Business definition | Plain-English meaning | Primary contact email for the customer account |
| Source system | Where this data originates | Web Signup |
| Owner | Business owner of this data element | Customer Operations |
| Sensitive? | Flag for personal/sensitive data | Yes |
| Notes | Additional context | Used for login and notifications |

Guidance:
- Be precise about types — never just "string"; always include the length or precision.
- Validation rules must be testable (a tester could pass or fail a value against them).
- Flag personal or otherwise sensitive data so downstream handling rules are explicit.
- Distinguish data captured at entry from data derived later from other fields.

## Enumeration Sheet

Every coded field references an enum here. One row per allowed value.

| Column | Meaning |
|---|---|
| Enum name | Name referenced by the catalogue (e.g. `OrderStatus`) |
| Code | Stored value |
| Display value | Human-readable label |
| Description | When this value applies |
| Active? | Whether the value is currently in use |

Keep enums complete — list every valid value, including "unknown" or "not supplied" sentinels where they exist.

## Entity Relationship Summary

A compact map of the entities and how they relate. Drives the `Entity` column in the catalogue.

| Column | Meaning |
|---|---|
| Entity | Entity/table name |
| Description | What the entity represents |
| Key fields | Primary key and notable identifiers |
| Relationships | Cardinality to other entities (e.g. "Has many Orders") |

Keep relationship phrasing directional and explicit ("Customer has many Orders"; "Order belongs to one Customer"). This is a summary, not a full physical schema.

## S2T Mapping Structure

One row per source→target field movement. Build it after the dictionary so types are already known.

| Column | Meaning |
|---|---|
| Map ID | Unique identifier (e.g. M-001) |
| Source system | System the data comes from |
| Source entity | Source table/object |
| Source field | Source field name |
| Source type | Source data type |
| Target system | System the data goes to |
| Target entity | Target table/object |
| Target field | Target field name |
| Target type | Target data type |
| Category | Transformation category (see below) |
| Transformation rule | Concrete, testable rule |
| Default / fallback | Value or action when source is missing/invalid |
| Notes | Risks, data-loss warnings, context |

### Transformation categories

| Category | Description | Example |
|---|---|---|
| Direct | 1:1 mapping, no transformation | `first_name` → `first_name` |
| Format | Same data, different format | `DD/MM/YYYY` → `YYYY-MM-DD` |
| Lookup | Map codes/values via reference table | `Y/N` → enum lookup |
| Calculated | Derive target from source field(s) | `account_age = today - created_date` |
| Concatenated | Combine multiple source fields | `full_name = first + ' ' + last` |
| Split | Split one source into multiple targets | `full_name` → `first_name` + `last_name` |
| Conditional | Mapping varies by condition | If `type='B2B'` map to `company_table`, else `person_table` |
| Default | No source — target gets a default | `created_by = 'MIGRATION'` |
| Unmapped | Source field has no target (document why) | `legacy_ref` — no longer needed |

A transformation rule must be specific enough to implement and test. Prefer explicit input→output statements over prose.

### Migration vs integration

Distinguish the two, because they need different supporting detail:
- **Migration mapping** — one-time load from a legacy system. Include record counts, cleansing rules, and a rollback strategy.
- **Integration mapping** — ongoing real-time or batch flow. Include frequency, error handling, retry logic, and monitoring.

## Worked Example (neutral domain: customers & orders)

### Field catalogue (excerpt)

| Field ID | Entity | Field name (logical) | Field name (physical) | Data type | Length / precision | Required? | Allowed values / enum | Validation rules | Business definition |
|---|---|---|---|---|---|---|---|---|---|
| FLD-001 | Customer | Email Address | customer_email | String | 254 | Mandatory | — | Must contain `@`; unique per customer | Primary contact email for the account |
| FLD-002 | Order | Order Status | order_status | Enum | — | Mandatory | OrderStatus | Must be a valid OrderStatus code | Lifecycle state of the order |

`field-catalogue.csv`:

```csv
Field ID,Entity,Field name (logical),Field name (physical),Data type,Length / precision,Required?,Allowed values / enum,Validation rules,Business definition
FLD-001,Customer,Email Address,customer_email,String,254,Mandatory,,Must contain @; unique per customer,Primary contact email for the account
FLD-002,Order,Order Status,order_status,Enum,,Mandatory,OrderStatus,Must be a valid OrderStatus code,Lifecycle state of the order
```

### Enumerations (excerpt)

| Enum name | Code | Display value | Description | Active? |
|---|---|---|---|---|
| OrderStatus | NEW | New | Order placed, not yet paid | Yes |
| OrderStatus | PAID | Paid | Payment confirmed | Yes |
| OrderStatus | SHP | Shipped | Order dispatched | Yes |
| OrderStatus | CNL | Cancelled | Order cancelled before shipment | Yes |

`enumerations.csv`:

```csv
Enum name,Code,Display value,Description,Active?
OrderStatus,NEW,New,Order placed not yet paid,Yes
OrderStatus,PAID,Paid,Payment confirmed,Yes
OrderStatus,SHP,Shipped,Order dispatched,Yes
OrderStatus,CNL,Cancelled,Order cancelled before shipment,Yes
```

### S2T mapping (one row with a transformation rule)

| Map ID | Source system | Source field | Source type | Target system | Target field | Target type | Category | Transformation rule | Default / fallback | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| M-001 | Legacy Shop | ord_state | CHAR(1) | New Platform | order_status | Enum | Lookup | `N`→NEW, `P`→PAID, `S`→SHP, `C`→CNL | Error if unmapped code | Legacy used single-char codes |

`s2t-mapping.csv`:

```csv
Map ID,Source system,Source field,Source type,Target system,Target field,Target type,Category,Transformation rule,Default / fallback,Notes
M-001,Legacy Shop,ord_state,CHAR(1),New Platform,order_status,Enum,Lookup,N->NEW; P->PAID; S->SHP; C->CNL,Error if unmapped code,Legacy used single-char codes
```

## Quality Checklist

- [ ] Every field has a unique ID, logical name, and physical name
- [ ] Data types and formats are precise — length/precision included, never bare "string"
- [ ] Validation rules are testable and specific
- [ ] Personal/sensitive fields are flagged
- [ ] Every coded field references a complete enum in the enumeration table
- [ ] Entity relationships are directional and explicit
- [ ] S2T mapping covers all fields, including "unmapped" rows with rationale
- [ ] Each mapping row has a category and a concrete transformation rule with a default/fallback
- [ ] Migration vs integration mappings are distinguished with their extra detail
- [ ] Every Markdown table has a matching, column-aligned CSV

## Gotchas

- **No `.xlsx`.** Produce Markdown tables plus parallel CSV files, never a spreadsheet workbook. The Markdown and CSV must carry the same columns.
- **CSV escaping.** Commas inside a cell break the CSV. Either quote the cell (`"a, b"`) or rewrite the value to avoid the comma (the example replaces `","` with `";"` or removes it). Keep header rows identical to the Markdown column order.
- **Bare types are not acceptable.** "String" without a length, or "Decimal" without precision, is an incomplete spec.
- **Enums must be exhaustive.** A coded field that maps to an incomplete enum will silently drop or reject valid values; include sentinels like "unknown".
- **Always specify a default/fallback in S2T.** Every mapping needs a defined behaviour for missing or invalid source data — even if that behaviour is "reject".
- **Document unmapped source fields.** A source field with no target is a decision, not an omission; record why.
- **Keep examples domain-neutral** unless the project supplies its own vocabulary. Do not import domain-specific code systems or jargon the project has not introduced.
- Trace data fields back to requirements with **requirements-traceability-matrix**, and surface missing or conflicting data with **gap-impact-analysis**.

## Related

- **requirements-traceability-matrix** — trace each data field to the requirement(s) it satisfies
- **gap-impact-analysis** — analyse data gaps, missing fields, and unmapped sources
