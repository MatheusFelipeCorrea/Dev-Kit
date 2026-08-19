import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import readline from "node:readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = process.cwd();
const cardsRoot = path.join(workspaceRoot, ".github", "cards");
const configPath = path.join(cardsRoot, "config", "projects-map.json");
const projectYmlPath = path.join(workspaceRoot, ".github", "project.yml");

const argInteractive = process.argv.includes("--interactive");
const argYes = process.argv.includes("--yes");

function isInteractive() {
  if (argYes) return false;
  if (argInteractive) return true;
  return process.stdin.isTTY;
}

async function askYesNo(question) {
  if (!isInteractive()) return false;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => rl.question(`${question} (y/N): `, resolve));
  rl.close();
  const normalized = String(answer || "").trim().toLowerCase();
  return normalized === "y" || normalized === "yes";
}

function log(prefix, msg) {
  console.log(`[doctor] ${prefix} ${msg}`);
}

function warn(msg) {
  log("⚠️", msg);
}

function error(msg) {
  log("❌", msg);
}

function ok(msg) {
  log("✅", msg);
}

async function readJsonIfExists(p) {
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function detectRepoFromGit() {
  try {
    const url = execSync("git remote get-url origin", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();

    const httpsMatch = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (httpsMatch) return `${httpsMatch[1]}/${httpsMatch[2]}`;
    const sshMatch = url.match(/github\.com:([^/]+)\/([^/.]+)/);
    if (sshMatch) return `${sshMatch[1]}/${sshMatch[2]}`;
  } catch {}
  return null;
}

function detectTokenFromGhCli() {
  try {
    return execSync("gh auth token", { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {}
  return "";
}

function resolveRepoConfig(config, repositorySlug) {
  const fallback = config.default || {};
  const repoSpecific = config.repositories?.[repositorySlug] || {};
  return {
    ...fallback,
    ...repoSpecific,
    fieldMap: { ...(fallback.fieldMap || {}), ...(repoSpecific.fieldMap || {}) },
    defaults: { ...(fallback.defaults || {}), ...(repoSpecific.defaults || {}) },
  };
}

async function detectBackend(repoConfig) {
  const cfgBackend = repoConfig.backend;
  if (cfgBackend) return String(cfgBackend).toLowerCase();

  try {
    const raw = await fs.readFile(projectYmlPath, "utf8");
    const backendMatch = raw.match(/management:\s*[\s\S]*?backend\s*:\s*([^\s#]+)\s*(?:\n|$)/m);
    if (backendMatch?.[1]) return String(backendMatch[1]).toLowerCase();
  } catch {}

  return "github";
}

function getMappedFieldNames(repoConfig) {
  const fieldMap = repoConfig.fieldMap || {};
  return {
    status: fieldMap.status || "Status",
    type: fieldMap.type || "Type",
    priority: fieldMap.priority || "Priority",
    sprint: fieldMap.sprint || "Sprint",
    storyPoints: fieldMap.storyPoints || "Story Points",
    reporter: fieldMap.reporter || "Reporter",
    parent: fieldMap.parent || "Parent (Epic/Feature)",
    dueDate: fieldMap.dueDate || "Due Date",
  };
}

const FIELD_NAME_ALIASES = {
  status: ["Status"],
  type: ["Type", "Tipo"],
  priority: ["Priority", "Prioridade"],
  sprint: ["Sprint", "Numero da Sprint", "Número da Sprint"],
  storyPoints: ["Story Points"],
  reporter: ["Reporter", "Relator"],
  parent: ["Parent (Epic/Feature)", "Pai (Epic/Feature)"],
  dueDate: ["Due Date", "Data Limite"],
};

function printMissingOptionMapping(repoConfig, locale) {
  const optionMapByLocale = repoConfig.optionMapByLocale || {};
  const has =
    optionMapByLocale[locale] &&
    optionMapByLocale[locale].status &&
    optionMapByLocale[locale].type &&
    optionMapByLocale[locale].priority;
  if (!has) {
    warn(
      `optionMapByLocale incomplete for locale "${locale}" (status/type/priority). Built-in PT/EN alias matching still helps, but safest is to configure optionMapByLocale.`
    );
  } else {
    ok(`optionMapByLocale found for locale "${locale}".`);
  }
}

const EXPECTED_STATUS_OPTIONS = [
  "Backlog",
  "Functional Refinement",
  "Technical Refinement",
  "In Progress",
  "In Tests",
  "In Revision",
  "Done",
];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function checkStatusOptions(statusField) {
  if (!statusField || statusField.__typename !== "ProjectV2SingleSelectField") {
    warn("Status field was not found as a single-select field.");
    return false;
  }

  const optionNames = (statusField.options || []).map((o) => o.name);
  const normalizedExisting = new Set(optionNames.map(normalizeText));
  const missing = EXPECTED_STATUS_OPTIONS.filter(
    (name) => !normalizedExisting.has(normalizeText(name))
  );

  if (!missing.length) {
    ok("Status field options match DevForge flow (7 columns).");
    return true;
  }

  warn(`Status field is missing DevForge options: ${missing.join(", ")}.`);
  warn(
    `Current Status options: ${optionNames.join(", ") || "(none)"}`
  );
  warn("Fix in GitHub Project Settings -> Fields -> Status.");
  return false;
}

function checkSprintField(sprintField, configuredName) {
  if (!sprintField) {
    warn(`Sprint iteration field not found (expected: ${configuredName}).`);
    warn("Run npm run cards:sync to auto-create it, or add manually in Project Settings.");
    return false;
  }

  if (sprintField.__typename !== "ProjectV2IterationField") {
    warn(`Sprint field "${sprintField.name}" should be Iteration type, found ${sprintField.__typename}.`);
    return false;
  }

  const iterationCount = sprintField.configuration?.iterations?.length || 0;
  if (iterationCount === 0) {
    ok(`Sprint iteration field OK: ${sprintField.name} (0 iterations — add sprints in Project Settings when ready).`);
  } else {
    ok(`Sprint iteration field OK: ${sprintField.name} (${iterationCount} iteration(s)).`);
  }
  return true;
}

// ---------------------------------------------------------------------------
// GitHub GraphQL (Project existence + fields/options)
// ---------------------------------------------------------------------------

async function graphql({ token }, query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "cards-sync-doctor",
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors) {
    const details = JSON.stringify(payload.errors || payload, null, 2);
    throw new Error(`GraphQL failed: ${details}`);
  }
  return payload.data;
}

async function getProject({ token }, owner, repoName, projectNumber) {
  const projectFieldsFragment = `fields(first: 50) {
    nodes {
      __typename
      ... on ProjectV2Field { id name dataType }
      ... on ProjectV2SingleSelectField { id name options { id name } }
      ... on ProjectV2IterationField { id name configuration { iterations { id title } } }
    }
  }`;

  // repository-level project first
  try {
    const data = await graphql(
      { token },
      `query($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          projectV2(number: $number) { id ${projectFieldsFragment} }
        }
      }`,
      { owner, name: repoName, number: projectNumber }
    );
    if (data.repository?.projectV2) return data.repository.projectV2;
  } catch {}

  // user-level
  try {
    const data = await graphql(
      { token },
      `query($owner: String!, $number: Int!) {
        user(login: $owner) { projectV2(number: $number) { id ${projectFieldsFragment} } }
      }`,
      { owner, number: projectNumber }
    );
    if (data.user?.projectV2) return data.user.projectV2;
  } catch {}

  // organization-level
  try {
    const data = await graphql(
      { token },
      `query($owner: String!, $number: Int!) {
        organization(login: $owner) { projectV2(number: $number) { id ${projectFieldsFragment} } }
      }`,
      { owner, number: projectNumber }
    );
    if (data.organization?.projectV2) return data.organization.projectV2;
  } catch {}

  return null;
}

function normalizeOptionNames(fieldsNodes) {
  const byName = new Map();
  for (const f of fieldsNodes || []) {
    const name = f?.name;
    if (name) byName.set(String(name).toLowerCase(), f);
  }
  return byName;
}

function findFieldByCandidates(byName, candidates) {
  for (const c of candidates) {
    const f = byName.get(String(c).toLowerCase());
    if (f) return f;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const repositorySlug = process.env.GITHUB_REPOSITORY || detectRepoFromGit() || "unknown/unknown";
const [repoOwner, repoName] = repositorySlug.split("/");

const token =
  process.env.PROJECT_SYNC_TOKEN || process.env.GITHUB_TOKEN || detectTokenFromGhCli();
const tokenSource = process.env.PROJECT_SYNC_TOKEN
  ? "PROJECT_SYNC_TOKEN"
  : process.env.GITHUB_TOKEN
    ? "GITHUB_TOKEN"
    : token
      ? "gh-cli"
      : "none";

const config = await readJsonIfExists(configPath);
if (!config) {
  error(`Could not read ${configPath}.`);
  error("Run setup: `cards-sync-setup` skill, or restore projects-map.json.");
  process.exit(1);
}

const repoConfig = resolveRepoConfig(config, repositorySlug);
const locale = repoConfig.locale || "en";
const backend = await detectBackend(repoConfig);

ok(`Repo: ${repoOwner}/${repoName}`);
ok(`Token source: ${tokenSource}`);
ok(`Backend detected: ${backend}`);

// project.yml checks (auto-refresh trigger)
const projectYmlExists = (await fs.stat(projectYmlPath).then(() => true).catch(() => false));
if (!projectYmlExists) {
  warn(`Missing .github/project.yml.`);
  warn("Suggestion: run `project-discovery` in Configure mode, then re-run doctor.");
} else {
  ok(`Found .github/project.yml`);
}

// config shape checks
if (!repoConfig.fieldMap || Object.keys(repoConfig.fieldMap).length === 0) {
  warn("projects-map.json.fieldMap is missing/empty. Field updates may fail.");
}

printMissingOptionMapping(repoConfig, locale);

// labelsFile checks
const labelsFile = repoConfig.labelsFile;
if (!labelsFile) {
  warn("projects-map.json.default.labelsFile missing. Labels i18n may not work, but categories labels can still be created on-the-fly.");
} else {
  const resolved = labelsFile.includes("{locale}") ? labelsFile.replaceAll("{locale}", locale) : labelsFile;
  const fullPath = path.isAbsolute(resolved) ? resolved : path.join(cardsRoot, "config", resolved);
  const labelsExists = (await fs.stat(fullPath).then(() => true).catch(() => false));
  if (!labelsExists) warn(`labelsFile resolved path not found: ${fullPath}`);
  else ok(`labelsFile OK: ${fullPath}`);
}

// remote project checks (only if we have token + projectNumber)
const projectOwner = process.env.PROJECT_OWNER || repoConfig.projectOwner || repoOwner;
const projectNumber = Number(process.env.PROJECT_NUMBER || "0") || Number(repoConfig.projectNumber || "0");

log("info", `Resolved project: owner="${projectOwner}", number=${projectNumber}`);

if (!token && backend === "github") {
  warn("No GitHub token available. Doctor will only do local checks.");
  process.exit(0);
}

if (backend === "jira") {
  const jiraUrl = process.env.JIRA_URL || null;
  const jiraProjectKey = process.env.JIRA_PROJECT_KEY || null;
  const jiraEmail = process.env.JIRA_EMAIL || null;
  const jiraToken = process.env.JIRA_API_TOKEN || null;
  const jiraIssueType = process.env.JIRA_ISSUE_TYPE || "Task";

  if (!jiraUrl || !jiraProjectKey || !jiraEmail || !jiraToken) {
    warn("Jira backend detected. Missing one or more required env vars:");
    warn("JIRA_URL, JIRA_PROJECT_KEY, JIRA_EMAIL, JIRA_API_TOKEN");
    process.exit(1);
  }

  function encodeJiraAuth() {
    return Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64");
  }

  async function jiraRequest(endpoint, method = "GET") {
    const baseUrl = String(jiraUrl).replace(/\/+$/, "");
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${encodeJiraAuth()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = { raw: text };
    }

    if (!response.ok) {
      throw new Error(`Jira request failed (${response.status} ${response.statusText})`);
    }
    return payload || {};
  }

  ok("Jira backend env vars detected.");
  log("Checking Jira project exists...");
  await jiraRequest(`/rest/api/2/project/${encodeURIComponent(jiraProjectKey)}`);
  ok(`Jira project OK: ${jiraProjectKey}`);

  log(`Checking Jira issue type is creatable: ${jiraIssueType}...`);
  await jiraRequest(
    `/rest/api/2/issue/createmeta?projectKeys=${encodeURIComponent(jiraProjectKey)}&issuetypeNames=${encodeURIComponent(
      jiraIssueType
    )}&expand=projects.issuetypes.fields`
  );
  ok(`Jira issue type OK: ${jiraIssueType}`);

  ok("Doctor finished (Jira remote checks passed).");
  process.exit(0);
}

if (backend !== "github" && backend !== "jira") {
  warn(`Doctor remote checks are only implemented for GitHub Projects and Jira.`);
  warn(`For backend="${backend}", use: node scripts/cards-sync/sync.mjs --dry-run`);
  process.exit(0);
}

if (!projectNumber || projectNumber <= 0) {
  if (repoConfig.autoCreateProject === false) {
    warn("projectNumber not set (or <=0) and autoCreateProject is false. You must create the Project manually.");
    process.exit(0);
  }

  const wants = await askYesNo("Project number missing. Can I run sync.mjs to auto-create the GitHub Project?");
  if (wants) {
    log("info", "Running sync.mjs (real mode) to auto-create project/fields/labels...");
    const res = spawnSync("node", ["scripts/cards-sync/sync.mjs"], {
      cwd: workspaceRoot,
      stdio: "inherit",
      env: process.env,
    });
    process.exit(res.status ?? 1);
  }
  warn("Auto-create skipped. Tip: set projectNumber=0 or remove it, then run sync.mjs.");
  process.exit(0);
}

const project = await getProject({ token }, projectOwner, repoName, projectNumber);
if (!project) {
  warn(`GitHub Project not found for owner="${projectOwner}" number=${projectNumber}.`);

  if (repoConfig.autoCreateProject === false) {
    warn("autoCreateProject is false in projects-map.json. Create it manually or set autoCreateProject=true.");
    process.exit(0);
  }

  const wants = await askYesNo("Project not found. Can I set projects-map.json.projectNumber to 0 and re-run sync to auto-create?");
  if (!wants) {
    warn("Auto-create skipped. You can set projectNumber to 0 manually, then run sync.mjs.");
    process.exit(0);
  }

  // Edit config: set default.projectNumber = 0
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const obj = JSON.parse(raw);
    if (!obj.default) obj.default = {};
    obj.default.projectNumber = 0;
    await fs.writeFile(configPath, JSON.stringify(obj, null, 2) + "\n", "utf8");
    ok("projects-map.json updated: default.projectNumber=0");
  } catch (e) {
    error(`Could not edit projects-map.json: ${e.message}`);
    process.exit(1);
  }

  const res = spawnSync("node", ["scripts/cards-sync/sync.mjs"], {
    cwd: workspaceRoot,
    stdio: "inherit",
    env: process.env,
  });
  process.exit(res.status ?? 1);
}

ok(`Project found. Checking required fields...`);

const required = getMappedFieldNames(repoConfig);
const fieldsNodes = project?.fields?.nodes || [];
const byName = normalizeOptionNames(fieldsNodes);

const missingFields = [];
for (const [key, configuredName] of Object.entries(required)) {
  const candidates = [configuredName, ...(FIELD_NAME_ALIASES[key] || [])];
  const found = findFieldByCandidates(byName, candidates);
  if (!found) missingFields.push(configuredName);
}
if (missingFields.length) {
  warn(`Missing required Project fields: ${missingFields.join(", ")}`);
  warn("Fix options:");
  warn("1) Create those fields manually in Project Settings");
  warn("2) Or set projects-map.json.default.projectNumber=0 and let sync auto-create a fresh Project (if acceptable)");
} else {
  ok("All required Project fields exist.");
}

const statusCandidates = [required.status, ...(FIELD_NAME_ALIASES.status || [])];
const statusField = findFieldByCandidates(byName, statusCandidates);
const statusOk = checkStatusOptions(statusField);

const sprintCandidates = [required.sprint, ...(FIELD_NAME_ALIASES.sprint || [])];
const sprintField = findFieldByCandidates(byName, sprintCandidates);
const sprintOk = checkSprintField(sprintField, required.sprint);

ok("Doctor finished.");
process.exit(missingFields.length || !statusOk || !sprintOk ? 1 : 0);

