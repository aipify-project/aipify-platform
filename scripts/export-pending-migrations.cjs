#!/usr/bin/env node
/**
 * Apply pending migrations via Supabase MCP-style workflow.
 * Writes each migration payload to stdout as JSON lines for batch processing.
 *
 * Usage:
 *   node scripts/export-pending-migrations.cjs --offset 0 --limit 10
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const APPLIED = new Set(JSON.parse(process.argv.includes("--applied-file")
  ? fs.readFileSync(process.argv[process.argv.indexOf("--applied-file") + 1], "utf8")
  : "[]"));

const offset = Number(process.argv.includes("--offset")
  ? process.argv[process.argv.indexOf("--offset") + 1]
  : 0);
const limit = Number(process.argv.includes("--limit")
  ? process.argv[process.argv.indexOf("--limit") + 1]
  : 10);

const pending = fs
  .readdirSync(path.join(ROOT, "supabase/migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((file) => {
    const match = file.match(/^(\d+)_(.+)\.sql$/);
    return { file, version: match[1], name: match[2] };
  })
  .filter((m) => !APPLIED.has(m.version))
  .slice(offset, offset + limit);

for (const migration of pending) {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations", migration.file),
    "utf8"
  );
  process.stdout.write(
    JSON.stringify({
      project_id: "qbcqoixhrvhnuwphefvw",
      name: migration.name,
      version: migration.version,
      file: migration.file,
      query: sql,
    }) + "\n"
  );
}
