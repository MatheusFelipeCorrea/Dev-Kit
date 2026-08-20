#!/usr/bin/env node
/**
 * Structural eval for critical skills — golden string checks (not LLM).
 * Run: npm run hyperion:skills-eval
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const evalRoot = join(root, ".github/skills/eval");

function walkSkills(dir, map = new Map()) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "eval") continue;
      walkSkills(p, map);
      continue;
    }
    if (name === "SKILL.md") {
      const folder = dirname(p).split(/[/\\]/).pop();
      map.set(folder, p);
    }
  }
  return map;
}

const casesPath = join(evalRoot, "cases.json");
const cases = JSON.parse(readFileSync(casesPath, "utf8"));
const skills = walkSkills(join(root, ".github/skills"));

let failed = 0;
for (const c of cases) {
  const path = skills.get(c.skill);
  if (!path) {
    console.error(`FAIL ${c.skill}: skill folder not found`);
    failed++;
    continue;
  }
  const text = readFileSync(path, "utf8");
  for (const needle of c.mustContain) {
    if (!text.includes(needle)) {
      console.error(`FAIL ${c.skill}: missing "${needle}"`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`\nskills:eval FAILED (${failed} checks)`);
  process.exit(1);
}

console.log(`skills:eval OK (${cases.length} skill cases)`);
