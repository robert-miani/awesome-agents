# Clean Code

## Description

Applies clean code principles to improve code quality, readability, and maintainability. Covers naming conventions, function design, SOLID principles, DRY elimination, code organization, and complexity reduction across any programming language.

## When to Use

- Refactoring existing code for clarity
- Reviewing code for clean code violations
- Improving naming conventions
- Reducing complexity and code smells
- Applying SOLID principles
- Eliminating DRY violations
- Organizing code structure

## Usage

Activate this skill when writing, reviewing, or refactoring code. The skill provides guidance on:

- Naming (intention-revealing, pronounceable, searchable names)
- Functions (small, single-responsibility, minimal arguments)
- Comments (explain WHY not WHAT, self-documenting code)
- Formatting (consistent indentation, vertical density)
- Error handling (exceptions over error codes)
- SOLID principles (SRP, OCP, LSP, ISP, DIP)

## Example

**Before:**

```csharp
public List<int[]> getThem() {
    List<int[]> list1 = new ArrayList<>();
    for (int[] x : theList)
        if (x[0] == 4) list1.add(x);
    return list1;
}
```

**After:**

```csharp
public List<Cell> getFlaggedCells() {
    List<Cell> flaggedCells = new ArrayList<>();
    for (Cell cell : gameBoard)
        if (cell.isFlagged()) flaggedCells.add(cell);
    return flaggedCells;
}
```

## Requirements

- No external tools required
- Language-agnostic principles applicable to any codebase
