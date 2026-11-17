# ASCII Diagram Generator

## Description

Generates diagrams using ASCII art that works everywhere — terminals, plain text files, code comments, emails, and any environment without rendering support. Supports box-and-arrow flowcharts, sequence diagrams, hierarchical trees, and more using Unicode box-drawing characters or plain ASCII.

## When to Use

- Generating ASCII art diagrams for documentation
- Creating text-based diagrams for terminals or CLI output
- Adding diagrams to plain text documentation or READMEs without Mermaid support
- Embedding diagrams in code comments
- Producing visuals for environments without rendering support (emails, logs)

## Usage

Activate this skill and describe the diagram you need. Specify:

- The type of diagram (flowchart, sequence, tree, table, etc.)
- Components and their relationships
- Whether to use Unicode box-drawing characters (`┌─┐`) or plain ASCII (`+--+`)

## Example

**Input:** "Create an ASCII diagram showing a request flowing from Client to API to Service to Database"

**Output:**

```
  Client          API           Service         Database
    │              │               │               │
    │──Request────▶│               │               │
    │              │──Process─────▶│               │
    │              │               │──Query───────▶│
    │              │               │◀──Result──────│
    │              │◀──Response────│               │
    │◀──Result─────│               │               │
    │              │               │               │
```

## Requirements

- No external tools required
- Works with any text editor or terminal
