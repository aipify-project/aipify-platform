#!/usr/bin/env node
/**
 * Export one migration payload for MCP apply_migration.
 * Usage: node scripts/mcp-apply-single.mjs <index> [--compact]
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const idx = Number(process.argv[2]);
if (Number.isNaN(idx)) {
  console.error("Usage: node scripts/mcp-apply-single.mjs <index>");
  process.exit(1);
}

const out = execSync(
  `node ${path.join(__dirname, "export-migration-payload.mjs")} ${idx}`,
  { encoding: "utf8" }
);
const payload = JSON.parse(out);
console.log(JSON.stringify({
  index: payload.index,
  file: payload.file,
  name: payload.name,
  project_id: payload.project_id,
  query_len: payload.query.length,
}));
