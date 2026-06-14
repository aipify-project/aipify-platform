#!/usr/bin/env node
/**
 * Apply pending migrations via Supabase Management API (same as MCP apply_migration).
 * Reads token from SUPABASE_ACCESS_TOKEN or ~/.supabase/access-token
 *
 * Usage: node scripts/apply-pending-migrations-remote.mjs [--from-index N] [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const PENDING = "/tmp/aipify-pending-migrations.json";
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const STATE_FILE = path.join(ROOT, ".supabase-migration-apply-state.json");

const fromIndex = process.argv.includes("--from-index")
  ? Number(process.argv[process.argv.indexOf("--from-index") + 1])
  : 0;
const dryRun = process.argv.includes("--dry-run");

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) return fs.readFileSync(tokenPath, "utf8").trim();
  return null;
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { appliedCount: 0, lastIndex: -1, failed: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function fetchAppliedVersions(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`List migrations failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return new Set((Array.isArray(data) ? data : data.migrations || []).map((m) => m.version));
}

async function applyMigration(token, migration) {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, migration.file), "utf8");
  if (dryRun) {
    console.log(`[dry-run] would apply ${migration.file}`);
    return;
  }
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: migration.name, query: sql }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Migration ${migration.file} failed (${res.status}): ${text}`);
  }
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error("No SUPABASE_ACCESS_TOKEN found. Set env var or run: npx supabase login");
    process.exit(1);
  }

  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const appliedRemote = await fetchAppliedVersions(token);
  const state = loadState();

  let startIdx = Math.max(fromIndex, state.lastIndex + 1);
  const toApply = pending.filter((m, i) => i >= startIdx && !appliedRemote.has(m.version));

  console.log(`Total pending in list: ${pending.length}`);
  console.log(`Already on remote: ${pending.length - toApply.length - (startIdx > 0 ? startIdx : 0)}`);
  console.log(`To apply from index ${startIdx}: ${toApply.length}`);

  let applied = 0;
  for (let i = 0; i < pending.length; i++) {
    if (i < startIdx) continue;
    const migration = pending[i];
    if (appliedRemote.has(migration.version)) continue;

    const n = i + 1;
    if (n % 25 === 0 || n === 1) {
      console.log(`[${n}/${pending.length}] ${migration.file}`);
    } else {
      process.stdout.write(`[${n}/${pending.length}] ${migration.file} ... `);
    }

    try {
      await applyMigration(token, migration);
      applied++;
      state.lastIndex = i;
      state.appliedCount = (state.appliedCount || 0) + 1;
      state.failed = null;
      saveState(state);
      if (n % 25 !== 0 && n !== 1) console.log("ok");
    } catch (error) {
      state.failed = { index: i, file: migration.file, message: error.message };
      saveState(state);
      console.error(`\nFAILED at [${n}/${pending.length}] ${migration.file}`);
      console.error(error.message);
      process.exit(1);
    }
  }

  const finalApplied = await fetchAppliedVersions(token);
  console.log(`\nDone. Applied ${applied} migration(s) this run.`);
  console.log(`Remote migration count: ${finalApplied.size}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
