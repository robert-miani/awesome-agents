# 🤖 Awesome Agents

![Version](https://img.shields.io/badge/version-0.2.0-blue)

A curated collection of AI agent **skills** and **plugins** — covering the full software delivery lifecycle, from development and QA to design, DevOps, and people management.

> **Inspired by** [github/awesome-copilot](https://github.com/github/awesome-copilot)

---

## 📦 What's in this repo

| Section | Description |
|---------|-------------|
| 🎯 [Skills](skills/README.md) | Self-contained agent instruction sets, organized by discipline |
| 🔌 [Plugins](plugins/README.md) | Curated bundles combining multiple skills for end-to-end workflows |
| 📚 [Guide](guide/README.md) | How to install, create, and contribute skills & plugins |


**Skills** (`skills/`) are the AI-agentic baseline — single-responsibility instruction sets organised by discipline (development, QA, business analysis, DevOps, and more). Each skill is independently installable and versioned following the [agentskills.io](https://agentskills.io) open standard.

**Plugins** (`plugins/`) are the consumption layer — SDLC-phase bundles that assemble the right skills for a specific delivery stage and team role, ready to install directly into Claude Code via the plugin marketplace in this repo. Plugins can also extend beyond skills with subagents, event hooks, MCP server connections, and more.

| Stage | Plugin | Recommended for | Status |
|-------|--------|-----------------|--------|
| Onboarding | [project-onboarding](plugins/project-onboarding/README.md) | Anyone new to a project | 🚧 In Progress |
| Discovery | [product-discovery](plugins/product-discovery/README.md) | Product Manager, Product Owner | ✅ Ready |
| Spec | [requirements-specification](plugins/requirements-specification/README.md) | Business Analyst, Product Owner, Technical Analyst | ✅ Ready |
| Spec | [technical-analysis](plugins/technical-analysis/README.md) | Technical Analyst | ✅ Ready |
| Planning | [technical-planning](plugins/technical-planning/README.md) | Tech Lead, Architect | 🚧 In Progress |
| Implementation | [implementation-dotnet](plugins/implementation-dotnet/README.md) | .NET Developer | ✅ Ready |
| Implementation | [implementation-react](plugins/implementation-react/README.md) | React Developer | ✅ Ready |
| Review | [code-review](plugins/code-review/README.md) | Reviewer, Senior Engineer | 🚧 In Progress |
| Testing | [qa-testing](plugins/qa-testing/README.md) | QA Automation Engineer | 🚧 In Progress |
| Deploy | [release-deployment](plugins/release-deployment/README.md) | DevOps Engineer | 🚧 In Progress |

For a detailed description of the skills baseline, plugin bundles, extensibility options, and marketplace installation instructions, see [SDLC Plugins & Marketplace](guide/sdlc-plugins-marketplace.md).

---

## ⚙️ Requirements

| Tool | Purpose |
|------|---------|
| [Claude Code](https://claude.ai/code) | Loading and running plugins and skills |
| [Node.js 22+](https://nodejs.org/) | Running `scripts/assemble-plugins.js` — required to build plugin skill bundles |
| Git | Version control and pre-commit hook |

> **Note:** Node.js is only needed to contribute to this repo (assembly step). End-users
> who install plugins directly from a release do not need Node.js.

---

## 🚀 Quick Start

### 1 — Add the marketplace (once per machine)

```shell
/plugin marketplace add <github-owner>/awesome-agents
```

Replace `<github-owner>` with the GitHub user or organization that hosts your copy of this repository.

### 2 — Install the plugin for your role

```shell
/plugin install implementation-react@awesome-agents
```

### 3 — Start a session

```bash
cd <your-project-root>
claude --plugin implementation-react
```

Skills are available as `/<plugin-name>:<skill-name>` commands (e.g. `/implementation-react:react-feature`).

For all plugins and update instructions, see [SDLC Plugins & Marketplace](guide/sdlc-plugins-marketplace.md).

---

## 📖 Registry & Recommendations

- **[Skills & Plugins Registry](guide/skills-registry.md)** — full catalogue of published skills and plugins with usage recommendations
- **[Skills README](skills/README.md)** — per-discipline registry and best practices
- **[Plugins README](plugins/README.md)** — plugin catalogue and composition guidelines

---

## 🤝 Contributing

| Action | Guide |
|--------|-------|
| Create a skill for your project | [how-to-create-project-skills.md](guide/how-to-create-project-skills.md) |
| Promote a skill to this library | [how-to-promote-skill-to-library.md](guide/how-to-promote-skill-to-library.md) |

---

## 📂 Repository Structure

```
awesome-agents/
├── skills/                          ← authoring layer (discipline-organised)
│   ├── development/
│   ├── quality-assurance/
│   ├── business-analysis/
│   ├── project-management/
│   ├── team-development/
│   ├── design-and-ux/
│   ├── devops/
│   ├── common/
│   └── README.md
├── plugins/                         ← consumption layer (SDLC-stage bundles)
│   ├── project-onboarding/          ← onboarding stage
│   ├── product-discovery/           ← discovery stage
│   ├── requirements-specification/  ← spec stage
│   ├── technical-analysis/          ← spec stage
│   ├── technical-planning/          ← planning stage
│   ├── implementation-dotnet/       ← implementation stage (.NET)
│   ├── implementation-react/        ← implementation stage (React)
│   ├── code-review/                 ← review stage
│   ├── qa-testing/                  ← testing stage
│   ├── release-deployment/          ← deploy stage
│   ├── plugin-config.json           ← skill × plugin matrix (machine-readable)
│   └── README.md
├── scripts/
│   └── assemble-plugins.js          ← copies skills into plugins at build time
└── guide/
    ├── README.md
    ├── sdlc-plugins-marketplace.md
    ├── skills-registry.md
    ├── how-to-install-skill.md
    ├── how-to-create-project-skills.md
    └── how-to-promote-skill-to-library.md
```
