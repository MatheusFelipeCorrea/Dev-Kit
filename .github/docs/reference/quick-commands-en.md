# Hyperion quick commands

Single reference for **npm** (terminal) and **agent** (no terminal).  
**Português:** [comandos-rapidos.md](../reference/comandos-rapidos.md)

---

## Prefer the agent

With Cursor, Copilot, or Claude Code, **you do not need npm**. Say:

| Say this | What happens |
|----------|--------------|
| **`/setup`** or *"Set up Hyperion in this repo"* | Guided full setup (`project-startup`) |
| **`/doctor`** or *"Run Hyperion doctor"* | Kit + cards health check |
| **`/sync`** or *"Sync the cards"* | Validate and push cards to GitHub |
| **`/discover`** or *"Discover this project"* | Map repo, create/refresh `project.yml` |
| **`/migrate`** or *"Adapt Hyperion to this repo"* | Legacy repo → project.yml + memory |
| **`/refine`** or *"Refine into cards"* | Structured cards |
| **`/audit`** or *"Full repo audit"* | Six audit dimensions |
| **`/review`** | Code review |
| **`/pr-review`** | Open PR review (diff + tests) |
| **`/deps`** | Dependency health (audit + outdated) |
| **`/implement`** | Implementation plan for a card |
| **`/execute`** | Run approved plan phase (+ tests) |
| **`/spec-review`** | Spec/card gate before coding |
| **`/audit-run`** | Orchestrated audit (6 dimensions) |
| **`/release`** | Changelog, version bump, tag |
| **`/diagram`** or *"Full diagram package"* | 11 UML types under `.github/diagrams/` |
| **`/spec`** | BDD spec + optional per-story flowchart |
| **`/help`** or *"List Hyperion commands"* | Show shortcuts |

Slash commands work natively in **Claude Code** (`CLAUDE.md`). In **Cursor**, use phrases or slashes — `.cursor/rules/hyperion.mdc` maps the same triggers.

---

## npm one-liners

Requires Node 20+ at repo root.

```bash
npm run hyperion:help              # list all
npm run hyperion:doctor            # kit + cards health
npm run hyperion:setup -- --yes    # full cards bootstrap
npm run hyperion:sync              # validate + sync
npm run hyperion:sync -- --dry-run # simulate only
```

### First time (GitHub)

```bash
gh auth login
npm run hyperion:setup -- --yes
# or ask the agent: /setup
```

### Day to day

```bash
npm run hyperion:sync
npm run cards:watch                # optional auto-sync on save
```

---

## Audits (agent only)

Audits are **read-only** — reports go to `.github/audits/results/`.

| Phrase | Skill |
|--------|-------|
| *"Full audit"* | `full-audit` |
| *"Security review"* | `security-audit` |
| *"Architecture review"* | `architecture-audit` |
| *"DevOps review"* | `devops-audit` |
| *"Code review"* | `code-review` |
| *"Product alignment"* | `po-audit` |
| *"UX review"* | `ux-audit` |

Guide: [first-audit-en.md](../quality/first-audit-en.md)

---

## Diagrams (`/diagram`)

Skill `plantuml-generator` — writes `.puml` / `.mmd` sources (PNG export is manual).

| Say this | Result |
|----------|--------|
| **`/diagram`** + *"Complete package"* | 11 diagrams in recommended order (approval between each) |
| *"Sequence diagram for login"* | `Sequencia/sequencia-login.puml` |
| *"ER model for the database"* | `Modelo de Dados/modelo-dados.puml` |
| *"Order state machine"* | `Estado/estado-pedido.puml` |

Types: use case, components, packages, classes, ER, deployment, data flow, sequence, activity, state, C4 prompt.

Full map: [diagrams/README.md](../../diagrams/README.md) · [where-outputs-go-en.md](../meta/where-outputs-go-en.md)

---

## Keeping commands in sync

| Source | Role |
|--------|------|
| **`.github/commands.yml`** | Canonical registry of phrases, skills, and npm scripts |
| `npm run hyperion:generate-rules` | Regenerates `help.mjs`, `CLAUDE.md`, `hyperion.mdc`, `copilot-instructions.md` |
| `npm run hyperion:check-rules` | CI — fails if runtime rules drift from `commands.yml` |
| `package.json` | npm scripts (`hyperion:*`, `cards:*`) |
| `scripts/hyperion/help.mjs` | `hyperion:help` output (generated) |
| `project-startup` / `hyperion-ops` skills | Guided setup and terminal ops |
| `.github/audits/manifest.yml` | Audit types |

**Maintainer flow:** edit `commands.yml` → `npm run hyperion:generate-rules` → commit generated files.  
Update this doc (PT/EN pair) when user-visible behavior changes.

Full policy: [doc-maintenance-policy.md](../meta/doc-maintenance-policy.md)

---

## See also

- [setup-quickstart-en.md](../onboarding/setup-quickstart-en.md)
- [scripts/cards-sync/README.md](../../../scripts/cards-sync/README.md)
