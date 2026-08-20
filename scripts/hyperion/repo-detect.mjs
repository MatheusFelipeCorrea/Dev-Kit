/**
 * Repository-adaptive detection — reads project.yml first, then discovers from manifests.
 * Used by migration, dependency-health, pr-reviewer, implementation-executor.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { parseSimpleYamlBlock } from "./pipeline-lib.mjs";

export function readProjectYmlText(root) {
  const p = join(root, ".github/project.yml");
  if (!existsSync(p)) return null;
  return readFileSync(p, "utf8");
}

export function readProjectCommands(text) {
  if (!text) return {};
  const block = parseSimpleYamlBlock(text, "commands");
  if (!block) return {};
  const cmds = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^\s{2,}(\w+):\s*(.+)$/);
    if (m) cmds[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return cmds;
}

export function fileExists(root, rel) {
  return existsSync(join(root, rel));
}

export function detectPackageManager(root) {
  if (fileExists(root, "pnpm-lock.yaml")) return "pnpm";
  if (fileExists(root, "yarn.lock")) return "yarn";
  if (fileExists(root, "package-lock.json") || fileExists(root, "package.json")) return "npm";
  if (fileExists(root, "uv.lock") || fileExists(root, "pyproject.toml")) return "python";
  if (fileExists(root, "go.mod")) return "go";
  if (fileExists(root, "Cargo.toml")) return "cargo";
  return "unknown";
}

export function detectTestCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).test;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.test && !/^echo/i.test(pkg.scripts.test)) {
        const run = pm === "pnpm" ? "pnpm test" : pm === "yarn" ? "yarn test" : "npm test";
        return run;
      }
    } catch {
      /* ignore */
    }
    return "npm test";
  }
  if (pm === "python") {
    if (fileExists(root, "pytest.ini") || fileExists(root, "tests")) return "pytest";
    return "python -m pytest";
  }
  if (pm === "go") return "go test ./...";
  if (pm === "cargo") return "cargo test";
  return null;
}

export function detectLintCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).lint;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.lint) {
        return pm === "pnpm" ? "pnpm run lint" : pm === "yarn" ? "yarn lint" : "npm run lint";
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function detectBuildCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).build;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.build) {
        return pm === "pnpm" ? "pnpm run build" : pm === "yarn" ? "yarn build" : "npm run build";
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function detectAuditCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).audit;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm") return "npm audit --audit-level=moderate";
  if (pm === "pnpm") return "pnpm audit";
  if (pm === "yarn") return "yarn npm audit --all --recursive";
  if (pm === "python") return "pip-audit";
  return null;
}

export function detectStackSummary(root) {
  const hints = [];
  if (fileExists(root, "package.json")) hints.push("node");
  if (fileExists(root, "pyproject.toml") || fileExists(root, "requirements.txt")) hints.push("python");
  if (fileExists(root, "go.mod")) hints.push("go");
  if (fileExists(root, "Cargo.toml")) hints.push("rust");
  if (fileExists(root, "Dockerfile") || fileExists(root, "docker-compose.yml")) hints.push("docker");
  return hints.length ? hints : ["unknown"];
}

export function isHyperionInstalled(root) {
  return (
    fileExists(root, ".github/project.yml") &&
    fileExists(root, "scripts/hyperion/doctor.mjs")
  );
}

export function detectRepoAdaptation(root = process.cwd()) {
  const projectText = readProjectYmlText(root);
  return {
    hyperionInstalled: isHyperionInstalled(root),
    packageManager: detectPackageManager(root),
    stack: detectStackSummary(root),
    test: detectTestCommand(root, projectText),
    lint: detectLintCommand(root, projectText),
    build: detectBuildCommand(root, projectText),
    audit: detectAuditCommand(root, projectText),
    commands: readProjectCommands(projectText),
  };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const json = process.argv.includes("--json");
  const adaptation = detectRepoAdaptation();
  if (json) {
    console.log(JSON.stringify(adaptation, null, 2));
  } else {
    console.log("Hyperion repo adaptation");
    for (const [k, v] of Object.entries(adaptation)) {
      console.log(`  ${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`);
    }
    console.log("\nSuggested project.yml block:");
    console.log("commands:");
    if (adaptation.test) console.log(`  test: ${adaptation.test}`);
    if (adaptation.lint) console.log(`  lint: ${adaptation.lint}`);
    if (adaptation.build) console.log(`  build: ${adaptation.build}`);
    if (adaptation.audit) console.log(`  audit: ${adaptation.audit}`);
  }
}
