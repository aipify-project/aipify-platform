#!/usr/bin/env node
/**
 * Apply pending migrations using Supabase Management API.
 * Reads SQL from migration files — same endpoint as MCP apply_migration.
 *
 * Requires SUPABASE_ACCESS_TOKEN in environment.
 * Progress logged to /tmp/aipify-migration-apply.log
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const PENDING = "/tmp/aipify-pending-migrations.json";
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const LOG = "/tmp/aipify-migration-apply.log";
const START_INDEX = Number(process.env.START_INDEX ?? 0);

const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + "\n");
}

async function listApplied() {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return new Set((Array.isArray(data) ? data : data.migrations || []).map((m) => m.version));
}

async function apply(name, sql) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, query: sql }),
    }
  );
  if (!res.ok) throw new Error(await res.text());
}

const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
const applied = await listApplied();
log(`Starting from index ${START_INDEX}, remote has ${applied.size} migrations`);

let count = 0;
for (let i = START_INDEX; i < pending.length; i++) {
  const m = pending[i];
  if (applied.has(m.version)) continue;
  const n = i + 1;
  if (n % 25 === 0 || n === 1) log(`[${n}/${pending.length}] ${m.file}`);
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, m.file), "utf8");
  try {
    await apply(m.name, sql);
    applied.add(m.version);
    count++;
  } catch (e) {
    log(`FAILED [${n}/${pending.length}] ${m.file}: ${e.message}`);
    process.exit(1);
  }
}
log(`Applied ${count}. Remote total: ${applied.size}`);
