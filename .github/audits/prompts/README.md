# Prompts de auditoria

Protocolos **genéricos**. Skills e copy-paste seguem estes arquivos.

Produto (paths, RFs, stack): [`../../project.yml`](../../project.yml) + overlay opcional.  
Hub: [`../README.md`](../README.md) · Comandos: [`../../COMMANDS.md`](../../COMMANDS.md).

## Ordem de leitura

1. **Prompt** desta pasta  
2. **`project.yml`** (se existir)  
3. **Overlay** (`audits.overlay`) — complemento, nunca substituto  
4. Sem config → discovery (sem inventar paths)

## Mapa prompt → skill → saída

| Prompt | Skill | Pasta de saída |
|--------|-------|----------------|
| [product-owner.md](./product-owner.md) | `po-audit` | [`../results/product-owner/`](../results/product-owner/) |
| [security.md](./security.md) | `security-audit` | [`../results/application-security/`](../results/application-security/) |
| [devops.md](./devops.md) | `devops-audit` | [`../results/devops/`](../results/devops/) |
| [code-review.md](./code-review.md) | `code-review` | [`../results/code-review/`](../results/code-review/) |
| [ux-design.md](./ux-design.md) | `ux-audit` | [`../results/ux-design/`](../results/ux-design/) |
| [architecture.md](./architecture.md) | `architecture-audit` | [`../results/architecture/`](../results/architecture/) |

Manifesto: [`../manifest.yml`](../manifest.yml) · Overlay Pulso: [`../overlays/pulso.md`](../overlays/pulso.md)

## Invocar

```text
Auditoria completa do repositório
Audite o módulo X com po-audit
Execute Fase 1 da security-audit
```

Multi-fase: **uma fase por sessão**.