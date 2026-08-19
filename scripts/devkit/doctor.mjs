import process from "node:process";
import {
  collectKitHealth,
  fail,
  ok,
  runNodeScript,
  warn,
  log,
} from "./lib.mjs";

const argYes = process.argv.includes("--yes");
const argSkipCards = process.argv.includes("--skip-cards");

async function main() {
  log("", "Dev-Kit doctor — kit health check");
  log("", "");

  const health = await collectKitHealth();

  log("", `Node.js: ${process.version} ${health.nodeMajor >= 20 ? "(OK)" : "(upgrade required)"}`);
  log("", `Repository: ${health.repo || "not detected"}`);
  log("", `GitHub token: ${health.token ? "available" : "missing"}`);
  log("", `project.yml: ${health.hasProjectYml ? "present" : "missing"}`);
  log("", `memory/PROJECT.md: ${health.memoryFilled ? "filled" : "template/empty"}`);
  log("", "");

  for (const msg of health.issues) fail(msg);
  for (const msg of health.warnings) warn(msg);

  if (health.issues.length === 0 && health.warnings.length === 0) {
    ok("Kit structure looks good.");
  }

  if (!argSkipCards && health.hasProjectsMap) {
    log("", "");
    log("", "Running cards-sync doctor...");
    const cardsCode = runNodeScript("doctor.mjs", argYes ? ["--yes"] : []);
    if (cardsCode !== 0) {
      fail("cards-sync doctor reported issues.");
      process.exit(cardsCode);
    }
  }

  log("", "");
  if (health.issues.length > 0) {
    fail(`Doctor finished with ${health.issues.length} blocking issue(s).`);
    log("", "Fix blockers, then re-run: npm run devkit:doctor");
    process.exit(1);
  }

  if (health.warnings.length > 0) {
    warn(`Doctor finished with ${health.warnings.length} warning(s) — kit usable, improvements recommended.`);
    log("", "Agent shortcut: ask \"Rode o doctor do Dev-Kit\" or /doctor");
    process.exit(0);
  }

  ok("Doctor complete — no issues.");
}

main().catch((error) => {
  fail(`FATAL: ${error.message}`);
  process.exit(1);
});
