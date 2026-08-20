#!/usr/bin/env node
/**
 * Detect CI/CD state and project.yml ci policy.
 * Run: npm run hyperion:pipeline-detect
 */
import { detectPipeline, formatCiYamlBlock } from "./pipeline-lib.mjs";
import { log, ok } from "./lib.mjs";

const detection = await detectPipeline();

log("", "Pipeline detection");
log("", `  Provider: ${detection.config.provider}`);
log("", `  Stack: ${detection.stack}`);
log("", `  Policy: ${detection.config.policy}`);
log("", `  Product CI present: ${detection.hasProductCi ? "yes" : "no"}`);

if (detection.classified.product.length) {
  log("", `  Product workflows: ${detection.classified.product.join(", ")}`);
}
if (detection.classified.hyperion.length) {
  log("", `  Hyperion workflows: ${detection.classified.hyperion.join(", ")}`);
}
if (detection.classified.legacy.length) {
  log("", `  Legacy (migrate): ${detection.classified.legacy.join(", ")}`);
}
if (detection.external.length) {
  log("", `  External CI: ${detection.external.map((e) => `${e.provider} (${e.file})`).join(", ")}`);
}

log("", "");
log("", "Suggested project.yml ci block:");
log("", formatCiYamlBlock(detection));

ok("Detection complete. Run: npm run hyperion:pipeline-plan");
