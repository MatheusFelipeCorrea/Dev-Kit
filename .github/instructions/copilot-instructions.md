# Project Instructions

These instructions apply to all AI coding agents working in this repository
(GitHub Copilot, Cursor, Claude Code, or any other). They are the project's
coding constitution — do not violate them.

## Bootstrap (always first)

1. Read `.github/project.yml` if it exists — it defines the project contract.
2. Read `.github/memory/PROJECT.md` — project context.
3. Read `.github/memory/DOMAIN.md` — domain model.
4. Read `.github/memory/DECISIONS.md` — existing decisions.
5. If `project.yml` is absent, run the `project-discovery` skill or ask the user.

## Principles

### KISS first, SOLID on refactor, DRY on third occurrence

- Write the simplest solution that satisfies the requirement.
- Apply SOLID patterns during refactoring, not upfront.
- Extract shared code only when the pattern has repeated 3 times.

### Spec before code

- Do not implement without understanding what "done" means.
- Acceptance criteria or a BDD spec must exist before writing logic.
- If neither exists, ask the user or suggest running `card-refiner` or `acceptance-spec`.

### Security is not a phase

- Never commit secrets, tokens, or credentials.
- Never trust external input without validation.
- Apply the principle of least privilege in access control.
- When in doubt, ask before exposing data.

### Decisions are recorded

- If you make or suggest an architectural choice, note it.
- Small decisions: add to `.github/memory/DECISIONS.md`.
- Significant decisions: suggest creating an ADR via `adr-generator`.

## Code Rules

### Commits

Use Conventional Commits:
- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — restructuring without behavior change
- `test:` — adding or fixing tests
- `docs:` — documentation only
- `chore:` — tooling, config, dependencies

### Tests

- Every feature must have tests. Prefer unit tests for logic, integration for flows.
- TDD is encouraged: Red (failing test) → Green (minimal pass) → Refactor.
- Do not skip tests to ship faster.

### Error handling

- Use consistent error patterns across the codebase.
- Errors should be informative (what went wrong, where, what to do).
- Never swallow errors silently.

### File organization

- Follow existing conventions discovered from the codebase.
- When creating new files, reference `project.yml` for paths and existing patterns.
- Never invent a new organizational pattern without checking what exists.
- **Dev-Kit outputs** — every skill writes to a defined folder (see `.github/docs/onde-ficam-os-outputs.md`):
  - Cards (sync) → `.github/cards/`
  - Specs → `.github/plans/specs/`
  - Plans → `.github/plans/implementations/`
  - Audits → `.github/audits/results/<type>/`
  - ADRs → `.github/docs/adr/`
  - Discoveries → `.github/memory/discoveries/`

## Collaboration Rules

### Human gates

- Never execute code or make breaking changes without explicit permission.
- Present plans before implementing.
- Ask when something is ambiguous or contradictory.

### Language

- Match the user's language for communication.
- Keep technical terms in English (controller, service, hook, middleware, etc.).
- Read `locale` from `project.yml` for generated artifacts.

### Documentation

- Update documentation when behavior changes.
- Prefer diagrams (Mermaid) over long prose for flows.
- Keep READMEs current — use `readme-updater` skill periodically.

## Available Skills

When a task maps to an existing skill, suggest using it — **or run npm yourself** via `devkit-ops` when the user wants sync/doctor without using the terminal.

| Need | Skill / command |
|------|-----------------|
| **Full Dev-Kit setup** | `project-startup` — or user says `/setup` |
| **Sync / doctor / validate cards** | `devkit-ops` — runs `npm run devkit:sync`, `devkit:doctor` |
| Understand project structure | `project-discovery` |
| Plan greenfield architecture | `project-architect` |
| Refine ideas into cards | `card-refiner` |
| Explore a problem space | `hypothesis-forge` |
| Write acceptance spec | `acceptance-spec` |
| Record architectural decision | `adr-generator` |
| Implement from a card | `implementation-plan` agent |
| Learn/mentor | `mentoring` agent |
| Full repo audit | `full-audit` |
| Security review | `security-audit` |
| Architecture review | `architecture-audit` |
| Code quality review | `code-review` |
| DevOps/CI review | `devops-audit` |
| Product alignment review | `po-audit` |
| UX/Design review | `ux-audit` |
| Generate diagrams | `plantuml-generator` |
| Update README | `readme-updater` |
| Sync cards to GitHub | `cards-sync-setup` |
| Test strategy/plan | `testing-strategy` |
| Identify tech debt | `tech-debt-tracker` |
| Guide a refactoring | `refactor-guide` |
| Sprint retrospective | `sprint-retro` |
| Generate changelog | `changelog-generator` |
| Connect to Jira/Azure/Linear/GitLab | `integration-bridge` |

## Evolving cards in conversation

If the user asks to move or update a card (e.g. "mova o card X para Done"):

1. Edit the existing file in `.github/cards/{epics|features|stories|tasks}/` — update `status` or other frontmatter fields
2. Keep `card_id` unchanged
3. Run `npm run devkit:sync` (or `devkit-ops` skill)
4. **GitHub:** Project Status column updates. **Jira/other:** status in issue metadata (native board not mapped yet)
5. Allowed status values: Backlog, Functional Refinement, Technical Refinement, In Progress, In Tests, In Revision, Done

See `card-refiner` skill § Card evolution during conversation (status aliases) and § Prototype-first refinement (UX flow).
