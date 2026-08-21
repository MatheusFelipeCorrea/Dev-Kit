# 🔧 GitHub setup — Hyperion

**Short** guide for GitHub Projects. 🟢 First time? Start at [GETTING-STARTED.md](../../../GETTING-STARTED.md) (6 commands).

**Português:** [setup-github.md](./setup-github.md) · **Other boards:** [choose-backend-en.md](../integration/choose-backend-en.md)

---

## ⏱️ 5 minutes

| # | Step |
|---|------|
| 1️⃣ | Clone [Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion) and copy `.github/`, `scripts/`, `package.json` (+ `bin/`, `Dockerfile` for Docker) |
| 2️⃣ | In chat: **`/setup`** (new) or **`/migrate`** (existing code) |
| 3️⃣ | **`/doctor`** — see what's missing |
| 4️⃣ | `gh auth login` → **`/sync`** (if using Projects) |
| 5️⃣ | **`/refine`** for your first idea |

---

## 🎛️ Agent vs npm

| Situation | Use |
|-----------|-----|
| 💬 Day to day | **`/setup`**, **`/sync`**, **`/doctor`**, **`/refine`** |
| ⌨️ Terminal | `npm run hyperion:setup -- --yes`, `hyperion:sync` |
| 🤖 CI | `hyperion-sync-cards.yml` |

---

## ✅ Prerequisites (GitHub)

| Item | Required? |
|------|-----------|
| Node 20+ **or** Docker | ✅ Yes — [node-and-docker-en.md](../meta/node-and-docker-en.md) (`./bin/hyperion`) |
| GitHub repo | ✅ Yes |
| `gh auth login` | ✅ For local sync — [tutorial](../integration/github-cli-setup-en.md) |
| Existing Project | ❌ No — sync creates if `autoCreateProject: true` |

---

## 📦 Copy the kit

**Source:** [github.com/MatheusFelipeCorrea/Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion)

```bash
git clone https://github.com/MatheusFelipeCorrea/Hyperion.git
```

| Folder / file | |
|---------------|---|
| `.github/` | ✅ |
| `scripts/` | ✅ |
| `package.json` | Recommended |
| `bin/` + `Dockerfile` | If using Docker without Node — [node-and-docker-en.md](../meta/node-and-docker-en.md) |
| `.cursor/rules/` | If using Cursor |
| `CLAUDE.md` | If using Claude Code |

---

## ⚙️ Configure

**With AI:** **`/setup`** or **`/migrate`**. Only `project.yml`: **`/discover`**.

**Manual:**

```bash
cp .github/project.example.yml .github/project.yml
gh auth login
npm run hyperion:setup -- --yes
```

---

## 🔄 Cards sync (GitHub)

Default in `.github/cards/config/projects-map.json`:

- `backend: "github"`
- `projectNumber: null` + `autoCreateProject: true` → creates `[Repo] Hyperion Project`
- If one exists: URL `.../projects/7` → `projectNumber: 7`

**Status (safe mode):** existing card **without** `status` in frontmatter → sync **preserves** manual column. Ask *"move CARD to Done"* → agent edits frontmatter + **`/sync`**.

Recommended columns: Backlog, Functional Refinement, Technical Refinement, In Progress, In Tests, In Revision, Done.

---

## 📝 First card

> **`/refine`** — or copy `.github/cards/CARD.template.md` into `epics/` / `stories/`

`_examples/` and `EXAMPLE-*` **never** go to the board.

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| Token | `gh auth login` |
| Project not found | `projectNumber: null` or check owner/number |
| 0 cards | Normal on clean clone — create in `epics/`, `features/`, etc. |
| Cursor rules | `npm run hyperion:cursor` |

More: [common-pitfalls-en.md](../troubleshooting/common-pitfalls-en.md) · technical: [cards-sync README](../../../scripts/cards-sync/README.md)

---

## ➡️ Next

| Want | Read |
|------|------|
| 🧩 Which skill | [skills-catalog.md](../reference/skills-catalog.md) |
| 🔄 Jira/Linear/Azure/GitLab | [choose-backend-en.md](../integration/choose-backend-en.md) |
| 📚 Full path | [learning-path-en.md](./learning-path-en.md) |
