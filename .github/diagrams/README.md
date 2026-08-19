# Diagrams (PlantUML + Mermaid)

This folder is **generated on demand** — it is empty in a fresh Dev-Kit clone.

## When files appear here

| Trigger | Skill | Output pattern |
|---------|-------|----------------|
| "Gera diagramas" / "Generate architecture diagrams" | `plantuml-generator` | `{category}/*.puml`, optional `*.mmd` |

Typical subfolders: `Caso de Uso/`, `Componentes/`, `Classes/`, `Pacotes/`, `Implantacao/`, `Arquitetura/`.

## Prerequisites (optional)

Diagrams work best when project docs exist, but the skill falls back to READMEs and codebase discovery when blueprints are missing:

- `.github/docs/Project_Architecture_Blueprint.md` — optional (from `project-architect`)
- `.github/docs/Project_Folders_Structure_Blueprint.md` — optional
- App READMEs and `project.yml` — always useful

## Related docs

- [plantuml-generator skill](../skills/docs/plantuml-generator/SKILL.md)
- [where-outputs-go-en.md](../docs/where-outputs-go-en.md)
