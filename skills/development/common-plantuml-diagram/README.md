# PlantUML Diagram Generator

## Description

Generates diagrams using PlantUML syntax and renders them as SVG files. Because PlantUML does not render natively in GitHub or Bitbucket markdown, diagrams are maintained as `.puml` source files committed alongside their generated `.svg` output, which is then referenced from markdown.

## When to Use

- Generating sequence, component, class, or ER diagrams for documentation
- Creating architecture or deployment diagrams that need precise layout control
- Adding use case diagrams, state diagrams, activity diagrams with swimlanes, or mindmaps
- Producing visuals that display reliably in GitHub, Bitbucket, and any markdown viewer

## Usage

Activate this skill and describe the diagram you need. Specify:

- The type of diagram (sequence, class, ER, state, deployment, use case, activity, mindmap, etc.)
- Components, relationships, and flow direction
- Any grouping or highlighting requirements

## Example

**Input:** "Create a sequence diagram showing user authentication flow"

**Output:** `auth-flow.puml` source file and `auth-flow.svg` generated from it. The following line is added to your documentation markdown to display the diagram:

```markdown
![Auth Flow](auth-flow.svg)
```

*(The SVG reference above is intentionally a code snippet — the actual rendered samples are in the gallery below.)*

## Requirements

One of the following is required to generate SVG files:

- **plantuml CLI** — `brew install plantuml` (macOS), or download from [plantuml.com](https://plantuml.com/download)
- **Docker** — used to run `plantuml/plantuml` image (no local install needed)

If neither is available, SVG files cannot be generated and diagrams will not render correctly when referenced from markdown.

---

## Sample Diagrams

### Sequence — [source](samples/sequence.puml)

![User Authentication Flow](samples/sequence.svg)

### Component / Architecture — [source](samples/architecture.puml)

![Microservices Architecture](samples/architecture.svg)

### Class — [source](samples/class.puml)

![Domain Class Diagram](samples/class.svg)

### Entity Relationship — [source](samples/er.puml)

![E-Commerce Entity Relationship](samples/er.svg)

### State — [source](samples/state.puml)

![Order Lifecycle](samples/state.svg)

### Activity with Swimlanes *(PlantUML only)* — [source](samples/activity-swimlanes.puml)

![Order Processing Flow](samples/activity-swimlanes.svg)

### Deployment *(PlantUML only)* — [source](samples/deployment.puml)

![Cloud Deployment Architecture](samples/deployment.svg)

### Use Case *(PlantUML only)* — [source](samples/usecase.puml)

![E-Commerce Use Cases](samples/usecase.svg)

### Mindmap *(PlantUML only)* — [source](samples/mindmap.puml)

![Microservices Architecture Concerns](samples/mindmap.svg)
