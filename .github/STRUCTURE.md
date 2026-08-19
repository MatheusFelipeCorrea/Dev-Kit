# Dev-Kit — folder map

Canonical layout for the portable kit. **English:** see section headers; user docs are PT/EN in `docs/`.

> **Navigation hub:** [docs/README.md](./docs/README.md) (which doc to read)  
> **Organization rationale:** [docs/organizacao.md](./docs/organizacao.md)

---

## Repository root

```
./
├── .cursor/rules/dev-kit.mdc   ← Cursor (ships with kit — no manual copy)
├── .github/                     ← AI kit core (see below)
├── scripts/
│   ├── devkit/                ← npm run devkit:* (help, doctor, setup, sync)
│   └── cards-sync/              ← npm run cards:* (sync engine)
├── CLAUDE.md                    ← Claude Code slash commands
├── package.json                 ← npm shortcuts
├── .env.example                 ← optional token config (alternative to gh)
└── README.md                    ← main hub
```

**Not shipped / generated at runtime:** `node_modules/`, `.env`, audit reports, `last-sync.md`.

---

## `.github/` — kit core

| Folder | Always on clone? | Purpose |
|--------|------------------|---------|
| `agents/` | Yes | Autonomous agents (2) |
| `audits/` | Yes (scaffold) | `manifest.yml`, prompts, `results/.gitkeep` |
| `cards/` | Yes | Sync source + `_examples/` (never synced) |
| `diagrams/` | Yes (empty) | plantuml-generator output |
| `docs/` | Yes | Human guides + adr/retros placeholders |
| `instructions/` | Yes | Copilot constitution |
| `memory/` | Yes (templates) | PROJECT, DOMAIN, DECISIONS |
| `plans/` | Yes (scaffold) | specs/, implementations/, cards/ |
| `skills/` | Yes | 24 skills in 4 categories |
| `workflows/` | Yes | CI, security, sync-cards |

**Config files:**

| File | Consumer action |
|------|-----------------|
| `project.example.yml` | Copy → `project.yml` in **your** repo |
| `project.yml` | Copy from `project.example.yml` when adding the kit to your repo |
| `project.schema.json` | Validation contract |
| `INDEX.md` | Short pointer → this file + docs index |

---

## Cards layout

```
cards/
├── CARD.template.md      ← copy to epics|features|stories|tasks/ (never synced)
├── _examples/            ← reference samples (never synced)
├── config/               ← projects-map.json, labels.*.json
├── epics/                ← your syncable cards
├── features/
├── stories/
└── tasks/
```

---

## Scripts vs agent

| Prefer | When |
|--------|------|
| **`/setup` `/sync` `/doctor`** | Day-to-day — agent runs npm |
| `npm run devkit:*` | CI, power users, no agent |
| `npm run cards:*` | Granular sync operations |

Full command list: `npm run devkit:help`

---

## Runtime rules (3 surfaces — intentional overlap)

| Runtime | File |
|---------|------|
| Cursor | `.cursor/rules/dev-kit.mdc` |
| Claude Code | `CLAUDE.md` |
| Copilot / generic | `.github/instructions/copilot-instructions.md` |

Policy: [docs/doc-maintenance-policy.md](./docs/doc-maintenance-policy.md)

---

## Skills (24)

| Category | Count | Folder |
|----------|-------|--------|
| planning | 6 | `skills/planning/` |
| setup | 5 | `skills/setup/` |
| quality | 9 | `skills/quality/` |
| docs | 4 | `skills/docs/` |

Output registry: [docs/skills-output-map.md](./docs/skills-output-map.md)
