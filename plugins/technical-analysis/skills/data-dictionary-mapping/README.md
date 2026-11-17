# Data Dictionary & Mapping

## Description

Authors data dictionaries and source-to-target (S2T) mappings. The skill owns the field catalogue (logical and physical name, type, length, nullability, allowed values, validation rules, and business meaning), enumeration/reference-data sheets, an entity relationship summary, and the S2T mapping with transformation rules, defaults, and fallbacks. Deliverables are produced as Markdown tables with a parallel `.csv` per table — Excel-openable and git-diffable — rather than `.xlsx` workbooks.

## When to Use

- Defining a data dictionary or field catalogue for a system or feature
- Documenting field specs: type, length, nullability, format, validation rules, and business meaning
- Cataloguing enumerations or reference data (allowed values, codes, display labels)
- Summarising entities and their relationships
- Writing a source-to-target (S2T) mapping for a data migration or integration
- Specifying transformation rules for how fields move and change between systems
- Reviewing an existing dictionary or mapping for completeness and precision

## Usage

Activate this skill and describe the data you need to define or map. Provide as much context as you have:

- The entities and systems in scope
- The source(s) of each data element and the target system(s)
- Whether this is a one-time migration or an ongoing integration
- Any existing schema, sample data, or reference-data lists

The skill sketches the entity relationships first, catalogues fields one entity at a time, extracts coded fields into enumeration tables, and then builds the S2T mapping with a classified, testable transformation rule for each row. It emits a Markdown document plus a parallel CSV for each table.

## Example

**Input:** "Create a data dictionary for our customers and orders, and map the legacy shop's order state into the new platform's status enum."

**Output:** A Markdown document and parallel CSV files such as:

```text
docs/data/
  data-dictionary.md          (field catalogue + enumerations + entity relationships + S2T mapping)
  field-catalogue.csv
  enumerations.csv
  entity-relationships.csv
  s2t-mapping.csv
```

The field catalogue lists each element with its type, length, allowed values, validation rules, and business definition; `OrderStatus` is captured as a complete enum; and the S2T mapping includes a row mapping the legacy single-char `ord_state` to the new `order_status` enum via a lookup rule (`N`→NEW, `P`→PAID, `S`→SHP, `C`→CNL) with an "error if unmapped code" fallback.

## Requirements

- A repository with a data documentation location, preferably configured in `CLAUDE.md` or under `docs/data/`
- Enough context to identify entities, field-level details, sources, and targets
- For S2T mappings: knowledge of both source and target schemas (or sample data)
- Related skills: `requirements-traceability-matrix` (trace data fields to requirements) and `gap-impact-analysis` (analyse data gaps and unmapped sources)
