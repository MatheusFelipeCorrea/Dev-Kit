import { log } from "./lib.mjs";

const sections = [
  {
    title: "Dev-Kit — one-liners (npm)",
    rows: [
      ["npm run devkit:help", "This reference"],
      ["npm run devkit:doctor", "Kit + cards health check"],
      ["npm run devkit:setup -- --yes", "Full bootstrap (labels → doctor → validate → sync)"],
      ["npm run devkit:sync", "Validate + sync cards"],
      ["npm run devkit:sync -- --dry-run", "Validate + dry-run only"],
      ["npm run devkit:cursor", "Install .cursor/rules/ if partial kit copy"],
      ["npm run cards:watch", "Auto-sync on save"],
    ],
  },
  {
    title: "Cards sync (granular npm)",
    rows: [
      ["npm run cards:init -- --yes", "Same as devkit:setup (cards only)"],
      ["npm run cards:validate", "Validate card frontmatter"],
      ["npm run cards:doctor", "Cards-sync diagnostics only"],
      ["npm run cards:reverse", "GitHub → Markdown"],
      ["npm run cards:labels-reset -- --yes", "Align repo labels"],
    ],
  },
  {
    title: "Agent phrases (no terminal — preferred)",
    rows: [
      ["/setup or \"Configura o Dev-Kit\"", "project-startup — full guided setup"],
      ["/doctor or \"Rode o doctor do Dev-Kit\"", "devkit-ops → devkit:doctor"],
      ["/sync or \"Sincroniza os cards\"", "devkit-ops → devkit:sync"],
      ["/discover or \"Descobre esse projeto\"", "project-discovery"],
      ["/refine or \"Refina em cards\"", "card-refiner"],
      ["/audit or \"Auditoria completa\"", "full-audit (6 dimensions)"],
      ["/review", "code-review"],
      ["/implement", "implementation-plan agent"],
      ["/connect", "integration-bridge (Jira/Azure/Linear/GitLab)"],
    ],
  },
  {
    title: "Quality audits (agent)",
    rows: [
      ["\"Revisão de segurança\"", "security-audit"],
      ["\"Revisa a arquitetura\"", "architecture-audit"],
      ["\"Revisão de DevOps\"", "devops-audit"],
      ["\"Alinhamento de produto\"", "po-audit"],
      ["\"Revisão de UX\"", "ux-audit"],
      ["\"Estratégia de testes\"", "testing-strategy"],
      ["\"Qual tech debt temos?\"", "tech-debt-tracker"],
    ],
  },
];

function printTable(title, rows) {
  log("", "");
  log("", title);
  log("", "─".repeat(Math.min(title.length + 4, 60)));
  const colWidth = Math.max(...rows.map((r) => r[0].length), 20);
  for (const [cmd, desc] of rows) {
    log("", `  ${cmd.padEnd(colWidth)}  ${desc}`);
  }
}

for (const section of sections) {
  printTable(section.title, section.rows);
}

log("", "");
log("", "Docs: .github/docs/comandos-rapidos.md · setup-quickstart.md");
log("", "Claude Code: CLAUDE.md · Cursor: .cursor/rules/dev-kit.mdc");
