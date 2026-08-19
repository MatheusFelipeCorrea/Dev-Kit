# .github/ Structure

Quick reference for navigating the DevForge kit.

```
.github/
├── agents/              → Autonomous agent definitions (implementation-plan, mentoring)
├── audits/
│   ├── manifest.yml     → Registry mapping audit types to skills + prompts
│   ├── prompts/         → System prompts for each audit persona
│   ├── overlays/        → Project-specific context that augments prompts
│   └── results/         → Generated audit reports (gitignored in prod)
├── cards/
│   ├── config/          → projects-map.json (labels, field map, project settings)
│   ├── epics/           → Epic card files (YAML frontmatter)
│   ├── features/        → Feature card files
│   ├── stories/         → Story card files
│   └── tasks/           → Task card files
├── docs/
│   ├── README.md            → Índice: qual doc ler
│   ├── guia-completo.md     → Guia do zero (iniciantes)
│   ├── setup-quickstart.md  → Setup em 5 minutos
│   ├── github-cli-setup.md  → GitHub CLI (instalar + login)
│   ├── escolher-backend.md  → GitHub vs Jira vs outros
│   ├── primeira-auditoria.md→ Primeira auditoria
│   ├── onde-ficam-os-outputs.md → Mapa de outputs
│   ├── guide-complete-en.md → Complete guide (EN)
│   ├── setup-quickstart-en.md → 5-min setup (EN)
│   ├── github-cli-setup-en.md → GitHub CLI (EN)
│   ├── choose-backend-en.md → Backend choice (EN)
│   ├── first-audit-en.md  → First audit (EN)
│   ├── where-outputs-go-en.md → Outputs map (EN)
│   ├── skills-output-map.md → Skill-by-skill output map
│   ├── doc-maintenance-policy.md → Docs anti-duplication policy
│   ├── methodology-cheatsheet.md → Agent vs skill quick reference
│   ├── exemplars.md         → Representative file patterns (optional, team-maintained)
│   ├── adr/                 → ADRs (generated — see adr/README.md)
│   └── retros/              → Sprint retros (generated — see retros/README.md)
├── diagrams/            → PlantUML + Mermaid (generated — see diagrams/README.md)
├── instructions/
│   └── copilot-instructions.md → Runtime-agnostic AI guidelines
├── memory/
│   ├── PROJECT.md       → What is this project
│   ├── DOMAIN.md        → Business domain entities and rules
│   ├── DECISIONS.md     → Key decisions log
│   └── discoveries/     → Output from hypothesis-forge sessions
├── plans/
│   ├── cards/           → Consolidated card README (human-readable)
│   ├── implementations/ → Generated implementation plans
│   └── specs/           → Acceptance specifications
├── skills/
│   ├── planning/        → hypothesis-forge, acceptance-spec, card-refiner, project-architect,
│   │                      refactor-guide, sprint-retro
│   ├── setup/           → project-discovery, cards-sync-setup, integration-bridge
│   ├── quality/         → full-audit, security-audit, architecture-audit, devops-audit,
│   │                      code-review, po-audit, ux-audit, testing-strategy, tech-debt-tracker
│   └── docs/            → adr-generator, plantuml-generator, readme-updater, changelog-generator
│   SKILL.template.md    → Template for new skills (Output section required)
├── workflows/           → GitHub Actions (ci, security, sync-cards)
├── project.example.yml  → Template for project.yml
├── project.schema.json  → JSON Schema validation
└── dependabot.yml       → Dependency update config

scripts/
└── cards-sync/          → Sync engine (README: status safe mode, multi-backend, reverse)
```

## Cards sync quick links

| Topic | Where |
|-------|-------|
| **Qual doc ler?** | `docs/README.md` |
| Setup em 5 min | `docs/setup-quickstart.md` |
| GitHub CLI (instalar + login) | `docs/github-cli-setup.md` |
| Escolher backend | `docs/escolher-backend.md` |
| Primeira auditoria | `docs/primeira-auditoria.md` |
| Onde ficam outputs | `docs/onde-ficam-os-outputs.md` |
| Mapa skill-a-skill | `docs/skills-output-map.md` |
| Política de docs | `docs/doc-maintenance-policy.md` |
| English guides | `docs/guide-complete-en.md`, `docs/setup-quickstart-en.md`, … |
| Skill template | `skills/SKILL.template.md` |
| Sync engine reference | `../scripts/cards-sync/README.md` |
| Card evolution (agent) | `skills/planning/card-refiner/SKILL.md` |
| Guia completo (iniciantes) | `docs/guia-completo.md` |
| Env vars template | `../.env.example` |
| External backends | `skills/setup/integration-bridge/SKILL.md` |
| GitHub wizard | `skills/setup/cards-sync-setup/SKILL.md` |

## How skills are organized

| Category | Purpose | Skills |
|----------|---------|--------|
| **planning** | Problem exploration, specification, architecture | hypothesis-forge, acceptance-spec, card-refiner, project-architect, refactor-guide, sprint-retro |
| **setup** | Project bootstrapping and integrations | project-discovery, cards-sync-setup, integration-bridge |
| **quality** | Audits, testing, code health | full-audit, security-audit, architecture-audit, devops-audit, code-review, po-audit, ux-audit, testing-strategy, tech-debt-tracker |
| **docs** | Documentation generation and maintenance | adr-generator, plantuml-generator, readme-updater, changelog-generator |
