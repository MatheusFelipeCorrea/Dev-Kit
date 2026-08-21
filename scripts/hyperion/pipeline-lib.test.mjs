import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  classifyWorkflows,
  buildPipelinePlan,
  readCiFromProjectYml,
  DEFAULT_CI_CONFIG,
} from "./pipeline-lib.mjs";

describe("classifyWorkflows", () => {
  it("separates hyperion, product, and legacy", () => {
    const r = classifyWorkflows([
      "ci.yml",
      "deploy.yml",
      "hyperion-sync-cards.yml",
      "hyperion-validate.yml",
    ]);
    assert.deepEqual(r.legacy, ["ci.yml"]);
    assert.deepEqual(r.product, ["deploy.yml"]);
    assert.deepEqual(r.hyperion, ["hyperion-sync-cards.yml", "hyperion-validate.yml"]);
  });
});

describe("readCiFromProjectYml", () => {
  it("parses hyperion flags", () => {
    const yaml = `
ci:
  provider: github-actions
  policy: detect
  stack: auto
  hyperion:
    cards_sync: true
    kit_validation: true
    security_scan: false
    product_ci: auto
`;
    const cfg = readCiFromProjectYml(yaml);
    assert.equal(cfg.hyperion.kit_validation, true);
    assert.equal(cfg.hyperion.security_scan, false);
  });
});

describe("buildPipelinePlan", () => {
  it("skips product CI when detect + existing product workflow", () => {
    const detection = {
      config: { ...DEFAULT_CI_CONFIG, policy: "detect", hyperion: { ...DEFAULT_CI_CONFIG.hyperion } },
      hasProductCi: true,
      classified: { legacy: [], product: ["deploy.yml"], hyperion: [] },
      stack: "node-npm",
      external: [],
    };
    const plan = buildPipelinePlan(detection);
    assert.ok(plan.skips.some((s) => s.includes("hyperion-product-ci")));
    assert.ok(plan.actions.some((a) => a.template === "hyperion-sync-cards.yml"));
  });

  it("generates product CI for greenfield detect", () => {
    const detection = {
      config: { ...DEFAULT_CI_CONFIG, policy: "detect", hyperion: { ...DEFAULT_CI_CONFIG.hyperion } },
      hasProductCi: false,
      classified: { legacy: [], product: [], hyperion: [] },
      stack: "node-npm",
      external: [],
    };
    const plan = buildPipelinePlan(detection);
    assert.ok(plan.actions.some((a) => a.template === "hyperion-product-ci.yml"));
  });

  it("respects policy skip", () => {
    const detection = {
      config: { ...DEFAULT_CI_CONFIG, policy: "skip", hyperion: { ...DEFAULT_CI_CONFIG.hyperion } },
      hasProductCi: false,
      classified: { legacy: [], product: [], hyperion: [] },
      stack: "unknown",
      external: [],
    };
    const plan = buildPipelinePlan(detection);
    assert.equal(plan.actions.length, 0);
    assert.ok(plan.skips.length > 0);
  });

  it("plans GitLab include snippet when gitlab-ci detected", () => {
    const detection = {
      config: {
        ...DEFAULT_CI_CONFIG,
        provider: "gitlab-ci",
        policy: "merge",
        hyperion: { ...DEFAULT_CI_CONFIG.hyperion, cards_sync: true, kit_validation: true },
      },
      hasProductCi: true,
      classified: { legacy: [], product: [], hyperion: [] },
      stack: "node-npm",
      external: [{ provider: "gitlab-ci", file: ".gitlab-ci.yml" }],
    };
    const plan = buildPipelinePlan(detection);
    assert.ok(plan.actions.some((a) => a.file === ".gitlab/hyperion-ci.yml" && a.templateDir === "ci"));
    assert.ok(!plan.actions.some((a) => a.template === "hyperion-sync-cards.yml"));
  });

  it("plans Azure Pipelines template when azure-pipelines detected", () => {
    const detection = {
      config: {
        ...DEFAULT_CI_CONFIG,
        provider: "azure-pipelines",
        policy: "detect",
        hyperion: { ...DEFAULT_CI_CONFIG.hyperion, security_scan: true },
      },
      hasProductCi: true,
      classified: { legacy: [], product: [], hyperion: [] },
      stack: "dotnet",
      external: [{ provider: "azure-pipelines", file: "azure-pipelines.yml" }],
    };
    const plan = buildPipelinePlan(detection);
    assert.ok(plan.actions.some((a) => a.file === "hyperion-azure-pipelines.yml"));
  });
});
