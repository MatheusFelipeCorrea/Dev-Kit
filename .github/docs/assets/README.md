# Hyperion — documentation diagrams

PNG exports for docs. Source: matching `.mmd` files in this folder.

| PNG | Used in |
|-----|---------|
| `hyperion-journey-minimal.png` | `README.md`, `GETTING-STARTED.md`, trilha PT/EN, `armadilhas-comuns.md`, `common-pitfalls-en.md` |
| `hyperion-journey-full.png` | `meta/fluxo-completo.md`, `GETTING-STARTED.md` |
| `hyperion-sdlc-full-en.png` | `meta/full-flow-en.md` |
| `hyperion-outputs-map.png` | `README.md`, `meta/onde-ficam-os-outputs.md`, `meta/where-outputs-go-en.md`, skill maps, onboarding |
| `hyperion-three-pillars.png` | `meta/organizacao.md` |
| `hyperion-docs-map.png` | `STRUCTURE.md`, `docs/README.md` |

Do not paste live ` ```mermaid ` in user-facing docs — export PNG like the rest.

Regenerate: edit `.mmd` → `npx @mermaid-js/mermaid-cli -i file.mmd -o file.png` or [mermaid.live](https://mermaid.live).
