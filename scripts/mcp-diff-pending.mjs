#!/usr/bin/env node
/**
 * Compare pending migrations against remote applied names.
 * Usage: node scripts/mcp-diff-pending.mjs /tmp/remote-applied-names.json
 */
import fs from "node:fs";

const pending = JSON.parse(fs.readFileSync("/tmp/aipify-pending-migrations.json", "utf8"));
const remoteRows = JSON.parse(fs.readFileSync(process.argv[2] ?? "/tmp/remote-applied-names.json", "utf8"));
const appliedNames = new Set(remoteRows.map((r) => r.name));

const fromIndex = Number(process.env.FROM_INDEX ?? 2);
const missing = [];
for (let i = fromIndex; i < pending.length; i++) {
  const m = pending[i];
  if (!appliedNames.has(m.name)) missing.push({ index: i, ...m });
}

console.log(JSON.stringify({
  pending_total: pending.length,
  remote_distinct_names: appliedNames.size,
  from_index: fromIndex,
  missing_count: missing.length,
  first_missing: missing.slice(0, 10),
  last_missing: missing.slice(-3),
}, null, 2));

if (process.argv.includes("--write")) {
  fs.writeFileSync("/tmp/aipify-missing-migrations.json", JSON.stringify(missing, null, 2));
  console.error(`Wrote ${missing.length} missing to /tmp/aipify-missing-migrations.json`);
}
