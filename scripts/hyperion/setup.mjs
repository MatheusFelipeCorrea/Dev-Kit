import process from "node:process";
import {
  collectHyperionHealth,
  fail,
  log,
  ok,
  runHyperionScript,
  runNodeScript,
  warn,
} from "./lib.mjs";

const argYes = process.argv.includes("--yes");
const argSkipSync = process.argv.includes("--skip-sync");
const argInstallHook = process.argv.includes("--install-hook");
const argSkipCards = process.argv.includes("--skip-cards");

function printAgentSteps(health) {
  log("", "");
  log("", "── Agent steps (no terminal needed) ──");
  if (!health.hasProjectYml) {
    log("", "  1. Ask: \"Configura o Hyperion neste repo\" or /setup");
    log("", "     → project-discovery (Configure) creates project.yml");
  }
  log("", "  2. Ask: \"Preenche a memoria do projeto\" → edits memory/PROJECT.md");
  log("", "  3. Ask: \"Sincroniza os cards\" or /sync → agent runs validate + sync");
  log("", "  4. Ask: \"Refina minha ideia em cards\" or /refine");
  log("", "  5. Ask: \"Faz auditoria completa\" or /audit");
  log("", "");
}

async function main() {
  log("", "Hyperion setup — full bootstrap");
  log("", "");

  const health = await collectHyperionHealth();

  for (const msg of health.issues) fail(msg);
  if (health.issues.length > 0) {
    printAgentSteps(health);
    process.exit(1);
  }

  if (!health.hasProjectYml) {
    warn("project.yml missing — cards sync can run, but agents work better after /setup.");
  }
  if (!health.token && !argSkipSync) {
    warn("No GitHub token — sync will be skipped. Run: gh auth login");
  }

  if (argSkipCards) {
    ok("Skipped cards bootstrap (--skip-cards).");
    printAgentSteps(health);
    process.exit(0);
  }

  const initArgs = [];
  if (argYes) initArgs.push("--yes");
  if (argSkipSync) initArgs.push("--skip-sync");
  if (argInstallHook) initArgs.push("--install-hook");

  log("", "Step 0/7 — Cursor rules...");
  const cursorCode = runHyperionScript("install-cursor-rules.mjs");
  if (cursorCode !== 0) warn("Cursor rules install skipped — copy .cursor/rules/ manually if using Cursor");

  log("", "Step 1/7 — CI/CD (hyperion-* workflows, non-destructive)...");
  if (argYes) {
    const pipeCode = runHyperionScript("pipeline-apply.mjs", ["--yes"]);
    if (pipeCode !== 0) warn("Pipeline apply had issues — run: npm run hyperion:pipeline-plan");
  } else {
    runHyperionScript("pipeline-plan.mjs");
  }

  log("", "Running cards:init bootstrap...");
  const initCode = runNodeScript("init.mjs", initArgs);
  if (initCode !== 0) {
    fail("cards:init failed — fix issues above and re-run npm run hyperion:setup");
    printAgentSteps(health);
    process.exit(initCode);
  }

  log("", "");
  ok("Hyperion setup complete.");
  log("", "Day-to-day: npm run hyperion:sync  OR  ask the agent: /sync");
  log("", "Watch mode: npm run cards:watch");
  printAgentSteps(health);
}

main().catch((error) => {
  fail(`FATAL: ${error.message}`);
  process.exit(1);
});
