# docx-to-md — Implementation Guide

Detailed PowerShell code examples and reference tables for each step in the conversion process.

---

## Step 1 — Extract the document XML

DOCX files are ZIP archives. Use PowerShell to unzip `word/document.xml` in-memory:

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$reader = New-Object System.IO.StreamReader($entry.Open())
$content = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
```

Save to a temp file for parsing. Extract `word/numbering.xml` and `word/styles.xml` the same way if list styles need resolving.

---

## Step 2 — Parse paragraphs and tables

Always create a namespace manager before any XPath call:

```powershell
[xml]$xml = Get-Content $tempXmlPath -Encoding UTF8
$nsmgr = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$nsmgr.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
```

For each child of `$xml.document.body`:
- **`w:p` (paragraph):** read `w:pPr/w:pStyle/@w:val` for the style name; collect all `w:r/w:t` text nodes; read `w:pPr/w:numPr` for list level.
- **`w:tbl` (table):** iterate `w:tr` → `w:tc`, collect cell text via `.//w:t`.
- Walk `w:hyperlink` children inside paragraphs to capture link text.

---

## Step 3 — Style → Markdown mapping table

Survey unique style names first: `$items | Select-Object Style -Unique`

| Word style | Markdown output |
|------------|-----------------|
| `a5`, `a6`, `Title` | Document title (`# ` with no number) |
| `a7`, `Subtitle` | Subtitle (bold paragraph, not a heading) |
| `1`, `Heading1`, `h1` | `# N. ` |
| `2`, `Heading2`, `h2` | `## N.N. ` |
| `3`, `Heading3`, `h3` | `### N.N.N. ` |
| `4`, `Heading4`, `h4` | `#### N.N.N.N. ` |
| `SourceCode`, `Code` | fenced code block ` ``` ` |
| `Compact`, `ListParagraph` | bullet list item (`- `) |
| `Normal`, `a0`, `FirstParagraph` | regular paragraph |
| `ImageCaption` | skip or italicize |
| `ac` | blockquote (`> `) |

> **Note:** Style names above (`a5`, `a7`, `Compact`, etc.) are from the SimpliGov documentation template. Real documents will differ — always survey first.

Number headings automatically: track `[h1, h2, h3, h4]`; reset lower levels when a higher level increments.

---

## Step 4 — Code language detection

Inspect the text of `SourceCode` paragraphs to pick a fence language tag:

| Heuristic | Language tag |
|-----------|-------------|
| Starts with `{`, `[{`, or `"` (JSON-like) | `json` |
| Contains `public class`, `public void`, `string `, `var `, `=>` | `csharp` |
| Contains `docker `, `uv run`, `git `, `npm `, `bash` | `bash` |
| Contains `$`, `─►`, `│`, `└`, `├`, `▼` (ASCII diagrams) | _(none)_ |
| `KEY=value` patterns | `env` |
| Default | _(none)_ |

Consecutive `SourceCode` paragraphs belong to the same block — buffer and flush on style change.

---

## Step 7 — Strip garbled section numbers

Word auto-numbering artifacts appear when content is copy-pasted across sections (e.g. `7.3.23.2 Authentication`). Strip them:

```python
import re
clean = re.sub(r'^[\d]+\.[\d.]*\s*', '', heading_text)
```

Correct heading numbers come from the counter in Step 3, not the document text.

---

## Step 8 — TOC anchor generation

GitHub/CommonMark anchor rules for `## Table of Contents` link targets:

1. Lowercase all characters
2. Replace spaces with `-`
3. Remove all punctuation except `-`
4. Collapse multiple consecutive `-` to one

Example:

```markdown
## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1. Background](#11-background)
    - [1.1.1. Prior Art](#111-prior-art)
```
