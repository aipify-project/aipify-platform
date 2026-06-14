#!/usr/bin/env node
/**
 * Apply pending migrations via Supabase Management API (database/query + schema_migrations).
 * Uses filename version keys to avoid MCP timestamp collisions.
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
const MIGRATIONS_DIR = path.join(ROOT, "supabase/migrations");
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
    return { appliedThisRun: 0, lastIndex: startIndex - 1, lastFile: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function isAlreadyExistsError(msg) {
  const lower = msg.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate object") ||
    (lower.includes("relation") && lower.includes("already exists"))
  );
}

async function fetchAppliedMigrations(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`List migrations failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  const rows = Array.isArray(data) ? data : data.migrations || [];
  return {
    versions: new Set(rows.map((m) => m.version)),
    names: new Set(rows.map((m) => m.name)),
    count: rows.length,
  };
}

function escapeSqlLiteral(value) {
  return value.replace(/'/g, "''");
}

async function executeQuery(token, query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text);
  }
  return text;
}

async function applyMigration(token, migration, sql) {
  await executeQuery(token, sql);
  const recordSql = `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${escapeSqlLiteral(migration.version)}', '${escapeSqlLiteral(migration.name)}') ON CONFLICT (version) DO NOTHING`;
  await executeQuery(token, recordSql);
}

async function main() {
  const token = getToken();
  if (!token) {
    log("ERROR: No Supabase access token found.");
    process.exit(1);
  }

  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const remote = await fetchAppliedMigrations(token);
  const state = loadState();
  const total = pending.length;

  log(
    `Starting from index ${startIndex}, total migrations: ${total}, remote count: ${remote.count}`
  );

  for (let i = Math.max(startIndex, state.lastIndex + 1); i < total; i++) {
    const migration = pending[i];
    const n = i + 1;

    if (remote.versions.has(migration.version) || remote.names.has(migration.name)) {
      if (n % 20 === 0) log(`[${n}/${total}] skipped (already applied) ${migration.file}`);
      state.lastIndex = i;
      state.lastFile = migration.file;
      saveState(state);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, migration.file), "utf8");

    try {
      await applyMigration(token, migration, sql);
      remote.versions.add(migration.version);
      remote.names.add(migration.name);
      state.appliedThisRun = (state.appliedThisRun || 0) + 1;
      state.lastIndex = i;
      state.lastFile = migration.file;
      delete state.failed;
      saveState(state);

      if (n % 5 === 0 || n === total) {
        log(`[${n}/${total}] applied ${migration.file}`);
      }
    } catch (error) {
      const errMsg = error.message || String(error);

      if (isAlreadyExistsError(errMsg)) {
        log(`[${n}/${total}] record-only (objects exist) ${migration.file}`);
        try {
          await executeQuery(
            token,
            `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${escapeSqlLiteral(migration.version)}', '${escapeSqlLiteral(migration.name)}') ON CONFLICT (version) DO NOTHING`
          );
          remote.versions.add(migration.version);
          remote.names.add(migration.name);
          state.lastIndex = i;
          state.lastFile = migration.file;
          delete state.failed;
          saveState(state);
          continue;
        } catch (recordErr) {
          log(`FAILED record [${n}/${total}] ${migration.file}`);
          log(`ERROR: ${recordErr.message}`);
          state.failed = { index: i, file: migration.file, message: recordErr.message };
          saveState(state);
          process.exit(1);
        }
      }

      log(`FAILED [${n}/${total}] ${migration.file}`);
      log(`ERROR: ${errMsg.slice(0, 1200)}`);
      state.failed = { index: i, file: migration.file, message: errMsg };
      saveState(state);
      process.exit(1);
    }
  }

  log(`Done. Applied ${state.appliedThisRun || 0} migration(s) this run.`);
  log(`Last successful: ${state.lastFile}`);
}

main().catch((e) => {
  log(`FATAL: ${e.message}`);
  process.exit(1);
});
