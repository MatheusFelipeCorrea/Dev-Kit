---
name: devops-audit
description: >-
  Runs a phased DevOps/SRE audit covering CI/CD, reliability/jobs, and
  observability/cost. Use when reviewing pipelines, deploy configs, jobs,
  environments, or operational readiness.
---

# DevOps Audit — Platform & Operations

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover CI workflows, deploy configs, IaC, job/cron schedulers, observability hooks, and package scripts from manifests and tree. **Never** assume a vendor or folder layout.
3. Capture: pipeline paths, env/deploy roots, `language`/`locale`, `outputs.audits` (devops).
4. If an **overlay** is configured, read it **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/devops.md` when present.

**Fallback:** if prompt/config is missing, continue with a professional DevOps/SRE checklist (CI quality gates → environments/secrets → jobs/reliability → observability → cost/capacity). Do **not** block.

## Phases (generic)

**One phase per session**; wait for user OK between phases.

| Phase | Focus (only if artifacts exist) |
|-------|----------------------------------|
| 1 | CI/CD & environments |
| 2 | Jobs, migrations & reliability |
| 3 | Observability & costs |
| consolidate | Cross-phase executive summary |

Mark N/A when there is no CI, no schedulers, no cloud config, etc.

## Scope & findings

- Cite concrete YAML, scripts, and configs with `path:line`.
- Finding IDs: `OPS-<PHASE>-<NN>` (or config prefix).
- Each finding: evidence, severity/priority, impact, confidence, recommendation.
- Prefer actionable fixes over generic advice.

## Execution rules

- **Read-only by default.** Do not change pipelines or infra unless the user asks for implementation separately.
- Output language: config / user preference.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (devops) |
| Fallback | `.github/audits/results/devops/` |

Suggested filenames:

- `devops-fase-1-cicd-ambientes.md`
- `devops-fase-2-jobs-confiabilidade.md`
- `devops-fase-3-observabilidade-custos.md`
- `devops-sumario-executivo.md`

## Example

> Execute devops-audit phase 1 (CI/CD & environments).
