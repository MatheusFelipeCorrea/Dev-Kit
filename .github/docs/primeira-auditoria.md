# Primeira auditoria do repositório

**English:** [first-audit-en.md](./first-audit-en.md)

Guia passo a passo para rodar sua **primeira auditoria** com o Dev-Kit.

Tempo estimado: 10–30 min (depende do tamanho do repo e se você pausa entre dimensões).

---

## O que é uma auditoria aqui?

O Dev-Kit não altera código durante auditorias. Ele **lê o repo**, aplica checklists especializados e grava relatórios em `.github/audits/results/`.

| Skill | Foco |
|-------|------|
| **full-audit** | Orquestra todas as dimensões abaixo |
| **architecture-audit** | Estrutura, padrões, acoplamento |
| **security-audit** | OWASP, secrets, auth |
| **devops-audit** | CI/CD, deploy, infra |
| **code-review** | Qualidade, manutenibilidade |
| **po-audit** | Requisitos, cobertura de produto |
| **ux-audit** | UX, acessibilidade, design system |

---

## Pré-requisitos

| Item | Obrigatório? |
|------|--------------|
| Kit Dev-Kit copiado (`.github/`) | Sim |
| `.github/project.yml` | Recomendado — peça *"project-discovery em Configure"* |
| `.github/memory/PROJECT.md` | Opcional — melhora contexto |
| Overlay de domínio | Opcional — `.github/audits/overlays/seu-projeto.md` |

---

## Caminho rápido (com agente de IA)

### 1. Prepare contexto

Peça:

> "Rode **project-discovery** em modo Context (se ainda não tiver project.yml)"

Preencha `.github/memory/PROJECT.md` com 2–3 parágrafos sobre o produto.

### 2. Dispare a auditoria completa

Peça:

> "Faz uma **auditoria completa** do repositório"

Isso aciona a skill **full-audit**, que roda as 6 dimensões **uma por vez** e pausa para você aprovar continuar.

### 3. Onde encontrar os relatórios

```
.github/audits/results/
├── architecture/
├── application-security/
├── devops/
├── code-review/
├── product-owner/
├── ux-design/
└── _summary/          ← resumo consolidado (full-audit)
```

### 4. O que fazer com os achados

1. Leia o resumo em `_summary/full-audit-<data>.md`
2. Priorize Critical → High
3. Registre decisões em `.github/memory/DECISIONS.md` ou ADR (*"Gera ADR sobre X"*)
4. Crie cards para correções (*"Refina esses achados em cards"*)

---

## Caminho manual (sem agente)

1. Leia `.github/audits/manifest.yml` — lista skills, prompts e pastas de output
2. Para cada dimensão, leia o prompt em `.github/audits/prompts/<nome>.md`
3. Peça à IA para seguir **uma skill por vez** (ex.: *"Revisão de segurança"* → `security-audit`)
4. Salve outputs em `.github/audits/results/<pasta>/`

Ordem recomendada (mesma do full-audit):

1. architecture-audit  
2. security-audit  
3. devops-audit  
4. code-review  
5. po-audit  
6. ux-audit  

---

## Auditoria de uma dimensão só

| Peça ao agente | Skill |
|----------------|-------|
| "Revisão de segurança" | `security-audit` |
| "Revisa a arquitetura" | `architecture-audit` |
| "Code review do repo" | `code-review` |
| "Revisão DevOps" | `devops-audit` |
| "Alinhamento de produto" | `po-audit` |
| "Revisão UX" | `ux-audit` |

---

## Overlay de domínio (opcional)

Se o repo tem regras de negócio específicas, crie:

`.github/audits/overlays/meu-projeto.md`

Referencie em `project.yml`:

```yaml
audits:
  overlay: .github/audits/overlays/meu-projeto.md
```

O overlay complementa os prompts genéricos — não substitui.

---

## FAQ

**A auditoria modifica código?**  
Não. Só gera relatórios em `.github/audits/results/`.

**Posso rodar só uma pasta?**  
Sim. Peça auditoria focada (ex.: *"Revisão de segurança só em src/api"*).

**Quanto tempo demora?**  
Repos pequenos: ~10 min por dimensão. Repos grandes: use modo phased (full-audit pausa entre dimensões).

**Preciso de Node?**  
Não para a auditoria em si — é fluxo de IA + Markdown. Node só se quiser validar cards depois.

---

## Próximos passos

- [guia-completo.md](./guia-completo.md) — visão geral do kit
- [README principal](../../README.md) — tabela de todas as skills
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — criar overlays ou prompts custom
