---
name: common-clean-code
description: 'Apply clean code principles. Use when: refactoring code, improving readability, reducing complexity, applying SOLID principles, naming conventions, code organization, reducing code smell, DRY violations.'
---

# Clean Code

Apply clean code principles to improve code quality, readability, and maintainability.

## When to Use

- Refactoring existing code for clarity
- Reviewing code for clean code violations
- Improving naming conventions
- Reducing complexity and code smells
- Applying SOLID principles
- Eliminating DRY violations
- Organizing code structure

## Principles

### Naming

- Use intention-revealing names
- Avoid disinformation (misleading names)
- Make meaningful distinctions
- Use pronounceable and searchable names
- Avoid encodings and prefixes
- Class names should be nouns
- Method names should be verbs

### Functions

- Keep functions small (ideally < 20 lines)
- Do one thing only
- Use descriptive names
- Minimize arguments (0-2 ideal, 3 max)
- Avoid side effects
- Command-Query Separation: functions should either do something OR return something, not both
- No side effects

### Comments

- Code should be self-documenting
- Comments explain WHY, not WHAT
- Remove commented-out code
- Avoid redundant comments
- Use docstrings for public APIs

### Formatting

- Consistent indentation and spacing
- Related code should be vertically close
- Declare variables close to usage
- Keep lines reasonably short

### SOLID Principles

| Principle | Description |
|-----------|-------------|
| **S**ingle Responsibility | A class should have only one reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable for their base types |
| **I**nterface Segregation | Many specific interfaces over one general interface |
| **D**ependency Inversion | Depend on abstractions, not concretions |

### Code Smells to Avoid

- Long methods
- Large classes
- Duplicate code
- Dead code
- Magic numbers/strings
- Deep nesting
- Long parameter lists
- Feature envy
- Inappropriate intimacy

## Procedure

1. **Identify** the target code to clean
2. **Analyze** for violations of clean code principles
3. **Prioritize** issues by impact and effort
4. **Refactor** incrementally with tests
5. **Verify** functionality is preserved
6. **Document** significant changes

## Output Format

When reviewing code, provide:
- Specific issues found with line references
- Principle violated
- Suggested improvement with code example
