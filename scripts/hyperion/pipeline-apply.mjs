#!/usr/bin/env node
/**
 * Apply Hyperion workflows per ci policy (never overwrites product CI).
 * Run: npm run hyperion:pipeline-apply
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  detectPipeline,
  buildPipelinePlan,
  LEGACY_WORKFLOWS,
  TEMPLATES_DIR,
  CI_TEMPLATES_DIR,
} from "./pipeline-lib.mjs";
import { workspaceRoot, log, ok, warn, fail } from "./lib.mjs";

const argYes = process.argv.includes("--yes");
const argMigrateLegacy = process.argv.includes("--migrate-legacy");

async function readTemplate(action) {
  const dir = action.templateDir === "ci" ? CI_TEMPLATES_DIR : TEMPLATES_DIR;
  const p = path.join(workspaceRoot, dir, action.template);
  return fs.readFile(p, "utf8");
}

async function removeLegacy() {
  for (const name of LEGACY_WORKFLOWS) {
    const rel = `.github/workflows/${name}`;
    const abs = path.join(workspaceRoot, rel);
    try {
      await fs.unlink(abs);
      ok(`Removed legacy ${rel}`);
    } catch {
      /* absent */
    }
  }
}

async function main() {
  const detection = await detectPipeline();
  const plan = buildPipelinePlan(detection);

  if (detection.config.policy === "skip") {
    warn("ci.policy=skip — no workflows written.");
    process.exit(0);
  }

  for (const w of plan.warnings) warn(w);

  if (plan.actions.length === 0 && !argMigrateLegacy) {
    warn("Nothing to apply. Run pipeline-detect to review policy.");
    process.exit(0);
  }

  if (!argYes && plan.actions.length > 0) {
    log("", "Dry-run only. Re-run with --yes to write files:");
    for (const a of plan.actions) log("", `  ${a.file}`);
    log("", "  npm run hyperion:pipeline-apply -- --yes");
    process.exit(0);
  }

  let written = 0;
  for (const action of plan.actions) {
    const abs = path.join(workspaceRoot, action.file);
    let exists = false;
    try {
      await fs.access(abs);
      exists = true;
    } catch {
      /* new */
    }
    if (exists) {
      warn(`Exists — skipped: ${action.file}`);
      continue;
    }
    const content = await readTemplate(action);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content, "utf8");
    ok(`Wrote ${action.file}`);
    written++;
  }

  if (argMigrateLegacy && detection.classified.legacy.length > 0) {
    if (!argYes) {
      warn("Legacy workflows found. Run with --yes --migrate-legacy to remove ci.yml, sync-cards.yml, security.yml after hyperion-* exist.");
    } else {
      await removeLegacy();
    }
  }

  log("", "");
  ok(`Pipeline apply complete (${written} file(s) written).`);
}

main().catch((err) => {
  fail(err.message);
  process.exit(1);
});
