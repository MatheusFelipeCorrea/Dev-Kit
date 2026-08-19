# Guia completo Dev-Kit — do zero ao uso diário

Este guia é para quem **nunca usou** o Dev-Kit. Leia na ordem.

**Atalhos:**
- **Qual doc ler?** → [docs/README.md](./README.md)
- **Onde ficam os arquivos gerados?** → [onde-ficam-os-outputs.md](./onde-ficam-os-outputs.md)
- **English (full guides):** [guide-complete-en.md](./guide-complete-en.md) · [setup-quickstart-en.md](./setup-quickstart-en.md) · [docs index](./README.md)
- Setup rápido (5 min): [setup-quickstart.md](./setup-quickstart.md)
- **GitHub CLI (instalar + login):** [github-cli-setup.md](./github-cli-setup.md)
- **Escolher backend:** [escolher-backend.md](./escolher-backend.md)
- **Primeira auditoria:** [primeira-auditoria.md](./primeira-auditoria.md)
- Variáveis de ambiente: [`.env.example`](../../.env.example)
- Referência técnica do sync: [`scripts/cards-sync/README.md`](../../scripts/cards-sync/README.md)

---

## 1. O que é o Dev-Kit?

Dev-Kit é um **kit portátil** de instruções para assistentes de IA (Cursor, GitHub Copilot, Claude Code, etc.).

Ele não é um app que você abre — é uma pasta (`.github/` + `scripts/`) que você **copia para o seu repositório**. A IA lê esses arquivos e passa a:

- Entender a estrutura do seu projeto
- Criar cards/tickets bem formatados
- Sincronizar cards com GitHub Projects, Jira, etc.
- Rodar auditorias, gerar ADRs, planos de implementação, e mais

**Analogia:** pense no Dev-Kit como um "manual de operação + ferramentas" que a IA segue dentro do seu repo.

> **Clone limpo:** várias pastas (ADRs, retros, diagramas, planos, auditorias) começam vazias e são preenchidas quando você usa skills. Blueprints de arquitetura só existem após `project-architect`. Veja [README — clone vs artefatos gerados](../../README.md#clone-limpo-vs-artefatos-gerados).

---

## 2. O que vem no kit?

```
Dev-Kit/
├── .github/           ← agentes, skills, cards, memória, workflows
├── scripts/cards-sync/← engine que sincroniza cards com boards
├── .env.example       ← variáveis de ambiente (copie para .env)
├── package.json       ← atalhos npm run devkit:* e cards:*
├── CLAUDE.md          ← config para Claude Code
└── README.md
```

### Agentes (fluxos longos, autônomos)

| Agente | Arquivo | Quando usar |
|--------|---------|-------------|
| **implementation-plan** | `.github/agents/implementation-plan.agent.md` | "Implementa o card X" — gera plano em fases com aprovação humana |
| **mentoring** | `.github/agents/mentoring.agent.md` | "Me ensina X" — mentor socrático, adapta ao seu nível |

### Skills (capacidades sob demanda — 24 no total)

Peça à IA usando linguagem natural. Ela deve ler o `SKILL.md` correspondente.

#### Planning — planejamento e produto

| Skill | Peça assim | O que faz |
|-------|------------|-----------|
| **hypothesis-forge** | "Explora essa ideia" | Persona, impacto, hipótese, decisão go/no-go |
| **acceptance-spec** | "Escreve spec de aceite" | Given/When/Then estruturado |
| **card-refiner** | "Refina isso em cards" / "mova card X para Done" | Cria **e evolui** cards; edita status, prioridade, critérios |
| **project-architect** | "Planeja arquitetura greenfield" | Passos guiados de arquitetura |
| **refactor-guide** | "Guia refactor seguro" | Refatoração incremental |
| **sprint-retro** | "Facilita retro da sprint" | Retrospectiva estruturada |

#### Setup — configuração e integrações

| Skill | Peça assim | O que faz |
|-------|------------|-----------|
| **project-startup** | **`/setup`** ou "Configura o Dev-Kit" | Orquestra setup completo (discovery → memory → cards) |
| **project-discovery** | "Descobre esse projeto" / **`/discover`** | Mapeia stack, pastas, docs; cria `.github/project.yml` |
| **devkit-ops** | **`/doctor`**, **`/sync`** | Agente roda `devkit:*` no terminal por você |
| **cards-sync-setup** | "Configura cards sync" | Wizard GitHub Project + token + `projects-map.json` |
| **integration-bridge** | "Conecta ao Jira/Azure/Linear/GitLab" | Ponte com ferramentas externas |

#### Quality — auditorias e qualidade

| Skill | Peça assim | O que faz |
|-------|------------|-----------|
| **full-audit** | "Auditoria completa" | Orquestra 6 dimensões |
| **security-audit** | "Revisão de segurança" | OWASP / appsec |
| **architecture-audit** | "Revisa arquitetura" | Padrões estruturais |
| **devops-audit** | "Revisão DevOps" | CI/CD, infra, deploy |
| **code-review** | "Code review" | Qualidade nível senior |
| **po-audit** | "Alinhamento de produto" | Cobertura de requisitos |
| **ux-audit** | "Revisão UX" | Design system, acessibilidade |
| **testing-strategy** | "Plano de testes" | Unit/integration/e2e |
| **tech-debt-tracker** | "Qual tech debt temos?" | Inventário priorizado |

#### Docs — documentação

| Skill | Peça assim | O que faz |
|-------|------------|-----------|
| **adr-generator** | "Gera ADR sobre X" | Architecture Decision Record |
| **plantuml-generator** | "Diagrama de arquitetura" | PlantUML + C4 |
| **readme-updater** | "Atualiza o README" | README alinhado ao estado atual |
| **changelog-generator** | "Gera changelog" | CHANGELOG a partir de commits |

---

## 3. Como colocar no meu projeto?

### Passo 1 — Copiar arquivos

Copie para a **raiz do seu repositório**:

1. A pasta `.github/` (merge com a existente se já tiver uma)
2. A pasta `scripts/`
3. Opcional: `CLAUDE.md`, `.cursor/rules/` (incluso), `.env.example`, `package.json`

### Passo 2 — Escolher seu runtime de IA

| Ferramenta | O que configurar |
|------------|------------------|
| **Cursor** | `.cursor/rules/dev-kit.mdc` (incluso no kit) |
| **GitHub Copilot** | Já lê `.github/instructions/copilot-instructions.md` |
| **Claude Code** | Copie `CLAUDE.md` para a raiz — commands `/discover`, `/audit`, etc. |

### Passo 3 — Criar o contrato do projeto

Peça à IA:

> "Rode project-discovery em modo Configure"

Isso cria `.github/project.yml` — o **único arquivo** que liga o kit genérico ao **seu** produto (stack, apps, locale, backend de gestão).

Ou copie manualmente de `.github/project.example.yml` e edite.

### Passo 4 — GitHub CLI (para automação no GitHub)

Se você usa **GitHub Projects**, instale e faça login no CLI — é o único passo manual “de verdade”:

→ **[github-cli-setup.md](./github-cli-setup.md)** (instalar Windows/macOS/Linux + `gh auth login`)

Depois:

```bash
npm run devkit:setup -- --yes
```

Ou peça ao agente: **`/setup`**. Equivalente granular: `npm run cards:init -- --yes`.

**Alternativa:** `GITHUB_TOKEN` no `.env` (sem `gh`).

### Passo 5 — Configurar cards sync (outros backends)

→ **[escolher-backend.md](./escolher-backend.md)** — árvore de decisão GitHub / Jira / Azure / Linear / GitLab

Peça ao agente:

> "Configura cards sync" (GitHub) ou "Conecta ao Jira" (outros)

Ou siga [setup-quickstart.md](./setup-quickstart.md) § Passo 3.1.

### Passo 6 — Variáveis de ambiente (Jira e outros)

```bash
cp .env.example .env
# Edite .env com token, Jira URL, etc.
```

**GitHub local:** instale o `gh` e rode `gh auth login` — [tutorial](./github-cli-setup.md). O sync detecta o token automaticamente.

**GitHub Actions:** use **Repository Secrets** (não commite `.env`). O CI não precisa do `gh`.

---

## 4. Como funcionam os cards?

Cards são arquivos Markdown em `.github/cards/` com **YAML frontmatter**:

```yaml
---
card_id: PROJ-STORY-001
title: "Login com OAuth"
status: Backlog
type: Story
priority: High
parent: PROJ-EPIC-001
categories:
  - Backend
  - Frontend
---

# [STORY] Login com OAuth

## Critérios de Aceite
...
```

Pastas:
- `epics/` — épicos
- `features/` — features
- `stories/` — histórias
- `tasks/` — tarefas

### Sincronizar com o board

Peça **`/sync`** ao agente — ou, no terminal:

```bash
npm run devkit:setup -- --yes   # 1ª vez
npm run devkit:sync             # validate + sync
npm run cards:watch               # incremental ao salvar
```

### Evolução conversacional

Depois de criar cards, você **não precisa editar manualmente** se preferir falar:

- *"mova PROJ-STORY-001 para Done"*
- *"coloca o card 001 em In Progress"*
- *"adiciona critério de aceite no card de login"*

A IA edita o **mesmo arquivo**, roda `/sync` (ou `devkit:sync`), e o board atualiza.

**Onde cada coisa fica:** [onde-ficam-os-outputs.md](./onde-ficam-os-outputs.md) — mapa completo de pastas por skill.

---

## 5. Fluxo de trabalho recomendado

```
Ideia → hypothesis-forge / card-refiner
           ↓
      Cards em .github/cards/
           ↓
      cards-sync → GitHub Projects / Jira
           ↓
      implementation-plan → código
           ↓
      code-review / full-audit  →  ver primeira-auditoria.md
```

### Primeira auditoria

Passo a passo: **[primeira-auditoria.md](./primeira-auditoria.md)** — peça *"Faz auditoria completa"* ou rode dimensões individuais.

### Memória persistente

A IA lê estes arquivos em toda sessão (se existirem):

| Arquivo | Conteúdo |
|---------|----------|
| `.github/memory/PROJECT.md` | O que é o projeto |
| `.github/memory/DOMAIN.md` | Regras de negócio |
| `.github/memory/DECISIONS.md` | Decisões já tomadas |

Atualize-os ou peça à IA para manter.

---

## 6. Backends de gestão (GitHub, Jira, etc.)

| Backend | Comando | Status no board |
|---------|---------|-----------------|
| **GitHub** (default) | `npm run cards:sync` | Coluna Status do Project ✅ |
| **Jira** | `CARDS_SYNC_BACKEND=jira npm run cards:sync` | Transição de workflow quando o nome bate ✅ |
| **Azure / Linear / GitLab** | ver `.env.example` | Forward only; status em metadata ⚠️ |

Configure `management.backend` em `project.yml` e variáveis em `.env`.

Para Jira, mapeie nomes de status em `projects-map.json` → `optionMapByLocale` se seu workflow usar nomes em PT.

---

## 7. Comandos úteis (resumo)

| Comando | O que faz |
|---------|-----------|
| `npm run devkit:setup -- --yes` | Bootstrap completo (recomendado 1ª vez) |
| `npm run devkit:sync` | Validate + sync |
| `npm run cards:init -- --yes` | Equivalente granular ao setup |
| `npm run cards:validate` | Valida frontmatter dos cards |
| `npm run cards:sync` | Sync forward |
| `npm run cards:sync -- --only ID` | Sync incremental (card + pais) |
| `npm run cards:watch` | Sync incremental ao salvar |
| `npm run cards:hook` | Instala pre-commit validate |
| `npm run cards:test` | Testes unitários |

---

## 8. Perguntas frequentes

**Preciso de Node instalado?**  
Sim, para cards-sync (Node 20+). As skills em si são Markdown — a IA lê sem Node.

**Preciso do GitHub CLI?**  
Para automação local no GitHub (descobrir token, repo, Project): **sim**, ou use `GITHUB_TOKEN` no `.env`. Tutorial: [github-cli-setup.md](./github-cli-setup.md). No CI (Actions) o token é automático.

**Preciso commitar `.env`?**  
Não. `.env` está no `.gitignore`. Use secrets no CI.

**O sync sobrescreve meu board?**  
Modo seguro (GitHub): se o card **não tem** `status` no frontmatter, o sync **preserva** o status manual. Se tem `status` explícito, aplica.

**Funciona sem GitHub Actions?**  
Sim. Rode `npm run cards:sync` localmente.

**Posso usar só algumas skills?**  
Sim. O kit é modular — use só o que precisar.

---

## 9. Próximos passos

1. [Qual doc ler?](./README.md) — mapa da documentação
2. [GitHub CLI — instalar e login](./github-cli-setup.md) (se usar GitHub Projects)
3. [Setup em 5 minutos](./setup-quickstart.md)
4. **`/setup`** ou `npm run devkit:setup -- --yes`
5. Peça: *"Descobre esse projeto"* (project-discovery)
6. Peça: *"Refina [sua ideia] em cards"* (card-refiner)
7. [Primeira auditoria](./primeira-auditoria.md) ou *"Implementa PROJ-STORY-001"* (implementation-plan)
