#!/usr/bin/env node
/**
 * Export migration payloads for a range (for MCP batch apply).
 * Usage: node scripts/mcp-export-batch.mjs <startIndex> <count>
 * Writes one JSON file per migration to /tmp/aipify-mcp-batch/
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const start = Number(process.argv[2] ?? 2);
const count = Number(process.argv[3] ?? 25);
const outDir = "/tmp/aipify-mcp-batch";

fs.mkdirSync(outDir, { recursive: true });

for (let i = start; i < start + count; i++) {
  const raw = execSync(
    `node ${path.join(__dirname, "export-migration-payload.mjs")} ${i}`,
    { encoding: "utf8" }
  );
  fs.writeFileSync(path.join(outDir, `${String(i).padStart(4, "0")}.json`), raw);
  const j = JSON.parse(raw);
  console.log(`[${i}/514] ${j.file}`);
}
