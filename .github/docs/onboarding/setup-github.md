# 🔧 Setup GitHub — Hyperion

Guia **curto** para GitHub Projects. 🟢 Primeira vez? Comece em [GETTING-STARTED.md](../../../GETTING-STARTED.md) (6 comandos).

**English:** [setup-github-en.md](./setup-github-en.md) · **Outros boards:** [escolher-backend.md](../integration/escolher-backend.md)

---

## ⏱️ 5 minutos

| # | Passo |
|---|-------|
| 1️⃣ | Clone [Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion) e copie `.github/`, `scripts/`, `package.json` (+ `bin/`, `Dockerfile` se quiser Docker) |
| 2️⃣ | No chat: **`/setup`** (novo) ou **`/migrate`** (já tem código) |
| 3️⃣ | **`/doctor`** — veja o que falta |
| 4️⃣ | `gh auth login` → **`/sync`** (se usar Projects) |
| 5️⃣ | **`/refine`** na sua primeira ideia |

---

## 🎛️ Agent vs npm

| Situação | Use |
|----------|-----|
| 💬 Dia a dia | **`/setup`**, **`/sync`**, **`/doctor`**, **`/refine`** |
| ⌨️ Terminal | `npm run hyperion:setup -- --yes`, `hyperion:sync` |
| 🤖 CI | `hyperion-sync-cards.yml` |

---

## ✅ Pré-requisitos (GitHub)

| Item | Obrigatório? |
|------|--------------|
| Node 20+ **ou** Docker | ✅ Sim — [node-and-docker.md](../meta/node-and-docker.md) (`./bin/hyperion`) |
| Repo GitHub | ✅ Sim |
| `gh auth login` | ✅ Para sync local — [tutorial](../integration/github-cli-setup.md) |
| Project existente | ❌ Não — sync cria se `autoCreateProject: true` |

---

## 📦 Copiar o kit

**Fonte:** [github.com/MatheusFelipeCorrea/Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion)

```bash
git clone https://github.com/MatheusFelipeCorrea/Hyperion.git
```

| Pasta / arquivo | |
|-----------------|---|
| `.github/` | ✅ |
| `scripts/` | ✅ |
| `package.json` | Recomendado |
| `bin/` + `Dockerfile` | Se usar Docker sem Node — [node-and-docker.md](../meta/node-and-docker.md) |
| `.cursor/rules/` | Se usar Cursor |
| `CLAUDE.md` | Se usar Claude Code |

---

## ⚙️ Configurar

**Com IA:** **`/setup`** ou **`/migrate`**. Só `project.yml`: **`/discover`**.

**Manual:**

```bash
cp .github/project.example.yml .github/project.yml
gh auth login
npm run hyperion:setup -- --yes
```

---

## 🔄 Cards sync (GitHub)

Default em `.github/cards/config/projects-map.json`:

- `backend: "github"`
- `projectNumber: null` + `autoCreateProject: true` → cria Project `[Repo] Hyperion Project`
- Se já existe: URL `.../projects/7` → `projectNumber: 7`

**Status (modo seguro):** card existente **sem** `status` no frontmatter → sync **preserva** coluna manual. Peça *"mova CARD para Done"* → agente edita frontmatter + **`/sync`**.

Colunas recomendadas: Backlog, Functional Refinement, Technical Refinement, In Progress, In Tests, In Revision, Done.

---

## 📝 Primeiro card

> **`/refine`** — ou copie `.github/cards/CARD.template.md` em `epics/` / `stories/`

`_examples/` e `EXAMPLE-*` **nunca** vão pro board.

---

## ⚠️ Troubleshooting

| Problema | Solução |
|----------|---------|
| Token | `gh auth login` |
| Project not found | `projectNumber: null` ou confira owner/number |
| 0 cards | Normal no clone — crie em `epics/`, `features/`, etc. |
| Rules Cursor | `npm run hyperion:cursor` |

Mais: [armadilhas-comuns.md](../troubleshooting/armadilhas-comuns.md) · técnico: [cards-sync README](../../../scripts/cards-sync/README.md)

---

## ➡️ Próximo

| Quer | Leia |
|------|------|
| 🧩 Qual skill usar | [catalogo-skills.md](../reference/catalogo-skills.md) |
| 🔄 Jira/Linear/Azure/GitLab | [escolher-backend.md](../integration/escolher-backend.md) |
| 📚 Trilha completa | [trilha-de-aprendizado.md](./trilha-de-aprendizado.md) |
