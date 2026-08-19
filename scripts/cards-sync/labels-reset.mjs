import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";
import {
  detectRepoFromGit,
  detectTokenFromGhCli,
  readJsonIfExists,
  resolveRepoConfig,
} from "./lib.mjs";

const workspaceRoot = process.cwd();
const cardsRoot = path.join(workspaceRoot, ".github", "cards");
const configPath = path.join(cardsRoot, "config", "projects-map.json");
const projectYmlPath = path.join(workspaceRoot, ".github", "project.yml");

const argYes = process.argv.includes("--yes");
const argDryRun = process.argv.includes("--dry-run");

/** GitHub default labels shipped with new repositories. */
const GITHUB_DEFAULT_LABELS = new Set([
  "bug",
  "documentation",
  "duplicate",
  "enhancement",
  "good first issue",
  "help wanted",
  "invalid",
  "question",
  "wontfix",
]);

/** Automation labels — kept unless --no-keep-dependabot. */
const DEPENDABOT_LABELS = new Set(["dependencies", "github_actions"]);

/** Card type/priority belong on Project fields, not issue labels. */
const PROJECT_FIELD_LABEL_LEAKS = new Set([
  "Epic",
  "Feature",
  "Story",
  "Task",
  "Subtask",
  "Highest",
  "High",
  "Medium",
  "Low",
  "Priority: Highest",
  "Priority: High",
  "Priority: Medium",
  "Priority: Low",
]);

function log(msg) {
  console.log(`[labels-reset] ${msg}`);
}

function colorFromString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return (hash & 0xffffff).toString(16).padStart(6, "0");
}

async function detectProjectLocale() {
  try {
    const raw = await fs.readFile(projectYmlPath, "utf8");
    const match = raw.match(/^\s*locale\s*:\s*([^\s#]+)\s*$/m);
    if (match?.[1]) return match[1];
  } catch {}
  return null;
}

async function loadLabelsCatalog(repoConfig) {
  const locale = repoConfig.locale || (await detectProjectLocale()) || "en";

  if (Array.isArray(repoConfig.labels)) {
    return { locale, labels: repoConfig.labels, file: "(inline config)" };
  }

  const labelsFile = repoConfig.labelsFile;
  if (!labelsFile) return { locale, labels: [], file: null };

  const resolvedFileName = labelsFile.includes("{locale}")
    ? labelsFile.replaceAll("{locale}", locale)
    : labelsFile;

  const fullPath = path.isAbsolute(resolvedFileName)
    ? resolvedFileName
    : path.join(cardsRoot, "config", resolvedFileName);

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = JSON.parse(raw);
    return { locale, labels: Array.isArray(parsed) ? parsed : [], file: fullPath };
  } catch {
    return { locale, labels: [], file: fullPath };
  }
}

function listRepoLabels(owner, repo) {
  try {
    const out = execSync(`gh label list --repo ${owner}/${repo} --limit 200 --json name`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const parsed = JSON.parse(out);
    return parsed.map((row) => row.name);
  } catch (error) {
    throw new Error(`Failed to list labels: ${error.message}`);
  }
}

function deleteLabel(owner, repo, name, dryRun) {
  if (dryRun) {
    log(`  (dry-run) delete: ${name}`);
    return;
  }
  try {
    execSync(`gh label delete ${JSON.stringify(name)} --repo ${owner}/${repo} --yes`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    log(`  deleted: ${name}`);
  } catch (error) {
    log(`  WARN: could not delete "${name}": ${error.stderr?.toString?.() || error.message}`);
  }
}

function createLabel(owner, repo, name, dryRun) {
  const color = colorFromString(name);
  if (dryRun) {
    log(`  (dry-run) create: ${name} (#${color})`);
    return;
  }
  try {
    execSync(
      `gh label create ${JSON.stringify(name)} --repo ${owner}/${repo} --color ${color} --force`,
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
    );
    log(`  ensured: ${name}`);
  } catch (error) {
    log(`  WARN: could not create "${name}": ${error.stderr?.toString?.() || error.message}`);
  }
}

async function main() {
  const keepDependabot = !process.argv.includes("--no-keep-dependabot");
  const dryRun = argDryRun || !argYes;

  if (dryRun && !argDryRun) {
    log("Dry-run mode (pass --yes to apply). Preview only.");
  }

  const repositorySlug = process.env.GITHUB_REPOSITORY || detectRepoFromGit();
  if (!repositorySlug) {
    log("ERROR: cannot detect repository from git remote.");
    process.exit(1);
  }

  const [owner, repo] = repositorySlug.split("/");
  const token = process.env.PROJECT_SYNC_TOKEN || process.env.GITHUB_TOKEN || detectTokenFromGhCli();
  if (!token) {
    log("ERROR: no GitHub token. Run: gh auth login");
    process.exit(1);
  }

  const config = (await readJsonIfExists(configPath)) || { default: {} };
  const repoConfig = resolveRepoConfig(config, repositorySlug);
  const projectLocale = await detectProjectLocale();
  if (projectLocale && !repoConfig.locale) repoConfig.locale = projectLocale;

  const catalog = await loadLabelsCatalog(repoConfig);
  const canonical = new Set(catalog.labels || []);
  const locale = catalog.locale || repoConfig.locale || "en";

  if (!canonical.size) {
    log(`ERROR: no labels loaded (locale=${locale}, file=${catalog.file || "?"})`);
    process.exit(1);
  }

  log(`Repository: ${repositorySlug}`);
  log(`Locale: ${locale} (${canonical.size} Dev-Kit labels)`);
  log(`Keep Dependabot labels: ${keepDependabot ? "yes" : "no"}`);
  log("");

  const existing = listRepoLabels(owner, repo);
  const toDelete = [];
  const toCreate = [...canonical].filter((name) => !existing.includes(name));

  for (const name of existing) {
    const lower = name.toLowerCase();
    if (canonical.has(name)) continue;
    if (keepDependabot && DEPENDABOT_LABELS.has(name)) continue;
    if (GITHUB_DEFAULT_LABELS.has(lower)) {
      toDelete.push(name);
      continue;
    }
    if (PROJECT_FIELD_LABEL_LEAKS.has(name)) {
      toDelete.push(name);
      continue;
    }
    // Wrong locale / orphan labels from mixed provisioning
    toDelete.push(name);
  }

  log(`Existing: ${existing.length} | Delete: ${toDelete.length} | Ensure: ${toCreate.length}`);
  log("");

  if (toDelete.length) {
    log("Removing non-Dev-Kit labels...");
    for (const name of toDelete.sort()) deleteLabel(owner, repo, name, dryRun);
  }

  log("");
  log("Ensuring Dev-Kit catalog labels...");
  for (const name of [...canonical].sort()) createLabel(owner, repo, name, dryRun);

  log("");
  if (dryRun) {
    log("Dry-run complete. Re-run with --yes to apply.");
  } else {
    log("Label reset complete.");
  }
}

main().catch((error) => {
  console.error("[labels-reset] FATAL:", error.message);
  process.exit(1);
});
