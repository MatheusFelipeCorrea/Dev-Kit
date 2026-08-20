#!/usr/bin/env node
/**
 * Dry-run pipeline apply plan.
 * Run: npm run hyperion:pipeline-plan
 */
import { detectPipeline, buildPipelinePlan } from "./pipeline-lib.mjs";
import { log, ok, warn } from "./lib.mjs";

const detection = await detectPipeline();
const plan = buildPipelinePlan(detection);

log("", "Pipeline plan (dry-run)");
log("", `  Policy: ${plan.policy}`);
log("", `  Stack: ${plan.stack}`);
log("", `  Product CI exists: ${plan.hasProductCi}`);

for (const w of plan.warnings) warn(w);

if (plan.actions.length) {
  log("", "");
  log("", "Would write:");
  for (const a of plan.actions) {
    log("", `  + ${a.file}`);
    log("", `    (${a.reason})`);
  }
} else {
  log("", "");
  log("", "  (no workflow files to write)");
}

if (plan.skips.length) {
  log("", "");
  log("", "Skipped:");
  for (const s of plan.skips) log("", `  - ${s}`);
}

log("", "");
ok("Plan complete. Apply with: npm run hyperion:pipeline-apply");
