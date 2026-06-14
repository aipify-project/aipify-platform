#!/usr/bin/env node
/**
 * Prepare JSON payloads for Supabase MCP apply_migration (one file per migration).
 * Output: /tmp/aipify-mcp-payloads/manifest.json + {version}.json
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const OUT = "/tmp/aipify-mcp-payloads";
const fromVersion = process.argv.includes("--from")
  ? process.argv[process.argv.indexOf("--from") + 1]
  : "20260611300000";

fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .filter((f) => f >= `${fromVersion}_`);

const manifest = [];
for (const file of files) {
  const match = file.match(/^(\d+)_(.+)\.sql$/);
  if (!match) continue;
  const payload = {
    project_id: "qbcqoixhrvhnuwphefvw",
    name: match[2],
    version: match[1],
    file,
    query: fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"),
  };
  const outFile = `${match[1]}.json`;
  fs.writeFileSync(path.join(OUT, outFile), JSON.stringify(payload));
  manifest.push({
    version: match[1],
    file,
    payload: outFile,
    bytes: Buffer.byteLength(payload.query),
  });
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Prepared ${manifest.length} payloads in ${OUT}`);
