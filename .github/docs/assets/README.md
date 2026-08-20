# Hyperion — documentation diagrams

PNG exports for docs. Source: matching `.mmd` files in this folder.

| PNG | Used in |
|-----|---------|
| `hyperion-journey-full.png` | `README.md`, `GETTING-STARTED.md`, `onboarding/guia-completo.md`, `onboarding/guide-complete-en.md` |
| `hyperion-journey-minimal.png` | `troubleshooting/armadilhas-comuns.md`, `troubleshooting/common-pitfalls-en.md` |
| `hyperion-outputs-map.png` | `README.md`, `meta/onde-ficam-os-outputs.md`, `meta/where-outputs-go-en.md`, `reference/skills-output-map.md`, `reference/mapa-outputs-skills.md`, onboarding guides |
| `hyperion-three-pillars.png` | `meta/organizacao.md` |
| `hyperion-docs-map.png` | `docs/README.md`, `STRUCTURE.md` |

Regenerate: edit `.mmd` → `npx @mermaid-js/mermaid-cli -i file.mmd -o file.png` or [mermaid.live](https://mermaid.live).
