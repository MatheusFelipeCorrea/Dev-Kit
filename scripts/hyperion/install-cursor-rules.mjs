import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { log, ok, warn, workspaceRoot } from "./lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(workspaceRoot, ".cursor", "rules", "hyperion.mdc");
const targetDir = path.join(workspaceRoot, ".cursor", "rules");
const targetPath = path.join(targetDir, "hyperion.mdc");

async function resolveSource() {
  try {
    await fs.access(sourcePath);
    return sourcePath;
  } catch {
    return null;
  }
}

async function main() {
  log("", "Hyperion Cursor rules install");
  const src = await resolveSource();
  if (!src) {
    warn("No hyperion.mdc template found (.cursor/rules/ or rules/).");
    process.exit(1);
  }

  await fs.mkdir(targetDir, { recursive: true });
  const content = await fs.readFile(src, "utf8");
  const existing = await fs.readFile(targetPath, "utf8").catch(() => null);

  if (existing === content) {
    ok("Cursor rules already up to date: .cursor/rules/hyperion.mdc");
    return;
  }

  await fs.writeFile(targetPath, content, "utf8");
  ok("Installed .cursor/rules/hyperion.mdc");
}

main().catch((error) => {
  console.error("[Hyperion] FATAL:", error.message);
  process.exit(1);
});
