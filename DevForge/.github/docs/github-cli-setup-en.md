# GitHub CLI (`gh`) — installation and login

DevForge uses the **GitHub CLI** to automate almost everything on the **GitHub Projects** backend:

| Without `gh` | With `gh auth login` |
|----------|---------------------|
| You must copy/paste token manually | Token detected automatically (`gh auth token`) |
| Local sync may not update Issues/Projects | `npm run cards:init` and `cards:watch` work |
| Limited Project auto-discovery | Finds and saves `projectNumber` automatically |

**Alternative to `gh`:** set `GITHUB_TOKEN` or `PROJECT_SYNC_TOKEN` in `.env` (see [`.env.example`](../../.env.example)). The CLI is just the simplest path.

**Português:** [github-cli-setup.md](./github-cli-setup.md)

---

## 1. Install

### Windows

**Option A — winget (recommended)**

```powershell
winget install --id GitHub.cli
```

**Option B — installer**

1. Download from [https://cli.github.com](https://cli.github.com)
2. Run the `.msi` and complete the wizard
3. Close and reopen the terminal (PowerShell or CMD)

**Verify:**

```powershell
gh --version
```

---

### macOS

**Homebrew (recommended):**

```bash
brew install gh
gh --version
```

**MacPorts:**

```bash
sudo port install gh
```

---

### Linux

**Debian / Ubuntu:**

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

**Fedora / RHEL:**

```bash
sudo dnf install gh
```

Official docs (other distros): [https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)

---

## 2. Log in

In the terminal, in your repository folder:

```bash
gh auth login
```

Answer the wizard:

| Question | Recommended for DevForge |
|----------|---------------------------|
| GitHub.com or Enterprise? | **GitHub.com** (or your Enterprise instance) |
| Protocol | **HTTPS** (simplest on Windows) |
| Authenticate | **Login with a web browser** |
| Scopes | Accept **repo** (and **project** if prompted) |

Browser opens → authorize → return to terminal.

**Verify login:**

```bash
gh auth status
gh auth token    # cards-sync uses this internally
```

---

## 3. Required permissions

For **cards-sync** with GitHub Projects (repo-level):

| Scope | For what |
|--------|----------|
| `repo` | Issues, labels, content |
| `read:project` / `project` | Read and update Project fields |

If the Project is on the **user profile** (not the repository), create a **fine-grained PAT** with **Projects** scope and save as `PROJECT_SYNC_TOKEN` in `.env` or GitHub Secrets.

---

## 4. Test with DevForge

Prerequisites: kit copied, `git remote` pointing to GitHub, Node 20+.

```bash
# 1. Full bootstrap (discover repo, token, project → validate → sync)
npm run cards:init -- --yes

# 2. Continuous mode (sync on save)
npm run cards:watch
```

If something fails:

```bash
npm run cards:doctor
node scripts/cards-sync/doctor.mjs --interactive
```

---

## 5. Common problems

| Symptom | Likely cause | Fix |
|---------|----------------|---------|
| `'gh' is not recognized` | CLI not installed or PATH | Reinstall; restart terminal |
| `Token missing` on sync | Not logged in | `gh auth login` |
| `Project not found` | Multiple Projects in repo | Set `projectNumber` in `projects-map.json` |
| `GraphQL failed` permission | Token without Projects scope | PAT with Projects or repo-level Project |
| `Repository: unknown/unknown` | No git remote | `git remote add origin git@github.com:OWNER/REPO.git` |

---

## 6. CI (GitHub Actions)

In CI **do not** use `gh auth login`. The workflow `.github/workflows/sync-cards.yml` uses `GITHUB_TOKEN` automatically.

Local = `gh`. CI = Actions token.

---

## Next steps

- [Documentation index](./README.md) — which doc to read
- [5-minute setup](./setup-quickstart-en.md)
- [Choose backend](./choose-backend-en.md)
- [Complete guide](./guide-complete-en.md)
- [Cards sync README](../../scripts/cards-sync/README.md)
