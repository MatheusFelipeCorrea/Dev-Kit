import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { log, ok, warn, workspaceRoot } from "./lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(workspaceRoot, ".cursor", "rules", "dev-kit.mdc");
const legacySource = path.join(workspaceRoot, "rules", "dev-kit.mdc");
const targetDir = path.join(workspaceRoot, ".cursor", "rules");
const targetPath = path.join(targetDir, "dev-kit.mdc");

async function resolveSource() {
  try {
    await fs.access(sourcePath);
    return sourcePath;
  } catch {
    try {
      await fs.access(legacySource);
      return legacySource;
    } catch {
      return null;
    }
  }
}

async function main() {
  log("", "Dev-Kit Cursor rules install");
  const src = await resolveSource();
  if (!src) {
    warn("No dev-kit.mdc template found (.cursor/rules/ or rules/).");
    process.exit(1);
  }

  await fs.mkdir(targetDir, { recursive: true });
  const content = await fs.readFile(src, "utf8");
  const existing = await fs.readFile(targetPath, "utf8").catch(() => null);

  if (existing === content) {
    ok("Cursor rules already up to date: .cursor/rules/dev-kit.mdc");
    return;
  }

  await fs.writeFile(targetPath, content, "utf8");
  ok("Installed .cursor/rules/dev-kit.mdc");
  if (src === legacySource) {
    warn("Legacy path rules/dev-kit.mdc used — prefer .cursor/rules/ in future kit versions.");
  }
}

main().catch((error) => {
  console.error("[dev-kit] FATAL:", error.message);
  process.exit(1);
});
