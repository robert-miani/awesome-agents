---
name: common-plantuml-diagram
description: "Use when: generating PlantUML diagrams — sequence, class, ER, state, component/architecture, activity with swimlanes, deployment, use case, mindmap, and other PlantUML diagram types. Produces .puml source files and .svg renders referenced from markdown. For diagrams that must render natively in GitHub/Bitbucket without SVG files, use the mermaid skill instead."
---

# PlantUML Diagram Generator

Generate diagrams as `.puml` source files, render to `.svg`, and reference the SVG from markdown. PlantUML does not render natively in GitHub or Bitbucket — the SVG workflow is required.

## Prerequisites

Check in order before generating any diagram:

1. **Local plantuml** — run `plantuml -version`. If it succeeds, use:
   ```bash
   plantuml -tsvg <file>.puml
   ```
2. **Docker** — if plantuml is not installed locally, use:
   ```bash
   docker run --rm -v "$(pwd)":/data plantuml/plantuml -tsvg /data/<file>.puml
   ```
3. **Neither available** — stop and tell the user that either `plantuml` (e.g. `brew install plantuml`) or Docker is a prerequisite before proceeding.

## File Placement

Diagrams belong alongside the document that references them. The default convention is a **sibling folder named after the markdown file**:

```
docs/adrs/0042_event_sourcing.md          ← the document
docs/adrs/0042_event_sourcing/            ← diagram folder (same name, no extension)
    event_flow.puml
    event_flow.svg
```

Referenced from the markdown file as:
```markdown
![Event Flow](0042_event_sourcing/event_flow.svg)
```

**Placement rules (in priority order):**

1. **Project CLAUDE.md or in-context instructions** — if the project specifies a diagrams location, use that path exactly.
2. **Known document context** — if you know which markdown file will reference the diagram, create the sibling folder as shown above.
3. **No document context** — default to `docs/diagrams/`.

## Workflow

1. Determine the correct placement using the rules above
2. Write diagram source as `<name>.puml` in that folder
3. Generate SVG using the appropriate command above
4. Commit both `.puml` and `.svg`
5. Reference in the markdown file: `![Description](<folder>/<name>.svg)`

## Choosing the Right Diagram Type

| Goal | Diagram type |
|---|---|
| Interactions over time | sequence |
| Object structure & inheritance | class |
| Database schema | entity-relationship |
| Lifecycle / state transitions | state |
| Component structure & dependencies | component / architecture |
| Process flow with actor lanes | activity with swimlanes |
| Infrastructure & hosting topology | deployment |
| System scope & actor goals | use case |
| Hierarchical structure / brainstorming | mindmap |
| Signal timing, hardware/protocol | timing |
| Project schedule | Gantt |
| Task decomposition | WBS |
| UI wireframes | Salt |
| Network topology | nwdiag |
| Enterprise architecture layers | Archimate |
| Business process flows | BPMN |

## Diagram Syntax

### Sequence
```plantuml
@startuml
participant Client
participant "API Gateway" as API
participant Service

Client -> API : POST /resource
API -> Service : Process(request)
Service --> API : Result
API --> Client : 200 OK

alt error case
    Service --> API : Error
    API --> Client : 500
end
@enduml
```

### Component / Architecture
```plantuml
@startuml
skinparam componentStyle rectangle
skinparam linetype ortho

package "Service Layer" {
    [Service A] as A
    [Service B] as B
}
database "PostgreSQL" as DB
queue "Message Bus" as Bus

A --> DB
A --> Bus
Bus --> B
@enduml
```

### Class
```plantuml
@startuml
abstract class BaseEntity {
    +Id: Guid
    +CreatedAt: DateTime
}

class Order {
    +Status: OrderStatus
    +Place(): void
}

enum OrderStatus {
    Draft
    Placed
    Cancelled
}

BaseEntity <|-- Order
Order --> OrderStatus
@enduml
```

### Entity Relationship
```plantuml
@startuml
entity "Customer" {
    * customer_id : UUID <<PK>>
    --
    * email : VARCHAR
}

entity "Order" {
    * order_id : UUID <<PK>>
    --
    * customer_id : UUID <<FK>>
    * status : VARCHAR
}

Customer ||--o{ Order : places
@enduml
```

### State
```plantuml
@startuml
[*] --> Draft
Draft --> Active : activate
Active --> Suspended : suspend
Active --> Closed : close
Suspended --> Active : reactivate
Suspended --> Closed : close
Closed --> [*]
@enduml
```

### Activity with Swimlanes
```plantuml
@startuml
|Actor A|
start
:Step 1;

|Actor B|
:Step 2;
if (Condition?) then (yes)
    :Step 3a;
else (no)
    :Step 3b;
endif

|Actor A|
:Step 4;
stop
@enduml
```

### Deployment
```plantuml
@startuml
node "Cloud" {
    node "App Tier" {
        [Service A]
        [Service B]
    }
    database "DB" as db
    queue "Bus" as bus
}
[Service A] --> db
[Service A] --> bus
bus --> [Service B]
@enduml
```

### Use Case
```plantuml
@startuml
left to right direction
actor User
actor Admin

rectangle "System" {
    usecase "Feature A" as UC1
    usecase "Feature B" as UC2
    usecase "Manage Users" as UC3
}

User --> UC1
User --> UC2
Admin --> UC3
UC2 ..> UC1 : <<include>>
@enduml
```

### Mindmap
```plantuml
@startmindmap
* Root Topic
** Branch A
*** Leaf 1
*** Leaf 2
** Branch B
*** Leaf 3
@endmindmap
```

## Styling

Use PlantUML defaults. To draw attention to a specific element, use a `note` or apply a background colour to that element only — avoid broad `skinparam` overrides that change the overall look.

```plantuml
' Highlight with a note (sequence diagram)
@startuml
participant ServiceA
participant ServiceB
ServiceA -> ServiceB : request
note over ServiceA : Critical path
@enduml
```

```plantuml
' Highlight a component with colour
@startuml
skinparam component {
    BackgroundColor<<hot>> #FFD700
}
[Key Component] <<hot>>
[Other Component]
[Key Component] --> [Other Component]
@enduml
```

## Output

Always produce two files per diagram:

- `<name>.puml` — source, kept for future edits
- `<name>.svg` — generated output, committed alongside the source

Reference in markdown:
```markdown
![Diagram title](<name>.svg)
```

Place both files in the same directory as the markdown file referencing them, or in a dedicated `diagrams/` subdirectory.
