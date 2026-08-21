# Hyperion — documentation assets

## Brand

| File | Use |
|------|-----|
| `hyperion-banner.png` | README hero (full width) |
| `hyperion-logo.png` | README footer, GETTING-STARTED, social / avatar |

## Diagrams

PNG exports for docs. Source: matching `.mmd` files in this folder.

| PNG | Used in |
|-----|---------|
| `hyperion-journey-minimal.png` | `README.md`, `GETTING-STARTED.md`, trilha PT/EN, armadilhas |
| `hyperion-journey-full.png` | `meta/fluxo-completo.md`, `GETTING-STARTED.md` |
| `hyperion-sdlc-full-en.png` | `meta/full-flow-en.md` |
| `hyperion-outputs-map.png` | output maps, skill maps |
| `hyperion-three-pillars.png` | `meta/organizacao.md` |
| `hyperion-docs-map.png` | `STRUCTURE.md`, `docs/README.md` |

Do not paste live ` ```mermaid ` in user-facing docs — export PNG like the rest.

Regenerate diagrams (brand theme baked into each `.mmd`):

```bash
npx @mermaid-js/mermaid-cli -i file.mmd -o file.png -b "#0B1220"
```

Or [mermaid.live](https://mermaid.live). Background must be `#0B1220` to match Hyperion navy.

**Palette:** `#0B1220` fundo · `#2563EB` / `#1D4ED8` azul · `#F5D76E` âmbar · `#F8FAFC` texto · clusters com borda âmbar.
