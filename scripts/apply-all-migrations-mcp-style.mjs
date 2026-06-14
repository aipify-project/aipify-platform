#!/usr/bin/env node
/**
 * Apply all pending migrations via Supabase Management API (same endpoint as MCP apply_migration).
 * Handles already-exists errors by baselining schema_migrations via execute_sql equivalent.
 *
 * Usage: node scripts/apply-all-migrations-mcp-style.mjs [--start-index N]
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const PENDING = "/tmp/aipify-pending-migrations.json";
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const LOG_FILE = "/tmp/aipify-migration-apply-run.log";
const STATE_FILE = "/tmp/aipify-mcp-apply-state.json";

const startIndex = process.argv.includes("--start-index")
  ? Number(process.argv[process.argv.indexOf("--start-index") + 1])
  : 0;

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) return fs.readFileSync(tokenPath, "utf8").trim();
  try {
    return execSync('security find-generic-password -s "Supabase CLI" -w 2>/dev/null', {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
  } catch {
    return null;
  }
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { appliedThisRun: 0, lastIndex: startIndex - 1, lastFile: null, baselined: 0 };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function isAlreadyExistsError(msg) {
  const lower = msg.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate key") ||
    lower.includes("relation") && lower.includes("already exists") ||
    lower.includes("duplicate object")
  );
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

async function applyMigration(token, migration, sql) {
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
    throw new Error(text);
  }
  return text;
}

async function baselineMigration(token, migration) {
  const sql = `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${migration.version}', '${migration.name}') ON CONFLICT (version) DO NOTHING`;
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Baseline failed (${res.status}): ${text}`);
  }
}

async function main() {
  fs.writeFileSync(LOG_FILE, "");
  const token = getToken();
  if (!token) {
    log("ERROR: No Supabase access token found.");
    process.exit(1);
  }

  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const appliedRemote = await fetchAppliedVersions(token);
  const state = loadState();
  const total = pending.length;

  log(`Starting from index ${startIndex}, total migrations: ${total}, remote count: ${appliedRemote.size}`);

  for (let i = Math.max(startIndex, state.lastIndex + 1); i < total; i++) {
    const migration = pending[i];
    const n = i + 1;

    if (appliedRemote.has(migration.version)) {
      if (n % 10 === 0) log(`[${n}/${total}] skipped (already applied) ${migration.file}`);
      state.lastIndex = i;
      state.lastFile = migration.file;
      saveState(state);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, migration.file), "utf8");

    try {
      await applyMigration(token, migration, sql);
      appliedRemote.add(migration.version);
      state.appliedThisRun = (state.appliedThisRun || 0) + 1;
      state.lastIndex = i;
      state.lastFile = migration.file;
      saveState(state);

      if (n % 10 === 0 || n === total) {
        const progressLine = `[${n}/${total}] applied ${migration.file}`;
        log(progressLine);
      }
    } catch (error) {
      const errMsg = error.message || String(error);

      if (isAlreadyExistsError(errMsg)) {
        log(`[${n}/${total}] baselined (already exists) ${migration.file}`);
        try {
          await baselineMigration(token, migration);
          appliedRemote.add(migration.version);
          state.baselined = (state.baselined || 0) + 1;
          state.lastIndex = i;
          state.lastFile = migration.file;
          saveState(state);
          continue;
        } catch (baselineErr) {
          log(`FAILED baseline [${n}/${total}] ${migration.file}`);
          log(`ERROR: ${baselineErr.message}`);
          process.exit(1);
        }
      }

      log(`FAILED [${n}/${total}] ${migration.file}`);
      log(`ERROR: ${errMsg}`);
      state.failed = { index: i, file: migration.file, message: errMsg };
      saveState(state);
      process.exit(1);
    }
  }

  log(`Done. Applied ${state.appliedThisRun || 0} migration(s) this run, baselined ${state.baselined || 0}.`);
  log(`Last successful: ${state.lastFile}`);
  log(`Final remote count: ${appliedRemote.size}`);
}

main().catch((e) => {
  log(`FATAL: ${e.message}`);
  process.exit(1);
});
