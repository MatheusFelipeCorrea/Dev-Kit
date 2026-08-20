# Audits

Registry and prompts for read-only repository audits. Reports are written under `results/` (gitignored except `.gitkeep`).

## Layout

| Path | Role |
|------|------|
| [`manifest.yml`](./manifest.yml) | Source of truth: audit type → skill → prompt → output dir |
| [`prompts/`](./prompts/) | Persona protocols (generic checklists) |
| [`prompts/README.md`](./prompts/README.md) | How to invoke audits |
| [`overlays/`](./overlays/) | Optional domain context (`project.yml` → `audits.overlay`) |
| [`results/`](./results/) | Generated reports (runtime) |

## Quick start

Ask the agent: **`/audit`** or *"Auditoria completa do repositório"* → skill `full-audit`.

Single dimension: `/security`, `/architecture`, `/devops`, `/review`, `/po`, `/ux`.

Commands reference: [comandos-rapidos.md](../docs/reference/comandos-rapidos.md) · First audit guide: [primeira-auditoria.md](../docs/quality/primeira-auditoria.md)

## Rules

- Audits are **read-only** — no source edits.
- Phased audits: one phase per session unless user asks for unattended run.
- Product paths and stack come from [`../project.yml`](../project.yml), not from prompts alone.
