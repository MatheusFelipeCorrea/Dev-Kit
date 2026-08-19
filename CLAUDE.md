# Dev-Kit — Claude Code Instructions

You have access to a full AI development kit in `.github/`. Use it.

## Context Loading

Before any task, read:
- `.github/project.yml` — project config (stack, apps, conventions)
- `.github/memory/PROJECT.md` — what this project is
- `.github/memory/DOMAIN.md` — business domain
- `.github/memory/DECISIONS.md` — decisions already made

## Available Skills

Skills live in `.github/skills/` organized by category:

- **planning/** — hypothesis-forge, acceptance-spec, card-refiner, project-architect, refactor-guide, sprint-retro
- **setup/** — project-startup, project-discovery, cards-sync-setup, devkit-ops, integration-bridge
- **quality/** — full-audit, security-audit, architecture-audit, devops-audit, code-review, po-audit, ux-audit, testing-strategy, tech-debt-tracker
- **docs/** — adr-generator, plantuml-generator, readme-updater, changelog-generator

When the user asks for any of these capabilities, read the corresponding `SKILL.md` and follow its instructions exactly.

## Agents

- `.github/agents/implementation-plan.agent.md` — for implementing cards/tickets
- `.github/agents/mentoring.agent.md` — for teaching/explaining

## Commands Mapping

**Run npm yourself** when using `devkit-ops` or `project-startup` — do not ask the user to paste terminal commands unless Shell is unavailable.

| User says | Read and follow |
|-----------|-----------------|
| /help | Run `npm run devkit:help` — summarize shortcuts |
| /setup | `.github/skills/setup/project-startup/SKILL.md` |
| /doctor | `.github/skills/setup/devkit-ops/SKILL.md` → `npm run devkit:doctor` |
| /sync | `.github/skills/setup/devkit-ops/SKILL.md` → `npm run devkit:sync` |
| /discover | `.github/skills/setup/project-discovery/SKILL.md` |
| /refine | `.github/skills/planning/card-refiner/SKILL.md` |
| /explore | `.github/skills/planning/hypothesis-forge/SKILL.md` |
| /spec | `.github/skills/planning/acceptance-spec/SKILL.md` |
| /architect | `.github/skills/planning/project-architect/SKILL.md` |
| /adr | `.github/skills/docs/adr-generator/SKILL.md` |
| /audit | `.github/skills/quality/full-audit/SKILL.md` |
| /security | `.github/skills/quality/security-audit/SKILL.md` |
| /architecture | `.github/skills/quality/architecture-audit/SKILL.md` |
| /devops | `.github/skills/quality/devops-audit/SKILL.md` |
| /po | `.github/skills/quality/po-audit/SKILL.md` |
| /ux | `.github/skills/quality/ux-audit/SKILL.md` |
| /review | `.github/skills/quality/code-review/SKILL.md` |
| /implement | `.github/agents/implementation-plan.agent.md` |
| /mentor | `.github/agents/mentoring.agent.md` |
| /refactor | `.github/skills/planning/refactor-guide/SKILL.md` |
| /retro | `.github/skills/planning/sprint-retro/SKILL.md` |
| /test-plan | `.github/skills/quality/testing-strategy/SKILL.md` |
| /tech-debt | `.github/skills/quality/tech-debt-tracker/SKILL.md` |
| /changelog | `.github/skills/docs/changelog-generator/SKILL.md` |
| /connect | `.github/skills/setup/integration-bridge/SKILL.md` |
| /cards-setup | `.github/skills/setup/cards-sync-setup/SKILL.md` |
| /readme | `.github/skills/docs/readme-updater/SKILL.md` |
| /diagram | `.github/skills/docs/plantuml-generator/SKILL.md` |

Natural-language equivalents work too — see `.github/docs/comandos-rapidos.md`.

## Key Principles

1. Always check `project.yml` before making assumptions about stack or conventions
2. Use memory files as persistent context across sessions
3. When generating cards, follow YAML frontmatter format from card-refiner
4. Audit reports go to `.github/audits/results/` — never edit source code during audits
5. ADRs go to `.github/docs/adr/`

## Evolving cards in conversation

When the user asks to move or update a card (e.g. "mova EXAMPLE-STORY-001 para Done"):

1. Edit the existing file in `.github/cards/` — update `status` or other frontmatter fields in place
2. Keep `card_id` unchanged; never create a duplicate file
3. Run `npm run devkit:sync` (or validate + sync via devkit-ops)
4. Explicit `status` in frontmatter updates the GitHub Project Status column on forward sync (other backends: metadata in issue description until native workflow mapping exists)

Allowed status: Backlog, Functional Refinement, Technical Refinement, In Progress, In Tests, In Revision, Done.

See `.github/skills/planning/card-refiner/SKILL.md` — section "Card evolution during conversation".
