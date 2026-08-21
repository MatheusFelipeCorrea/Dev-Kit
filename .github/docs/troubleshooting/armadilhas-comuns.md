# ⚠️ Armadilhas comuns e gaps de aprendizado

O que mais confunde quem usa o Hyperion pela primeira vez — e como evitar.

**English:** [common-pitfalls-en.md](./common-pitfalls-en.md) · **Comandos:** [comandos-rapidos.md](../reference/comandos-rapidos.md)

---

## 💬 1. “Preciso rodar npm o tempo todo?”

**Não.** Desde a v2026 do kit, o caminho preferido é falar com o agente:

| Em vez de… | Diga… |
|------------|-------|
| Copiar comandos do README | **`/setup`** — setup completo guiado |
| `npm run cards:validate` + `sync` | **`/sync`** — agente roda `hyperion:sync` |
| Diagnosticar manualmente | **`/doctor`** |

npm continua existindo para CI, power users e quando o agente não tem terminal.

---

## 🐳 1b. “Não tenho Node no laptop”

Os scripts (`sync`, `doctor`, `upgrade`, `*-verify`) **continuam obrigatórios** — são o diferencial. Sem Node ≥ 20:

```bash
./bin/hyperion doctor          # builda imagem hyperion-cli se preciso
./bin/hyperion --docker sync
```

Guia: [node-and-docker.md](../meta/node-and-docker.md). Chat/skills funcionam sem Node; ops usam Docker.

---

## 🖥️ 2. Cursor: regras não carregam

O kit **já inclui** `.cursor/rules/hyperion.mdc` no clone completo.

Se você copiou só `.github/` + `scripts/`:

```bash
npm run hyperion:cursor
```

Ou peça `/setup` — o bootstrap instala as rules automaticamente.

---

## 🔄 3. EXAMPLE cards aparecem no board / sync falha

Cards em `.github/cards/_examples/` e `CARD.template.md` são **referência** — nunca vão pro GitHub Project.

| Sintoma | Causa provável |
|---------|----------------|
| “0 cards para sync” no clone limpo | Normal — crie cards em `epics/`, `features/`, etc. |
| EXAMPLE sumiu do board após update | Comportamento correto — eram samples |
| `--only EXAMPLE-*` não synca | Proposital — use `--include-samples` só em manutenção do kit |

---

## 📋 4. Status do card vs coluna do board

**Modo seguro (GitHub Projects):**

| Situação | O que acontece |
|----------|----------------|
| Card **sem** `status` no frontmatter (existente) | Sync **preserva** o que você moveu manualmente no board |
| Usuário pede “mova para Done” | Agente **deve** setar `status: Done` no arquivo e rodar `/sync` |
| Card novo sem status | Vai para `Backlog` |

Confusão comum: mover só no board e esperar que o Markdown atualize sozinho — forward sync não faz reverse de status automaticamente (use `cards:reverse` se precisar).

---

## 🔑 5. `gh auth login` vs token no `.env`

| Cenário | Recomendação |
|---------|--------------|
| Dev local | `gh auth login` — auto-detect no doctor/init |
| CI / GitHub Actions | `GITHUB_TOKEN` ou `PROJECT_SYNC_TOKEN` |
| Project de organização | Fine-grained PAT com Issues + Projects |

Sem token: `hyperion:setup` roda até validate/dry-run; sync real fica para depois do login.

---

## 🧩 6. Muitas skills — por onde começar?

Jornada mínima (ordem sugerida) — **não** é o catálogo de 30 skills:

![Jornada mínima Hyperion — setup, refine, implement, execute](../assets/hyperion-journey-minimal.png)

| Fase | Comando | Objetivo |
|------|---------|----------|
| Bootstrap | `/setup` ou `/migrate` | `project.yml` + memory |
| Saúde | `/doctor` | O que falta (token, cards, rules) |
| Planejar | `/refine` | Ideia → cards |
| Executar | `/implement` → `/execute` | Plano + código + testes do **seu** repo |
| Qualidade (depois) | `/audit` | Relatórios read-only |

`/help` lista o resto. [comandos-rapidos.md](../reference/comandos-rapidos.md) cobre 90% do uso.

---

## 🔍 7. Auditoria demora / pausa entre dimensões

`full-audit` roda **6 dimensões** e pausa entre elas (por design — evita contexto gigante).

| Expectativa | Realidade |
|-------------|-----------|
| “Auditoria em 2 min” | 10–30 min; depende do tamanho do repo |
| “Altera código” | **Nunca** — só grava em `.github/audits/results/` |
| Escopo parcial | OK — peça “só security + architecture” |

---

## 📚 8. Docs desatualizados vs `hyperion:*`

**Fonte de verdade para atalhos:**

1. `.github/commands.yml` — registro canônico
2. `npm run hyperion:help` — gerado a partir do YAML acima
3. [comandos-rapidos.md](../reference/comandos-rapidos.md) — referência humana PT/EN
4. `CLAUDE.md` / `.cursor/rules/hyperion.mdc` / `copilot-instructions.md` — gerados (marcadores `HYPERION:COMMANDS`)
5. Mapa de pastas: [organizacao.md](../meta/organizacao.md)

Se algo parecer inconsistente, rode `npm run hyperion:check-rules` — o CI bloqueia drift.

---

## 🔄 9. Backend não-GitHub (Jira, Azure, Linear, GitLab)

GitHub Projects = caminho maduro. Outros backends = forward sync best-effort; reverse e colunas nativas limitadas.

→ [escolher-backend.md](../integration/escolher-backend.md) + skill `integration-bridge` (`/connect`)

---

## 💡 10. O que ainda não existe (expectativa vs kit)

| Usuário espera | Status atual |
|----------------|--------------|
| Slash commands nativos no Cursor (plugin) | Via rules — escreva `/setup` ou a frase equivalente |
| Sync bidirecional de status em Jira | Transições de **workflow** quando o nome bate; Kanban nativo depende do projeto |
| Reverse Azure / GitLab / Linear | Ainda não — só GitHub e Jira |
| Vídeo / tutorial interativo | Só markdown |

---

## 🟢 11. “Nunca usei agents — por onde começo?”

Você não precisa entender a arquitetura. Clone [Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion) → copie o kit → abra o chat no repo → **`/setup`** ou **`/migrate`**. Se o modelo não reconhecer a barra, digite *“Configura o Hyperion neste repo”*.

Confusões de comando:

| Você quis | Use |
|-----------|-----|
| Ligar o kit num repo que já existe | `/migrate` |
| Só gerar/atualizar `project.yml` | `/discover` |
| Explorar uma ideia de produto | `/explore` |
| Setup greenfield completo | `/setup` |

---

## Quando pedir ajuda ao agente

Frases que desbloqueiam a maioria dos problemas:

- *“Rode `/doctor` e me explica o que falta”*
- *“Estou no Cursor e as rules não pegam — o que copio?”*
- *“Por que meu card não subiu pro Project?”*
- *“Qual a diferença entre project-discovery e /setup?”*

`/setup` = orquestração completa. `project-discovery` = só mapeia repo e `project.yml`.
