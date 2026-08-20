# Contribuindo com o Hyperion

Obrigado por considerar contribuir! Este kit é open-source e aceita PRs.

## Como contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/minha-skill`)
3. Faça suas alterações
4. Valide localmente antes do PR:
   ```bash
   npm run docs:check              # links em markdown
   npm run skills:validate         # frontmatter + ## Output das skills
   npm run hyperion:check-rules    # runtime rules sincronizadas
   npm run cards:test              # testes do cards-sync
   node scripts/cards-sync/sync.mjs --dry-run   # se alterou cards/sync
   ```
5. Commit com mensagem descritiva
6. Abra um Pull Request

## Tipos de contribuição

- **Nova skill** — crie em `.github/skills/<categoria>/sua-skill/SKILL.md`
- **Novo prompt de auditoria** — adicione em `.github/audits/prompts/` e registre no `manifest.yml`
- **Bug fix** — descreva o comportamento esperado vs. atual
- **Documentação** — melhorias no README, exemplos, traduções

## Padrões

- Skills são Markdown puro (sem dependências externas)
- Nomes de skills em inglês (kebab-case)
- Documentação bilíngue quando possível (PT-BR primário, EN secundário)
- Mantenha compatibilidade multi-runtime (Copilot, Cursor, Claude Code)

## Estrutura de uma Skill

```
.github/skills/<categoria>/minha-skill/
└── SKILL.md
```

Use [`.github/skills/SKILL.template.md`](.github/skills/SKILL.template.md) como ponto de partida.

O `SKILL.md` deve ter:
- Frontmatter YAML com `name` e `description`
- Passos claros e numerados
- Regras/constraints
- Pelo menos um exemplo de uso
- **Caminho de output explícito** — onde gravar artefatos (ver [onde-ficam-os-outputs.md](.github/docs/meta/onde-ficam-os-outputs.md))

### Onde gravar outputs (novas skills)

| Tipo de artefato | Pasta padrão |
|------------------|--------------|
| Card syncável | `.github/cards/{epics,features,stories,tasks}/` |
| Spec / plano | `.github/plans/specs/` ou `implementations/` |
| Relatório | `.github/audits/results/<tipo>/` |
| Decisão permanente | `.github/docs/adr/` ou `memory/DECISIONS.md` |
| Descoberta de produto | `.github/memory/discoveries/` |

Leia `project.yml` → `outputs` antes de inventar paths. Registre auditorias em `audits/manifest.yml`.

### Novo comando ou slash phrase

1. Adicione entrada em `.github/commands.yml`
2. Rode `npm run hyperion:generate-rules` e commite os arquivos gerados
3. Atualize `comandos-rapidos.md` + `quick-commands-en.md` se o comportamento visível mudar
4. `npm run hyperion:check-rules` deve passar no CI

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob MIT.
