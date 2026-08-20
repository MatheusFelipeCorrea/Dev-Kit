# Mapa skill → output — Hyperion

Registro canônico: **cada skill** e onde grava artefatos.

**English:** [skills-output-map.md](../reference/skills-output-map.md)

Override: leia `project.yml` → `outputs` e `docs.*` primeiro.

![Mapa de outputs Hyperion](../assets/hyperion-outputs-map.png)

---

## Resumo

| Status | Count | Significado |
|--------|-------|-------------|
| ✅ | 24/24 | Todas as skills têm seção `## Output` explícita |
| 📁 | scaffold | Pastas com `.gitkeep`; conteúdo gitignored |

---

## Planning

| Skill | Output principal | Path |
|-------|------------------|------|
| **hypothesis-forge** | Bundle de descoberta | `.github/memory/discoveries/{DISC-ID}/` |
| **acceptance-spec** | Spec BDD | `.github/plans/specs/{story-id}/` |
| **card-refiner** | Cards sync + rollup | `.github/cards/{type}/` + `.github/plans/cards/` |
| **project-architect** | Blueprints | `.github/docs/Project_*_Blueprint.md` |
| **refactor-guide** | Plano de refactor | `.github/plans/implementations/refactor-{module}-{date}.md` |
| **sprint-retro** | Retro | `.github/docs/retros/retro-{sprint}-{date}.md` |

## Setup

| Skill | Output principal | Path |
|-------|------------------|------|
| **project-discovery** | Contrato do projeto | `.github/project.yml` |
| **project-startup** | Checklist (sessão) | *(orquestrador)* |
| **hyperion-ops** | Ops terminal (sessão) | *(npm — sem arquivo fixo)* |
| **cards-sync-setup** | Config sync | `.github/cards/config/projects-map.json` |
| **integration-bridge** | Resumo integração | `.github/memory/DECISIONS.md` |
| **pipeline-architect** | CI + workflows | `.github/project.yml` → `ci` + `hyperion-*.yml` |

## Quality

| Skill | Output principal | Path |
|-------|------------------|------|
| **full-audit** | Por dimensão + summary | `.github/audits/results/<type>/` |
| **architecture-audit** | Relatório arquitetura | `.github/audits/results/architecture/` |
| **security-audit** | Relatório segurança | `.github/audits/results/application-security/` |
| **devops-audit** | Relatório DevOps | `.github/audits/results/devops/` |
| **code-review** | Code review | `.github/audits/results/code-review/` |
| **po-audit** | Alinhamento produto | `.github/audits/results/product-owner/` |
| **ux-audit** | Relatório UX | `.github/audits/results/ux-design/` |
| **testing-strategy** | Plano de testes | `.github/plans/specs/testing-strategy-{scope}.md` |
| **tech-debt-tracker** | Inventário dívida | `.github/docs/tech-debt-inventory.md` |

## Docs

| Skill | Output principal | Path |
|-------|------------------|------|
| **adr-generator** | ADR | `.github/docs/adr/ADR-{NNN}-{slug}.md` |
| **plantuml-generator** | Pacote completo (11 tipos) | `.github/diagrams/{category}/` — ver [diagrams/README.md](../../diagrams/README.md) |
| **readme-updater** | README atualizado | In place |
| **changelog-generator** | Changelog | `CHANGELOG.md` |

Guia completo: [onde-ficam-os-outputs.md](../meta/onde-ficam-os-outputs.md)
