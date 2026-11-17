# docx-to-md

## Description

Converts a `.docx` file to a clean, structured Markdown document. Extracts headings, paragraphs, tables, code blocks, and lists from the Word XML and emits numbered headings, a generated Table of Contents, and fenced code blocks with language detection. The source `.docx` is never modified.

## When to Use

- A Word document needs to be converted to Markdown for use in a code repository, wiki, or documentation site.
- Documentation is maintained in `.docx` format and must be integrated into a Markdown-based workflow.
- A merged or copy-pasted Word document contains duplicate sections that need to be cleaned up during conversion.

## Usage

```
/docx-to-md <path-to-file.docx> [output-path.md]
```

If `output-path` is omitted, the output is written to the same directory as the source file with the same base name and a `.md` extension.

## Example

```
/docx-to-md ./docs/architecture.docx
# → writes ./docs/architecture.md

/docx-to-md ./specs/api-spec.docx ./output/api-spec.md
# → writes ./output/api-spec.md
```

The output includes:
- Auto-numbered headings (`# 1. Introduction`, `## 1.1. Overview`, …)
- A generated Table of Contents after the document title
- Fenced code blocks with language tags (`json`, `csharp`, `bash`, `env`)
- Markdown tables with header rows and separators
- Merged content when duplicate sections are detected

## Requirements

- **Platform:** Windows (uses PowerShell + `System.IO.Compression.FileSystem` for in-memory ZIP extraction)
- **Tools:** PowerShell 5.1+
- **Input:** A valid `.docx` file (Office Open XML format)
- **No external dependencies** — uses only built-in .NET assemblies
