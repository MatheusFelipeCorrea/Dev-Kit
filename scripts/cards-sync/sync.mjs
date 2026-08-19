import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  parseOnlyFilter,
  expandCardIdsWithParents,
  filterEdgesForCards,
  discoverGitHubProjectNumber,
  resolveRepoConfig,
  writeSyncSummary,
} from "./lib.mjs";

const workspaceRoot = process.cwd();
const cardsRoot = path.join(workspaceRoot, ".github", "cards");
const configPath = path.join(cardsRoot, "config", "projects-map.json");
const projectYmlPath = path.join(workspaceRoot, ".github", "project.yml");

const argDryRun = process.argv.includes("--dry-run");
const argReverse = process.argv.includes("--reverse");
const argForward = process.argv.includes("--forward");
const envDryRun = String(process.env.DRY_RUN || "false").toLowerCase() === "true";
const dryRun = argDryRun || envDryRun;
const directionEnv = String(process.env.SYNC_DIRECTION || "").toLowerCase();
const syncDirection = argReverse
  ? "reverse"
  : argForward
    ? "forward"
    : directionEnv === "reverse"
      ? "reverse"
      : "forward";

// ---------------------------------------------------------------------------
// Auto-detect repository from git remote
// ---------------------------------------------------------------------------

function detectRepoFromGit() {
  try {
    const url = execSync("git remote get-url origin", { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
    // https://github.com/OWNER/REPO.git or git@github.com:OWNER/REPO.git
    const httpsMatch = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
    if (httpsMatch) return `${httpsMatch[1]}/${httpsMatch[2]}`;
    const sshMatch = url.match(/github\.com:([^/]+)\/([^/.]+)/);
    if (sshMatch) return `${sshMatch[1]}/${sshMatch[2]}`;
  } catch {}
  return null;
}

// ---------------------------------------------------------------------------
// Auto-detect token from gh CLI
// ---------------------------------------------------------------------------

function detectTokenFromGhCli() {
  try {
    return execSync("gh auth token", { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {}
  return "";
}

const repositorySlug =
  process.env.GITHUB_REPOSITORY || detectRepoFromGit() || "unknown/unknown";
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

let createMissingLabels =
  String(process.env.CREATE_MISSING_LABELS || "true").toLowerCase() === "true";

function log(message) {
  console.log(`[cards-sync] ${message}`);
}

function readManagementHintsFromProjectYml(content) {
  const blockMatch = content.match(/^\s*management\s*:\s*\n([\s\S]*?)(?:^\S|\Z)/m);
  if (!blockMatch) return {};

  const block = blockMatch[1];
  const pick = (key) => {
    const m = block.match(new RegExp(`^\\s*${key}\\s*:\\s*([^\\n#]+)`, "m"));
    if (!m) return null;
    const value = String(m[1]).trim().replace(/^["']|["']$/g, "");
    return value === "null" ? null : value;
  };

  return {
    backend: pick("backend"),
    url: pick("url"),
    project_key: pick("project_key"),
    email: pick("email"),
  };
}

async function resolveManagementConfig(repoConfig) {
  let projectYmlManagement = {};
  try {
    const raw = await fs.readFile(projectYmlPath, "utf8");
    projectYmlManagement = readManagementHintsFromProjectYml(raw);
  } catch {}

  const cfgManagement = repoConfig.management || {};

  return {
    backend:
      process.env.CARDS_SYNC_BACKEND ||
      cfgManagement.backend ||
      projectYmlManagement.backend ||
      repoConfig.backend ||
      "github",
    // ----------------------------
    // Jira
    // ----------------------------
    jiraUrl:
      process.env.JIRA_URL ||
      cfgManagement.url ||
      projectYmlManagement.url ||
      null,
    jiraProjectKey:
      process.env.JIRA_PROJECT_KEY ||
      cfgManagement.project_key ||
      projectYmlManagement.project_key ||
      null,
    jiraEmail:
      process.env.JIRA_EMAIL ||
      cfgManagement.email ||
      projectYmlManagement.email ||
      null,
    jiraApiToken: process.env.JIRA_API_TOKEN || null,
    jiraIssueType: process.env.JIRA_ISSUE_TYPE || "Task",

    // ----------------------------
    // Azure DevOps
    // ----------------------------
    azureOrgUrl: process.env.AZDO_ORG_URL || cfgManagement.org || projectYmlManagement.org || null,
    azureProject: process.env.AZDO_PROJECT || cfgManagement.project || projectYmlManagement.project || null,
    azurePat: process.env.AZDO_PAT || null,
    azureWorkItemType: process.env.AZDO_WORK_ITEM_TYPE || "Task",

    // ----------------------------
    // Linear
    // ----------------------------
    linearTeamId: process.env.LINEAR_TEAM_ID || cfgManagement.team || projectYmlManagement.team || null,
    linearApiToken: process.env.LINEAR_API_TOKEN || null,

    // ----------------------------
    // GitLab
    // ----------------------------
    gitlabUrl: process.env.GITLAB_URL || cfgManagement.url || projectYmlManagement.url || "https://gitlab.com",
    gitlabProjectId: process.env.GITLAB_PROJECT_ID || null,
    gitlabToken: process.env.GITLAB_TOKEN || null,
    gitlabIssueType: process.env.GITLAB_ISSUE_TYPE || null,
  };
}

// ---------------------------------------------------------------------------
// YAML Frontmatter Parser (lightweight, no dependencies)
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return null;
  }

  const yamlBlock = match[1];
  const body = match[2];
  const meta = {};

  let currentKey = null;
  let currentArray = null;

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trimEnd();

    if (/^\s*-\s+/.test(trimmed) && currentKey && currentArray !== null) {
      const value = trimmed.replace(/^\s*-\s+/, "").replace(/^["']|["']$/g, "").trim();
      if (value) currentArray.push(value);
      continue;
    }

    if (currentKey && currentArray !== null) {
      meta[currentKey] = currentArray;
      currentArray = null;
      currentKey = null;
    }

    const kvMatch = trimmed.match(/^([a-z_]+)\s*:\s*(.*)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1];
    let value = kvMatch[2].trim();

    if (value === "") {
      currentKey = key;
      currentArray = [];
      continue;
    }

    if (value === "null") {
      meta[key] = null;
      continue;
    }

    // Inline array: [Frontend, Backend]
    const inlineArray = value.match(/^\[([^\]]*)\]$/);
    if (inlineArray) {
      meta[key] = inlineArray[1]
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }

    // Scalar value
    value = value.replace(/^["']|["']$/g, "");
    const num = Number(value);
    if (!isNaN(num) && value !== "") {
      meta[key] = num;
    } else {
      meta[key] = value;
    }
  }

  if (currentKey && currentArray !== null) {
    meta[currentKey] = currentArray;
  }

  return { meta, body };
}

// ---------------------------------------------------------------------------
// File listing
// ---------------------------------------------------------------------------

async function listMarkdownFiles(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "config" || entry.name === "synced") continue;
      files.push(...(await listMarkdownFiles(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      if (entry.name.toLowerCase() === "readme.md") continue;
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Card parsing — one card per file
// ---------------------------------------------------------------------------

function parseCardFile(content, relativeFile) {
  const parsed = parseFrontmatter(content);
  if (!parsed || !parsed.meta.card_id) {
    return null;
  }

  const { meta, body } = parsed;

  return {
    cardId: meta.card_id,
    title: meta.title || extractTitleFromBody(body),
    status: meta.status || null,
    type: meta.type || "Story",
    priority: meta.priority || null,
    sprint: meta.sprint || null,
    storyPoints: meta.story_points ?? null,
    reporter: meta.reporter || null,
    parent: meta.parent || null,
    dueDate: meta.due_date || null,
    categories: Array.isArray(meta.categories) ? meta.categories : [],
    body,
    relativeFile,
  };
}

function extractTitleFromBody(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

// ---------------------------------------------------------------------------
// Sub-issues detection from body
// ---------------------------------------------------------------------------

function parseSubIssueIds(body) {
  const results = [];
  const lines = body.split("\n");
  let inSection = false;

  for (const line of lines) {
    if (/^##\s+.*[Ss]ub-issues/i.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(line)) break;
    if (!inSection) continue;

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (!bullet) continue;
    const id = bullet[1].trim();
    if (id) results.push(id);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Edge building (parent-child relationships)
// ---------------------------------------------------------------------------

function buildEdges(cards) {
  const byCardId = new Map(cards.map((c) => [c.cardId, c]));
  const edges = [];
  const seen = new Set();

  const addEdge = (parentId, childId) => {
    if (!parentId || !childId || parentId === childId) return;
    const key = `${parentId}=>${childId}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ parentCardId: parentId, childCardId: childId });
  };

  for (const card of cards) {
    if (card.parent && byCardId.has(card.parent)) {
      addEdge(card.parent, card.cardId);
    }
  }

  for (const card of cards) {
    const subIds = parseSubIssueIds(card.body);
    for (const childId of subIds) {
      if (byCardId.has(childId)) {
        addEdge(card.cardId, childId);
      }
    }
  }

  return edges;
}

// ---------------------------------------------------------------------------
// Issue title formatting
// ---------------------------------------------------------------------------

function buildIssueTitle(card) {
  const typeTag = card.type || "Story";
  const baseTitle = (card.title || "").replace(/^\[[^\]]+\]\s*/, "").trim();
  return `[${typeTag}] ${baseTitle || card.cardId}`;
}

// ---------------------------------------------------------------------------
// Issue body with sync metadata
// ---------------------------------------------------------------------------

function buildIssueBody(card) {
  const lines = [];
  lines.push(card.body.trim());
  lines.push("");
  lines.push("---");
  lines.push("<!-- SYNC_METADATA — do not edit below this line -->");
  lines.push(`CARD_ID: ${card.cardId}`);
  lines.push(`SOURCE_FILE: ${card.relativeFile}`);
  if (card.parent) {
    lines.push(`PARENT_CARD_ID: ${card.parent}`);
  }
  lines.push("<!-- /SYNC_METADATA -->");
  return lines.join("\n");
}

function buildJiraDescription(card) {
  const lines = [];
  lines.push(card.body.trim());
  lines.push("");
  lines.push("---");
  lines.push("<!-- SYNC_METADATA — do not edit below this line -->");
  lines.push(`CARD_ID: ${card.cardId}`);
  lines.push(`SOURCE_FILE: ${card.relativeFile}`);
  lines.push(`TYPE: ${card.type || "Story"}`);
  lines.push(`STATUS: ${card.status ?? ""}`);
  lines.push(`PRIORITY: ${card.priority ?? ""}`);
  lines.push(`SPRINT: ${card.sprint ?? ""}`);
  lines.push(`STORY_POINTS: ${card.storyPoints ?? ""}`);
  lines.push(`REPORTER: ${card.reporter ?? ""}`);
  lines.push(`PARENT_CARD_ID: ${card.parent ?? ""}`);
  lines.push(`DUE_DATE: ${card.dueDate ?? ""}`);
  lines.push(`CATEGORIES: ${(card.categories || []).join(", ")}`);
  lines.push("<!-- /SYNC_METADATA -->");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// GitHub GraphQL
// ---------------------------------------------------------------------------

async function graphql(query, variables = {}) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "cards-sync-script",
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

async function getRepositoryNodeId(owner, name) {
  const data = await graphql(
    `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { id } }`,
    { owner, name }
  );
  return data.repository.id;
}

async function searchIssueByCardId(owner, name, cardId) {
  const q = `repo:${owner}/${name} in:body "CARD_ID: ${cardId}" is:issue`;
  const data = await graphql(
    `query($query: String!) { search(type: ISSUE, query: $query, first: 1) { nodes { ... on Issue { id number title url } } } }`,
    { query: q }
  );
  return data.search.nodes[0] || null;
}

async function createIssue(repositoryId, title, body) {
  const data = await graphql(
    `mutation($repositoryId: ID!, $title: String!, $body: String!) { createIssue(input: { repositoryId: $repositoryId, title: $title, body: $body }) { issue { id number title url } } }`,
    { repositoryId, title, body }
  );
  return data.createIssue.issue;
}

async function updateIssue(issueId, title, body) {
  const data = await graphql(
    `mutation($issueId: ID!, $title: String!, $body: String!) { updateIssue(input: { id: $issueId, title: $title, body: $body }) { issue { id number title url } } }`,
    { issueId, title, body }
  );
  return data.updateIssue.issue;
}

async function linkAsSubIssue(parentIssueId, childIssueId) {
  await graphql(
    `mutation($issueId: ID!, $subIssueId: ID!) { addSubIssue(input: { issueId: $issueId, subIssueId: $subIssueId }) { issue { id } } }`,
    { issueId: parentIssueId, subIssueId: childIssueId }
  );
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

async function getLabelId(owner, name, labelName, createIfMissing = false) {
  const data = await graphql(
    `query($owner: String!, $name: String!, $labelName: String!) { repository(owner: $owner, name: $name) { id label(name: $labelName) { id } } }`,
    { owner, name, labelName }
  );

  if (data.repository.label?.id) return data.repository.label.id;
  if (!createIfMissing) return "";

  const repositoryId = data.repository.id;
  const color = colorFromString(labelName);
  const created = await graphql(
    `mutation($repositoryId: ID!, $name: String!, $color: String!) { createLabel(input: { repositoryId: $repositoryId, name: $name, color: $color }) { label { id } } }`,
    { repositoryId, name: labelName, color }
  );
  return created.createLabel.label.id;
}

function colorFromString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return (hash & 0xffffff).toString(16).padStart(6, "0");
}

async function setIssueLabels(issueId, owner, name, labels) {
  if (!labels.length) return;

  const labelIds = [];
  const skipped = [];

  for (const labelName of labels) {
    const labelId = await getLabelId(owner, name, labelName, createMissingLabels);
    if (!labelId) {
      skipped.push(labelName);
      continue;
    }
    labelIds.push(labelId);
  }

  if (skipped.length) log(`Labels skipped (not found): ${skipped.join(", ")}`);
  if (!labelIds.length) return;

  await graphql(
    `mutation($labelableId: ID!, $labelIds: [ID!]!) { addLabelsToLabelable(input: { labelableId: $labelableId, labelIds: $labelIds }) { clientMutationId } }`,
    { labelableId: issueId, labelIds }
  );
}

// ---------------------------------------------------------------------------
// Project operations
// ---------------------------------------------------------------------------

async function getProject(owner, projectNumber) {
  const projectFieldsFragment = `fields(first: 50) {
    nodes {
      __typename
      ... on ProjectV2Field { id name dataType }
      ... on ProjectV2SingleSelectField { id name options { id name } }
      ... on ProjectV2IterationField { id name configuration { iterations { id title } } }
    }
  }`;

  // Try repository-level project first
  try {
    const data = await graphql(
      `query($owner: String!, $name: String!, $number: Int!) { repository(owner: $owner, name: $name) { projectV2(number: $number) { id ${projectFieldsFragment} } } }`,
      { owner, name: repoName, number: projectNumber }
    );
    if (data.repository?.projectV2) return data.repository.projectV2;
  } catch {}

  // Try user-level
  try {
    const data = await graphql(
      `query($owner: String!, $number: Int!) { user(login: $owner) { projectV2(number: $number) { id ${projectFieldsFragment} } } }`,
      { owner, number: projectNumber }
    );
    if (data.user?.projectV2) return data.user.projectV2;
  } catch {}

  // Try organization-level
  try {
    const data = await graphql(
      `query($owner: String!, $number: Int!) { organization(login: $owner) { projectV2(number: $number) { id ${projectFieldsFragment} } } }`,
      { owner, number: projectNumber }
    );
    if (data.organization?.projectV2) return data.organization.projectV2;
  } catch {}

  return null;
}

// ---------------------------------------------------------------------------
// Auto-create Project with default fields
// ---------------------------------------------------------------------------

const DEFAULT_TYPE_OPTIONS = ["Epic", "Feature", "Story", "Task", "Subtask", "Bug"];
const DEFAULT_PRIORITY_OPTIONS = ["Highest", "High", "Medium", "Low"];
const DEFAULT_STATUS_OPTIONS = [
  "Backlog",
  "Functional Refinement",
  "Technical Refinement",
  "In Progress",
  "In Tests",
  "In Revision",
  "Done",
];

async function createProjectV2(ownerId, title) {
  const data = await graphql(
    `mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: { ownerId: $ownerId, title: $title }) {
        projectV2 { id number }
      }
    }`,
    { ownerId, title }
  );
  return data.createProjectV2.projectV2;
}

async function addSingleSelectField(projectId, name, options) {
  const data = await graphql(
    `mutation($projectId: ID!, $name: String!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
      createProjectV2Field(input: {
        projectId: $projectId,
        dataType: SINGLE_SELECT,
        name: $name,
        singleSelectOptions: $options
      }) { projectV2Field { ... on ProjectV2SingleSelectField { id name } } }
    }`,
    {
      projectId,
      name,
      options: options.map((o, i) => ({ name: o, color: singleSelectColor(i) })),
    }
  );
  return data.createProjectV2Field.projectV2Field;
}

async function addTextField(projectId, name) {
  await graphql(
    `mutation($projectId: ID!, $name: String!) {
      createProjectV2Field(input: { projectId: $projectId, dataType: TEXT, name: $name }) {
        projectV2Field { ... on ProjectV2Field { id } }
      }
    }`,
    { projectId, name }
  );
}

async function addNumberField(projectId, name) {
  await graphql(
    `mutation($projectId: ID!, $name: String!) {
      createProjectV2Field(input: { projectId: $projectId, dataType: NUMBER, name: $name }) {
        projectV2Field { ... on ProjectV2Field { id } }
      }
    }`,
    { projectId, name }
  );
}

async function addDateField(projectId, name) {
  await graphql(
    `mutation($projectId: ID!, $name: String!) {
      createProjectV2Field(input: { projectId: $projectId, dataType: DATE, name: $name }) {
        projectV2Field { ... on ProjectV2Field { id } }
      }
    }`,
    { projectId, name }
  );
}

async function updateSingleSelectFieldOptions(fieldId, options) {
  const data = await graphql(
    `mutation($fieldId: ID!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
      updateProjectV2Field(input: { fieldId: $fieldId, singleSelectOptions: $options }) {
        projectV2Field { ... on ProjectV2SingleSelectField { id name options { id name } } }
      }
    }`,
    {
      fieldId,
      options: options.map((o, i) => ({ name: o, color: singleSelectColor(i) })),
    }
  );
  return data.updateProjectV2Field.projectV2Field;
}

async function ensureStatusFieldOptions(project, repoConfig) {
  const fieldMap = repoConfig.fieldMap || {};
  const statusName = fieldMap.status || "Status";
  let statusField = getFieldByName(project, statusName);

  if (!statusField) {
    await addSingleSelectField(project.id, statusName, DEFAULT_STATUS_OPTIONS);
    log(`  + Status field created with ${DEFAULT_STATUS_OPTIONS.length} workflow options`);
    return;
  }

  if (statusField.__typename !== "ProjectV2SingleSelectField") return;

  const existing = new Set((statusField.options || []).map((o) => normalizeText(o.name)));
  const allPresent = DEFAULT_STATUS_OPTIONS.every((opt) => existing.has(normalizeText(opt)));

  if (allPresent && (statusField.options || []).length >= DEFAULT_STATUS_OPTIONS.length) {
    log(`  = Status field already has DevForge workflow options`);
    return;
  }

  try {
    await updateSingleSelectFieldOptions(statusField.id, DEFAULT_STATUS_OPTIONS);
    log(`  ~ Status field updated with DevForge workflow options (${DEFAULT_STATUS_OPTIONS.length})`);
  } catch (error) {
    log(`  WARN: Could not update Status options automatically: ${error.message}`);
    log(`  Customize Status options manually in Project Settings.`);
  }
}

function singleSelectColor(index) {
  const colors = ["GREEN", "YELLOW", "ORANGE", "RED", "PURPLE", "BLUE", "PINK", "GRAY"];
  return colors[index % colors.length];
}

async function getOwnerNodeId(owner) {
  // Try repository node first (repo-level project creation).
  // Fallback to user/org id if repo id isn't available.
  try {
    const data = await graphql(
      `query($owner: String!, $name: String!) { repository(owner: $owner, name: $name) { id } }`,
      { owner, name: repoName }
    );
    return data.repository.id;
  } catch {}

  try {
    const data = await graphql(`query($login: String!) { user(login: $login) { id } }`, { login: owner });
    return data.user.id;
  } catch {}

  try {
    const data = await graphql(`query($login: String!) { organization(login: $login) { id } }`, { login: owner });
    return data.organization.id;
  } catch {}

  return null;
}

// Fields the sync expects to exist. Names here are the defaults used when creating.
// The fieldMap in config can override these names to match an existing Project.
const REQUIRED_FIELDS = [
  { key: "type", defaultName: "Type", kind: "single_select", options: DEFAULT_TYPE_OPTIONS },
  { key: "priority", defaultName: "Priority", kind: "single_select", options: DEFAULT_PRIORITY_OPTIONS },
  { key: "storyPoints", defaultName: "Story Points", kind: "number" },
  { key: "reporter", defaultName: "Reporter", kind: "text" },
  { key: "parent", defaultName: "Parent (Epic/Feature)", kind: "text" },
  { key: "dueDate", defaultName: "Due Date", kind: "date" },
];

async function autoCreateProject(owner, repoConfig) {
  log("Project not found. Auto-creating...");

  const ownerId = await getOwnerNodeId(owner);
  if (!ownerId) {
    throw new Error(`Cannot resolve owner node ID for "${owner}". Check permissions.`);
  }

  // Name requirement: "[RepoName] DevForge Project"
  const projectTitle = `${repoName} DevForge Project`;
  const created = await createProjectV2(ownerId, projectTitle);
  log(`Project created: "${projectTitle}" (number ${created.number})`);

  // Fetch newly created project to see existing fields (Status is auto-created by GitHub)
  const project = await getProject(owner, created.number);
  const existingNames = new Set(
    (project?.fields?.nodes || []).map((f) => f?.name?.toLowerCase()).filter(Boolean)
  );

  const fieldMap = repoConfig.fieldMap || {};

  for (const spec of REQUIRED_FIELDS) {
    const name = fieldMap[spec.key] || spec.defaultName;
    if (existingNames.has(name.toLowerCase())) {
      log(`  = Field exists: ${name} (skip)`);
      continue;
    }

    if (spec.kind === "single_select") {
      await addSingleSelectField(project.id, name, spec.options);
    } else if (spec.kind === "number") {
      await addNumberField(project.id, name);
    } else if (spec.kind === "text") {
      await addTextField(project.id, name);
    } else if (spec.kind === "date") {
      await addDateField(project.id, name);
    }
    log(`  + Field created: ${name}`);
  }

  const refreshed = await getProject(owner, created.number);
  await ensureStatusFieldOptions(refreshed, repoConfig);

  // Auto-save projectNumber back to config
  try {
    const rawConfig = await fs.readFile(configPath, "utf8");
    const configObj = JSON.parse(rawConfig);
    const target = configObj.default || (configObj.default = {});
    target.projectNumber = created.number;
    if (!target.projectOwner) target.projectOwner = owner;
    await fs.writeFile(configPath, JSON.stringify(configObj, null, 2) + "\n", "utf8");
    log(`  projects-map.json updated: projectNumber=${created.number}, projectOwner=${owner}`);
  } catch (e) {
    log(`  Could not auto-save projectNumber to config: ${e.message}`);
    log(`  Manually set "projectNumber": ${created.number} in projects-map.json`);
  }

  log("");
  log("NOTE: Status field configured with DevForge workflow columns.");
  log("'Sprint' (iteration) field must be created manually in Project Settings if needed.");

  return created;
}

function getFieldByName(project, fieldName) {
  if (!project || !fieldName) return null;
  const fields = project.fields?.nodes || [];
  return fields.find((f) => f?.name?.toLowerCase() === fieldName.toLowerCase()) || null;
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

function resolveProjectField(project, key, fieldMap = {}) {
  const configured = fieldMap[key];
  const candidates = [];
  if (configured) candidates.push(configured);
  candidates.push(...(FIELD_NAME_ALIASES[key] || []));

  for (const name of candidates) {
    const found = getFieldByName(project, name);
    if (found) return found;
  }
  return null;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const OPTION_ALIASES = {
  status: {
    Backlog: ["backlog"],
    "To do": ["to do", "todo", "a fazer"],
    "In progress": ["in progress", "em progresso"],
    "In tests": ["in tests", "em testes"],
    "In revision": ["in revision", "em revisao", "em revisão"],
    Done: ["done", "feito", "concluido", "concluído"],
    "Functional Refinement": ["functional refinement", "refinamento funcional"],
    "Technical Refinement": ["technical refinement", "refinamento tecnico", "refinamento técnico"],
  },
  type: {
    Epic: ["epic", "epico", "épico"],
    Feature: ["feature", "feat", "funcionalidade"],
    Story: ["story", "historia", "história", "user story"],
    Task: ["task", "tarefa"],
    Subtask: ["subtask", "sub-task", "sub tarefa", "subtarefa"],
    Bug: ["bug", "defect", "erro"],
  },
  priority: {
    Highest: ["highest", "critical", "critico", "crítico", "urgente", "urgent"],
    High: ["high", "alto", "alta"],
    Medium: ["medium", "medio", "médio", "normal"],
    Low: ["low", "baixo", "baixa"],
  },
};

function resolveMappedOptionValue(fieldKey, value, repoConfig) {
  if (!fieldKey || value === null || value === undefined) return value;
  const raw = String(value);
  const locale = repoConfig?.locale || "en";
  const directMap = repoConfig?.optionMap?.[fieldKey] || {};
  const localeMap = repoConfig?.optionMapByLocale?.[locale]?.[fieldKey] || {};
  return localeMap[raw] ?? directMap[raw] ?? value;
}

function buildOptionCandidates(fieldKey, value, repoConfig) {
  const mapped = resolveMappedOptionValue(fieldKey, value, repoConfig);
  const candidates = [String(mapped), String(value)];
  const aliasesByField = OPTION_ALIASES[fieldKey] || {};
  const normalizedInput = normalizeText(mapped);

  for (const [canonical, aliases] of Object.entries(aliasesByField)) {
    const normalizedAliases = [canonical, ...aliases].map(normalizeText);
    if (normalizedAliases.includes(normalizedInput)) {
      candidates.push(canonical, ...aliases);
      break;
    }
  }

  // de-duplicate preserving order
  const seen = new Set();
  return candidates.filter((c) => {
    const key = normalizeText(c);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickSingleSelectOption(field, value, context = {}) {
  if (!value || !field?.options?.length) return "";
  const candidates = buildOptionCandidates(context.fieldKey, value, context.repoConfig);
  const options = field.options || [];

  for (const wanted of candidates) {
    const exact = options.find((o) => normalizeText(o.name) === normalizeText(wanted));
    if (exact) return exact.id;
  }

  for (const wanted of candidates) {
    const fuzzy = options.find((o) => normalizeText(o.name).includes(normalizeText(wanted)));
    if (fuzzy) return fuzzy.id;
  }

  return "";
}

function pickIterationOption(field, value) {
  if (!value || !field?.configuration?.iterations?.length) return "";
  const wanted = value.toLowerCase();
  const iterations = field.configuration.iterations;
  const exact = iterations.find((it) => it.title.toLowerCase() === wanted);
  if (exact) return exact.id;
  const fuzzy = iterations.find((it) => it.title.toLowerCase().includes(wanted));
  return fuzzy?.id || "";
}

async function updateProjectField(projectId, itemId, field, value, context = {}) {
  if (!value || !field) return;

  let fieldValue = null;

  if (field.__typename === "ProjectV2SingleSelectField") {
    const optionId = pickSingleSelectOption(field, String(value), context);
    if (!optionId) return;
    fieldValue = { singleSelectOptionId: optionId };
  } else if (field.__typename === "ProjectV2IterationField") {
    const iterationId = pickIterationOption(field, String(value));
    if (!iterationId) return;
    fieldValue = { iterationId };
  } else if (field.__typename === "ProjectV2Field") {
    if (field.dataType === "DATE") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
      fieldValue = { date: value };
    } else if (field.dataType === "NUMBER") {
      const n = Number(value);
      if (isNaN(n)) return;
      fieldValue = { number: n };
    } else {
      fieldValue = { text: String(value) };
    }
  }

  if (!fieldValue) return;

  await graphql(
    `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
      updateProjectV2ItemFieldValue(input: { projectId: $projectId, itemId: $itemId, fieldId: $fieldId, value: $value }) { projectV2Item { id } }
    }`,
    { projectId, itemId, fieldId: field.id, value: fieldValue }
  );
}

async function findProjectItem(projectId, issueId) {
  const data = await graphql(
    `query($projectId: ID!) { node(id: $projectId) { ... on ProjectV2 { items(first: 200) { nodes { id content { ... on Issue { id } } } } } } }`,
    { projectId }
  );
  const nodes = data.node?.items?.nodes || [];
  const found = nodes.find((item) => item.content?.id === issueId);
  return found?.id || null;
}

async function addProjectItem(projectId, issueId) {
  const data = await graphql(
    `mutation($projectId: ID!, $contentId: ID!) { addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) { item { id } } }`,
    { projectId, contentId: issueId }
  );
  return data.addProjectV2ItemById.item.id;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

async function readConfig() {
  try {
    const content = await fs.readFile(configPath, "utf8");
    return JSON.parse(content);
  } catch {
    return { default: { fieldMap: {}, defaults: {} } };
  }
}

async function resolveLabelsFromRepoConfig(repoConfig) {
  // Backward compatible:
  // - legacy: `projects-map.json.default.labels` (array of label names)
  // - new: `projects-map.json.default.labelsFile` + `locale` (loads labels from JSON file)
  if (Array.isArray(repoConfig.labels)) return repoConfig.labels;

  const labelsFile = repoConfig.labelsFile;
  if (!labelsFile) return [];

  const locale = repoConfig.locale || "en";
  const resolvedFileName = labelsFile.includes("{locale}")
    ? labelsFile.replaceAll("{locale}", locale)
    : labelsFile;

  const fullPath = path.isAbsolute(resolvedFileName)
    ? resolvedFileName
    : path.join(cardsRoot, "config", resolvedFileName);

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Dry-run table output
// ---------------------------------------------------------------------------

function printDryRunTable(cards, edges) {
  log("");
  log("=== DRY-RUN REPORT ===");
  log("");

  const header = "| Card ID                | Type     | Action | Parent              | Categories              |";
  const sep =    "|------------------------|----------|--------|---------------------|-------------------------|";
  log(header);
  log(sep);

  for (const card of cards) {
    const id = card.cardId.padEnd(22);
    const type = (card.type || "Story").padEnd(8);
    const action = "CREATE ".padEnd(6);
    const parent = (card.parent || "—").padEnd(19);
    const cats = (card.categories || []).join(", ").slice(0, 23).padEnd(23);
    log(`| ${id} | ${type} | ${action} | ${parent} | ${cats} |`);
  }

  log("");
  log(`Total cards: ${cards.length}`);
  log(`Total parent-child links: ${edges.length}`);

  if (edges.length) {
    log("");
    log("Hierarchy:");
    for (const edge of edges) {
      log(`  ${edge.parentCardId} -> ${edge.childCardId}`);
    }
  }

  log("");
  log("=== END DRY-RUN ===");
}

// ---------------------------------------------------------------------------
// Forward sync (Markdown -> GitHub)
// ---------------------------------------------------------------------------

async function runForwardSync() {
  const config = await readConfig();
  let repoConfig = resolveRepoConfig(config, repositorySlug);
  const management = await resolveManagementConfig(repoConfig);
  const backend = String(management.backend || "github").toLowerCase();

  log(`Dry-run: ${dryRun ? "yes" : "no"}`);
  log(`Direction: forward`);
  log(`Backend: ${backend}`);

  if (backend === "jira") {
    await runForwardSyncJira(repoConfig, management);
    return;
  }

  if (backend === "azure-devops" || backend === "azure") {
    await runForwardSyncAzure(repoConfig, management);
    return;
  }

  if (backend === "linear") {
    await runForwardSyncLinear(repoConfig, management);
    return;
  }

  if (backend === "gitlab") {
    await runForwardSyncGitLab(repoConfig, management);
    return;
  }

  if (backend === "github") {
    if (!dryRun) {
      if (!repoOwner || repoOwner === "unknown") {
        throw new Error("GITHUB_REPOSITORY not set. Expected: owner/repo");
      }
      if (!token) {
        throw new Error("Token missing. Set GITHUB_TOKEN or PROJECT_SYNC_TOKEN");
      }
    }

    log(`Repository: ${repoOwner}/${repoName}`);
    log(`Token source: ${tokenSource}`);
  }

  const defaults = repoConfig.defaults || {};
  const fieldMap = repoConfig.fieldMap || {};

  let projectOwner = process.env.PROJECT_OWNER || repoConfig.projectOwner || repoOwner;
  let projectNumber =
    Number(process.env.PROJECT_NUMBER || "0") || Number(repoConfig.projectNumber || "0");

  if (backend === "github" && token && repoOwner !== "unknown" && projectNumber <= 0) {
    try {
      const discovery = await discoverGitHubProjectNumber({
        token,
        owner: repoOwner,
        repoName,
        repoConfig,
        configPath,
        repositorySlug,
      });
      if (discovery.discovered) {
        log(`Auto-discovered GitHub Project #${discovery.projectNumber}: "${discovery.projectTitle}"`);
        const freshConfig = await readConfig();
        repoConfig = resolveRepoConfig(freshConfig, repositorySlug);
        projectOwner = process.env.PROJECT_OWNER || repoConfig.projectOwner || repoOwner;
        projectNumber =
          Number(process.env.PROJECT_NUMBER || "0") || Number(repoConfig.projectNumber || "0");
      } else if (discovery.reason === "ambiguous") {
        log("Multiple GitHub Projects found — set projectNumber in projects-map.json");
        for (const c of discovery.candidates || []) {
          log(`  candidate: #${c.number} ${c.title}`);
        }
      }
    } catch (error) {
      log(`Project auto-discovery skipped: ${error.message}`);
    }
  }

  // Override createMissingLabels from config if set
  if (repoConfig.createMissingLabels !== undefined) {
    createMissingLabels = Boolean(repoConfig.createMissingLabels);
  }

  // Pre-provision all labels from config (ensures they exist before card sync)
  const configLabels = await resolveLabelsFromRepoConfig(repoConfig);
  if (configLabels.length && createMissingLabels && !dryRun && token) {
    log(`Provisioning ${configLabels.length} labels...`);
    let created = 0;
    for (const labelName of configLabels) {
      const id = await getLabelId(repoOwner, repoName, labelName, true);
      if (id) created++;
    }
    log(`Labels ready (${created} verified/created).`);
  }

  const allMd = await listMarkdownFiles(cardsRoot);
  if (!allMd.length) {
    log("No card files found in .github/cards/");
    return;
  }

  const cards = [];
  for (const file of allMd) {
    const relative = path.relative(workspaceRoot, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf8");
    const card = parseCardFile(content, relative);
    if (card) {
      cards.push(card);
    } else {
      log(`SKIP (no frontmatter/card_id): ${relative}`);
    }
  }

  if (!cards.length) {
    log("No valid cards found (all files missing YAML frontmatter with card_id).");
    return;
  }

  const onlyIds = parseOnlyFilter();
  const cardsToSync = onlyIds?.length ? expandCardIdsWithParents(cards, onlyIds) : cards;
  if (onlyIds?.length) {
    log(`Incremental sync: ${onlyIds.length} target(s) → ${cardsToSync.length} card(s) including parents`);
  }

  log(`Valid cards: ${cardsToSync.length}${onlyIds?.length ? ` (of ${cards.length} total)` : ""}`);

  const edges = filterEdgesForCards(buildEdges(cardsToSync), cardsToSync.map((c) => c.cardId));
  log(`Parent-child links: ${edges.length}`);

  if (dryRun && !token) {
    printDryRunTable(cardsToSync, edges);
    return;
  }

  // --- Real sync ---
  const repositoryId = await getRepositoryNodeId(repoOwner, repoName);
  const issueByCardId = new Map();
  const issueExistedByCardId = new Map();
  const actions = [];

  for (const card of cardsToSync) {
    const issueTitle = buildIssueTitle(card);
    const issueBody = buildIssueBody(card);

    const existing = await searchIssueByCardId(repoOwner, repoName, card.cardId);

    if (dryRun) {
      actions.push({ action: existing ? "UPDATE" : "CREATE", cardId: card.cardId, title: issueTitle });
      issueByCardId.set(card.cardId, existing || { id: `DRY-${card.cardId}`, number: 0 });
      issueExistedByCardId.set(card.cardId, Boolean(existing));
      continue;
    }

    const issue = existing
      ? await updateIssue(existing.id, issueTitle, issueBody)
      : await createIssue(repositoryId, issueTitle, issueBody);

    issueByCardId.set(card.cardId, issue);
    issueExistedByCardId.set(card.cardId, Boolean(existing));
    actions.push({
      action: existing ? "UPDATED" : "CREATED",
      cardId: card.cardId,
      number: issue.number,
      url: issue.url,
    });

    // Set labels from categories
    if (card.categories.length) {
      try {
        await setIssueLabels(issue.id, repoOwner, repoName, card.categories);
      } catch (e) {
        actions.push({ action: "LABELS_FAILED", cardId: card.cardId, reason: e.message });
      }
    }
  }

  // Link sub-issues
  for (const edge of edges) {
    const parentIssue = issueByCardId.get(edge.parentCardId);
    const childIssue = issueByCardId.get(edge.childCardId);
    if (!parentIssue || !childIssue) continue;

    if (!dryRun) {
      try {
        await linkAsSubIssue(parentIssue.id, childIssue.id);
        actions.push({ action: "LINKED", parent: parentIssue.number, child: childIssue.number });
      } catch (e) {
        actions.push({ action: "LINK_FAILED", parent: edge.parentCardId, child: edge.childCardId, reason: e.message });
      }
    }
  }

  // Project field updates
  let project = null;
  if (projectNumber > 0 && !dryRun) {
    project = await getProject(projectOwner, projectNumber);
    if (!project) {
      log(`Project not found: owner=${projectOwner} number=${projectNumber}`);
    } else {
      log(`Project found: owner=${projectOwner} number=${projectNumber}`);
    }
  }

  if (!project && !dryRun) {
    if (projectNumber > 0) {
      log(`Project #${projectNumber} not found — check projectOwner/projectNumber in config.`);
    } else if (repoConfig.autoCreateProject !== false) {
      try {
        const created = await autoCreateProject(projectOwner, repoConfig);
        project = await getProject(projectOwner, created.number);
      } catch (e) {
        log(`Auto-create project failed: ${e.message}`);
      }
    }
  }

  if (project && !dryRun) {
    const fStatus = resolveProjectField(project, "status", fieldMap);
    const fType = resolveProjectField(project, "type", fieldMap);
    const fPriority = resolveProjectField(project, "priority", fieldMap);
    const fSprint = resolveProjectField(project, "sprint", fieldMap);
    const fStoryPoints = resolveProjectField(project, "storyPoints", fieldMap);
    const fReporter = resolveProjectField(project, "reporter", fieldMap);
    const fParent = resolveProjectField(project, "parent", fieldMap);
    const fDueDate = resolveProjectField(project, "dueDate", fieldMap);

    for (const card of cardsToSync) {
      const issue = issueByCardId.get(card.cardId);
      if (!issue) continue;

      let itemId;
      try {
        itemId = await findProjectItem(project.id, issue.id);
        if (!itemId) {
          itemId = await addProjectItem(project.id, issue.id);
          actions.push({ action: "ADDED_TO_PROJECT", cardId: card.cardId });
        }
      } catch (e) {
        actions.push({ action: "PROJECT_ADD_FAILED", cardId: card.cardId, reason: e.message });
        continue;
      }

      try {
        // Safe status behavior:
        // - If card.status is provided: always apply it.
        // - If card.status is missing:
        //   - new issue => apply defaults.status (or Backlog)
        //   - existing issue => preserve manual status (do not overwrite)
        const existed = issueExistedByCardId.get(card.cardId) === true;
        const desiredStatus =
          card.status ??
          (existed ? null : (defaults.status || "Backlog"));

        await updateProjectField(project.id, itemId, fStatus, desiredStatus, { fieldKey: "status", repoConfig });
        await updateProjectField(project.id, itemId, fType, card.type, { fieldKey: "type", repoConfig });
        await updateProjectField(project.id, itemId, fPriority, card.priority, { fieldKey: "priority", repoConfig });
        await updateProjectField(project.id, itemId, fSprint, card.sprint);
        await updateProjectField(project.id, itemId, fStoryPoints, card.storyPoints);
        await updateProjectField(project.id, itemId, fReporter, card.reporter);
        await updateProjectField(project.id, itemId, fParent, card.parent);
        await updateProjectField(project.id, itemId, fDueDate, card.dueDate);
      } catch (e) {
        actions.push({ action: "FIELD_UPDATE_FAILED", cardId: card.cardId, reason: e.message });
      }
    }
  }

  // Print summary
  if (dryRun) {
    printDryRunTable(cardsToSync, edges);
  } else {
    log("");
    log("=== SYNC COMPLETE ===");
    for (const a of actions) {
      log(JSON.stringify(a));
    }

    try {
      const summaryPath = await writeSyncSummary({
        workspaceRoot,
        repositorySlug,
        projectOwner,
        projectNumber: projectNumber > 0 ? projectNumber : null,
        actions,
        cardCount: cardsToSync.length,
        incrementalIds: onlyIds,
      });
      log(`Summary written: ${path.relative(workspaceRoot, summaryPath)}`);
    } catch (error) {
      log(`Could not write sync summary: ${error.message}`);
    }
  }
}

function encodeJiraAuth(email, tokenValue) {
  return Buffer.from(`${email}:${tokenValue}`).toString("base64");
}

async function jiraRequest(management, endpoint, method = "GET", body = null) {
  const baseUrl = String(management.jiraUrl || "").replace(/\/+$/, "");
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    Authorization: `Basic ${encodeJiraAuth(management.jiraEmail, management.jiraApiToken)}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payloadText = await response.text();
  let payload = null;
  try {
    payload = payloadText ? JSON.parse(payloadText) : {};
  } catch {
    payload = { raw: payloadText };
  }
  if (!response.ok) {
    throw new Error(`Jira request failed (${response.status} ${response.statusText}): ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function jiraSearchIssueByCardId(management, projectKey, cardId) {
  const jql = `project = "${projectKey}" AND description ~ "\\"CARD_ID: ${cardId}\\"" ORDER BY updated DESC`;
  const data = await jiraRequest(
    management,
    `/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=1&fields=summary,labels`,
    "GET"
  );
  return data.issues?.[0] || null;
}

async function jiraCreateIssue(management, projectKey, card) {
  const body = {
    fields: {
      project: { key: projectKey },
      issuetype: { name: management.jiraIssueType || "Task" },
      summary: buildIssueTitle(card),
      description: buildJiraDescription(card),
      labels: card.categories || [],
    },
  };
  return jiraRequest(management, "/rest/api/2/issue", "POST", body);
}

async function jiraUpdateIssue(management, issueKey, card) {
  const body = {
    fields: {
      summary: buildIssueTitle(card),
      description: buildJiraDescription(card),
      labels: card.categories || [],
    },
  };
  await jiraRequest(management, `/rest/api/2/issue/${issueKey}`, "PUT", body);
}

function pickJiraTransition(transitions, targetStatus, repoConfig = {}) {
  if (!targetStatus || !Array.isArray(transitions)) return null;

  const candidates = buildOptionCandidates("status", targetStatus, repoConfig);

  for (const candidate of candidates) {
    const norm = normalizeText(candidate);
    const match = transitions.find((transition) => {
      const toName = normalizeText(transition.to?.name || "");
      const transitionName = normalizeText(transition.name || "");
      return toName === norm || transitionName === norm;
    });
    if (match) return match;
  }

  return null;
}

async function jiraGetTransitions(management, issueKey) {
  const data = await jiraRequest(management, `/rest/api/2/issue/${issueKey}/transitions`, "GET");
  return data.transitions || [];
}

async function jiraApplyStatusTransition(management, issueKey, targetStatus, repoConfig) {
  if (!targetStatus) return { applied: false, reason: "no_status" };

  const transitions = await jiraGetTransitions(management, issueKey);
  const match = pickJiraTransition(transitions, targetStatus, repoConfig);

  if (!match) {
    return {
      applied: false,
      reason: "no_matching_transition",
      targetStatus,
      available: transitions.map((t) => t.to?.name || t.name).filter(Boolean),
    };
  }

  await jiraRequest(management, `/rest/api/2/issue/${issueKey}/transitions`, "POST", {
    transition: { id: match.id },
  });

  return { applied: true, transition: match.name, to: match.to?.name || null };
}

async function jiraLinkIssues(management, inwardKey, outwardKey) {
  const body = {
    type: { name: "Relates" },
    inwardIssue: { key: inwardKey },
    outwardIssue: { key: outwardKey },
  };
  await jiraRequest(management, "/rest/api/2/issueLink", "POST", body);
}

async function runForwardSyncJira(repoConfig, management) {
  if (!management.jiraUrl || !management.jiraProjectKey || !management.jiraEmail || !management.jiraApiToken) {
    throw new Error(
      "Jira backend requires JIRA_URL, JIRA_PROJECT_KEY, JIRA_EMAIL, and JIRA_API_TOKEN (env or config)."
    );
  }

  const allMd = await listMarkdownFiles(cardsRoot);
  if (!allMd.length) {
    log("No card files found in .github/cards/");
    return;
  }

  const cards = [];
  for (const file of allMd) {
    const relative = path.relative(workspaceRoot, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf8");
    const card = parseCardFile(content, relative);
    if (card) cards.push(card);
    else log(`SKIP (no frontmatter/card_id): ${relative}`);
  }

  if (!cards.length) {
    log("No valid cards found (all files missing YAML frontmatter with card_id).");
    return;
  }

  const edges = buildEdges(cards);
  log(`Valid cards: ${cards.length}`);
  log(`Parent-child links: ${edges.length}`);

  if (dryRun) {
    printDryRunTable(cards, edges);
    log("Dry-run in Jira mode: no remote changes applied.");
    return;
  }

  const actions = [];
  const issueByCardId = new Map();

  for (const card of cards) {
    const existing = await jiraSearchIssueByCardId(management, management.jiraProjectKey, card.cardId);
    let issueKey;
    if (existing) {
      await jiraUpdateIssue(management, existing.key, card);
      issueKey = existing.key;
      issueByCardId.set(card.cardId, issueKey);
      actions.push({ action: "UPDATED", cardId: card.cardId, issueKey });
    } else {
      const created = await jiraCreateIssue(management, management.jiraProjectKey, card);
      issueKey = created.key;
      issueByCardId.set(card.cardId, issueKey);
      actions.push({ action: "CREATED", cardId: card.cardId, issueKey });
    }

    if (card.status) {
      const transitionResult = await jiraApplyStatusTransition(
        management,
        issueKey,
        card.status,
        repoConfig
      );
      actions.push({
        action: transitionResult.applied ? "STATUS_TRANSITIONED" : "STATUS_SKIPPED",
        cardId: card.cardId,
        issueKey,
        status: card.status,
        ...transitionResult,
      });
    }
  }

  for (const edge of edges) {
    const parentKey = issueByCardId.get(edge.parentCardId);
    const childKey = issueByCardId.get(edge.childCardId);
    if (!parentKey || !childKey) continue;
    try {
      await jiraLinkIssues(management, parentKey, childKey);
      actions.push({ action: "LINKED", parent: parentKey, child: childKey });
    } catch (error) {
      actions.push({ action: "LINK_FAILED", parent: parentKey, child: childKey, reason: error.message });
    }
  }

  log("");
  log("=== JIRA SYNC COMPLETE ===");
  for (const action of actions) {
    log(JSON.stringify(action));
  }
}

// ---------------------------------------------------------------------------
// Forward adapters (Azure DevOps / Linear / GitLab)
// ---------------------------------------------------------------------------

function buildRemoteDescriptionFromCard(card) {
  // Reuse the same metadata block for idempotent search across backends.
  // Only Jira reverse sync is implemented; others are currently "forward best-effort".
  return buildJiraDescription(card);
}

function basicAuthHeaderFromPat(pat) {
  return Buffer.from(`:${pat}`).toString("base64");
}

function linearCardSearchMarker(card) {
  return `CARD_ID: ${card.cardId}`;
}

function gitlabCardSearchTerm(card) {
  return `CARD_ID: ${card.cardId}`;
}

function buildAzureWiqlForCardId(cardId) {
  // WIQL supports searching by substring in fields like System.Description.
  return `SELECT [System.Id] FROM WorkItems WHERE [System.Description] CONTAINS 'CARD_ID: ${cardId}' ORDER BY [System.Changed Date] DESC`;
}

async function runForwardSyncAzure(repoConfig, management) {
  if (!management.azureOrgUrl || !management.azureProject || !management.azurePat) {
    throw new Error("Azure DevOps backend requires AZDO_ORG_URL, AZDO_PROJECT, and AZDO_PAT (env or config).");
  }

  const baseUrl = String(management.azureOrgUrl).replace(/\/+$/, "");
  const project = String(management.azureProject);
  const workItemType = String(management.azureWorkItemType || "Task");

  const auth = basicAuthHeaderFromPat(management.azurePat);

  async function azureRequest(endpoint, method = "GET", body = undefined) {
    const url = `${baseUrl}/${encodeURIComponent(project)}${endpoint}`;
    const headers = {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }
    if (!response.ok) {
      throw new Error(`Azure request failed (${response.status} ${response.statusText}): ${JSON.stringify(payload)}`);
    }
    return payload;
  }

  async function azureFindWorkItemIdByCardId(cardId) {
    const wiql = buildAzureWiqlForCardId(cardId);
    const data = await azureRequest(
      `/_apis/wit/wiql?api-version=7.0`,
      "POST",
      { query: wiql }
    );
    const id = data?.workItems?.[0]?.id;
    return id || null;
  }

  async function azureCreateWorkItem(card) {
    const title = buildIssueTitle(card);
    const description = buildRemoteDescriptionFromCard(card);
    const ops = [
      { op: "add", path: "/fields/System.Title", value: title },
      { op: "add", path: "/fields/System.Description", value: description },
    ];

    const data = await azureRequest(
      `/_apis/wit/workitems/${encodeURIComponent(workItemType)}?api-version=7.0`,
      "POST",
      ops
    );
    return data?.id || null;
  }

  async function azureUpdateWorkItem(id, card) {
    const title = buildIssueTitle(card);
    const description = buildRemoteDescriptionFromCard(card);
    const ops = [
      { op: "add", path: "/fields/System.Title", value: title },
      { op: "add", path: "/fields/System.Description", value: description },
    ];

    await azureRequest(`/_apis/wit/workitems/${id}?api-version=7.0`, "PATCH", ops);
  }

  const allMd = await listMarkdownFiles(cardsRoot);
  const cards = [];
  for (const file of allMd) {
    const relative = path.relative(workspaceRoot, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf8");
    const card = parseCardFile(content, relative);
    if (card) cards.push(card);
  }

  if (!cards.length) {
    log("No valid cards found for Azure mode.");
    return;
  }

  log("Dry-run in Azure mode depends on your DRY_RUN/--dry-run env; no GitHub side-effects.");

  const actions = [];
  for (const card of cards) {
    const existingId = await azureFindWorkItemIdByCardId(card.cardId);
    if (dryRun) {
      actions.push({ action: existingId ? "UPDATE" : "CREATE", cardId: card.cardId, workItemId: existingId || null });
      continue;
    }
    if (existingId) {
      await azureUpdateWorkItem(existingId, card);
      actions.push({ action: "UPDATED", cardId: card.cardId, workItemId: existingId });
    } else {
      const createdId = await azureCreateWorkItem(card);
      actions.push({ action: "CREATED", cardId: card.cardId, workItemId: createdId });
    }
  }

  log("");
  log("=== AZURE DEVOPS SYNC COMPLETE ===");
  for (const a of actions) log(JSON.stringify(a));
}

async function runForwardSyncGitLab(repoConfig, management) {
  if (!management.gitlabProjectId || !management.gitlabToken) {
    throw new Error("GitLab backend requires GITLAB_PROJECT_ID and GITLAB_TOKEN (env or config).");
  }

  const projectId = management.gitlabProjectId;
  const token = management.gitlabToken;
  const gitlabBase = management.gitlabUrl || "https://gitlab.com";

  const headers = {
    "PRIVATE-TOKEN": token,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  async function gitlabRequest(endpoint, method = "GET", body = undefined) {
    const url = `${gitlabBase.replace(/\/+$/, "")}${endpoint}`;
    const response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await response.text();
    let payload = null;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }
    if (!response.ok) {
      throw new Error(`GitLab request failed (${response.status} ${response.statusText}): ${JSON.stringify(payload)}`);
    }
    return payload;
  }

  async function gitlabFindIssueByCardId(card) {
    const term = gitlabCardSearchTerm(card);
    const data = await gitlabRequest(
      `/api/v4/projects/${encodeURIComponent(projectId)}/issues?search=${encodeURIComponent(term)}&state=opened&per_page=1`,
      "GET"
    );
    return data?.[0] || null;
  }

  async function gitlabCreateIssue(card) {
    const title = buildIssueTitle(card);
    const description = buildRemoteDescriptionFromCard(card);
    const labels = card.categories || [];
    const data = await gitlabRequest(
      `/api/v4/projects/${encodeURIComponent(projectId)}/issues`,
      "POST",
      { title, description, labels }
    );
    return data;
  }

  async function gitlabUpdateIssue(iid, card) {
    const title = buildIssueTitle(card);
    const description = buildRemoteDescriptionFromCard(card);
    const labels = card.categories || [];
    await gitlabRequest(
      `/api/v4/projects/${encodeURIComponent(projectId)}/issues/${encodeURIComponent(iid)}`,
      "PUT",
      { title, description, labels }
    );
  }

  const allMd = await listMarkdownFiles(cardsRoot);
  const cards = [];
  for (const file of allMd) {
    const relative = path.relative(workspaceRoot, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf8");
    const card = parseCardFile(content, relative);
    if (card) cards.push(card);
  }

  if (!cards.length) {
    log("No valid cards found for GitLab mode.");
    return;
  }

  const actions = [];
  for (const card of cards) {
    const existing = await gitlabFindIssueByCardId(card);
    if (dryRun) {
      actions.push({ action: existing ? "UPDATE" : "CREATE", cardId: card.cardId, gitlabIssueIid: existing?.iid || null });
      continue;
    }
    if (existing) {
      await gitlabUpdateIssue(existing.iid, card);
      actions.push({ action: "UPDATED", cardId: card.cardId, gitlabIssueIid: existing.iid });
    } else {
      const created = await gitlabCreateIssue(card);
      actions.push({ action: "CREATED", cardId: card.cardId, gitlabIssueIid: created?.iid || null });
    }
  }

  log("");
  log("=== GITLAB SYNC COMPLETE ===");
  for (const a of actions) log(JSON.stringify(a));
}

async function runForwardSyncLinear(repoConfig, management) {
  if (!management.linearTeamId || !management.linearApiToken) {
    throw new Error("Linear backend requires LINEAR_TEAM_ID and LINEAR_API_TOKEN (env or config).");
  }

  const endpoint = "https://api.linear.app/graphql";
  const teamId = management.linearTeamId;
  const apiToken = management.linearApiToken;

  async function linearGraphql(query, variables = {}) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors) {
      const details = JSON.stringify(payload.errors || payload, null, 2);
      throw new Error(`Linear GraphQL failed: ${details}`);
    }
    return payload.data;
  }

  const searchMarker = (cardId) => `CARD_ID: ${cardId}`;

  async function linearFindIssueIdByCardId(cardId) {
    // Best-effort: filter issues by description containing our metadata marker.
    const query = `query($teamId: String!, $marker: String!) {
      team(id: $teamId) {
        issues(first: 1, filter: { description: { containsIgnoreCase: $marker } }) {
          nodes { id title description updatedAt }
        }
      }
    }`;

    const data = await linearGraphql(query, { teamId, marker: searchMarker(cardId) });
    return data?.team?.issues?.nodes?.[0]?.id || null;
  }

  async function linearCreateIssue(card) {
    const query = `mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id title }
      }
    }`;

    const input = {
      teamId,
      title: buildIssueTitle(card),
      description: buildRemoteDescriptionFromCard(card),
    };

    const data = await linearGraphql(query, { input });
    return data?.issueCreate?.issue?.id || null;
  }

  async function linearUpdateIssue(issueId, card) {
    const query = `mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue { id title }
      }
    }`;

    const input = {
      title: buildIssueTitle(card),
      description: buildRemoteDescriptionFromCard(card),
    };

    await linearGraphql(query, { id: issueId, input });
  }

  const allMd = await listMarkdownFiles(cardsRoot);
  const cards = [];
  for (const file of allMd) {
    const relative = path.relative(workspaceRoot, file).replace(/\\/g, "/");
    const content = await fs.readFile(file, "utf8");
    const card = parseCardFile(content, relative);
    if (card) cards.push(card);
  }

  if (!cards.length) {
    log("No valid cards found for Linear mode.");
    return;
  }

  const actions = [];
  for (const card of cards) {
    const existingId = await linearFindIssueIdByCardId(card.cardId);
    if (dryRun) {
      actions.push({ action: existingId ? "UPDATE" : "CREATE", cardId: card.cardId, linearIssueId: existingId || null });
      continue;
    }
    if (existingId) {
      await linearUpdateIssue(existingId, card);
      actions.push({ action: "UPDATED", cardId: card.cardId, linearIssueId: existingId });
    } else {
      const createdId = await linearCreateIssue(card);
      actions.push({ action: "CREATED", cardId: card.cardId, linearIssueId: createdId });
    }
  }

  log("");
  log("=== LINEAR SYNC COMPLETE ===");
  for (const a of actions) log(JSON.stringify(a));
}

// ---------------------------------------------------------------------------
// Reverse sync (Backend -> Markdown)
// ---------------------------------------------------------------------------

function parseSyncMetadataFromDescription(description) {
  const text = String(description || "");
  const metaMatch = text.match(/<!-- SYNC_METADATA[\s\S]*?-->\s*([\s\S]*?)\s*<!-- \/SYNC_METADATA -->/);
  if (!metaMatch) return null;

  const metaBlock = metaMatch[1];
  const meta = {};
  for (const line of metaBlock.split("\n")) {
    const trimmed = String(line || "").trim();
    if (!trimmed) continue;
    const kv = trimmed.match(/^([A-Z_]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    meta[kv[1]] = kv[2].trim();
  }

  const bodyContent = text
    .replace(/\n---\n<!-- SYNC_METADATA[\s\S]*?<!-- \/SYNC_METADATA -->/m, "")
    .trimEnd();

  return { meta, bodyContent };
}

function parseIssueSummaryTypeTitle(summary) {
  const s = String(summary || "").trim();
  const m = s.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (!m) return { type: "Story", title: s || "Untitled" };
  return { type: m[1].trim(), title: m[2].trim() || "Untitled" };
}

function yamlQuote(value) {
  const s = String(value ?? "");
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function yamlNullIfEmpty(value) {
  const s = String(value ?? "").trim();
  return s === "" ? "null" : yamlQuote(s);
}

function yamlNullIfEmptyNumber(value) {
  const s = String(value ?? "").trim();
  if (s === "") return "null";
  const n = Number(s);
  return Number.isFinite(n) ? String(n) : "null";
}

function jiraIssueToCardMarkdown(issue) {
  const desc = issue?.fields?.description || "";
  const parsed = parseSyncMetadataFromDescription(desc);
  if (!parsed) return null;

  const meta = parsed.meta || {};
  const { type, title } = parseIssueSummaryTypeTitle(issue?.fields?.summary);

  const cardId = meta.CARD_ID || null;
  const sourceFile = meta.SOURCE_FILE || null;
  if (!cardId || !sourceFile) return null;

  const categoriesFromMeta = meta.CATEGORIES
    ? meta.CATEGORIES.split(",").map((x) => x.trim()).filter(Boolean)
    : null;
  const categories = Array.isArray(issue?.fields?.labels) ? issue.fields.labels : categoriesFromMeta || [];

  const typeValue = meta.TYPE || type;
  const storyPointsYaml = yamlNullIfEmptyNumber(meta.STORY_POINTS);

  const yaml = [];
  yaml.push("---");
  yaml.push(`card_id: ${yamlQuote(cardId)}`);
  yaml.push(`title: ${yamlQuote(title)}`);
  yaml.push(`status: ${yamlNullIfEmpty(meta.STATUS)}`);
  yaml.push(`type: ${yamlQuote(typeValue)}`);
  yaml.push(`priority: ${yamlNullIfEmpty(meta.PRIORITY)}`);
  yaml.push(`sprint: ${yamlNullIfEmpty(meta.SPRINT)}`);
  yaml.push(`story_points: ${storyPointsYaml}`);
  yaml.push(`reporter: ${yamlNullIfEmpty(meta.REPORTER)}`);
  yaml.push(`parent: ${yamlNullIfEmpty(meta.PARENT_CARD_ID)}`);
  yaml.push(`due_date: ${yamlNullIfEmpty(meta.DUE_DATE)}`);

  if (categories.length) {
    yaml.push("categories:");
    for (const c of categories) yaml.push(`  - ${yamlQuote(c)}`);
  } else {
    yaml.push("categories: []");
  }

  yaml.push("---");
  yaml.push("");
  yaml.push(parsed.bodyContent.trimEnd());
  yaml.push("");

  return { sourceFile, markdown: yaml.join("\n") };
}

async function runReverseSyncJira(management) {
  if (!management.jiraUrl || !management.jiraProjectKey || !management.jiraEmail || !management.jiraApiToken) {
    throw new Error(
      "Jira backend requires JIRA_URL, JIRA_PROJECT_KEY, JIRA_EMAIL, and JIRA_API_TOKEN (env or config)."
    );
  }

  log(`Backend: jira`);
  log(`Dry-run: ${dryRun ? "yes" : "no"}`);
  log("Direction: reverse (Jira -> Markdown)");

  const jql = `project = "${management.jiraProjectKey}" AND description ~ "\\"CARD_ID:\\"" ORDER BY updated DESC`;
  const maxResults = 50;
  let startAt = 0;
  const issues = [];

  while (true) {
    const data = await jiraRequest(
      management,
      `/rest/api/2/search?jql=${encodeURIComponent(jql)}&startAt=${startAt}&maxResults=${maxResults}&fields=summary,description,labels`,
      "GET"
    );

    const batch = data.issues || [];
    issues.push(...batch);

    startAt = Number(data.startAt ?? 0) + batch.length;
    const total = Number(data.total ?? issues.length);
    if (!batch.length || startAt >= total) break;
  }

  if (!issues.length) {
    log("No Jira issues with CARD_ID found.");
    return;
  }

  log(`Jira issues found: ${issues.length}`);

  let written = 0;
  for (const issue of issues) {
    const converted = jiraIssueToCardMarkdown(issue);
    if (!converted) continue;

    const { sourceFile, markdown } = converted;
    const targetPath = path.join(workspaceRoot, sourceFile);

    if (dryRun) {
      log(`Would write: ${sourceFile} (Jira issue)`);
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, markdown, "utf8");
    written++;
  }

  if (!dryRun) log(`Jira reverse sync wrote: ${written} file(s)`);
}

async function runReverseSync() {
  const config = await readConfig();
  const repoConfig = resolveRepoConfig(config, repositorySlug);
  const management = await resolveManagementConfig(repoConfig);
  const backend = String(management.backend || "github").toLowerCase();

  if (backend === "jira") {
    await runReverseSyncJira(management);
    return;
  }

  // Default: GitHub reverse sync
  if (!repoOwner || repoOwner === "unknown") {
    throw new Error("GITHUB_REPOSITORY not set.");
  }
  if (!token) {
    throw new Error("Token missing.");
  }

  log(`Repository: ${repoOwner}/${repoName}`);
  log(`Dry-run: ${dryRun ? "yes" : "no"}`);
  log("Direction: reverse (GitHub -> Markdown)");

  const query = `repo:${repoOwner}/${repoName} in:body "CARD_ID:" is:issue`;
  let issues = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const data = await graphql(
      `query($query: String!, $endCursor: String) {
        search(type: ISSUE, query: $query, first: 50, after: $endCursor) {
          pageInfo { hasNextPage endCursor }
          nodes { ... on Issue { id number title body url updatedAt } }
        }
      }`,
      { query, endCursor }
    );
    issues.push(...(data.search?.nodes || []));
    hasNextPage = Boolean(data.search?.pageInfo?.hasNextPage);
    endCursor = data.search?.pageInfo?.endCursor || null;
  }

  if (!issues.length) {
    log("No issues with CARD_ID found.");
    return;
  }

  log(`Issues found: ${issues.length}`);

  for (const issue of issues) {
    const metaMatch = issue.body?.match(/<!-- SYNC_METADATA.*?-->\r?\n([\s\S]*?)\r?\n<!-- \/SYNC_METADATA -->/);
    if (!metaMatch) continue;

    const metaLines = metaMatch[1];
    const sourceFile = metaLines.match(/SOURCE_FILE:\s*(.+)/)?.[1]?.trim();

    if (!sourceFile) continue;

    const bodyContent = issue.body.replace(/\n---\n<!-- SYNC_METADATA[\s\S]*<!-- \/SYNC_METADATA -->/, "").trim();
    const targetPath = path.join(workspaceRoot, sourceFile);

    if (dryRun) {
      log(`Would write: ${sourceFile} (issue #${issue.number})`);
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, `${bodyContent}\n`, "utf8");
    log(`Written: ${sourceFile} (issue #${issue.number})`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (syncDirection === "reverse") {
    await runReverseSync();
  } else {
    await runForwardSync();
  }
}

const directRunPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const currentFilePath = fileURLToPath(import.meta.url);
const isDirectRun = directRunPath === currentFilePath;

if (isDirectRun) {
  main().catch((error) => {
    console.error("[cards-sync] FATAL ERROR");
    console.error(error);
    process.exit(1);
  });
}

export {
  parseFrontmatter,
  parseCardFile,
  parseSubIssueIds,
  buildEdges,
  normalizeText,
  resolveMappedOptionValue,
  buildOptionCandidates,
  pickSingleSelectOption,
  pickJiraTransition,
  buildJiraDescription,
  parseSyncMetadataFromDescription,
  parseIssueSummaryTypeTitle,
  jiraIssueToCardMarkdown,
  jiraRequest,
  graphql,
  DEFAULT_STATUS_OPTIONS,
};
