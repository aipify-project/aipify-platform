#!/usr/bin/env node
/**
 * Outputs migration payloads for MCP apply_migration calls.
 * Usage: node scripts/export-migration-payload.mjs <index>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const pending = JSON.parse(fs.readFileSync("/tmp/aipify-pending-migrations.json", "utf8"));
const idx = Number(process.argv[2] ?? 0);
const m = pending[idx];
if (!m) {
  console.error(`No migration at index ${idx}`);
  process.exit(1);
}
const sql = fs.readFileSync(
  path.join(ROOT, "supabase/migrations", m.file),
  "utf8"
);
process.stdout.write(
  JSON.stringify({
    index: idx,
    file: m.file,
    version: m.version,
    name: m.name,
    project_id: "qbcqoixhrvhnuwphefvw",
    query: sql,
  })
);
