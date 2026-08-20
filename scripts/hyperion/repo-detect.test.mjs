import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  detectPackageManager,
  detectTestCommand,
  detectAuditCommand,
  isHyperionInstalled,
} from "./repo-detect.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

describe("repo-detect", () => {
  it("detects npm for this kit", () => {
    assert.equal(detectPackageManager(root), "npm");
  });

  it("detects npm test", () => {
    const cmd = detectTestCommand(root);
    assert.ok(cmd?.includes("test"));
  });

  it("detects npm audit", () => {
    const cmd = detectAuditCommand(root);
    assert.ok(cmd?.includes("audit"));
  });

  it("hyperion installed in kit repo", () => {
    assert.equal(isHyperionInstalled(root), true);
  });
});
