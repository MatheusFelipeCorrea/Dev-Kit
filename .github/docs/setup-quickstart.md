# START HERE — Setup em 5 minutos

Guia rápido para usar o Dev-Kit em um repositório novo.

**English:** [setup-quickstart-en.md](./setup-quickstart-en.md)

**Não sabe por onde começar?** Veja [README dos docs](./README.md) — tabela *Qual doc ler?*

---

## Caminho mais fácil (sem terminal)

Peça ao agente de IA:

> **`/setup`** — ou *"Configura o Dev-Kit neste repo"*

O agente roda `project-discovery`, preenche memória (com sua ajuda), executa `npm run devkit:setup` por você e oferece próximos passos.

Outros atalhos: **`/sync`**, **`/doctor`**, **`/audit`**, **`/refine`** — lista completa em [comandos-rapidos.md](./comandos-rapidos.md).

---

## O que você precisa

| Item | Obrigatório? | Para quê |
|------|--------------|----------|
| Node.js 20+ | Sim | Rodar `devkit:*`, `cards:*` |
| Repositório GitHub | Sim (backend GitHub) | Issues + Projects |
| **`gh` CLI + login** | **Sim para automação local** | Auto-detect de token, repo e Project — [tutorial](./github-cli-setup.md) |
| GitHub Project existente | Não | Se não existir, o sync cria automaticamente |
| Conta Jira + API token | Só se backend Jira | Criar/atualizar issues no Jira |

> **Resumo:** para GitHub “plug and play”, instale o `gh` e rode `gh auth login`. Tutorial: **[github-cli-setup.md](./github-cli-setup.md)**

---

## Passo 1 — Copiar o kit

Copie para a **raiz do seu repositório**:

| Pasta / arquivo | Obrigatório? |
|-----------------|--------------|
| `.github/` | Sim |
| `scripts/` | Sim (cards-sync) |
| `package.json` | Recomendado (`npm run devkit:*` e `cards:*`) |
| `.env.example` | Recomendado (copie para `.env` se não usar `gh`) |
| `CLAUDE.md` | Se usar Claude Code |
| `.cursor/rules/` | Se usar Cursor (incluso no kit completo) |

```
.github/
scripts/
package.json       ← atalhos npm run devkit:* e cards:*
.env.example       ← alternativa ao gh auth login
```

---

## Passo 2 — Configurar o projeto

### Opção A: Com IA (recomendado)

Peça ao agente:

> "Rode **project-discovery** em modo **Configure**"

Isso gera `.github/project.yml` com stack, paths e locale.

### Opção B: Manual

```bash
cp .github/project.example.yml .github/project.yml
# Edite name, locale, apps, etc.
```

Preencha também (opcional, mas recomendado):

- `.github/memory/PROJECT.md`
- `.github/memory/DOMAIN.md`
- `.github/memory/DECISIONS.md`

---

## Passo 2.5 — GitHub CLI (automação local)

**Obrigatório** se você quer que o sync descubra token, repo e Project sozinho.

1. Instale o `gh`: **[github-cli-setup.md](./github-cli-setup.md)** (Windows / macOS / Linux)
2. Faça login:

```bash
gh auth login
gh auth status
```

3. Bootstrap do Dev-Kit:

```bash
npm run devkit:setup -- --yes
```

Equivalente granular: `npm run cards:init -- --yes`. **Ou peça `/setup` ao agente.**

Sem `gh`, configure `GITHUB_TOKEN` no `.env` — veja [`.env.example`](../../.env.example).

---

## Passo 3 — Configurar Cards Sync

Edite `.github/cards/config/projects-map.json`:

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

### Se o Project já existe

1. Abra o Project no GitHub
2. Pegue o número na URL: `.../projects/7` → `projectNumber: 7`
3. Confirme que os **fields** batem com `fieldMap` (ou ajuste)

### Se o Project NÃO existe (pior caso)

Deixe `projectNumber: null` e `autoCreateProject: true`.

O sync cria automaticamente um Project chamado:

**`[NomeDoRepositorio] Dev-Kit Project`**

---

## Passo 3.1 — Escolher backend (GitHub / Jira / outros)

Guia completo com árvore de decisão: **[escolher-backend.md](./escolher-backend.md)**

Resumo abaixo por backend:

### Backend GitHub (default)

Não precisa mudar nada: `backend: "github"` em `projects-map.json` já funciona.

### Backend Jira (forward + reverse)

1. Defina no ambiente:
   - `CARDS_SYNC_BACKEND=jira`
   - `JIRA_URL`
   - `JIRA_PROJECT_KEY`
   - `JIRA_EMAIL`
   - `JIRA_API_TOKEN`
2. Opcional: `JIRA_ISSUE_TYPE=Task`
3. Em `project.yml`, você pode registrar:

```yaml
management:
  backend: jira
  url: https://your-org.atlassian.net
  project_key: PROJ
```

> No modo Jira atual, o sync faz forward e também reverse:
> - `forward`: cria/atualiza issues, labels e links entre issues
> - `reverse`: Jira -> Markdown usando o marcador `CARD_ID` no description

---
### Backend Azure DevOps (forward best-effort)

1. Defina no ambiente:
   - `CARDS_SYNC_BACKEND=azure-devops`
   - `AZDO_ORG_URL`
   - `AZDO_PROJECT`
   - `AZDO_PAT`
2. Opcional: `AZDO_WORK_ITEM_TYPE=Task`

> No modo Azure atual, o sync faz forward: cria/atualiza work items de forma idempotente pelo marcador `CARD_ID`.

---
### Backend Linear (forward best-effort)

1. Defina no ambiente:
   - `CARDS_SYNC_BACKEND=linear`
   - `LINEAR_TEAM_ID`
   - `LINEAR_API_TOKEN`

> No modo Linear atual, o sync faz forward: cria/atualiza issues idempotentes pelo marcador `CARD_ID`.

---
### Backend GitLab (forward best-effort)

1. Defina no ambiente:
   - `CARDS_SYNC_BACKEND=gitlab`
   - `GITLAB_PROJECT_ID`
   - `GITLAB_TOKEN`
   - opcional: `GITLAB_URL` (default: `https://gitlab.com`)

> No modo GitLab atual, o sync faz forward: cria/atualiza issues idempotentes pelo marcador `CARD_ID`.

---

## Passo 4 — Configurar o board (Status columns)

Se você cria o Project manualmente, use estas colunas (EN):

| Status |
|--------|
| Backlog |
| Functional Refinement |
| Technical Refinement |
| In Progress |
| In Tests |
| In Revision |
| Done |

> O sync detecta nomes de **fields** em PT ou EN (`Type`/`Tipo`, `Priority`/`Prioridade`, etc.).

---

## Passo 5 — Validar e sincronizar

### Caminho automático (GitHub — recomendado)

Se você fez o [Passo 2.5](#passo-25--github-cli-automação-local), o bootstrap já rodou validate + dry-run. Para repetir ou forçar sync:

```bash
npm run devkit:setup -- --yes    # bootstrap completo + sync real
npm run cards:watch            # sync incremental ao salvar cards
```

### Caminho manual (avançado ou outros backends)

<details>
<summary>Comandos node individuais</summary>

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

No CI, `.github/workflows/sync-cards.yml` roda automaticamente ao alterar cards.

---

## Passo 6 — Criar seu primeiro card

**Recomendado:** peça ao agente *"Refina minha ideia em cards"* (`card-refiner`) — ele usa `.github/cards/CARD.template.md` (layout amigável com emojis, negrito e blocos de código).

Ou copie o template manualmente:

1. Duplique `.github/cards/CARD.template.md` → `.github/cards/epics/PROJ-EPIC-001.md`
2. Ajuste frontmatter (`card_id`, `title`, `categories`, …)
3. Valide e sincronize:

```bash
npm run cards:validate
npm run cards:dry-run
npm run cards:sync
# ou, enquanto edita:
npm run cards:watch
```

O sync publica no GitHub com **links** (parent/sub-issues), seções mais legíveis e rodapé **🔄 Dev-Kit sync**.

> **Referência ≠ board:** `_examples/`, `*.template.md` e IDs `EXAMPLE-*`/`TEMPLATE-*`/`SAMPLE-*` **nunca** vão pro GitHub Project. Só cards criados em `epics/`, `features/`, `stories/`, `tasks/` (ex.: `PROJ-EPIC-001`).

Exemplo mínimo de frontmatter:

```yaml
---
card_id: PROJ-EPIC-001
title: "Minha primeira feature"
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

---

## Regras de Status (modo seguro — GitHub Projects)

> Em Jira/Azure/Linear/GitLab o `status` é gravado nos metadados da issue na forward sync; colunas nativas do board ainda não são mapeadas.

| Situação | Comportamento |
|----------|---------------|
| Card novo sem `status` | Vai para `Backlog` (default) |
| Card novo com `status: Functional Refinement` | Vai para essa coluna |
| Card existente sem `status` no frontmatter | **Preserva** status manual no board |
| Card existente com `status` explícito | Aplica o status do card |

### Quando usar cada status

| Status | Quando |
|--------|--------|
| `Backlog` | Ideia nova, sem refinamento |
| `Functional Refinement` | Precisa refinamento de produto |
| `Technical Refinement` | Passou funcional, precisa refinamento técnico |
| `In Progress` | Em desenvolvimento |
| `In Tests` | Em testes |
| `In Revision` | Em revisão |
| `Done` | Concluído |

---

## Evolução conversacional (agente)

Peça em linguagem natural — o agente edita o **mesmo arquivo** do card, valida e sincroniza:

- *"mova EXAMPLE-STORY-001 para Done"*
- *"coloca o card 001 em In Progress"*
- *"aumenta a prioridade do PROJ-EPIC-001 para High"*

Fluxo: editar frontmatter → `validate.mjs` → `sync.mjs`. Detalhes em `card-refiner` skill § Card evolution during conversation.

**GitHub:** coluna Status do Project atualiza após sync.  
**Jira:** tenta transição de workflow quando o nome do status bate (configure `optionMapByLocale` se usar PT).  
**Azure/Linear/GitLab:** status em metadados da issue (board nativo ainda não mapeado).

---

## O que o agente faz vs o que você faz

| Tarefa | Quem faz |
|--------|----------|
| Criar `.github/project.yml` | Agent (`project-discovery`) |
| Gerar cards estruturados | Agent (`card-refiner`) |
| Configurar `projects-map.json` | Agent (`cards-sync-setup`) ou manual |
| Criar Project no GitHub | Sync auto (se não existir) |
| Workflows do GitHub Projects (UI) | **Você** (automations nativas do board) |
| Mover cards manualmente no board (sem `status` no frontmatter) | **Você** — sync preserva (modo seguro) |
| Pedir ao agente "mova card X para Done" | **Agent** — edita `status` no arquivo + sync |
| Sync cards → Issues | Script / GitHub Actions |

---

## Variáveis de ambiente

Copie o template na raiz do kit:

```bash
cp .env.example .env
# Edite .env — NÃO commite (já está no .gitignore)
```

| Variável | Quando precisa |
|----------|----------------|
| `GITHUB_TOKEN` / `gh auth login` | Sync GitHub local — [tutorial gh](./github-cli-setup.md) |
| `PROJECT_SYNC_TOKEN` | Project no perfil do usuário (não no repo) |
| `CARDS_SYNC_BACKEND=jira` + `JIRA_*` | Backend Jira |
| `AZDO_*` / `LINEAR_*` / `GITLAB_*` | Outros backends |

Lista completa: [`.env.example`](../../.env.example)

Atalhos npm (opcional — requer `package.json` na raiz):

```bash
npm run devkit:setup -- --yes    # bootstrap completo (GitHub)
npm run devkit:sync              # validate + sync
npm run cards:validate
npm run cards:sync
npm run cards:watch         # sync incremental ao salvar cards
npm run cards:hook          # pre-commit validate
```

---

## Token e permissões

| Cenário | Token |
|---------|-------|
| Project no **repositório** | `GITHUB_TOKEN` (Actions) ou `gh auth token` (local) |
| Project no **perfil do usuário** | PAT com scope `project` → secret `PROJECT_SYNC_TOKEN` |

Permissões do workflow (já configuradas):

- `issues: write`
- `repository-projects: write`

---

## Troubleshooting rápido

| Problema | Solução |
|----------|---------|
| Project not found | Verifique `projectOwner`/`projectNumber` ou deixe null para auto-create |
| Fields vazios | Confira nomes no `fieldMap` vs Project Settings |
| Labels não aplicadas | `createMissingLabels: true` (default) |
| Issues duplicadas | Todo card precisa de `card_id` estável |
| Status não muda | Card existente sem `status` no frontmatter = preserva manual |
| Token missing | `gh auth login` — [tutorial](./github-cli-setup.md) ou configure `PROJECT_SYNC_TOKEN` |
| Jira auth missing | Defina `JIRA_URL`, `JIRA_PROJECT_KEY`, `JIRA_EMAIL`, `JIRA_API_TOKEN` |

Documentação completa: [`scripts/cards-sync/README.md`](../../scripts/cards-sync/README.md)

---

## Próximos passos

Depois do setup:

1. **Explorar problema** → `hypothesis-forge`
2. **Refinar em cards** → `card-refiner`
3. **Implementar** → `implementation-plan` agent
4. **Auditar** → [primeira-auditoria.md](./primeira-auditoria.md)

Veja todos os comandos no [README principal](../../README.md) e o mapa em [docs/README.md](./README.md).
