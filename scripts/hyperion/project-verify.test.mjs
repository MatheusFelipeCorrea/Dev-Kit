import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const script = join(__dirname, "project-verify.mjs");

describe("project-verify", () => {
  it("passes on valid project.yml with existing paths", () => {
    const dir = mkdtempSync(join(tmpdir(), "pv-ok-"));
    try {
      mkdirSync(join(dir, ".github"), { recursive: true });
      mkdirSync(join(dir, "src"), { recursive: true });
      writeFileSync(join(dir, "package.json"), "{}\n");
      writeFileSync(
        join(dir, ".github", "project.yml"),
        `version: 1
name: Demo
commands:
  test: npm test
apps:
  api:
    root: src
    manifest: package.json
uncertainties:
  - none
`
      );
      const r = spawnSync(process.execPath, [script, "--root", dir], { encoding: "utf8" });
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.match(r.stdout, /project-verify OK/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails when app root missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "pv-bad-"));
    try {
      mkdirSync(join(dir, ".github"), { recursive: true });
      writeFileSync(
        join(dir, ".github", "project.yml"),
        `version: 1
name: Demo
apps:
  api:
    root: missing-app
`
      );
      const r = spawnSync(process.execPath, [script, "--root", dir], { encoding: "utf8" });
      assert.notEqual(r.status, 0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
