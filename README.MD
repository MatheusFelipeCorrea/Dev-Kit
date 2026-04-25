# 🚀 Starter-Pack-ForProjects

Um kit prático para planejar, documentar, implementar e manter projetos de software com apoio de IA. A ideia é simples: você usa os agents para ganhar velocidade, mas continua no comando das decisões.

> **Mente Superior Domina Mente Inferior** — a IA é ferramenta; você é o arquiteto.

**Autor:** Matheus Felipe Correa
**Versão:** 2.0
**Data:** Abril 2026

---

## Índice

- [O que existe neste repositório](#o-que-existe-neste-repositório)
- [Estrutura da pasta .github](#estrutura-da-pasta-github)
- [Como usar os agents](#como-usar-os-agents)
- [Skills](#skills)
- [Fluxo recomendado do zero](#fluxo-recomendado-do-zero)
- [Fluxo recomendado em projeto existente](#fluxo-recomendado-em-projeto-existente)
- [Onde cada arquivo deve ficar](#onde-cada-arquivo-deve-ficar)
- [Templates rápidos](#templates-rápidos)

---

## O que existe neste repositório

Este repositório organiza o trabalho em 3 blocos:

1. **Skills** geram documentação e artefatos de apoio.
2. **Agents** ajudam a implementar ou a aprender com o código.
3. **Docs, plans e diagrams** guardam o resultado do processo.

O objetivo é deixar o caminho claro para qualquer cenário:

- começar um projeto do zero
- entrar em um projeto já existente
- transformar uma ideia em cards
- implementar um card com validação fase a fase


A estrutura atual do workspace é esta:

```text
.github/
├── agents/
│   ├── implementation-plan.agent.md
│   └── mentoring-juniors.agent.md
├── copilot/
├── diagrams/
│   ├── Arquitetura/
│   ├── Caso de Uso/
│   ├── Classes/
│   ├── Componentes/
│   ├── Implantação/
│   └── Pacotes/
├── docs/
├── instructions/
├── plans/
│   ├── cards/
│   └── implementations/
└── skills/
	├── architecture-blueprint-generator/
	├── card-refiner/
	├── code-exemplars-blueprint-generator/
	├── copilot-instructions-blueprint-generator/
	├── folder-structure-blueprint-generator/
	├── plantuml-diagram-generator/
	├── project-architect/
	└── readme-updater/
```

Leitura rápida da função de cada pasta:

| Pasta | Para que serve |
|---|---|
| `.github/skills/` | Skills que geram blueprints, cards, diagramas e READMEs |
| `.github/agents/` | Agents que executam fluxos guiados de implementação e mentoria |
| `.github/docs/` | Documentos de contexto do projeto, como arquitetura, exemplars e estrutura de pastas |
| `.github/instructions/` | Instruções de Copilot que guiam o estilo e as regras do projeto |
| `.github/plans/cards/` | Cards refinados, prontos para copiar para o board |
| `.github/plans/implementations/` | Planos de execução faseados para implementação de tarefas |
| `.github/diagrams/` | Diagramas PlantUML e o prompt de arquitetura |
| `.github/copilot/` | Espaço reservado para arquivos auxiliares do Copilot, se o projeto precisar |

---

## Como usar os agents

### 1. Se você vai começar um projeto do zero

Use primeiro a skill de arquitetura do projeto:

1. Abra o Copilot Chat.
2. Chame /project-architect.
3. Informe escopo, objetivo, stack desejada, público e, se tiver, protótipos.
4. Leia a sugestão de arquitetura com calma.
5. Só avance quando a proposta fizer sentido para o projeto.

Depois disso, siga esta ordem:

1. /card-refiner para transformar ideias em cards.
2. /plantuml-diagram-generator para registrar os diagramas.
3. /architecture-blueprint-generator para documentar a arquitetura.
4. /code-exemplars-blueprint-generator para registrar bons exemplos reais.
5. /folder-structure-blueprint-generator para deixar o mapa de pastas claro.
6. /copilot-instructions-blueprint-generator por último, para consolidar as regras do projeto.

### 2. Se você já entrou em um projeto existente

Comece entendendo o terreno antes de mexer em código:

1. /architecture-blueprint-generator para responder como o sistema funciona.
2. /code-exemplars-blueprint-generator para descobrir padrões reais do projeto.
3. /folder-structure-blueprint-generator para saber onde cada arquivo deve viver.
4. /copilot-instructions-blueprint-generator para entender as regras que o Copilot deve seguir.

### 3. Se você recebeu um card para implementar

Use o agent de implementação:

1. Cole o card no Copilot Chat.
2. Chame o agent Implementation Plan.
3. Anexe READMEs, blueprint, exemplars, estrutura de pastas e protótipos, se existirem.
4. Deixe o agent interpretar requisitos, tarefas, regras de negócio e débitos.
5. Leia o plano gerado e aprove antes de começar qualquer fase.
6. A cada fase concluída, valide o resultado antes de liberar a próxima.

### 4. Se a meta é aprender ou destravar uma dúvida

Use o agent Sensei quando você quiser entender o código sem receber só a resposta pronta.

Ele é mais útil quando você quer:

- entender uma arquitetura
- revisar uma implementação já feita
- descobrir por que um código existe daquele jeito
- comparar uma solução atual com um exemplar real do projeto
- aprender sem receber só a resposta pronta

O melhor formato de uso é simples:

1. Explique o que você tentou.
2. Mostre o erro, a dúvida ou a área do código.
3. Peça para o Sensei guiar a leitura do projeto com perguntas.
4. Responda, pense com ele e só depois codifique.

---

## Skills

As skills são usadas quando você quer gerar documentação, cards, diagramas ou instruções de projeto com base no código real. A regra geral é: primeiro entender o contexto, depois gerar o artefato e só então aplicar no projeto.

### Escala de avaliação

Usei esta régua para pontuar as skills:

- **9,0 a 10,0 — Excelente:** muito sólida, pronta para uso com poucos ajustes.
- **8,0 a 8,9 — Muito boa:** já entrega valor real, mas ainda tem pequenos pontos de melhoria.
- **7,0 a 7,9 — Boa:** funciona bem, porém depende mais de contexto ou disciplina de uso.
- **6,0 a 6,9 — Regular:** útil, mas ainda pede refinamento antes de virar referência.
- **Abaixo de 6,0 — Fraca:** precisa de revisão antes de confiar no fluxo.

### Nota geral observada

| Skill | Nota | Categoria | Leitura rápida |
|---|---:|---|---|
| `/project-architect` | 9,6 | Excelente | Fluxo bem guiado, cobre arquitetura, stack, telas e banco com boa disciplina de aprovação. |
| `/architecture-blueprint-generator` | 9,3 | Excelente | Muito forte para documentar arquitetura real e lidar com monorepo. |
| `/code-exemplars-blueprint-generator` | 9,2 | Excelente | Boa curadoria de exemplos e anti-patterns, útil para padronizar implementação. |
| `/folder-structure-blueprint-generator` | 9,1 | Excelente | Muito bom para orientar localização de arquivos e convenções de estrutura. |
| `/copilot-instructions-blueprint-generator` | 9,3 | Excelente | Consolida regras do projeto de forma consistente e alinhada ao código existente. |
| `/plantuml-diagram-generator` | 9,0 | Excelente | Ótimo para transformar documentação em diagramas com controle de aprovação. |
| `/card-refiner` | 8,8 | Muito boa | Forte e bem processual; agora fica mais completa com resumo de concluído e pendente. |
| `/readme-updater` | 8,7 | Muito boa | Boa para manutenção contínua, com foco correto em mudanças reais do projeto. |

### 1. /project-architect

**O que faz:** desenha a arquitetura de um projeto novo do zero e sugere stack, estrutura, banco, telas e fluxo de dados.

**Quando usar:** no começo de um projeto, antes de criar as primeiras pastas e arquivos.

**Passo a passo:**
1. Abra o Copilot Chat.
2. Chame /project-architect.
3. Informe objetivo, público, stack desejada, prazo e integrações.
4. Responda às perguntas sobre protótipos, hosting, autenticação e monorepo.
5. Revise a proposta de arquitetura.
6. Só avance quando aprovar a sugestão.

### 2. /architecture-blueprint-generator

**O que faz:** cria o blueprint da arquitetura do projeto já existente, explicando camadas, responsabilidades e fluxo.

**Quando usar:** quando o código já existe e você precisa entender como tudo se conecta.

**Passo a passo:**
1. Abra o projeto no Copilot Chat.
2. Chame /architecture-blueprint-generator.
3. Deixe a skill analisar a estrutura real do repositório.
4. Revise o blueprint gerado.
5. Use o arquivo em `.github/docs/` como base para próximas decisões.

### 3. /code-exemplars-blueprint-generator

**O que faz:** identifica os melhores exemplos de código do projeto para servir de referência.

**Quando usar:** depois do blueprint, quando você quer copiar padrões reais do projeto em vez de adivinhar.

**Passo a passo:**
1. Rode a skill depois da arquitetura já mapeada.
2. Deixe ela varrer os arquivos do projeto.
3. Leia os exemplos escolhidos e os anti-patterns, se existirem.
4. Use os exemplars como modelo para novos arquivos.

### 4. /folder-structure-blueprint-generator

**O que faz:** documenta onde cada arquivo deve ficar e quais nomes o projeto usa.

**Quando usar:** quando você está em dúvida sobre o lugar certo de um arquivo ou vai criar uma nova feature.

**Passo a passo:**
1. Chame a skill depois de entender a arquitetura.
2. Deixe ela mapear as pastas reais do projeto.
3. Confira a árvore gerada e as convenções de nomeação.
4. Use o blueprint de pastas para criar novos arquivos no lugar certo.

### 5. /copilot-instructions-blueprint-generator

**O que faz:** transforma os padrões do projeto em instruções para o Copilot seguir.

**Quando usar:** depois das skills de arquitetura, exemplars e pastas, porque ela consolida tudo no arquivo de instruções.

**Passo a passo:**
1. Rode a skill por último entre as de contexto.
2. Deixe ela ler arquitetura, exemplars e estrutura de pastas.
3. Revise as regras geradas para garantir que combinam com o projeto.
4. Salve o arquivo em `.github/instructions/`.

### 6. /card-refiner

**O que faz:** transforma uma ideia solta, épico ou requisito bagunçado em cards prontos para board.

**Quando usar:** quando você quer quebrar uma feature em Epic + Stories com backend, frontend, banco e protótipo.

**Passo a passo:**
1. Abra o Copilot Chat.
2. Chame /card-refiner.
3. Descreva a feature, mesmo que ainda esteja rascunhada.
4. Anexe os READMEs, o blueprint, os exemplars, a estrutura de pastas e protótipos, se existirem.
5. Responda às perguntas de escopo, regras de negócio, integrações e telas.
6. Espere a skill resumir o entendimento antes de gerar qualquer card.
7. Aprove a geração dos cards.
8. Receba um único arquivo em `.github/plans/cards/` com Epic + Stories.
9. Copie cada seção separada por `---` para o seu board.

**Regra importante da card-refiner:** ela tem ordem e estrutura próprias.

- Primeiro ela entende o problema.
- Depois pergunta o que falta.
- Só então gera o README do épico.
- Os cards saem nesta ordem: Banco de Dados → Backend → Frontend → Protótipo.
- Se um arquivo já existe, ela marca como `EXISTENTE — MODIFICAR`.
- Se o arquivo ainda não existe, ela marca como `NOVO — CRIAR`.


## Fluxo recomendado do zero

Se o projeto ainda está nascendo, siga esta sequência:

1. **Entenda o problema** com /project-architect.
2. **Transforme ideias em trabalho executável** com /card-refiner.
3. **Desenhe os diagramas** com /plantuml-diagram-generator.
4. **Documente a base técnica** com os blueprints de arquitetura, exemplars e estrutura.
5. **Feche as regras do Copilot** com /copilot-instructions-blueprint-generator.
6. **Implemente por fases** usando o Implementation Plan.
7. **Use o Sensei** sempre que algo precisar de explicação ou revisão conceitual.
8. **Atualize a documentação periodicamente** com /readme-updater e /plantuml-diagram-generator em modo update.

---

## Fluxo recomendado em projeto existente

Se o código já existe, o caminho mais seguro é este:

1. Leia a arquitetura do projeto.
2. Leia os exemplars para copiar padrões reais, não suposições.
3. Leia a estrutura de pastas para não colocar arquivo no lugar errado.
4. Leia as instruções do Copilot para respeitar as regras do projeto.
5. Use o Sensei quando quiser entender o porquê de uma solução.
6. Use o Implementation Plan quando precisar executar uma entrega com controle de fases.
7. Use o README Updater quando a documentação ficar defasada.

---

## Onde cada arquivo deve ficar

| Arquivo | Caminho |
|---|---|
| Architecture Blueprint | `.github/docs/Project_Architecture_Blueprint.md` |
| Code Exemplars | `.github/docs/exemplars.md` |
| Folder Structure Blueprint | `.github/docs/Project_Folders_Structure_Blueprint.md` |
| Copilot Instructions | `.github/instructions/copilot-instructions.md` |
| Card refinado | `.github/plans/cards/[EPIC] Nome-do-Modulo.md` |
| Plano de implementação | `.github/plans/implementations/[purpose]-[component]-[version].md` |
| Caso de uso | `.github/diagrams/Caso de Uso/caso-de-uso.puml` |
| Componentes | `.github/diagrams/Componentes/componentes.puml` |
| Classes do backend | `.github/diagrams/Classes/classes.puml` |
| Pacotes do frontend | `.github/diagrams/Pacotes/pacotes-frontend.puml` |
| Pacotes do backend | `.github/diagrams/Pacotes/pacotes-backend.puml` |
| Implantação | `.github/diagrams/Implantação/implantacao.puml` |
| Prompt de arquitetura | `.github/diagrams/Arquitetura/prompt-arquitetura.md` |

Se o projeto tiver frontend e backend separados, os READMEs costumam ficar em:

- `[projeto]/web/Documents/README.md`
- `[projeto]/api/Documents/README.md`

---

## Templates rápidos

### Para pedir implementação

Recebi esse card, quero que você monte o plano e me guie fase a fase. Contexto: [card + imagens + docs]

### Para pedir explicação ao Sensei

Me explique essa parte do código com foco em arquitetura, segurança e trade-offs. Mostre também quais arquivos eu deveria ler primeiro.

### Para revisar uma entrega manual

Implementei esta funcionalidade manualmente em [arquivo]. Revise se segue os padrões do projeto, se há riscos de segurança e o que eu deveria melhorar.

### Para atualizar documentação

Atualize o README e os docs afetados com base no código atual, sem mudar o estilo do projeto e preservando o formato existente.