---
name: architecture-audit
description: >-
  Runs a phased architecture review of domain/data, integrations/runtime, and
  client/evolution concerns with explicit trade-offs. Use when assessing
  structure, boundaries, coupling, or evolution readiness.
---

# Architecture Audit — Domain, Runtime, Evolution

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover bounded contexts/packages, data stores, integration points, runtime/deploy model, and client apps from manifests, workspaces, diagrams (if any), READMEs, and tree. **Never** assume a fixed domain, ORM, or hosting model.
3. Capture: package boundaries, data/schema locations, `language`/`locale`, `outputs.audits` (architecture).
4. If an **overlay** is configured, read it **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/architecture.md` when present.

**Fallback:** if prompt/config is missing, continue with a professional architecture checklist (boundaries → data model → integrations → runtime constraints → client architecture → evolution risks). Do **not** block.

## Phases (generic)

**One phase per session**; wait for user OK between phases.

| Phase | Focus (adapt to detected shape) |
|-------|----------------------------------|
| 1 | Domain & data |
| 2 | Integrations & runtime |
| 3 | Clients & evolution |
| consolidate | Cross-cutting trade-offs + executive summary |

Phases are thematic, not tied to product modules. Mark N/A when a layer does not exist (e.g. no external integrations).

## Scope & findings

- Finding IDs: `ARCH-<PHASE>-<NN>` (or config prefix).
- Each finding: evidence `path:line`, severity/priority, impact, confidence, recommendation, and **explicit trade-offs** when proposing change.
- Prefer structural risks (coupling, consistency, operability) over micro-style nits.

## Execution rules

- **Read-only by default.** Do not refactor unless the user asks for a separate implementation pass.
- Do not invent target architectures; ground recommendations in what the repo actually has.
- Output language: config / user preference.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (architecture) |
| Fallback | `.github/audits/results/architecture/` |

Suggested filenames:

- `arch-fase-1-dominio-dados.md`
- `arch-fase-2-integracoes-runtime.md`
- `arch-fase-3-clientes-evolucao.md`
- `arch-sumario-executivo.md`

## Example

> Run architecture-audit phase 1 (domain & data) and save the report.
