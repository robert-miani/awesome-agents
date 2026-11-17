# Confluence to Jira Stories

## Description

Turns Confluence product requirements into Jira-ready stories, then — only after explicit approval — breaks the approved stories into Jira tasks. The skill owns the channel-specific work: intake from Confluence (pages, child pages, inline comments, decision tables, attachments, and source links), preservation of Confluence and Jira conventions (issue types, statuses, components, labels, fix versions, epics, custom fields, and Definition of Ready / Done), a two-phase approval checkpoint, and either publishing through Jira/Confluence MCP tooling or producing import-ready Jira drafts when that tooling is unavailable.

It deliberately does not restate decomposition rules. Vertical-slice logic is delegated to the `issue-decomposition` skill, and story / acceptance-criteria format is delegated to the `user-story-authoring` skill.

## When to Use

- Turning a Confluence requirements page into a reviewed set of Jira stories
- Mapping requirements, decisions, and comments to stories with full source traceability
- Running the approval checkpoint before any task-level work begins
- Breaking approved stories into Jira tasks after explicit sign-off
- Publishing to Jira via MCP tooling, or producing import-ready Jira drafts when tooling is unavailable
- Preserving existing Jira conventions (epics, components, labels, fix versions, custom fields, DoR/DoD)

## Usage

Activate this skill and point it at the Confluence source. Provide as much context as you have:

- The Confluence page (and child pages) URL or exported text, including inline comments and decision tables
- The Jira project and its conventions (issue types, components, labels, fix versions, epics, custom fields, DoR/DoD)
- Any existing epic or parent issue the stories should sit under
- Whether Jira/Confluence MCP tooling is available and whether you approve publishing

The skill intakes the requirements, normalizes them into vertical-slice story candidates, drafts the story breakdown with source mapping and AFK/HITL flags, and then **stops at an approval checkpoint**. Only after explicit approval does it break the stories into tasks and prepare Jira output.

## Example

**Input:** "Turn the Confluence *Saved Payment Methods* page into Jira stories."

**Output (story phase):** A story breakdown mapped to the page's requirements — for example three stories (*Save a card at checkout*, *Reuse a saved card*, *Delete a saved card*) each with a user story, acceptance criteria, source references (R1–R3 plus the PCI decision comment), dependency order, and AFK/HITL classification — followed by an explicit request to approve granularity and dependency order before any tasks are created.

**After approval:** The approved stories are broken into Jira tasks tied to their parent story and acceptance criteria, and published via MCP tooling or returned as import-ready Jira drafts (stories first, then tasks in dependency order).

## Requirements

- A Confluence source: page URL/export, or pasted requirement text including comments and decision tables
- Jira project conventions when available (issue types, components, labels, fix versions, epics, custom fields, DoR/DoD)
- Jira/Confluence MCP tooling when direct publishing is desired; otherwise the skill produces import-ready drafts
- The `issue-decomposition` skill for vertical-slice decomposition logic
- The `user-story-authoring` skill for story and acceptance-criteria format
