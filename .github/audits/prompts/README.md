# Prompts de auditoria

Protocolos **genéricos**. Skills seguem estes arquivos; o manifesto liga prompt → skill → pasta de saída.

Produto (paths, stack): [`../../project.yml`](../../project.yml) + overlay opcional.  
Hub: [`../README.md`](../README.md) · Comandos: [`../../docs/comandos-rapidos.md`](../../docs/comandos-rapidos.md).

## Ordem de leitura

1. **Prompt** desta pasta  
2. **`project.yml`** (se existir)  
3. **Overlay** (`audits.overlay` em `project.yml`) — complemento, nunca substituto  
4. Sem config → discovery (sem inventar paths)

## Mapa prompt → skill → saída

| Prompt | Skill | Pasta de saída |
|--------|-------|----------------|
| [product-owner.md](./product-owner.md) | `po-audit` | `../results/product-owner/` |
| [security.md](./security.md) | `security-audit` | `../results/application-security/` |
| [devops.md](./devops.md) | `devops-audit` | `../results/devops/` |
| [code-review.md](./code-review.md) | `code-review` | `../results/code-review/` |
| [ux-design.md](./ux-design.md) | `ux-audit` | `../results/ux-design/` |
| [architecture.md](./architecture.md) | `architecture-audit` | `../results/architecture/` |

Manifesto: [`../manifest.yml`](../manifest.yml) · Overlay template: [`../overlays/README.md`](../overlays/README.md)

## Invocar

```text
/audit
Auditoria completa do repositório
Audite o módulo X com po-audit
Execute Fase 1 da security-audit
```

Multi-fase: **uma fase por sessão** (salvo pedido explícito para rodar tudo).
