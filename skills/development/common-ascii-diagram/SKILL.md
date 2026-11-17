---
name: common-ascii-diagram
description: "Use when: generating ASCII art diagrams, text-based diagrams, diagrams for terminals, plain text documentation, environments without Mermaid rendering support, code comments with diagrams."
---

# ASCII Diagram Generator

Generate diagrams using ASCII art that works everywhere — terminals, plain text files, code comments, emails, and any environment without rendering support.

## Diagram Styles

### Box-and-Arrow Flowchart
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  Processor  │────▶│   Output    │
│      A      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Database   │
                    └─────────────┘
```

### Simple Box Style (ASCII-only)
```
+-------------+     +-------------+     +-------------+
|  Component  |---->|  Processor  |---->|   Output    |
|      A      |     |             |     |             |
+-------------+     +-------------+     +-------------+
```

### Sequence Diagram
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

### Hierarchical Tree
```
PLCP.Unitization
├── src/
│   └── plcp_separator/
│       ├── config.py
│       ├── pipeline/
│       │   ├── orchestrator.py
│       │   └── processors/
│       ├── services/
│       │   ├── azure_ai_service.py
│       │   └── aws_ai_service.py
│       └── utils/
├── tests/
│   ├── unit/
│   └── integration/
└── docs/
```

### Data Flow
```
    ┌──────────┐
    │  Input   │
    │  Queue   │
    └────┬─────┘
         │
         ▼
┌────────────────┐
│  PDF Document  │
└────────┬───────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌──────┐
│ OCR  │  │ Doc  │
│      │  │ Intel│
└──┬───┘  └──┬───┘
   │         │
   └────┬────┘
        ▼
  ┌───────────┐
  │    LLM    │
  │ Processing│
  └─────┬─────┘
        │
        ▼
  ┌───────────┐
  │  Summary  │
  │   JSON    │
  └───────────┘
```

### State Machine
```
                    ┌─────────────────────────────────┐
                    ▼                                 │
┌───────┐     ┌──────────┐     ┌───────────┐     ┌───┴───┐
│ IDLE  │────▶│PROCESSING│────▶│ COMPLETED │     │ ERROR │
└───────┘     └────┬─────┘     └───────────┘     └───────┘
                   │                                  ▲
                   └──────────────────────────────────┘
```

### Component Relationship
```
┌─────────────────────────────────────────────────┐
│                 PLCP Unitization                │
├────────────────────────┬────────────────────────┤
│       Pipeline         │        Services        │
│  ┌──────────────────┐  │  ┌──────────────────┐  │
│  │   Orchestrator   │──┼─▶│ Azure OpenAI Svc │  │
│  └────────┬─────────┘  │  └──────────────────┘  │
│           │            │  ┌──────────────────┐  │
│           │            │  │ AWS Bedrock Svc  │  │
│  ┌────────▼─────────┐  │  └──────────────────┘  │
│  │    Processors    │──┼─▶┌──────────────────┐  │
│  └──────────────────┘  │  │  Doc Intel Svc   │  │
│                        │  └──────────────────┘  │
└────────────────────────┴────────────────────────┘
```

## Character Reference

### Box Drawing (Unicode)
```
Corners: ┌ ┐ └ ┘
Lines:   ─ │
T-joins: ├ ┤ ┬ ┴ ┼
Arrows:  ▶ ◀ ▲ ▼ ► ◄
```

### ASCII-Only (Maximum Compatibility)
```
Corners: + 
Lines:   - |
Arrows:  > < ^ v -->  <--
```

## Generation Guidelines

1. **Choose style based on target**:
   - Code comments → ASCII-only (`+`, `-`, `|`)
   - Documentation → Unicode box drawing (`┌`, `─`, `│`)
   - Terminal output → Unicode (most modern terminals support it)

2. **Consistent spacing** — Use monospace assumptions (each char = 1 unit width)

3. **Alignment matters** — Ensure boxes and arrows line up properly

4. **Keep it simple** — ASCII diagrams get messy quickly; focus on key relationships

5. **Add legends when needed**:
   ```
   Legend:
   ──────▶  Data flow
   ─ ─ ─ ▶  Optional/async
   ══════▶  Control flow
   ```

## Output Format

Always wrap ASCII diagrams in a fenced code block (no language identifier or use `text`):

````markdown
```
┌─────────┐     ┌─────────┐
│  Box A  │────▶│  Box B  │
└─────────┘     └─────────┘
```
````

## PLCP-Specific Patterns

### Pipeline Processing
```
┌─────────┐   ┌───────────────────────────────┐   ┌──────────┐
│  Queue  │──▶│         PLCP Pipeline         │──▶│  Output  │
│ Message │   │                               │   │   Blob   │
└─────────┘   │ ┌─────┐   ┌─────┐   ┌───────┐ │   └──────────┘
              │ │ OCR │──▶│ LLM │──▶│Summary│ │
              │ └─────┘   └─────┘   └───────┘ │
              └───────────────────────────────┘
```

### Config Loading
```
┌──────────────────────────────────────────┐
│            Config Sources                │
│  (Later sources override earlier ones)   │
│                                          │
│  ┌────────────┐                          │
│  │  Defaults  │◀─ Lowest priority        │
│  └─────┬──────┘                          │
│        ▼                                 │
│  ┌────────────┐                          │
│  │ Azure App  │                          │
│  │   Config   │                          │
│  └─────┬──────┘                          │
│        ▼                                 │
│  ┌────────────┐                          │
│  │    .env    │                          │
│  └─────┬──────┘                          │
│        ▼                                 │
│  ┌────────────┐                          │
│  │  Env Vars  │                          │
│  └─────┬──────┘                          │
│        ▼                                 │
│  ┌────────────┐                          │
│  │ Init Args  │◀─ Highest priority       │
│  └────────────┘                          │
└──────────────────────────────────────────┘
```
