import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const script = join(__dirname, "phase-verify.mjs");

describe("phase-verify", () => {
  it("passes when Verification has tests_result PASS", () => {
    const dir = mkdtempSync(join(tmpdir(), "phase-verify-"));
    try {
      const plan = join(dir, "plan.md");
      writeFileSync(
        plan,
        `# Plan\n\n## Phase 1\n- [x] done\n\n## Verification\n- phase: 1\n- tests_command: npm test\n- tests_result: PASS\n- tested_at: 2026-08-21T12:00:00Z\n`
      );
      const r = spawnSync(process.execPath, [script, "--plan", plan], { encoding: "utf8" });
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.match(r.stdout, /phase-verify OK/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails when tests_result is FAIL", () => {
    const dir = mkdtempSync(join(tmpdir(), "phase-verify-"));
    try {
      const plan = join(dir, "plan.md");
      writeFileSync(
        plan,
        `## Verification\n- phase: 2\n- tests_command: npm test\n- tests_result: FAIL\n- tested_at: 2026-08-21T12:00:00Z\n`
      );
      const r = spawnSync(process.execPath, [script, "--plan", plan, "--phase", "2"], { encoding: "utf8" });
      assert.notEqual(r.status, 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
