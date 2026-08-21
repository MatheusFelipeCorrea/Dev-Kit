import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import {
  detectPackageManager,
  detectTestCommand,
  detectBuildCommand,
  detectAuditCommand,
  detectStackSummary,
  isHyperionInstalled,
} from "./repo-detect.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function withFixture(files, fn) {
  const dir = mkdtempSync(join(tmpdir(), "hyperion-detect-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(dir, name), content);
    }
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

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

  it("detects dotnet from csproj", () => {
    withFixture({ "App.csproj": "<Project />" }, (dir) => {
      assert.equal(detectPackageManager(dir), "dotnet");
      assert.equal(detectTestCommand(dir), "dotnet test");
      assert.equal(detectBuildCommand(dir), "dotnet build");
      assert.ok(detectStackSummary(dir).includes("dotnet"));
    });
  });

  it("detects maven from pom.xml", () => {
    withFixture({ "pom.xml": "<project />" }, (dir) => {
      assert.equal(detectPackageManager(dir), "maven");
      assert.equal(detectTestCommand(dir), "mvn test");
      assert.ok(detectStackSummary(dir).includes("java-maven"));
    });
  });

  it("detects gradle from build.gradle.kts", () => {
    withFixture({ "build.gradle.kts": "plugins {}" }, (dir) => {
      assert.equal(detectPackageManager(dir), "gradle");
      assert.equal(detectTestCommand(dir), "gradle test");
      assert.ok(detectStackSummary(dir).includes("java-gradle"));
    });
  });

  it("detects php and ruby", () => {
    withFixture({ "composer.json": "{}" }, (dir) => {
      assert.equal(detectPackageManager(dir), "php");
      assert.equal(detectTestCommand(dir), "composer test");
    });
    withFixture({ Gemfile: "source 'https://rubygems.org'" }, (dir) => {
      assert.equal(detectPackageManager(dir), "ruby");
      assert.equal(detectTestCommand(dir), "bundle exec rake test");
    });
  });

  it("detects bun lockfile", () => {
    withFixture({ "bun.lockb": "", "package.json": '{"scripts":{"test":"bun test"}}' }, (dir) => {
      assert.equal(detectPackageManager(dir), "bun");
      assert.equal(detectTestCommand(dir), "bun test");
    });
  });
});
