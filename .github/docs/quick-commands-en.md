# Dev-Kit quick commands

Single reference for **npm** (terminal) and **agent** (no terminal).  
**Português:** [comandos-rapidos.md](./comandos-rapidos.md)

---

## Prefer the agent

With Cursor, Copilot, or Claude Code, **you do not need npm**. Say:

| Say this | What happens |
|----------|--------------|
| **`/setup`** or *"Set up Dev-Kit in this repo"* | Guided full setup (`project-startup`) |
| **`/doctor`** or *"Run Dev-Kit doctor"* | Kit + cards health check |
| **`/sync`** or *"Sync the cards"* | Validate and push cards to GitHub |
| **`/discover`** or *"Discover this project"* | Map repo, create/refresh `project.yml` |
| **`/refine`** or *"Refine into cards"* | Structured cards |
| **`/audit`** or *"Full repo audit"* | Six audit dimensions |
| **`/review`** | Code review |
| **`/implement`** | Implementation plan for a card |
| **`/help`** or *"List Dev-Kit commands"* | Show shortcuts |

Slash commands work natively in **Claude Code** (`CLAUDE.md`). In **Cursor**, use phrases or slashes — `rules/dev-kit.mdc` maps the same triggers.

---

## npm one-liners

Requires Node 20+ at repo root.

```bash
npm run devkit:help              # list all
npm run devkit:doctor            # kit + cards health
npm run devkit:setup -- --yes    # full cards bootstrap
npm run devkit:sync              # validate + sync
npm run devkit:sync -- --dry-run # simulate only
```

### First time (GitHub)

```bash
gh auth login
npm run devkit:setup -- --yes
# or ask the agent: /setup
```

### Day to day

```bash
npm run devkit:sync
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

Guide: [first-audit-en.md](./first-audit-en.md)

---

## Keeping commands in sync

| Source | Role |
|--------|------|
| `package.json` | npm scripts |
| `scripts/devkit/help.mjs` | `devkit:help` output |
| `CLAUDE.md` + `rules/dev-kit.mdc` | Agent slash commands |
| `project-startup` / `devkit-ops` skills | Guided setup and terminal ops |

Update `help.mjs` and this doc when adding scripts or skills.

---

## See also

- [setup-quickstart-en.md](./setup-quickstart-en.md)
- [scripts/cards-sync/README.md](../../scripts/cards-sync/README.md)
