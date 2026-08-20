#!/usr/bin/env node
/**
 * Basic markdown link sanity check.
 * Run: npm run docs:check
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const SKIP = ["http://", "https://", "mailto:", "#"];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p, files);
    } else if (name.endsWith(".md") || name.endsWith(".mdc")) {
      files.push(p);
    }
  }
  return files;
}

const files = walk(root);
const broken = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  let m;
  while ((m = LINK_RE.exec(content)) !== null) {
    const target = m[2].split("#")[0];
    if (!target || target === "url" || target.includes("abc1234") || SKIP.some((p) => target.startsWith(p))) continue;
    const resolved = resolve(dirname(file), target);
    try {
      statSync(resolved);
    } catch {
      broken.push({ file: file.replace(root + "\\", "").replace(root + "/", ""), link: m[2] });
    }
  }
}

if (broken.length) {
  console.error(`Broken links: ${broken.length}`);
  for (const b of broken.slice(0, 40)) console.error(`  ${b.file} → ${b.link}`);
  process.exit(1);
}

console.log(`docs:check OK — ${files.length} files`);
