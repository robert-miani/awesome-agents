# How to Add Plugin Hooks

> **Creating a new plugin?** The `plugin-create` skill handles hook scaffolding automatically in Phase 4 — it analyses your bundled skills, drafts the cross-skill rules, and confirms the hook prompt with you before writing `hooks/hooks.json`. Use this guide when **manually editing or maintaining** an existing `hooks/hooks.json`.

Plugin hooks let a plugin respond to Claude Code lifecycle events automatically — no user invocation required. This guide covers the most important pattern: injecting cross-skill workflow rules into Claude's context at session start.

---

## When to use hooks

Use a hook when the plugin bundles multiple skills and has orchestration rules that Claude must know *before* any skill is invoked:

- Skill load order and dependencies across the full plugin
- Scenario branching rules ("use `react-scaffold` only for new projects")
- Cross-skill gotchas that no single `SKILL.md` owns

Rules that belong to one skill stay in that skill's `SKILL.md`. The hook is for logic that sits *above* individual skills and would otherwise only live in the README (which Claude does not read automatically).

---

## File location

```
plugins/<plugin-name>/
└── hooks/
    └── hooks.json
```

The `hooks/` directory must be at the **plugin root**, not inside `.claude-plugin/`.

---

## The SessionStart + prompt pattern

The `SessionStart` event fires when a session begins or resumes. Pairing it with `type: "prompt"` injects text directly into Claude's context at that moment.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "<your workflow rules here>"
          }
        ]
      }
    ]
  }
}
```

---

## Example: implementation-react workflow rules

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You have the implementation-react plugin loaded. Follow these rules for all React tasks:\n\n**Skill load order**\n1. react-architecture — always, structure and boundaries\n2. react-code-style — always, naming and component conventions\n3. react-typescript — always, types and Zod\n4. react-configuration — config, env, feature flags\n5. react-api-client — HTTP clients, interceptors, auth\n6. react-data-fetching — TanStack Query hooks and mutations\n7. react-unit-testing — tests, mocks, coverage\n8. react-scaffold — new projects only\n9. react-feature — adding functionality to existing apps\n\n**Scenario rules**\n- New project: load 1–6, then react-scaffold, then react-api-client, then react-feature.\n- Existing app feature: load 1–6, then react-feature.\n- API/auth only: load 1, 3, 4, 5.\n- Tests only: load 1, 2, 7.\n\n**Gotchas**\n- Never load react-scaffold on an existing codebase — use react-feature instead.\n- react-api-client owns axios instances; react-feature owns feature-level *.api.ts fetchers.\n- Tests always live in root tests/, mirroring src/ — never inside src/features/."
          }
        ]
      }
    ]
  }
}
```

---

## Hook types reference

| Type | What it does | Typical use |
|------|-------------|-------------|
| `prompt` | Injects text into Claude's LLM context | Workflow rules, session-level instructions |
| `command` | Runs a shell command or script | Environment setup, dependency install |
| `http` | POSTs the event JSON to a URL | External notifications, webhooks |
| `mcp_tool` | Calls a tool on a configured MCP server | Integrations with external services |
| `agent` | Runs a full agentic verifier with tools | Complex pre/post-condition checks |

For plugin workflow injection, `prompt` on `SessionStart` is almost always the right choice.

---

## Other useful events

| Event | Fires when | Plugin use case |
|-------|-----------|-----------------|
| `SessionStart` | Session begins or resumes | Inject workflow rules, verify environment |
| `PostToolUse` | After a tool call succeeds | Auto-format, auto-lint after file edits |
| `UserPromptSubmit` | User submits a prompt | Validate or enrich the prompt |
| `PreToolUse` | Before a tool executes | Gate dangerous operations |

---

## Keeping the prompt focused

The `prompt` field is injected into every session — it adds to the token budget. Keep it to rules Claude would not infer from individual skill files:

- **In the hook:** load order, scenario branching, cross-skill gotchas
- **In `SKILL.md`:** rules, patterns, and gotchas specific to that skill
- **In `README.md`:** human-readable documentation (not read by Claude automatically)

---

## Reload after changes

Changes to `hooks/hooks.json` do not hot-reload. After editing, run:

```text
/reload-plugins
```

or restart Claude Code.
