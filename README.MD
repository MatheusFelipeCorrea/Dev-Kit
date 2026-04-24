# 🚀 Starter-Pack-ForProjects

Uma metodologia completa para planejar, desenvolver e manter projetos de software com auxílio de IA — do zero ou entrando em projetos existentes.

> **"Mente Superior Domina Mente Inferior"** — Sua mente domina a IA. A IA é ferramenta, você é o arquiteto.

**Autor:** Matheus Felipe Correa
**Versão:** 1.0
**Data:** Abril 2026

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Filosofia](#-filosofia)
- [Componentes do Starter Pack](#-componentes-do-starter-pack)
- [Fluxo 1 — Projeto do Zero](#-fluxo-1--projeto-do-zero)
- [Fluxo 2 — Entrando em Projeto Existente](#-fluxo-2--entrando-em-projeto-existente)
- [Os 3 C's — Contexto para Cada Tarefa](#-os-3-cs--contexto-para-cada-tarefa)
- [Ciclo de Desenvolvimento](#-ciclo-de-desenvolvimento)
- [Catálogo de Skills](#-catálogo-de-skills)
- [Catálogo de Agents](#-catálogo-de-agents)
- [Onde Salvar Cada Arquivo](#-onde-salvar-cada-arquivo)
- [Frequência de Uso](#-frequência-de-uso)
- [Templates Úteis](#-templates-úteis)
- [Exemplos Práticos](#-exemplos-práticos)

---

## 🎯 Visão Geral

O Starter-Pack-ForProjects é um ecossistema de **8 skills** e **2 agents** que cobrem todo o ciclo de vida de um projeto:

Planejar → Documentar → Refinar → Implementar → Ensinar → Manter

Funciona com **qualquer stack** (React, Node.js, .NET, Java, Go, Rust, Vue, Angular, Next.js, Flutter, Swift, Kotlin e mais) e **qualquer estrutura** (monorepo, fullstack, backend-only, microservices).

| Problema | Solução |
|----------|---------|
| "Não sei como começar o projeto" | `/project-architect` |
| "A documentação está desatualizada" | `/readme-updater` |
| "O Copilot gera código fora do padrão" | `/copilot-instructions-blueprint-generator` |
| "Dev novo não entende a arquitetura" | `/architecture-blueprint-generator` + Agent Sensei |
| "Não sei onde colocar cada arquivo" | `/folder-structure-blueprint-generator` |
| "Meus cards do board são bagunçados" | `/card-refiner` |
| "Não tenho diagramas atualizados" | `/plantuml-diagram-generator` |
| "Quero implementar um card com IA" | Agent: Implementation Plan |
| "Junior precisa de mentoria" | Agent: Sensei |

---

## 💡 Filosofia

| # | Princípio | Descrição |
|---|-----------|-----------|
| 1 | **Mente Superior Domina Mente Inferior** | Sua mente domina a IA. A IA gera, você valida, decide e aprova. |
| 2 | **Dividir para Conquistar** | Toda tarefa é quebrada em partes menores antes de ser executada. |
| 3 | **Nunca Assumir** | Em caso de dúvida, pergunte. Vale para você e para a IA. |
| 4 | **Validação Humana Obrigatória** | Nenhuma fase avança sem aprovação explícita do desenvolvedor. |
| 5 | **Manter-se Afiado** | Sempre desenvolva pelo menos uma parte manualmente. |
| 6 | **Documentação é Produto** | Docs desatualizados são piores que nenhum doc. O Starter Pack mantém vivo. |
| 7 | **Consistência > Novidade** | Manter os patterns do projeto é mais importante que usar a última trend. |
| 8 | **Generalizar, depois Especificar** | Skills são genéricas. O projeto específico vem do contexto. |

### A Lógica Invertida

MODELO TRADICIONAL: Dev programa → IA revisa

MODELO STARTER PACK: IA programa → Dev valida cada passo | Dev programa lógica de negócio → IA valida

Resultado: Dev entende TUDO, IA acelera o repetitivo.

---

## 🧩 Componentes do Starter Pack

### Skills (Geração de Documentação)

| # | Skill | Comando | O que gera |
|---|-------|---------|------------|
| 1 | Architecture Blueprint | `/architecture-blueprint-generator` | Mapa completo da arquitetura |
| 2 | Code Exemplars | `/code-exemplars-blueprint-generator` | Melhores exemplos de código |
| 3 | Copilot Instructions | `/copilot-instructions-blueprint-generator` | Regras pro Copilot |
| 4 | Folder Structure | `/folder-structure-blueprint-generator` | Guia de organização de pastas |
| 5 | Project Architect | `/project-architect` | Arquitetura + READMEs pra projetos novos |
| 6 | Card Refiner | `/card-refiner` | Cards padronizados pro board |
| 7 | PlantUML Diagrams | `/plantuml-diagram-generator` | Diagramas .puml + prompt C4 |
| 8 | README Updater | `/readme-updater` | Atualização cirúrgica dos READMEs |

### Agents (Execução e Aprendizado)

| # | Agent | O que faz |
|---|-------|-----------|
| 1 | **Implementation Plan** | Parseia cards, gera planos, implementa fase a fase com testes e validação |
| 2 | **Sensei Mentor** | Mentor socrático que ensina usando exemplos reais do projeto |

---

## 🆕 Fluxo 1 — Projeto do Zero

### Fase 1 — Planejamento e Arquitetura

**Skill:** `/project-architect`

Você fornece: escopo + techs + requisitos + protótipos (opcional). A skill sugere arquitetura, telas/UX, banco, endpoints. Após aprovação gera:

- `[projeto]/web/Documents/README.md` — Frontend
- `[projeto]/api/Documents/README.md` — Backend (com seção de Banco de Dados)

**Por que usar:** Toda a equipe começa com a mesma arquitetura, mesmas pastas, mesmas convenções.

### Fase 2 — Refinamento de Cards

**Skill:** `/card-refiner`

**Como usar:**
1. Abra o Copilot Chat e digite `/card-refiner`
2. Descreva o módulo ou feature que quer transformar em cards. Pode ser uma ideia bruta ("quero um módulo de lembretes com WhatsApp") ou uma descrição detalhada
3. Anexe como contexto:
- READMEs do projeto (frontend + backend) — pra skill saber quais arquivos já existem
- Protótipos PNG se tiver — pra skill extrair telas e componentes
- Docs das skills (Blueprint, Exemplars) se já existirem — pra skill referenciar patterns reais
4. A skill vai te fazer perguntas se algo estiver vago
5. Após entender tudo, pergunta: "Posso gerar os cards?"
6. Gera UM arquivo markdown contendo o Epic + todas as Stories

**O que você recebe:**

Um arquivo `.github/plans/cards/[EPIC] Nome-do-Modulo.md` contendo:
- **Epic** no topo com metadata (Tipo, Prioridade, Categoria, Pai, etc.)
- **Story Database** — SQL pronto pra executar, critérios de aceite como checklist
- **Story Backend** — Critérios (Given/When/Then com status codes), implementação (controller, service, repository, schemas, rotas), cada arquivo marcado como `(EXISTENTE — MODIFICAR)` ou `(NOVO — CRIAR)`
- **Story Frontend** — Critérios visuais, integração técnica (hooks, services, componentes), visual e UX
- **Story Protótipo** — Telas a prototipar com elementos e critérios

**O que você faz depois:**

Copie cada seção do arquivo (separadas por `---`) e cole como cards individuais no seu board (GitHub Projects, Jira, etc.). Preencha os campos que ficaram como `(preencher)`: Sprint, Relator, Data Limite.

**Por que usar:** Cards padronizados, consistência front↔back↔db garantida, arquivos reais do projeto referenciados, nada inventado.

### Fase 3 — Diagramas

**Skill:** `/plantuml-diagram-generator`

Gera: caso-de-uso.puml, componentes.puml, classes.puml (backend), pacotes-frontend.puml, pacotes-backend.puml, implantacao.puml, prompt-arquitetura.md (C4 Level 2).

**Por que usar:** Diagramas versionáveis (código .puml), atualizáveis automaticamente.

### Fase 4 — Código Base + Documentação Técnica

Após primeiros arquivos, rode **nesta ordem**:

| Ordem | Skill | Salvar em |
|-------|-------|-----------|
| 1º | `/architecture-blueprint-generator` | `.github/docs/Project_Architecture_Blueprint.md` |
| 2º | `/code-exemplars-blueprint-generator` | `.github/docs/exemplars.md` |
| 3º | `/folder-structure-blueprint-generator` | `.github/docs/Project_Folders_Structure_Blueprint.md` |
| 4º | `/copilot-instructions-blueprint-generator` | `.github/instructions/copilot-instructions.md` |

**Por que essa ordem:** Cada skill alimenta a próxima.

### Fase 5 — Desenvolvimento Dia a Dia

Siga o [Ciclo de Desenvolvimento](#-ciclo-de-desenvolvimento).

### Fase 6 — Manutenção (~2 semanas)

- `/readme-updater` → atualiza READMEs
- `/plantuml-diagram-generator` (modo Update) → atualiza diagramas
- Se arquitetura mudou muito → re-rode Skills 1-4
- Novo épico → `/card-refiner`

---

## 📂 Fluxo 2 — Entrando em Projeto Existente

### Fase 1 — Entendendo o Projeto

| Ordem | Skill | O que responde | Salvar em |
|-------|-------|----------------|-----------|
| 1º | `/architecture-blueprint-generator` | "Como funciona?" | `.github/docs/Project_Architecture_Blueprint.md` |
| 2º | `/code-exemplars-blueprint-generator` | "Melhores exemplos?" | `.github/docs/exemplars.md` |
| 3º | `/folder-structure-blueprint-generator` | "Onde fica cada coisa?" | `.github/docs/Project_Folders_Structure_Blueprint.md` |
| 4º | `/copilot-instructions-blueprint-generator` | "Quais as regras?" | `.github/instructions/copilot-instructions.md` |

### Fase 2 — Documentação Faltante

| Se falta... | Use... |
|-------------|--------|
| READMEs | `/project-architect` (modo existente) |
| Diagramas | `/plantuml-diagram-generator` |
| Cards | `/card-refiner` |

### Fase 3 — Desenvolvimento

Mesmo fluxo: Ciclo de Desenvolvimento + Manutenção periódica.

---

## 📋 Os 3 C's — Contexto para Cada Tarefa

### C1 — Contexto da Estratégia

**Quando:** Ao iniciar qualquer tarefa. **Como:** Abra o bloco de notas e escreva passo a passo de como VOCÊ faria.

### C2 — Contexto da Aplicação

**Quando:** Se não houver ou após melhorias arquiteturais. **Como:** Execute as skills:

| Skill | Salvar em |
|-------|-----------|
| `/copilot-instructions-blueprint-generator` | `.github/instructions/` |
| `/architecture-blueprint-generator` | `.github/docs/` |
| `/code-exemplars-blueprint-generator` | `.github/docs/` |
| `/folder-structure-blueprint-generator` | `.github/docs/` |

### C3 — Contexto da Tarefa

**Quando:** Ao iniciar cada tarefa. **Como:** Reunir card do board, prints do Figma, READMEs, docs das skills, arquivos relevantes.

### Usando os 3 C's

C1 (Estratégia) + C2 (Docs) + C3 (Card) → Agent Implementation Plan → Plano → Execução fase a fase

---

## 🔄 Ciclo de Desenvolvimento

### 1. Planejamento

Cole o card no Copilot Chat com o Agent:

Você: "Recebi esse card, vamos implementar juntos" + [card + imagens + docs]

Agent: Parseia → Pergunta → Gera plano → Espera aprovação

### 2. Desenvolvimento

Para CADA fase:

- Agent implementa + testes unitários
- VOCÊ verifica cada arquivo: Correto → Keep ✅ | Errado → Corrija ou peça correção | Não entendeu → Sensei explica
- O próximo passo faz sentido? Sim → "Validado, avança" | Não → Pede revisão
- **IMPORTANTE:** Desenvolva pelo menos UMA parte manualmente (lógica de negócio recomendado). Lógica invertida: DEV programa, IA valida.

### 3. Revisão e Commit

- Revisar TODOS os arquivos (um por vez)
- Em dúvida? Use o Sensei: "Me explique as alterações em termos de código, arquitetura e segurança. Indique temas pra eu estudar."
- A decisão final é SEMPRE sua
- Commit com mensagem clara

### Fluxo Geral

1. HUMANO planeja (C1) → 2. IA gera plano → 3. IA implementa, HUMANO valida → 4. HUMANO programa uma etapa → 5. HUMANO revisa tudo → 6. Commit

---

## 📖 Catálogo de Skills

### /project-architect

**Propósito:** Planejar arquitetura completa de projeto novo. **Quando:** Início de projeto. **Recebe:** Escopo, techs, requisitos, protótipos. **Gera:** Sugestão de arquitetura + telas + banco + endpoints + READMEs. **Fluxo:** 6 etapas com aprovação. **Por que:** Todos começam com a mesma base sólida.

### /architecture-blueprint-generator

**Propósito:** Documentar arquitetura de codebase existente. **Quando:** Entrando em projeto. Após scaffold. Mudança arquitetural. **Gera:** `Project_Architecture_Blueprint.md` — stack, camadas, dependências, data flow, cross-cutting, 17 techs, monorepo. **Salvar:** `.github/docs/` **Por que:** É o mapa. Todos referenciam ele.

### /code-exemplars-blueprint-generator

**Propósito:** Achar melhores exemplos no projeto. **Quando:** Após Blueprint. Onboarding. **Gera:** `exemplars.md` — melhor arquivo de cada categoria + snippets + anti-patterns. **Salvar:** `.github/docs/` **Por que:** "Como faço X aqui?" → "Olha o exemplar."

### /copilot-instructions-blueprint-generator

**Propósito:** Regras pro Copilot. **Quando:** Após Skills 1-3 (SEMPRE por último). **Gera:** `copilot-instructions.md` — versões, regras por tech, regras de camada, 10 "Never Break These", referências a exemplars. **Salvar:** `.github/instructions/` **Por que:** Copilot gera código consistente ao invés de genérico.

### /folder-structure-blueprint-generator

**Propósito:** Documentar onde cada arquivo fica. **Quando:** Após Blueprint. Onboarding. **Gera:** `Project_Folders_Structure_Blueprint.md` — ASCII tree, naming conventions, file placement, templates. **Salvar:** `.github/docs/` **Por que:** Responde "onde coloco isso?" com certeza.

### /card-refiner

**Propósito:** Ideias brutas → cards padronizados. **Quando:** Novo módulo/feature. **Recebe:** Ideia + READMEs + docs + protótipos. **Gera:** UM README com Epic + Stories (Front, Back, DB, Protótipo). Metadata preenchida:

Tipo: Story | Prioridade: 🔺 Highest | Sprint: (preencher) | Categoria: Backend | Relator: (preencher) | Pai: [EPIC] Nome | Data Limite: (preencher)

Arquivos como (EXISTENTE — MODIFICAR) ou (NOVO — CRIAR). **Salvar:** `.github/plans/cards/[EPIC] Nome.md` **Por que:** Cards consistentes, cruzamento front↔back↔db automático.

### /plantuml-diagram-generator

**Propósito:** Diagramas PlantUML + prompt C4. **Quando:** Início + manutenção ~2 semanas. **Gera:**

| Diagrama | Arquivo |
|----------|---------|
| Caso de Uso | `.github/diagrams/Caso de Uso/caso-de-uso.puml` |
| Componentes | `.github/diagrams/Componentes/componentes.puml` |
| Classes (Backend) | `.github/diagrams/Classes/classes.puml` |
| Pacotes Frontend | `.github/diagrams/Pacotes/pacotes-frontend.puml` |
| Pacotes Backend | `.github/diagrams/Pacotes/pacotes-backend.puml` |
| Implantação | `.github/diagrams/Implantacao/implantacao.puml` |
| Arquitetura | `.github/diagrams/Arquitetura/prompt-arquitetura.md` |

Modo Update: detecta mudanças, regenera só o necessário. **Por que:** Diagramas versionáveis e atualizáveis.

### /readme-updater

**Propósito:** Manter READMEs atualizados. **Quando:** ~2 semanas. Pré-release. **Faz:** Escaneia codebase + schema.prisma → compara com README → reporta mudanças → pergunta → atualiza mantendo formato exato. Inclui seção de Banco dentro do Backend README. **Por que:** README desatualizado engana. O Updater mantém vivo.

---

## 🤖 Catálogo de Agents

### Implementation Plan & Execution Agent

**Propósito:** Parceiro de implementação fase a fase. **Quando:** Toda vez que pega um card. **Como:** Cole o card → agent parseia → gera plano (REQ, TASK, BIZ, DEBT) → implementa fase a fase com testes → para entre fases → espera validação. **Regras:** Nunca programa sem permissão. Nunca avança sem validação. Nunca assume. Sempre testa.

### Sensei — Developer Mentor

**Propósito:** Mentor socrático com exemplos reais. **Quando:** Dúvidas, aprendizado, revisão, onboarding. **Como:** Guia com perguntas → aponta exemplars reais → adapta ao nível → técnicas: Rubber Duck, 5 Whys, Code Reading, Pattern Comparison, Architecture Walking → recap com temas pra estudar.

---

## 📁 Onde Salvar Cada Arquivo

| Arquivo | Caminho |
|---------|---------|
| Architecture Blueprint | `.github/docs/Project_Architecture_Blueprint.md` |
| Code Exemplars | `.github/docs/exemplars.md` |
| Folder Structure | `.github/docs/Project_Folders_Structure_Blueprint.md` |
| Copilot Instructions | `.github/instructions/copilot-instructions.md` |
| README Frontend | `[projeto]/web/Documents/README.md` |
| README Backend | `[projeto]/api/Documents/README.md` |
| Implementation Plans | `.github/plans/implementations/[purpose]-[component]-[version].md` |
| Refined Cards | `.github/plans/cards/[EPIC] Nome-do-Modulo.md` |
| Diagramas PlantUML | `.github/diagrams/[Nome]/[arquivo].puml` |
| Prompt Arquitetura | `.github/diagrams/Arquitetura/prompt-arquitetura.md` |

---

## ⏰ Frequência de Uso

| Componente | Frequência | Trigger |
|-----------|-----------|---------|
| Project Architect | 1 vez | Início do projeto |
| Architecture Blueprint | 1 vez + se mudar | Código existe |
| Code Exemplars | 1 vez + se mudar | Após Blueprint |
| Folder Structure | 1 vez + se mudar | Após Blueprint |
| Copilot Instructions | 1 vez + se mudar | Após Skills 1-3 |
| Card Refiner | Por épico | Novo módulo |
| PlantUML Diagrams | 1 vez + ~2 sem | READMEs existem |
| README Updater | ~2 semanas | Final de sprint |
| Implementation Plan | Cada card | Dia a dia |
| Sensei | Quando precisar | Dúvida/aprendizado |

---

## 📝 Templates Úteis

### Pedindo pro Agent implementar

Recebi esse card, vamos implementar juntos [CARD + IMAGENS]

### Pedindo pro Sensei explicar

Me explique as alterações em termos de código, arquitetura e segurança. Indique temas pra eu estudar.

### Lógica Invertida

Implementei [funcionalidade] manualmente em [arquivo]. Revise: segue os patterns? Problema de segurança? Edge cases? O que melhorar?

### Rodando Skills de contexto

1º /architecture-blueprint-generator → .github/docs/
2º /code-exemplars-blueprint-generator → .github/docs/
3º /folder-structure-blueprint-generator → .github/docs/
4º /copilot-instructions-blueprint-generator → .github/instructions/

---

## 🌾 Exemplos Práticos

### Projeto Agrofarm (Node.js + React, Monorepo)

INÍCIO: /project-architect → READMEs | /card-refiner → Cards | /plantuml → Diagramas

CÓDIGO: Skills 1→2→4→3

DIA A DIA: Agent Plan + Agent Sensei

MANUTENÇÃO: /readme-updater + /plantuml (Update)

### Sistema Aluguel de Carros (Java Micronaut + React, Monorepo)

ENTRANDO: Skills 1→2→4→3 → Entendeu tudo

DOCS FALTANTES: /plantuml → Diagramas

DESENVOLVIMENTO: Agent Plan + Agent Sensei

MANUTENÇÃO: /readme-updater + /plantuml (Update)

---

## 👤 Autor

**Matheus Felipe Correa**

## 📄 Licença

Este material é de uso livre para fins educacionais e profissionais. Credite o autor ao compartilhar.