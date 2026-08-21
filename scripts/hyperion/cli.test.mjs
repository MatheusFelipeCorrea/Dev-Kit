import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveCommand, COMMANDS } from "./cli.mjs";

describe("hyperion cli resolveCommand", () => {
  it("maps doctor", () => {
    const r = resolveCommand(["doctor"]);
    assert.equal(r.script, "doctor.mjs");
    assert.equal(r.dir, "hyperion");
  });

  it("maps project-verify with args", () => {
    const r = resolveCommand(["project-verify", "--root", "."]);
    assert.equal(r.script, "project-verify.mjs");
    assert.deepEqual(r.forward, ["--root", "."]);
  });

  it("maps check-rules to --check", () => {
    const r = resolveCommand(["check-rules"]);
    assert.deepEqual(r.forward, ["--check"]);
  });

  it("maps cards sync dry-run", () => {
    const r = resolveCommand(["cards", "dry-run"]);
    assert.equal(r.dir, "cards");
    assert.equal(r.script, "sync.mjs");
    assert.ok(r.forward.includes("--dry-run"));
  });

  it("errors on unknown", () => {
    const r = resolveCommand(["nope"]);
    assert.ok(r.error);
  });

  it("exposes core verify commands", () => {
    assert.ok(COMMANDS["phase-verify"]);
    assert.ok(COMMANDS["project-verify"]);
    assert.ok(COMMANDS["review-verify"]);
    assert.ok(COMMANDS.upgrade);
  });
});
