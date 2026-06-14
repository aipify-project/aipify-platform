#!/usr/bin/env node
/**
 * Helper: read pending migrations and output JSON lines for batch apply.
 * Usage: node scripts/mcp-batch-apply-helper.mjs [startIndex] [count]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PENDING = "/tmp/aipify-pending-migrations.json";
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");

const startIndex = Number(process.argv[2] ?? 1); // skip first already applied
const count = Number(process.argv[3] ?? 10);

const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
const slice = pending.slice(startIndex, startIndex + count);

for (const m of slice) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, m.file), "utf8");
  process.stdout.write(JSON.stringify({ file: m.file, name: m.name, sql }) + "\n");
}
