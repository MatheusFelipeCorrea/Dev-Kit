---
name: cards-sync-setup
description: >-
  Setup wizard for cards-sync in GitHub mode. Guides configuring GitHub Project,
  token, and projects-map.json. For Jira, Azure DevOps, Linear, or GitLab,
  route to integration-bridge. Covers status safe mode and conversational card
  evolution after setup.
---

# Cards Sync Setup Wizard

## When to use

- First-time setup of cards sync in a repository
- Troubleshooting sync failures
- Reconfiguring after Project changes
- Backend is GitHub (or unspecified/default)

If backend is **not GitHub** (Jira, Azure DevOps, Linear, GitLab), route to `integration-bridge`.

## Output

| Artifact | Path |
|----------|------|
| Sync configuration | `.github/cards/config/projects-map.json` |
| Label presets (optional) | `.github/cards/config/labels.{locale}.json` |
| Reference samples | `.github/cards/_examples/` (read-only for agents; never synced) |
| Last sync log (after init) | `.github/plans/cards/last-sync.md` |
| Workflow confirmation | `.github/workflows/sync-cards.yml` (must exist) |

Read `project.yml` → `outputs` if paths are customized. For non-GitHub backends, route to `integration-bridge` instead of writing GitHub-specific config.

## Step 0: GitHub CLI (local automation)

Before wizard questions, confirm GitHub CLI is ready for auto-detect:

1. Point the user to `.github/docs/github-cli-setup.md` (install + `gh auth login`)
2. Verify: `gh auth status` should show logged in
3. Suggest: `npm run cards:init -- --yes` for one-shot bootstrap (discover project → validate → sync)

If the user cannot install `gh`, guide them to `GITHUB_TOKEN` in `.env` (see `.env.example`).

## Step 1: Discover project context

Read `.github/project.yml` if it exists to get:
- Project name (for CARD_ID prefix)
- Repository owner

If absent, ask the user for:
- GitHub username or org
- Repository name

## Step 2: Project location

Ask: "Is your GitHub Project attached to the repository itself, or to your user profile?"

- **Repository-level**: default `GITHUB_TOKEN` from Actions works. No PAT needed in most cases.
- **User-level**: requires a fine-grained PAT with Projects scope saved as `PROJECT_SYNC_TOKEN`.

## Step 3: Get Project number

Ask the user to:
1. Open the Project in the browser
2. Look at the URL: `github.com/users/USERNAME/projects/N` or `github.com/OWNER/REPO/projects/N`
3. Provide the number N

## Step 4: Validate Project fields

The sync expects these fields in the Project (names must match exactly):

| Field | Type | Required options |
|-------|------|-----------------|
| Status | single select | Backlog, Functional Refinement, Technical Refinement, In Progress, In Tests, In Revision, Done |
| Type | single select | Epic, Feature, Story, Task, Subtask, Bug |
| Priority | single select | Highest, High, Medium, Low |
| Sprint | iteration | (create iterations as needed) |
| Story Points | number | — |
| Reporter | text | — |
| Parent (Epic/Feature) | text | — |
| Due Date | date | — |

Ask the user to confirm all fields exist with these exact names. If they use different names, update `fieldMap` in the config accordingly.

## Step 5: Generate projects-map.json

Write `.github/cards/config/projects-map.json`:

```json
{
  "default": {
    "projectOwner": "<detected or provided>",
    "projectNumber": <number from step 3>,
    "autoCreateProject": true,
    "locale": "en",
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
    "defaults": {
      "status": "Backlog"
    },
    "labelsFile": "labels.{locale}.json",
    "optionMapByLocale": {
      "en": {
        "status": {
          "Backlog": "Backlog",
          "Functional Refinement": "Functional Refinement",
          "Technical Refinement": "Technical Refinement",
          "In Progress": "In Progress",
          "In Tests": "In Tests",
          "In Revision": "In Revision",
          "Done": "Done"
        }
      }
    }
  }
}
```

Worst-case behavior: if the Project does not exist and `projectNumber` is `0/null` (and `autoCreateProject` is enabled),
the sync will auto-create a Project named: `[RepoName] DevForge Project` and **link it to the repository** (Default repository in Project Settings).

(`RepoName` is the repository name detected from git.)

## Step 6: Labels check

Default labels come from:
- `.github/cards/config/labels.en.json` (when `locale: en`)
- `.github/cards/config/labels.pt-BR.json` (when `locale: pt-BR`)

Tell the user to keep only one locale active per repository unless they intentionally
want bilingual labels.

Tell the user: "The sync will auto-create missing labels (CREATE_MISSING_LABELS=true by default). If you want to control colors, create them manually first."

## Step 7: Token setup

If repository-level Project:
- "The default GITHUB_TOKEN should work. No extra secret needed. If sync fails with permission errors, create a PAT."

If user-level Project:
- Guide to Settings > Developer settings > Fine-grained tokens
- Scopes: Issues (R/W), Contents (R), Projects (R/W)
- Save as repo secret: `PROJECT_SYNC_TOKEN`

## Step 8: Test

Instruct the user:
1. Copy `.github/cards/CARD.template.md` or adapt an `EXAMPLE-*` card
2. Run: `npm run cards:doctor`
3. Run: `npm run cards:validate`
4. Run: `npm run cards:dry-run`
5. If dry-run looks good: `npm run cards:sync` (or `npm run cards:init -- --yes` on first setup)
6. Check: Issue created? In Project? Fields populated? Labels applied? Issue body has parent/sub-issue **links**?

Optional: `npm run cards:labels-reset -- --yes` to align repo labels with DevForge catalog.

## Step 9: Workflow

Confirm `.github/workflows/sync-cards.yml` exists and triggers on:
- `push` to `.github/cards/**/*.md`
- `workflow_dispatch` for manual runs (supports `sync_direction: reverse` for GitHub reverse sync)

## Status safe mode (GitHub Projects)

| Situation | Behavior |
|-----------|----------|
| New card without `status` | Uses `defaults.status` (usually `Backlog`) |
| New card with explicit `status` | Applies that column |
| Existing card without `status` | Preserves manual board status |
| Existing card with explicit `status` | Applies status from frontmatter |

Full details: `.github/docs/setup-quickstart.md` § Regras de Status.

## After setup: conversational card moves

The user can ask the agent to evolve cards in natural language:
- *"mova EXAMPLE-STORY-001 para Done"*
- *"coloca o card 001 em In Progress"*

Agent workflow: edit existing file → `validate.mjs` → `sync.mjs`. See `card-refiner` skill § Card evolution during conversation.

**Note:** Board column updates on status change work on **GitHub Projects** today. Jira/other backends store status in issue metadata until native workflow mapping exists.

## Reverse sync (optional)

```bash
# GitHub → Markdown
node scripts/cards-sync/sync.mjs --reverse

# Jira → Markdown
CARDS_SYNC_BACKEND=jira node scripts/cards-sync/sync.mjs --reverse
```

## Troubleshooting guide

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| "Project not found" | Wrong owner or number | Recheck URL, ensure Project is on repo not user |
| "Token missing" | No GITHUB_TOKEN in env | Run inside Actions or set token manually |
| Fields stay empty | Name mismatch in fieldMap | Compare exact field names in Project settings |
| Duplicate issues | card_id missing or changed | Every card MUST have stable card_id in frontmatter |
| Labels not applied | Labels don't exist | CREATE_MISSING_LABELS=true auto-creates them |
| Sub-issues not linking | Feature unavailable or token scope | Ensure PAT has project + issues scope |
