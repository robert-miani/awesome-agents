---
name: docx-to-md
description: >
  Converts a .docx Word document to a clean, structured Markdown file. Handles headings, tables,
  code blocks, bullet lists, hyperlinks, and generates a Table of Contents automatically. Use when
  the user provides a .docx file, mentions a Word document, asks to convert or migrate
  documentation to Markdown, or wants to import a Word file into a repository or wiki.
license: Proprietary
compatibility: >
  Requires Windows with PowerShell 5.1+. Uses the built-in System.IO.Compression.FileSystem
  .NET assembly for ZIP extraction — no third-party dependencies needed.
metadata:
  author: awesome-agents
  version: "1.0"
allowed-tools: PowerShell Read Write
---

Convert a `.docx` file to a clean, structured Markdown document. The DOCX is treated as read-only — never modify it.

## Usage

```
/docx-to-md <path-to-file.docx> [output-path.md]
```

If `output-path` is omitted, write the output to the same directory as the source file, using the same base name with a `.md` extension.

## Process overview

1. **Extract XML** — unzip `word/document.xml` in-memory via PowerShell; also extract `word/numbering.xml` and `word/styles.xml` if list styles are needed
2. **Parse body nodes** — walk `w:p` (paragraph) and `w:tbl` (table) children; always use an XML namespace manager for the `w:` namespace
3. **Map styles to Markdown** — translate Word style names to headings, lists, code blocks, and blockquotes; auto-number headings with a `[h1,h2,h3,h4]` counter array
4. **Detect code language** — inspect `SourceCode` paragraph text to assign `json`, `csharp`, `bash`, or `env` fence tags; buffer consecutive `SourceCode` paragraphs into a single block
5. **Render tables** — first row is the header; emit pipe-table syntax with a separator row; use a single space for empty cells
6. **Merge duplicates** — detect repeated section headings (common in merged documents); keep the most complete version of tables, lists, and paragraphs
7. **Strip garbled numbers** — remove Word auto-numbering artifacts from heading text (e.g. `7.3.23.2 Authentication`); correct numbers come from step 3
8. **Generate TOC** — emit a `## Table of Contents` after the document title using CommonMark anchor rules (lowercase, spaces→hyphens, punctuation stripped)
9. **Write and verify** — emit the output file; confirm code fences are balanced, no heading is duplicated, and at least one `#` heading is present; delete all temp XML files

For detailed PowerShell code examples and the full style-mapping table, see [references/implementation-guide.md](references/implementation-guide.md).

## Gotchas

- **Namespace manager is mandatory.** `SelectSingleNode("w:pPr/w:pStyle", $nsmgr)` fails with "Namespace prefix 'w' is not defined" if you pass `$null` as the manager. Always create and populate `$nsmgr` before any XPath call.
- **Hyperlinks are `w:hyperlink` siblings, not `w:r` children.** Walk `w:hyperlink/w:r/w:t` separately from direct `w:r/w:t` to avoid missing linked text.
- **Consecutive SourceCode paragraphs are one block.** Buffer `SourceCode`-styled `<w:p>` elements and close the fence only when the next paragraph has a different style.
- **Style names vary by template.** Survey unique style names first (`$items | Select-Object Style -Unique`) before applying the mapping table.
- **Temp files must be cleaned up.** Delete `doc_raw.xml`, `doc_numbering.xml`, `doc_styles.xml` after the conversion completes.
