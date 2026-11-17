---
name: common-mermaid-diagram
description: "Use when: generating Mermaid diagrams, flowcharts, sequence diagrams, class diagrams, entity relationship diagrams, state diagrams, C4 diagrams in Mermaid syntax. Renders in GitHub, VS Code, and documentation tools."
---

# Mermaid Diagram Generator

Generate diagrams using Mermaid syntax that render beautifully in GitHub, VS Code, and most documentation platforms.

## Supported Diagram Types

### Flowchart / Architecture
```mermaid
flowchart TD
    A[Component A] --> B[Component B]
    B --> C{Decision}
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
```

### Sequence Diagram
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    Client->>API: Request
    API->>Service: Process
    Service-->>API: Response
    API-->>Client: Result
```

### Class Diagram
```mermaid
classDiagram
    class BaseClass {
        +attribute: type
        +method(): return_type
    }
    BaseClass <|-- DerivedClass
```

### Entity Relationship
```mermaid
erDiagram
    ENTITY_A ||--o{ ENTITY_B : has
    ENTITY_B }|--|| ENTITY_C : belongs_to
```

### State Diagram
```mermaid
stateDiagram-v2
    [*] --> State1
    State1 --> State2: trigger
    State2 --> [*]
```

### C4 Context Diagram
```mermaid
C4Context
    title System Context Diagram
    Person(user, "User", "Description")
    System(system, "System", "Description")
    System_Ext(external, "External System", "Description")
    Rel(user, system, "Uses")
    Rel(system, external, "Calls")
```

## Generation Guidelines

1. **Choose the right diagram type** for the content:
   - Architecture/flow → `flowchart`
   - Interactions over time → `sequenceDiagram`
   - Object relationships → `classDiagram`
   - Data models → `erDiagram`
   - Lifecycle/state → `stateDiagram-v2`
   - System boundaries → `C4Context` / `C4Container`

2. **Use clear, descriptive labels** — Avoid abbreviations unless widely known

3. **Direction matters**:
   - `TD` (top-down) for hierarchies
   - `LR` (left-right) for processes/flows
   - `TB` (top-bottom) same as TD

4. **Style for clarity**:
   ```mermaid
   flowchart TD
       classDef service fill:#f9f,stroke:#333
       classDef database fill:#bbf,stroke:#333
       A[Service]:::service --> B[(Database)]:::database
   ```

5. **Keep it readable** — Break complex diagrams into multiple focused diagrams

## Output Format

Always wrap Mermaid code in a fenced code block with `mermaid` language identifier:

````markdown
```mermaid
flowchart TD
    ...
```
````

## PLCP-Specific Patterns

For the PLCP Unitization project, common patterns include:

### Pipeline Flow
```mermaid
flowchart LR
    subgraph Input
        A[PDF Documents]
        B[Queue Message]
    end
    subgraph Processing
        C[OCR/Document Intelligence]
        D[LLM Processing]
        E[Summarization]
    end
    subgraph Output
        F[Blob Storage]
        G[Completion Queue]
    end
    A --> C --> D --> E --> F
    B --> C
    E --> G
```

### Service Integration
```mermaid
flowchart TD
    subgraph Azure
        AI[Azure OpenAI]
        DI[Document Intelligence]
        Blob[Blob Storage]
        SB[Service Bus]
    end
    subgraph AWS
        Bedrock[AWS Bedrock]
    end
    App[PLCP Unitization] --> AI
    App --> DI
    App --> Blob
    App --> SB
    App --> Bedrock
```
