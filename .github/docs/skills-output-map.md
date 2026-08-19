# Skills → Output map

Canonical registry: **every skill** and where it writes artifacts.

Config override: read `project.yml` → `outputs` and `docs.*` first; fall back to paths below.

---

## Summary

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ | 22/22 | All skills have explicit `## Output` section |
| ⚠️ | 3 | Path was ambiguous — fixed below |
| 📁 | 4 | Folders added with `.gitkeep` so structure exists on clone |

---

## Planning

| Skill | Primary output | Path |
|-------|----------------|------|
| **hypothesis-forge** | Discovery bundle | `.github/memory/discoveries/{DISC-ID}/` |
| **acceptance-spec** | BDD spec folder | `.github/plans/specs/{story-id}/` |
| **card-refiner** | Sync cards + human rollup | `.github/cards/{type}/` + `.github/plans/cards/` |
| **project-architect** | Blueprints + app READMEs | `.github/docs/Project_*_Blueprint.md` + `{app}/Documents/README.md` |
| **refactor-guide** | Refactor plan | `.github/plans/implementations/refactor-{module}-{date}.md` |
| **sprint-retro** | Retro doc | `.github/docs/retros/retro-{sprint}-{date}.md` |

## Setup

| Skill | Primary output | Path |
|-------|----------------|------|
| **project-discovery** | Project contract (Configure mode) | `.github/project.yml` |
| **cards-sync-setup** | Sync config | `.github/cards/config/projects-map.json` |
| **integration-bridge** | Integration summary | `.github/memory/DECISIONS.md` + `project.yml` → `management` |

## Quality

| Skill | Primary output | Path |
|-------|----------------|------|
| **full-audit** | Per-dimension + summary | `.github/audits/results/<type>/` + `_summary/` |
| **architecture-audit** | Architecture report | `.github/audits/results/architecture/` |
| **security-audit** | Security report | `.github/audits/results/application-security/` |
| **devops-audit** | DevOps report | `.github/audits/results/devops/` |
| **code-review** | Code review report | `.github/audits/results/code-review/` |
| **po-audit** | Product alignment report | `.github/audits/results/product-owner/` |
| **ux-audit** | UX report | `.github/audits/results/ux-design/` |
| **testing-strategy** | Test plan | `.github/plans/specs/testing-strategy-{scope}.md` |
| **tech-debt-tracker** | Debt inventory | `.github/docs/tech-debt-inventory.md` |

## Docs

| Skill | Primary output | Path |
|-------|----------------|------|
| **adr-generator** | ADR | `.github/docs/adr/ADR-{NNN}-{slug}.md` |
| **plantuml-generator** | PlantUML + Mermaid sources | `.github/diagrams/{category}/*.{puml,mmd}` |
| **readme-updater** | Updated README(s) | In place at detected README/docs files (root + apps) |
| **changelog-generator** | Changelog | `CHANGELOG.md` (repo root) |

## Agents (not skills, but produce files)

| Agent | Primary output | Path |
|-------|----------------|------|
| **implementation-plan** | Phased plan | `.github/plans/implementations/{card-id}-plan.md` |
| **mentoring** | *(none by default)* | In-chat only; may point to existing docs |

## Scripts (not skills)

| Script | Primary output | Path |
|--------|----------------|------|
| **cards-sync** | Last sync log | `.github/plans/cards/last-sync.md` |

---

## Folder tree (created in kit)

```
.github/
├── cards/              ← card-refiner (sync source)
├── plans/
│   ├── cards/          ← card-refiner rollup + last-sync.md
│   ├── specs/          ← acceptance-spec, testing-strategy
│   └── implementations/← implementation-plan, refactor-guide
├── memory/
│   └── discoveries/    ← hypothesis-forge
├── docs/
│   ├── adr/            ← adr-generator
│   └── retros/         ← sprint-retro
├── diagrams/           ← plantuml-generator
└── audits/results/     ← *-audit (gitignored — generated at runtime)
```

---

## Customization

In `.github/project.yml`:

```yaml
outputs:
  audits: .github/audits/results
  cards: .github/plans/cards
  implementations: .github/plans/implementations
  diagrams: .github/diagrams

docs:
  blueprints: .github/docs
  diagrams: .github/diagrams
```

Full user guide: [onde-ficam-os-outputs.md](./onde-ficam-os-outputs.md) · [EN](./where-outputs-go-en.md)
