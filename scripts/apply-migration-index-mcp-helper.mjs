#!/usr/bin/env node
/**
 * Prepares MCP apply_migration payloads for a range of pending migration indices.
 * Outputs one JSON object per line to stdout for agent MCP calls.
 *
 * Usage: node scripts/apply-migration-index-mcp-helper.mjs <start> <end>
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const start = Number(process.argv[2] ?? 5);
const end = Number(process.argv[3] ?? 49);
const exportScript = path.join(__dirname, "export-migration-payload.mjs");
const outDir = "/tmp/mcp-migration-batch";
fs.mkdirSync(outDir, { recursive: true });

for (let i = start; i <= end; i++) {
  const out = execSync(`node ${exportScript} ${i}`, { encoding: "utf8" });
  const payload = JSON.parse(out);
  const filePath = path.join(outDir, `${i}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload));
  const n = i + 1;
  const total = 507;
  if (n % 25 === 0) {
    process.stderr.write(`[${n}/${total}] ${payload.file}\n`);
  }
  process.stdout.write(
    JSON.stringify({
      index: i,
      file: payload.file,
      name: payload.name,
      version: payload.version,
      payload_path: filePath,
      query_len: payload.query.length,
    }) + "\n"
  );
}
