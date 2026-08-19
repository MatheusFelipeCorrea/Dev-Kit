# Choose management backend (GitHub, Jira, etc.)

Use this guide to decide **where your cards land** and which setup path to follow.

**Português:** [escolher-backend.md](./escolher-backend.md)

---

## Decision tree

```
Which management tool do you use?
│
├── GitHub Projects (Issues + board in repo)
│   └── → github-cli-setup-en.md + /setup (or devkit:setup -- --yes)
│
├── Jira
│   └── → integration-bridge (via agent) + setup-quickstart-en §3.1 Jira
│
├── Azure DevOps
│   └── → integration-bridge + setup-quickstart-en §3.1 Azure
│
├── Linear
│   └── → integration-bridge + setup-quickstart-en §3.1 Linear
│
└── GitLab Issues
    └── → integration-bridge + setup-quickstart-en §3.1 GitLab
```

---

## Quick comparison

| Backend | Setup | Sync | Board status | Reverse |
|---------|-------|------|-----------------|---------|
| **GitHub** | Easiest (`gh auth login`) | Full | Status column ✅ | ✅ |
| **Jira** | API token + env vars | Forward + reverse | Workflow transition ✅ | ✅ |
| **Azure DevOps** | PAT + env vars | Forward | Metadata ⚠️ | ❌ |
| **Linear** | API token | Forward | Metadata ⚠️ | ❌ |
| **GitLab** | Token + project ID | Forward | Metadata ⚠️ | ❌ |

> **Recommendation:** if you are already on GitHub, use GitHub Projects — most automation.

---

## GitHub Projects (default)

**When to choose:** repo on GitHub, project board in the same ecosystem.

**Setup:**

1. [github-cli-setup-en.md](./github-cli-setup-en.md) — `gh auth login`
2. **`/setup`** or `npm run devkit:setup -- --yes`
3. `npm run cards:watch` (optional, sync on save)

**Ask the agent:** *"Configure cards sync"* → skill `cards-sync-setup`

---

## Jira

**When to choose:** team already uses Jira Cloud/Server as source of truth.

**Setup:**

1. Copy [`.env.example`](../../.env.example) → `.env`
2. Fill in: `JIRA_URL`, `JIRA_PROJECT_KEY`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
3. Set `CARDS_SYNC_BACKEND=jira`
4. In `project.yml`:

```yaml
management:
  backend: jira
  url: https://your-org.atlassian.net
  project_key: PROJ
```

5. Sync: `CARDS_SYNC_BACKEND=jira npm run cards:sync`

**Ask the agent:** *"Connect to Jira"* → skill `integration-bridge`

**Tip:** map PT status names in `projects-map.json` → `optionMapByLocale`.

---

## Azure DevOps / Linear / GitLab

**When to choose:** board already exists in that tool.

**Setup:** see [setup-quickstart-en §3.1](./setup-quickstart-en.md#step-31--choose-backend-github--jira--others) for each backend's env vars.

**Ask the agent:** *"Connect to Azure"* / *"Connect to Linear"* / *"Connect to GitLab"* → `integration-bridge`

---

## After choosing

| Next step | Document |
|---------------|-----------|
| Create cards | Ask *"Refine X into cards"* or see [guide-complete-en §4](./guide-complete-en.md#4-how-do-cards-work) |
| Evolve cards | *"move CARD-ID to Done"* — [card-refiner](../skills/planning/card-refiner/SKILL.md) |
| Audit repo | [first-audit-en.md](./first-audit-en.md) |
