# START HERE — 5-minute setup

Quick guide to use Hyperion in a new repository.

**Not sure where to start?** See [docs README](../README.md) — *Which doc to read?* table.

**Português:** [setup-quickstart.md](../onboarding/setup-quickstart.md)

---

## Easiest path (no terminal)

Ask your AI agent:

> **`/setup`** — or *"Set up Hyperion in this repo"*

The agent runs project-discovery, helps fill memory, executes `npm run hyperion:setup` for you, and suggests next steps.

Other shortcuts: **`/sync`**, **`/doctor`**, **`/audit`**, **`/refine`** — full list in [quick-commands-en.md](../reference/quick-commands-en.md).

---

## What you need

| Item | Required? | For what |
|------|--------------|----------|
| Node.js 20+ | Yes | Run `hyperion:*`, `cards:*` |
| GitHub repository | Yes (GitHub backend) | Issues + Projects |
| **`gh` CLI + login** | **Yes for local automation** | Auto-detect token, repo, Project — [tutorial](../integration/github-cli-setup-en.md) |
| Existing GitHub Project | No | Sync creates one automatically if missing |
| Jira account + API token | Only for Jira backend | Create/update Jira issues |

> **Summary:** for GitHub "plug and play", install `gh` and run `gh auth login`. Tutorial: **[github-cli-setup-en.md](../integration/github-cli-setup-en.md)**

---

## Step 1 — Copy the kit

Copy to your repository **root**:

| Folder / file | Required? |
|-----------------|--------------|
| `.github/` | Yes |
| `scripts/` | Yes (cards-sync) |
| `package.json` | Recommended (`npm run hyperion:*` and `cards:*`) |
| `.env.example` | Recommended (copy to `.env` if not using `gh`) |
| `CLAUDE.md` | If using Claude Code |
| `.cursor/rules/` | If using Cursor (included in full kit) |

```
.github/
scripts/
package.json       ← npm run hyperion:* and cards:* shortcuts
.env.example       ← alternative to gh auth login
```

---

## Step 2 — Configure the project

### Option A: With AI (recommended)

Ask the agent:

> "Run **project-discovery** in **Configure** mode"

This generates `.github/project.yml` with stack, paths, and locale.

### Option B: Manual

```bash
cp .github/project.example.yml .github/project.yml
# Edit name, locale, apps, etc.
```

Also fill in (optional but recommended):

- `.github/memory/PROJECT.md`
- `.github/memory/DOMAIN.md`
- `.github/memory/DECISIONS.md`

---

## Step 2.5 — GitHub CLI (local automation)

**Required** if you want sync to discover token, repo, and Project on its own.

1. Install `gh`: **[github-cli-setup-en.md](../integration/github-cli-setup-en.md)** (Windows / macOS / Linux)
2. Log in:

```bash
gh auth login
gh auth status
```

3. Bootstrap cards-sync:

```bash
npm run hyperion:setup -- --yes
```

Or ask the agent: **`/setup`**. Granular equivalent: `npm run cards:init -- --yes`.

Without `gh`, configure `GITHUB_TOKEN` in `.env` — see [`.env.example`](../../../.env.example).

---

## Step 3 — Configure Cards Sync

Edit `.github/cards/config/projects-map.json`:

```json
{
  "default": {
    "projectOwner": null,
    "projectNumber": null,
    "autoCreateProject": true,
    "autoDiscoverProject": true,
    "locale": "en",
    "backend": "github",
    "fieldMap": {
      "status": "Status",
      "type": "Type",
      "priority": "Priority",
      "sprint": "Sprint",
      "storyPoints": "Story Points",
      "reporter": "Reporter",
      "parent": "Parent (Epic/Feature)",
      "dueDate": "Due Date"
    },
    "defaults": { "status": "Backlog" },
    "labelsFile": "labels.{locale}.json",
    "createMissingLabels": true
  }
}
```

### If the Project already exists

1. Open the Project on GitHub
2. Get the number from the URL: `.../projects/7` → `projectNumber: 7`
3. Confirm **fields** match `fieldMap` (or adjust)

### If the Project does NOT exist (worst case)

Leave `projectNumber: null` and `autoCreateProject: true`.

Sync automatically creates a Project named:

**`[RepositoryName] Hyperion Project`**

---

## Step 3.1 — Choose backend (GitHub / Jira / others)

Full guide with decision tree: **[choose-backend-en.md](../integration/choose-backend-en.md)**

Summary by backend:

### GitHub backend (default)

No changes needed: `backend: "github"` in `projects-map.json` works out of the box.

### Jira backend (forward + reverse)

1. Set in environment:
   - `CARDS_SYNC_BACKEND=jira`
   - `JIRA_URL`
   - `JIRA_PROJECT_KEY`
   - `JIRA_EMAIL`
   - `JIRA_API_TOKEN`
2. Optional: `JIRA_ISSUE_TYPE=Task`
3. In `project.yml`:

```yaml
management:
  backend: jira
  url: https://your-org.atlassian.net
  project_key: PROJ
```

> Current Jira mode: forward and reverse sync:
> - `forward`: creates/updates issues, labels, and links
> - `reverse`: Jira → Markdown using `CARD_ID` marker in description

### Azure DevOps (forward best-effort)

1. Set in environment:
   - `CARDS_SYNC_BACKEND=azure-devops`
   - `AZDO_ORG_URL`
   - `AZDO_PROJECT`
   - `AZDO_PAT`
2. Optional: `AZDO_WORK_ITEM_TYPE=Task`

### Linear (forward best-effort)

1. Set in environment:
   - `CARDS_SYNC_BACKEND=linear`
   - `LINEAR_TEAM_ID`
   - `LINEAR_API_TOKEN`

### GitLab (forward best-effort)

1. Set in environment:
   - `CARDS_SYNC_BACKEND=gitlab`
   - `GITLAB_PROJECT_ID`
   - `GITLAB_TOKEN`
   - optional: `GITLAB_URL` (default: `https://gitlab.com`)

---

## Step 4 — Configure the board (Status columns)

If you create the Project manually, use these columns (EN):

| Status |
|--------|
| Backlog |
| Functional Refinement |
| Technical Refinement |
| In Progress |
| In Tests |
| In Revision |
| Done |

> Sync detects **field** names in PT or EN (`Type`/`Tipo`, `Priority`/`Prioridade`, etc.).

---

## Step 5 — Validate and sync

### Automatic path (GitHub — recommended)

If you completed [Step 2.5](#step-25--github-cli-local-automation), bootstrap already ran validate + dry-run. To repeat or force sync:

```bash
npm run hyperion:setup -- --yes    # full bootstrap + real sync
npm run cards:watch            # incremental sync on save
```

### Manual path (advanced or other backends)

<details>
<summary>Individual node commands</summary>

```bash
npm run cards:doctor
npm run cards:validate
npm run cards:dry-run
npm run cards:sync

# Jira
CARDS_SYNC_BACKEND=jira npm run cards:sync

# Reverse
npm run cards:reverse
CARDS_SYNC_BACKEND=jira npm run cards:sync -- --reverse
```

</details>

In CI, `.github/workflows/hyperion-sync-cards.yml` runs automatically when cards change.

---

## Step 6 — Create your first card

**Recommended:** ask the agent *"Refine my idea into cards"* (`card-refiner`) — it uses `.github/cards/CARD.template.md`.

Or copy the template manually:

1. Duplicate `.github/cards/CARD.template.md` → `.github/cards/epics/PROJ-EPIC-001.md`
2. Adjust frontmatter (`card_id`, `title`, `categories`, …)
3. Validate and sync:

```bash
npm run cards:validate
npm run cards:dry-run
npm run cards:sync
# or while editing:
npm run cards:watch
```

> **Reference ≠ board:** `_examples/`, `*.template.md`, and `EXAMPLE-*` / `TEMPLATE-*` / `SAMPLE-*` card IDs **never** go to GitHub Projects. Only cards you create under `epics/`, `features/`, `stories/`, `tasks/` sync (e.g. `PROJ-EPIC-001`).

Minimal frontmatter example:

```yaml
---
card_id: PROJ-EPIC-001
title: "My first feature"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
---
```

Or ask the agent: *"Refine my idea into cards"* (`card-refiner`).

---

## Status rules (safe mode — GitHub Projects)

> On Jira/Azure/Linear/GitLab, `status` is written to issue metadata on forward sync; native board columns are not mapped yet.

| Situation | Behavior |
|----------|---------------|
| New card without `status` | Goes to `Backlog` (default) |
| New card with `status: Functional Refinement` | Goes to that column |
| Existing card without `status` in frontmatter | **Preserves** manual board status |
| Existing card with explicit `status` | Applies card status |

### When to use each status

| Status | When |
|--------|--------|
| `Backlog` | New idea, not refined |
| `Functional Refinement` | Needs product refinement |
| `Technical Refinement` | Passed functional, needs technical refinement |
| `In Progress` | In development |
| `In Tests` | In testing |
| `In Revision` | In review |
| `Done` | Complete |

---

## Conversational evolution (agent)

Ask in natural language — the agent edits the **same card file**, validates, and syncs:

- *"move EXAMPLE-STORY-001 to Done"*
- *"put card 001 in In Progress"*
- *"raise PROJ-EPIC-001 priority to High"*

Flow: edit frontmatter → `validate.mjs` → `sync.mjs`. See `card-refiner` skill § Card evolution during conversation.

**GitHub:** Project Status column updates after sync.  
**Jira:** tries workflow transition when status name matches (configure `optionMapByLocale` for PT).  
**Azure/Linear/GitLab:** status in issue metadata (native board not mapped yet).

---

## What the agent does vs what you do

| Task | Who |
|--------|----------|
| Create `.github/project.yml` | Agent (`project-discovery`) |
| Generate structured cards | Agent (`card-refiner`) |
| Configure `projects-map.json` | Agent (`cards-sync-setup`) or manual |
| Create GitHub Project | Sync auto (if missing) |
| GitHub Projects UI workflows | **You** (native board automations) |
| Move cards manually on board (no `status` in frontmatter) | **You** — sync preserves (safe mode) |
| Ask agent "move card X to Done" | **Agent** — edits `status` in file + sync |
| Sync cards → Issues | Script / GitHub Actions |

---

## Environment variables

Copy the template at kit root:

```bash
cp .env.example .env
# Edit .env — do NOT commit (already in .gitignore)
```

| Variable | When needed |
|----------|----------------|
| `GITHUB_TOKEN` / `gh auth login` | GitHub sync local — [gh tutorial](../integration/github-cli-setup-en.md) |
| `PROJECT_SYNC_TOKEN` | Project on user profile (not repo) |
| `CARDS_SYNC_BACKEND=jira` + `JIRA_*` | Jira backend |
| `AZDO_*` / `LINEAR_*` / `GITLAB_*` | Other backends |

Full list: [`.env.example`](../../../.env.example)

npm shortcuts (optional — requires `package.json` at root):

```bash
npm run hyperion:setup -- --yes    # full bootstrap (GitHub)
npm run hyperion:sync              # validate + sync
npm run cards:validate
npm run cards:sync
npm run cards:watch         # incremental sync on save
npm run cards:hook          # pre-commit validate
```

---

## Token and permissions

| Scenario | Token |
|---------|-------|
| Project on **repository** | `GITHUB_TOKEN` (Actions) or `gh auth token` (local) |
| Project on **user profile** | PAT with `project` scope → secret `PROJECT_SYNC_TOKEN` |

Workflow permissions (already configured):

- `issues: write`
- `repository-projects: write`

---

## Quick troubleshooting

| Problem | Solution |
|----------|---------|
| Project not found | Check `projectOwner`/`projectNumber` or leave null for auto-create |
| Empty fields | Compare `fieldMap` names vs Project Settings |
| Labels not applied | `createMissingLabels: true` (default) |
| Duplicate issues | Every card needs a stable `card_id` |
| Status not changing | Existing card without `status` in frontmatter = preserves manual |
| Token missing | `gh auth login` — [tutorial](../integration/github-cli-setup-en.md) or `PROJECT_SYNC_TOKEN` |
| Jira auth missing | Set `JIRA_URL`, `JIRA_PROJECT_KEY`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |

Full documentation: [`scripts/cards-sync/README.md`](../../../scripts/cards-sync/README.md)

---

## Next steps

After setup:

1. **Explore problem** → `hypothesis-forge`
2. **Refine into cards** → `card-refiner`
3. **Implement** → `implementation-plan` agent
4. **Audit** → [first-audit-en.md](../quality/first-audit-en.md)

See all commands in the [main README](../README.md) and the map in [docs/README.md](../README.md).
