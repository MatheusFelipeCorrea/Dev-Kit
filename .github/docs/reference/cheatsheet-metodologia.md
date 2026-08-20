# Cheat sheet de metodologia — Hyperion

Referência rápida: **o que cada peça é**, **quando usar** e **o que é opcional vs gerado**.

**English:** [methodology-cheatsheet.md](../reference/methodology-cheatsheet.md)

| Conceito | O que é | Quando usar | Vem no clone? |
|----------|---------|-------------|---------------|
| **Agent** | Fluxo autônomo longo com gates humanos | "Implementa esse card", "Me ensina X" | Sim (`.github/agents/`) |
| **Skill** | Capacidade sob demanda (ler `SKILL.md`) | Trigger em linguagem natural | Sim (`.github/skills/`) |
| **Script** | CLI determinístico (`cards-sync`, validate) | Sync, CI, automação | Sim (`scripts/`) |
| **Runtime rule** | Dicas específicas do IDE | Comportamento always-on | Sim (`hyperion.mdc`, `CLAUDE.md`) |
| **Memory** | Contexto persistente do projeto | Toda sessão | Templates sim; conteúdo após setup |
| **Card** | Markdown + YAML para boards | Planning, refinement, sync | Template + `_examples/` |
| **Blueprint** | Docs de arquitetura/pastas | Greenfield | **Não** — `project-architect` cria |
| **ADR / Retro / Diagram** | Artefatos gerados | Após invocar skill | **Não** — pastas existem, arquivos sob demanda |

## Fluxo típico

```
Discovery → Cards/Spec → Plano de implementação → Código (aprovado) → Audit / ADR / Retro
```

## Regra de fallback

Se blueprint, exemplar ou output **não existir**, não bloqueie:

1. Leia `project.yml` e `.github/memory/`
2. Busque padrões no código
3. Pergunte ao usuário só se ambíguo

## Docs relacionados

- [GETTING-STARTED.md](../../../GETTING-STARTED.md)
- [mapa-outputs-skills.md](../reference/mapa-outputs-skills.md)
- [docs/README.md](../README.md)
