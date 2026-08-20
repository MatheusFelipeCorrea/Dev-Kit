# Hyperion Complete Guide — from zero to daily use

This guide is for anyone who has **never used** Hyperion. Read it in order.

**Shortcuts:**
- **Which doc to read?** → [docs/README.md](../README.md)
- **Where generated files go** → [where-outputs-go-en.md](../meta/where-outputs-go-en.md)
- **Português:** [guia-completo.md](../onboarding/guia-completo.md)
- Quick setup (5 min): [setup-quickstart-en.md](../onboarding/setup-quickstart-en.md)
- **GitHub CLI (install + login):** [github-cli-setup-en.md](../integration/github-cli-setup-en.md)
- **Choose backend:** [choose-backend-en.md](../integration/choose-backend-en.md)
- **First audit:** [first-audit-en.md](../quality/first-audit-en.md)
- Environment variables: [`.env.example`](../../../.env.example)
- Sync technical reference: [`scripts/cards-sync/README.md`](../../../scripts/cards-sync/README.md)

---

## 1. What is Hyperion?

Hyperion is a **portable kit** of instructions for AI assistants (Cursor, GitHub Copilot, Claude Code, etc.).

It is not an app you open — it is a folder (`.github/` + `scripts/`) that you **copy into your repository**. The AI reads these files and can:

- Understand your project structure
- Create well-formatted cards/tickets
- Sync cards with GitHub Projects, Jira, etc.
- Run audits, generate ADRs, implementation plans, and more

**Analogy:** think of Hyperion as an "operations manual + tools" that the AI follows inside your repo.

> **Fresh clone:** folders such as ADRs, retros, diagrams, plans, and audit results start empty and are filled when you run skills. Architecture blueprints appear only after `project-architect`. See [README — fresh clone vs generated artifacts](../README.md#fresh-clone-vs-generated-artifacts).

---

## 2. What comes in the kit?

```
Hyperion/
├── .github/           ← agents, skills, cards, memory, workflows
├── scripts/cards-sync/← engine that syncs cards with boards
├── .env.example       ← environment variables (copy to .env)
├── package.json       ← npm run hyperion:* and cards:* shortcuts
├── CLAUDE.md          ← config for Claude Code
└── README.md
```

### Agents (long, autonomous flows)

| Agent | File | When to use |
|--------|---------|-------------|
| **migration** | `.github/agents/migration.agent.md` | **Existing repo** — adapt Hyperion (`/migrate`) |
| **spec-review** | `.github/agents/spec-review.agent.md` | Gate before coding (`/spec-review`) |
| **implementation-plan** | `.github/agents/implementation-plan.agent.md` | Phased plan (`/implement`) |
| **implementation-executor** | `.github/agents/implementation-executor.agent.md` | Run approved phases (`/execute`) |
| **pr-reviewer** | `.github/agents/pr-reviewer.agent.md` | Open PR review (`/pr-review`) |
| **audit-runner** | `.github/agents/audit-runner.agent.md` | Orchestrated audits (`/audit-run`) |
| **release** | `.github/agents/release.agent.md` | Changelog, tag (`/release`) |
| **mentoring** | `.github/agents/mentoring.agent.md` | Socratic mentor (`/mentor`) |

Flow: `/migrate` or `/setup` → … → `/execute` → `/pr-review` → `/release`

See [adapt-repo-en.md](./adapt-repo-en.md)

### Skills (on-demand capabilities — 30 total)

Ask the AI in natural language. It should read the matching `SKILL.md`.

#### Planning — product and planning

| Skill | Ask like this | What it does |
|-------|------------|-----------|
| **hypothesis-forge** | "Explore this idea" | Persona, impact, hypothesis, go/no-go decision |
| **acceptance-spec** | "Write acceptance spec" | Structured Given/When/Then |
| **card-refiner** | "Refine this into cards" / "move card X to Done" | Creates **and evolves** cards; edits status, priority, criteria |
| **project-architect** | "Plan greenfield architecture" | Guided architecture steps |
| **refactor-guide** | "Guide safe refactor" | Incremental refactoring |
| **sprint-retro** | "Facilitate sprint retro" | Structured retrospective |

#### Setup — configuration and integrations

| Skill | Ask like this | What it does |
|-------|------------|-----------|
| **project-startup** | **`/setup`** or "Set up Hyperion" | Orchestrates full setup (discovery → memory → cards) |
| **project-discovery** | "Discover this project" / **`/discover`** | Maps stack, folders, docs; creates `.github/project.yml` |
| **hyperion-ops** | **`/doctor`**, **`/sync`** | Agent runs `hyperion:*` terminal commands for you |
| **cards-sync-setup** | "Configure cards sync" | GitHub Project + token + `projects-map.json` wizard |
| **integration-bridge** | "Connect to Jira/Azure/Linear/GitLab" | Bridge to external tools |
| **pipeline-architect** | **`/pipeline`** | Adaptive CI workflows |
| **repo-migration** | (companion to `/migrate`) | Writes adapted `project.yml` |
| **memory-capture** | (auto after sessions) | Appends to `DECISIONS.md` |

#### Quality — audits and quality

| Skill | Ask like this | What it does |
|-------|------------|-----------|
| **full-audit** | "Full audit" | Orchestrates 6 dimensions |
| **security-audit** | "Security review" | OWASP / appsec |
| **architecture-audit** | "Review architecture" | Structural patterns |
| **devops-audit** | "DevOps review" | CI/CD, infra, deploy |
| **code-review** | "Code review" | Senior-level quality |
| **po-audit** | "Product alignment" | Requirements coverage |
| **ux-audit** | "UX review" | Design system, accessibility |
| **testing-strategy** | "Test plan" | Unit/integration/e2e |
| **tech-debt-tracker** | "What tech debt do we have?" | Prioritized inventory |
| **pr-review** | **`/pr-review`** | PR review checklist |
| **dependency-health** | **`/deps`** | Dependency audit + outdated |

#### Docs — documentation

| Skill | Ask like this | What it does |
|-------|------------|-----------|
| **adr-generator** | "Generate ADR about X" | Architecture Decision Record |
| **plantuml-generator** | "Full diagram package" / `/diagram` | 11 UML + C4 types (use case through state) |
| **readme-updater** | "Update the README" | README aligned with current state |
| **changelog-generator** | "Generate changelog" | CHANGELOG from commits |
| **release-manager** | (companion to `/release`) | Release checklist |

---

## 3. How to add it to my project?

### Step 1 — Copy files

Copy to your repository **root**:

1. The `.github/` folder (merge if one already exists)
2. The `scripts/` folder
3. Optional: `CLAUDE.md`, `.cursor/rules/` (included), `.env.example`, `package.json`

### Step 2 — Choose your AI runtime

| Tool | What to configure |
|------------|------------------|
| **Cursor** | `.cursor/rules/hyperion.mdc` (included in kit) |
| **GitHub Copilot** | Already reads `.github/instructions/copilot-instructions.md` |
| **Claude Code** | Copy `CLAUDE.md` to root — `/discover`, `/audit`, etc. |

### Step 3 — Adapt to your repository

**Existing repo with code:** **`/migrate`**

**New repo or fine-tuning:** **`/discover`** or copy `project.example.yml`

Guide: [adapt-repo-en.md](./adapt-repo-en.md) · `npm run hyperion:repo-detect`

### Step 4 — GitHub CLI (for GitHub automation)

If you use **GitHub Projects**, install and log in to the CLI — the only real manual step:

→ **[github-cli-setup-en.md](../integration/github-cli-setup-en.md)** (install Windows/macOS/Linux + `gh auth login`)

Then:

```bash
npm run hyperion:setup -- --yes
```

Or ask the agent: **`/setup`**.

**Alternative:** `GITHUB_TOKEN` in `.env` (without `gh`).

### Step 5 — Configure cards sync (other backends)

→ **[choose-backend-en.md](../integration/choose-backend-en.md)** — decision tree GitHub / Jira / Azure / Linear / GitLab

Ask the agent:

> "Configure cards sync" (GitHub) or "Connect to Jira" (others)

Or follow [setup-quickstart-en.md](../onboarding/setup-quickstart-en.md) § Step 3.1.

### Step 6 — Environment variables (Jira and others)

```bash
cp .env.example .env
# Edit .env with token, Jira URL, etc.
```

**GitHub local:** install `gh` and run `gh auth login` — [tutorial](../integration/github-cli-setup-en.md). Sync detects the token automatically.

**GitHub Actions:** use **Repository Secrets** (do not commit `.env`). CI does not need `gh`.

---

## 4. How do cards work?

Cards are Markdown files in `.github/cards/` with **YAML frontmatter**:

```yaml
---
card_id: PROJ-STORY-001
title: "Login with OAuth"
status: Backlog
type: Story
priority: High
parent: PROJ-EPIC-001
categories:
  - Backend
  - Frontend
---

# [STORY] Login with OAuth

## Acceptance Criteria
...
```

Folders:
- `epics/` — epics
- `features/` — features
- `stories/` — stories
- `tasks/` — tasks

### Sync with the board

Ask the agent for **`/sync`** — or in terminal:

```bash
npm run hyperion:setup -- --yes   # first time
npm run hyperion:sync
npm run cards:watch
```

### Conversational evolution

After creating cards, you **don't need to edit manually** if you prefer to talk:

- *"move PROJ-STORY-001 to Done"*
- *"put card 001 in In Progress"*
- *"add acceptance criterion to the login card"*

The AI edits the **same file**, runs validate + sync, and the board updates.

**Where everything goes:** [where-outputs-go-en.md](../meta/where-outputs-go-en.md) — full folder map by skill.

![Hyperion output map](../assets/hyperion-outputs-map.png)

---

## 5. Recommended workflow

![Hyperion journey](../assets/hyperion-journey-full.png)

### First audit

Step by step: **[first-audit-en.md](../quality/first-audit-en.md)** — ask *"Run a full audit"* or run individual dimensions.

### Persistent memory

The AI reads these files every session (if they exist):

| File | Content |
|---------|----------|
| `.github/memory/PROJECT.md` | What the project is |
| `.github/memory/DOMAIN.md` | Business rules |
| `.github/memory/DECISIONS.md` | Decisions already made |

Update them or ask the AI to maintain them.

---

## 6. Management backends (GitHub, Jira, etc.)

| Backend | Command | Board status |
|---------|---------|-----------------|
| **GitHub** (default) | `npm run cards:sync` | Project Status column ✅ |
| **Jira** | `CARDS_SYNC_BACKEND=jira npm run cards:sync` | Workflow transition when name matches ✅ |
| **Azure / Linear / GitLab** | see `.env.example` | Forward only; status in metadata ⚠️ |

Configure `management.backend` in `project.yml` and variables in `.env`.

For Jira, map status names in `projects-map.json` → `optionMapByLocale` if your workflow uses localized names.

---

## 7. Useful commands (summary)

| Command | What it does |
|---------|-----------|
| `npm run hyperion:setup -- --yes` | Full bootstrap (recommended first time) |
| `npm run hyperion:sync` | Validate + sync |
| `npm run cards:init -- --yes` | Granular equivalent |
| `npm run cards:validate` | Validates card frontmatter |
| `npm run cards:sync` | Forward sync |
| `npm run cards:sync -- --only ID` | Incremental sync (card + parents) |
| `npm run cards:watch` | Incremental sync on save |
| `npm run cards:hook` | Install pre-commit validate |
| `npm run cards:test` | Unit tests |

---

## 8. FAQ

**Do I need Node installed?**  
Yes, for cards-sync (Node 20+). Skills themselves are Markdown — the AI reads them without Node.

**Do I need GitHub CLI?**  
For local GitHub automation (discover token, repo, Project): **yes**, or use `GITHUB_TOKEN` in `.env`. Tutorial: [github-cli-setup-en.md](../integration/github-cli-setup-en.md). In CI (Actions) the token is automatic.

**Should I commit `.env`?**  
No. `.env` is in `.gitignore`. Use secrets in CI.

**Does sync overwrite my board?**  
Safe mode (GitHub): if the card **does not have** `status` in frontmatter, sync **preserves** manual board status. If it has explicit `status`, sync applies it.

**Works without GitHub Actions?**  
Yes. Run `npm run cards:sync` locally.

**Can I use only some skills?**  
Yes. The kit is modular — use only what you need.

---

## 9. Next steps

1. [Which doc to read?](../README.md) — documentation map
2. [GitHub CLI — install and login](../integration/github-cli-setup-en.md) (if using GitHub Projects)
3. [5-minute setup](../onboarding/setup-quickstart-en.md)
4. **`/setup`** or `npm run hyperion:setup -- --yes`
5. Ask: *"Discover this project"* (project-discovery)
6. Ask: *"Refine [your idea] into cards"* (card-refiner)
7. [First audit](../quality/first-audit-en.md) or *"Implement PROJ-STORY-001"* (implementation-plan)
