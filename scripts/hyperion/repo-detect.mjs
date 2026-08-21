/**
 * Repository-adaptive detection — reads project.yml first, then discovers from manifests.
 * Used by migration, dependency-health, pr-reviewer, implementation-executor.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

/** Shallow scan of root for a filename ending / exact match. */
export function rootHasFile(root, predicate) {
  try {
    for (const name of readdirSync(root)) {
      if (predicate(name)) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function detectPackageManager(root) {
  if (fileExists(root, "pnpm-lock.yaml")) return "pnpm";
  if (fileExists(root, "yarn.lock")) return "yarn";
  if (fileExists(root, "bun.lockb") || fileExists(root, "bun.lock")) return "bun";
  if (fileExists(root, "package-lock.json") || fileExists(root, "package.json")) return "npm";
  if (fileExists(root, "uv.lock") || fileExists(root, "pyproject.toml")) return "python";
  if (fileExists(root, "go.mod")) return "go";
  if (fileExists(root, "Cargo.toml")) return "cargo";
  if (
    rootHasFile(root, (n) => n.endsWith(".sln") || n.endsWith(".csproj")) ||
    fileExists(root, "Directory.Build.props")
  ) {
    return "dotnet";
  }
  if (fileExists(root, "pom.xml")) return "maven";
  if (
    fileExists(root, "build.gradle") ||
    fileExists(root, "build.gradle.kts") ||
    fileExists(root, "settings.gradle") ||
    fileExists(root, "settings.gradle.kts")
  ) {
    return "gradle";
  }
  if (fileExists(root, "composer.json")) return "php";
  if (fileExists(root, "Gemfile")) return "ruby";
  return "unknown";
}

export function detectTestCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).test;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn" || pm === "bun") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.test && !/^echo/i.test(pkg.scripts.test)) {
        if (pm === "pnpm") return "pnpm test";
        if (pm === "yarn") return "yarn test";
        if (pm === "bun") return "bun test";
        return "npm test";
      }
    } catch {
      /* ignore */
    }
    return pm === "bun" ? "bun test" : "npm test";
  }
  if (pm === "python") {
    if (fileExists(root, "pytest.ini") || fileExists(root, "tests")) return "pytest";
    return "python -m pytest";
  }
  if (pm === "go") return "go test ./...";
  if (pm === "cargo") return "cargo test";
  if (pm === "dotnet") return "dotnet test";
  if (pm === "maven") return "mvn test";
  if (pm === "gradle") {
    return fileExists(root, "gradlew") || fileExists(root, "gradlew.bat")
      ? "./gradlew test"
      : "gradle test";
  }
  if (pm === "php") {
    if (fileExists(root, "vendor/bin/phpunit")) return "./vendor/bin/phpunit";
    return "composer test";
  }
  if (pm === "ruby") {
    if (fileExists(root, "spec")) return "bundle exec rspec";
    return "bundle exec rake test";
  }
  return null;
}

export function detectLintCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).lint;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn" || pm === "bun") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.lint) {
        if (pm === "pnpm") return "pnpm run lint";
        if (pm === "yarn") return "yarn lint";
        if (pm === "bun") return "bun run lint";
        return "npm run lint";
      }
    } catch {
      /* ignore */
    }
  }
  if (pm === "dotnet") return "dotnet format --verify-no-changes";
  if (pm === "maven") return "mvn -q checkstyle:check";
  if (pm === "gradle") {
    return fileExists(root, "gradlew") || fileExists(root, "gradlew.bat")
      ? "./gradlew check"
      : "gradle check";
  }
  if (pm === "php") return "composer normalize --dry-run";
  if (pm === "ruby") return "bundle exec rubocop";
  if (pm === "go") return "go vet ./...";
  if (pm === "cargo") return "cargo clippy -- -D warnings";
  return null;
}

export function detectBuildCommand(root, projectText = null) {
  const text = projectText ?? readProjectYmlText(root);
  const fromYml = readProjectCommands(text).build;
  if (fromYml) return fromYml;

  const pm = detectPackageManager(root);
  if (pm === "npm" || pm === "pnpm" || pm === "yarn" || pm === "bun") {
    try {
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      if (pkg.scripts?.build) {
        if (pm === "pnpm") return "pnpm run build";
        if (pm === "yarn") return "yarn build";
        if (pm === "bun") return "bun run build";
        return "npm run build";
      }
    } catch {
      /* ignore */
    }
  }
  if (pm === "dotnet") return "dotnet build";
  if (pm === "maven") return "mvn -q package";
  if (pm === "gradle") {
    return fileExists(root, "gradlew") || fileExists(root, "gradlew.bat")
      ? "./gradlew build"
      : "gradle build";
  }
  if (pm === "go") return "go build ./...";
  if (pm === "cargo") return "cargo build";
  if (pm === "php") return "composer install --no-dev --optimize-autoloader";
  if (pm === "ruby") return "bundle install";
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
  if (pm === "bun") return "bun pm audit";
  if (pm === "python") return "pip-audit";
  if (pm === "dotnet") return "dotnet list package --vulnerable";
  if (pm === "maven") return "mvn org.owasp:dependency-check-maven:check";
  if (pm === "gradle") {
    return fileExists(root, "gradlew") || fileExists(root, "gradlew.bat")
      ? "./gradlew dependencyCheckAnalyze"
      : "gradle dependencyCheckAnalyze";
  }
  if (pm === "php") return "composer audit";
  if (pm === "ruby") return "bundle audit check --update";
  if (pm === "cargo") return "cargo audit";
  if (pm === "go") return "go list -m all";
  return null;
}

export function detectStackSummary(root) {
  const hints = [];
  if (fileExists(root, "package.json") || fileExists(root, "bun.lockb") || fileExists(root, "bun.lock")) {
    hints.push("node");
  }
  if (fileExists(root, "pyproject.toml") || fileExists(root, "requirements.txt")) hints.push("python");
  if (fileExists(root, "go.mod")) hints.push("go");
  if (fileExists(root, "Cargo.toml")) hints.push("rust");
  if (
    rootHasFile(root, (n) => n.endsWith(".sln") || n.endsWith(".csproj")) ||
    fileExists(root, "Directory.Build.props")
  ) {
    hints.push("dotnet");
  }
  if (fileExists(root, "pom.xml")) hints.push("java-maven");
  if (
    fileExists(root, "build.gradle") ||
    fileExists(root, "build.gradle.kts") ||
    fileExists(root, "settings.gradle") ||
    fileExists(root, "settings.gradle.kts")
  ) {
    hints.push("java-gradle");
  }
  if (fileExists(root, "composer.json")) hints.push("php");
  if (fileExists(root, "Gemfile")) hints.push("ruby");
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
