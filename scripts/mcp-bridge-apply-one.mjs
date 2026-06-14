#!/usr/bin/env node
/**
 * Apply one migration via Supabase Management API (same as MCP apply_migration).
 * Requires SUPABASE_ACCESS_TOKEN in environment.
 * Usage: SUPABASE_ACCESS_TOKEN=... node scripts/mcp-bridge-apply-one.mjs <index>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const idx = Number(process.argv[2]);
const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN required");
  process.exit(1);
}

const batchFile = `/tmp/aipify-mcp-batch/${String(idx).padStart(4, "0")}.json`;
const payload = JSON.parse(fs.readFileSync(batchFile, "utf8"));
const PROJECT = "qbcqoixhrvhnuwphefvw";

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT}/database/migrations`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: payload.name, query: payload.query }),
  }
);
const text = await res.text();
if (!res.ok) {
  console.error(text);
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, index: idx, name: payload.name, file: payload.file }));
