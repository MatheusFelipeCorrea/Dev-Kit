# Exemplars — Project Patterns

This file is **optional** and acts as a quick catalog of representative files and patterns.
Use it when a skill asks for an "exemplar" before creating or updating code/docs.

In a fresh Dev-Kit clone, only the starter examples below are pre-filled. Replace them with paths from **your** codebase as the team agrees on reference files.

## How to use

- Pick one file per pattern that your team already considers a good reference.
- Keep links/path pointers current.
- Prefer stable patterns (naming, error handling, folder conventions, tests).
- If a section still points to a placeholder, skills must fall back to codebase search — never invent paths.

## Starter examples (Dev-Kit)

These ship with the kit and demonstrate **card format**, not application code:

### Card / planning exemplar
- Path: `.github/cards/_examples/stories/EXAMPLE-STORY-001.md`
- Why this file: YAML frontmatter, Gherkin acceptance criteria, task breakdown, and status fields — use as template when refining new stories.

### Epic hierarchy exemplar
- Path: `.github/cards/_examples/epics/EXAMPLE-EPIC-001.md`
- Why this file: Epic-level scope, links to features, and backlog-oriented structure.

### Feature card exemplar
- Path: `.github/cards/_examples/features/EXAMPLE-FEATURE-001.md`
- Why this file: Feature decomposition between epic and story layers.

## Replace with your project (suggested sections)

### API / backend exemplar
- Path: `<your-service-file>`
- Why this file: `<pattern summary — e.g. error handling, layering, naming>`

### Frontend/UI exemplar
- Path: `<your-component-file>`
- Why this file: `<pattern summary — e.g. hooks, state, accessibility>`

### Testing exemplar
- Path: `<your-test-file>`
- Why this file: `<pattern summary — e.g. arrange/act/assert, fixtures>`

### Integration/infra exemplar
- Path: `<your-config-or-pipeline-file>`
- Why this file: `<pattern summary>`

## Notes

- If this file is empty or still has placeholders, skills should fall back to real code discovery.
- Do not invent paths: always verify files exist before referencing them in cards or docs.
- Run `project-discovery` or `project-architect` first on greenfield repos to populate blueprints; then add code exemplars here.
