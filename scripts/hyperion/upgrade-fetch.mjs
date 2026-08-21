/**
 * Resolve Hyperion upstream on GitHub and materialize a kit tree (shallow clone).
 */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

export const DEFAULT_ORIGIN = {
  repo: "MatheusFelipeCorrea/Hyperion",
  ref: "main",
};

/**
 * @param {string} targetRoot
 * @param {{ repo?: string, ref?: string }} overrides
 */
export async function resolveOrigin(targetRoot, overrides = {}) {
  let file = { ...DEFAULT_ORIGIN };
  const originPath = path.join(targetRoot, ".github", "hyperion-origin.json");
  try {
    const raw = JSON.parse(await fsp.readFile(originPath, "utf8"));
    if (raw.repo) {
      file.repo = String(raw.repo)
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/\.git$/, "");
    }
    if (raw.ref) file.ref = String(raw.ref);
  } catch {
    /* optional file */
  }

  const repo = String(
    overrides.repo || process.env.HYPERION_ORIGIN_REPO || file.repo || DEFAULT_ORIGIN.repo
  )
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git$/, "");
  const ref = String(
    overrides.ref || process.env.HYPERION_ORIGIN_REF || file.ref || DEFAULT_ORIGIN.ref
  );

  return { repo, ref };
}

export async function readLocalKitMeta(targetRoot) {
  try {
    return JSON.parse(
      await fsp.readFile(path.join(targetRoot, ".github", "hyperion-kit.json"), "utf8")
    );
  } catch {
    return null;
  }
}

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    windowsHide: true,
    ...opts,
  });
  return {
    status: r.status ?? 1,
    stdout: (r.stdout || "").trim(),
    stderr: (r.stderr || "").trim(),
  };
}

export function ghAvailable() {
  return run("gh", ["--version"]).status === 0;
}

/**
 * Latest commit SHA for repo@ref (via gh api, fallback git ls-remote).
 */
export function fetchRemoteTip(repo, ref) {
  if (ghAvailable()) {
    const r = run("gh", [
      "api",
      `repos/${repo}/commits/${encodeURIComponent(ref)}`,
      "--jq",
      ".sha",
    ]);
    if (r.status === 0 && /^[0-9a-f]{7,40}$/i.test(r.stdout)) {
      return { sha: r.stdout.toLowerCase(), method: "gh" };
    }
  }

  const url = `https://github.com/${repo}.git`;
  const r = run("git", ["ls-remote", url, ref]);
  if (r.status === 0 && r.stdout) {
    const lines = r.stdout.split(/\r?\n/).filter(Boolean);
    const line =
      lines.find((l) => l.includes(`refs/heads/${ref}`)) ||
      lines.find((l) => l.includes(`refs/tags/${ref}`)) ||
      lines[0];
    const sha = line?.split(/\s+/)[0];
    if (sha && /^[0-9a-f]{7,40}$/i.test(sha)) {
      return { sha: sha.toLowerCase(), method: "git-ls-remote" };
    }
  }

  throw new Error(
    `Could not resolve ${repo}@${ref}. Use gh auth login, or set GITHUB_TOKEN, or pass --from <local-kit>.`
  );
}

export function sameCommit(a, b) {
  if (!a || !b) return false;
  const x = String(a).toLowerCase();
  const y = String(b).toLowerCase();
  const n = Math.min(x.length, y.length, 40);
  if (n < 7) return false;
  return x.slice(0, n) === y.slice(0, n);
}

/**
 * Shallow-clone kit into a temp directory. Caller should cleanup tempParent.
 * @returns {{ kitRoot: string, tempParent: string, sha: string, repo: string, ref: string }}
 */
export function materializeKitFromGitHub(repo, ref, tipSha) {
  const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), "hyperion-upgrade-"));
  const kitRoot = path.join(tempParent, "kit");

  let cloneUrl = `https://github.com/${repo}.git`;
  if (ghAvailable()) {
    const tok = run("gh", ["auth", "token"]);
    if (tok.status === 0 && tok.stdout) {
      cloneUrl = `https://x-access-token:${tok.stdout}@github.com/${repo}.git`;
    }
  } else {
    const envTok = process.env.GITHUB_TOKEN || process.env.PROJECT_SYNC_TOKEN;
    if (envTok) cloneUrl = `https://x-access-token:${envTok}@github.com/${repo}.git`;
  }

  const clone = run(
    "git",
    ["clone", "--depth", "1", "--branch", ref, cloneUrl, kitRoot],
    { env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } }
  );
  if (clone.status !== 0) {
    fs.rmSync(tempParent, { recursive: true, force: true });
    throw new Error(`git clone failed: ${clone.stderr || clone.stdout || "unknown"}`);
  }

  let sha = tipSha;
  if (!sha) {
    const head = run("git", ["-C", kitRoot, "rev-parse", "HEAD"]);
    sha = head.stdout.toLowerCase();
  }

  return { kitRoot, tempParent, sha: String(sha).toLowerCase(), repo, ref };
}

export function cleanupTemp(tempParent) {
  if (!tempParent) return;
  try {
    fs.rmSync(tempParent, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}
