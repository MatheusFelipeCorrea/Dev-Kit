import fs from "node:fs/promises";
import path from "node:path";
import { workspaceRoot, pathExists, readTextIfExists } from "./lib.mjs";

export const HYPERION_PREFIX = "hyperion-";
export const WORKFLOWS_DIR = ".github/workflows";
export const TEMPLATES_DIR = path.join("scripts", "hyperion", "templates", "workflows");

export const HYPERION_WORKFLOWS = {
  syncCards: "hyperion-sync-cards.yml",
  security: "hyperion-security.yml",
  validate: "hyperion-validate.yml",
  productCi: "hyperion-product-ci.yml",
};

export const LEGACY_WORKFLOWS = ["ci.yml", "sync-cards.yml", "security.yml"];

export const DEFAULT_CI_CONFIG = {
  provider: "github-actions",
  policy: "detect",
  stack: "auto",
  existing: [],
  hyperion: {
    cards_sync: true,
    kit_validation: false,
    security_scan: true,
    product_ci: "auto",
  },
};

const PROVIDER_MARKERS = [
  { provider: "gitlab-ci", files: [".gitlab-ci.yml"] },
  { provider: "azure-pipelines", files: ["azure-pipelines.yml", "azure-pipelines.yaml"] },
  { provider: "circleci", files: [".circleci/config.yml"] },
  { provider: "jenkins", files: ["Jenkinsfile"] },
  { provider: "bitbucket", files: ["bitbucket-pipelines.yml"] },
];

export function parseSimpleYamlBlock(text, key) {
  const keyRe = new RegExp(`^(${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}):\\s*$|^(${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}):\\s+`);
  const lines = text.split(/\r?\n/);
  let start = -1;
  let baseIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    if (keyRe.test(lines[i])) {
      start = i;
      baseIndent = (lines[i].match(/^(\s*)/) || ["", ""])[1].length;
      break;
    }
  }
  if (start === -1) return null;

  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      out.push(line);
      continue;
    }
    const indent = (line.match(/^(\s*)/) || ["", ""])[1].length;
    if (indent <= baseIndent) break;
    out.push(line);
  }
  return out.join("\n");
}

export function readCiFromProjectYml(text) {
  if (!text) return null;
  const block = parseSimpleYamlBlock(text, "ci");
  if (!block) return null;

  const cfg = structuredClone(DEFAULT_CI_CONFIG);
  const provider = block.match(/^  provider:\s*(.+)$/m);
  const policy = block.match(/^  policy:\s*(.+)$/m);
  const stack = block.match(/^  stack:\s*(.+)$/m);
  if (provider) cfg.provider = provider[1].trim();
  if (policy) cfg.policy = policy[1].trim();
  if (stack) cfg.stack = stack[1].trim();

  const hyperionMatch = block.match(/^  hyperion:\s*\n((?:    .+\n?)*)/m);
  if (hyperionMatch) {
    const hyperionBlock = hyperionMatch[1];
    for (const [k, yamlKey] of [
      ["cards_sync", "cards_sync"],
      ["kit_validation", "kit_validation"],
      ["security_scan", "security_scan"],
    ]) {
      const m = hyperionBlock.match(new RegExp(`^    ${yamlKey}:\\s*(.+)$`, "m"));
      if (m) cfg.hyperion[k] = m[1].trim() === "true";
    }
    const pci = hyperionBlock.match(/^    product_ci:\s*(.+)$/m);
    if (pci) cfg.hyperion.product_ci = pci[1].trim();
  }

  const existing = [];
  const existingBlock = block.match(/^  existing:\s*\n((?:    - .+\n?)*)/m);
  if (existingBlock) {
    for (const line of existingBlock[1].split("\n")) {
      const m = line.match(/^    - "?(.+?)"?\s*$/);
      if (m) existing.push(m[1]);
    }
  }
  if (existing.length) cfg.existing = existing;

  return cfg;
}

export async function listGithubWorkflows(root = workspaceRoot) {
  const dir = path.join(root, WORKFLOWS_DIR);
  if (!(await pathExists(dir))) return [];
  const names = await fs.readdir(dir);
  return names.filter((n) => n.endsWith(".yml") || n.endsWith(".yaml")).sort();
}

export function classifyWorkflows(workflows) {
  const hyperion = [];
  const product = [];
  const legacy = [];

  for (const name of workflows) {
    if (LEGACY_WORKFLOWS.includes(name)) legacy.push(name);
    else if (name.startsWith(HYPERION_PREFIX)) hyperion.push(name);
    else product.push(name);
  }

  return { hyperion, product, legacy };
}

export async function detectExternalProviders(root = workspaceRoot) {
  const found = [];
  for (const { provider, files } of PROVIDER_MARKERS) {
    for (const file of files) {
      if (await pathExists(path.join(root, file))) found.push({ provider, file });
    }
  }
  return found;
}

export async function detectStack(root = workspaceRoot) {
  if (await pathExists(path.join(root, "package.json"))) {
    if (await pathExists(path.join(root, "pnpm-lock.yaml"))) return "node-pnpm";
    if (await pathExists(path.join(root, "yarn.lock"))) return "node-yarn";
    return "node-npm";
  }
  if (await pathExists(path.join(root, "pyproject.toml")) || (await pathExists(path.join(root, "requirements.txt")))) {
    return "python";
  }
  if (await pathExists(path.join(root, "Dockerfile")) || (await pathExists(path.join(root, "docker-compose.yml")))) {
    return "docker";
  }
  if (await pathExists(path.join(root, "go.mod"))) return "go";
  if (await pathExists(path.join(root, "Cargo.toml"))) return "rust";
  return "unknown";
}

export async function detectPipeline(root = workspaceRoot) {
  const workflows = await listGithubWorkflows(root);
  const classified = classifyWorkflows(workflows);
  const external = await detectExternalProviders(root);
  const stack = await detectStack(root);

  let provider = "none";
  if (workflows.length > 0 || classified.product.length > 0) provider = "github-actions";
  if (external.length > 0) provider = external[0].provider;

  const projectYmlPath = path.join(root, ".github", "project.yml");
  const projectText = await readTextIfExists(projectYmlPath);
  const configured = readCiFromProjectYml(projectText);
  const config = configured ? { ...DEFAULT_CI_CONFIG, ...configured, hyperion: { ...DEFAULT_CI_CONFIG.hyperion, ...configured.hyperion } } : structuredClone(DEFAULT_CI_CONFIG);

  if (provider !== "none") config.provider = provider;
  if (config.stack === "auto") config.stack = stack;

  const productPaths = [
    ...classified.product.map((n) => `${WORKFLOWS_DIR}/${n}`),
    ...classified.legacy.map((n) => `${WORKFLOWS_DIR}/${n}`),
    ...external.map((e) => e.file),
  ];
  if (productPaths.length) config.existing = [...new Set([...config.existing, ...productPaths])];

  const hasProductCi = classified.product.length > 0 || classified.legacy.length > 0 || external.length > 0;

  return {
    workflows,
    classified,
    external,
    stack,
    config,
    hasProductCi,
    projectYmlPath,
  };
}

export function buildPipelinePlan(detection) {
  const { config, hasProductCi, classified, stack } = detection;
  const plan = {
    policy: config.policy,
    provider: config.provider,
    stack,
    hasProductCi,
    actions: [],
    skips: [],
    warnings: [],
  };

  if (config.policy === "skip") {
    plan.skips.push("All Hyperion workflow writes skipped (ci.policy=skip).");
    return plan;
  }

  if (classified.legacy.length > 0) {
    plan.warnings.push(
      `Legacy kit workflows found (${classified.legacy.join(", ")}) — run npm run hyperion:pipeline-apply to migrate to hyperion-* names.`
    );
  }

  const h = config.hyperion;

  if (h.cards_sync) {
    plan.actions.push({
      file: `${WORKFLOWS_DIR}/${HYPERION_WORKFLOWS.syncCards}`,
      template: HYPERION_WORKFLOWS.syncCards,
      reason: "Cards sync on push to .github/cards/",
    });
  }

  if (h.security_scan) {
    plan.actions.push({
      file: `${WORKFLOWS_DIR}/${HYPERION_WORKFLOWS.security}`,
      template: HYPERION_WORKFLOWS.security,
      reason: "Optional security scan (npm audit, pip-audit, trufflehog)",
    });
  }

  if (h.kit_validation) {
    plan.actions.push({
      file: `${WORKFLOWS_DIR}/${HYPERION_WORKFLOWS.validate}`,
      template: HYPERION_WORKFLOWS.validate,
      reason: "Hyperion kit validation (docs, skills, runtime rules, cards tests)",
    });
  }

  const wantProductCi =
    h.product_ci === true || (h.product_ci === "auto" && !hasProductCi && config.policy !== "merge");

  if (wantProductCi && config.policy === "hyperion-only") {
    plan.actions.push({
      file: `${WORKFLOWS_DIR}/${HYPERION_WORKFLOWS.productCi}`,
      template: HYPERION_WORKFLOWS.productCi,
      reason: `Greenfield product CI for stack: ${stack}`,
    });
  } else if (wantProductCi && config.policy === "detect" && !hasProductCi) {
    plan.actions.push({
      file: `${WORKFLOWS_DIR}/${HYPERION_WORKFLOWS.productCi}`,
      template: HYPERION_WORKFLOWS.productCi,
      reason: `No product CI detected — generating minimal pipeline for ${stack}`,
    });
  } else if (hasProductCi && config.policy === "detect") {
    plan.skips.push("Product CI already exists — hyperion-product-ci.yml not written (ci.policy=detect).");
  }

  if (config.policy === "merge") {
    plan.skips.push("Merge mode — add Hyperion jobs manually or via pipeline-architect skill; no overwrites.");
    plan.warnings.push("See .github/docs/integration/pipeline-merge.md for injection snippets.");
  }

  return plan;
}

export function formatCiYamlBlock(detection) {
  const { config, hasProductCi, stack, classified } = detection;
  const existing = config.existing.length
    ? config.existing
    : [...classified.product, ...classified.legacy].map((n) => `${WORKFLOWS_DIR}/${n}`);

  const lines = [
    "ci:",
    `  provider: ${config.provider}`,
    `  policy: ${config.policy}`,
    `  stack: ${stack}`,
  ];

  if (existing.length) {
    lines.push("  existing:");
    for (const p of existing) lines.push(`    - "${p}"`);
  }

  lines.push("  hyperion:");
  lines.push(`    cards_sync: ${config.hyperion.cards_sync}`);
  lines.push(`    kit_validation: ${config.hyperion.kit_validation}`);
  lines.push(`    security_scan: ${config.hyperion.security_scan}`);
  lines.push(`    product_ci: ${config.hyperion.product_ci}`);

  return lines.join("\n");
}
