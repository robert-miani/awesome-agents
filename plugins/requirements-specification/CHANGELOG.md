# Changelog — requirements-specification

## [0.2.0] — 2026-06-24

### Added
- `requirements-source-ingestion` — turn existing docs, transcripts, wikis, and PRDs into structured requirements with source traceability
- `user-story-authoring` — canonical user stories, epics, and Gherkin acceptance criteria with MoSCoW/INVEST
- `prd-authoring` — synthesize a PRD from existing context
- `requirements-grilling` — one-question-at-a-time interrogation to sharpen scope (code-aware or docs-only)
- `gap-impact-analysis` — current-vs-future-state gap and change-impact analysis
- `requirements-traceability-matrix` — RTM linking objectives→requirements→stories→AC→tests
- `process-flow-modelling` — interactive HTML process flow / swimlane visualisations
- `issue-decomposition` — break approved scope into vertical-slice tracker issues
- `confluence-to-jira-stories` — Confluence requirements → Jira stories → tasks (after approval)
- `business-analyst` persona agent (thin router over the bundled skills)
- `.mcp.json` — Atlassian (Confluence + Jira) via the official Atlassian Remote MCP Server (`mcp-remote`, OAuth, no committed secrets)
- `hooks/hooks.json` — `SessionStart` prompt hook injecting the cross-skill pipeline, approval checkpoints, HITL/AFK rules, traceability defaults, and the "never pretend a tracker was updated" guardrail

### Changed
- `recommendedFor` now includes Technical Analyst

## [0.1.0] — 2026-06-16

### Added
- Initial release (🚧 in progress — dedicated specification skills planned)
- `docx-to-md` — converts Word documents and stakeholder notes to Markdown
- `common-ascii-diagram` — generates ASCII diagrams for lightweight spec documentation
- `common-mermaid-diagram` — generates Mermaid diagrams (flowchart, sequence, ER)
- `common-plantuml-diagram` — generates PlantUML diagrams for structured specs
- `git-commit` — standardised git commit workflow
