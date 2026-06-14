#!/usr/bin/env node
/**
 * Apply pending local migrations via Supabase Management API (resilient).
 * Skips versions already recorded; on duplicate-object errors, records version and continues.
 *
 *   export SUPABASE_ACCESS_TOKEN=...
 *   node scripts/apply-pending-migrations-resilient.cjs
 *   node scripts/apply-pending-migrations-resilient.cjs --from 20260611200000
 */
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const ROOT = path.join(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const STATE_FILE = path.join(ROOT, ".supabase-migration-state.json");
const fromVersion = process.argv.includes("--from")
  ? process.argv[process.argv.indexOf("--from") + 1]
  : "20260610400000";

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { applied: [], failed: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function listLocalMigrations() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((file) => {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (!match) throw new Error(`Invalid migration filename: ${file}`);
      return {
        file,
        version: match[1],
        name: match[2],
        sql: fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8"),
      };
    })
    .filter((m) => m.version >= fromVersion);
}

async function fetchAppliedVersions(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(`List migrations failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return new Set((Array.isArray(data) ? data : data.migrations || []).map((m) => m.version));
}

async function applyMigration(token, migration) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: migration.name, query: migration.sql }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Migration ${migration.file} failed (${res.status}): ${text}`);
    err.responseText = text;
    throw err;
  }
  return text;
}

function isAlreadyAppliedError(message) {
  const m = String(message).toLowerCase();
  return (
    m.includes("already exists") ||
    m.includes("duplicate key") ||
    m.includes("duplicate_object") ||
    m.includes("relation") && m.includes("already exists")
  );
}

async function recordVersion(token, migration) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${migration.version}', '${migration.name.replace(/'/g, "''")}') ON CONFLICT (version) DO NOTHING`,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Record version failed (${res.status}): ${await res.text()}`);
  }
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.error("SUPABASE_ACCESS_TOKEN is required.");
    process.exit(1);
  }

  const local = listLocalMigrations();
  const appliedRemote = await fetchAppliedVersions(token);
  const pending = local.filter((m) => !appliedRemote.has(m.version));
  const state = loadState();

  console.log(`From ${fromVersion}: ${pending.length} pending of ${local.length} local`);
  if (pending.length === 0) {
    console.log("Nothing to apply.");
    return;
  }

  for (let i = 0; i < pending.length; i++) {
    const migration = pending[i];
    if (state.applied.includes(migration.version)) continue;

    process.stdout.write(`[${i + 1}/${pending.length}] ${migration.file} ... `);
    try {
      await applyMigration(token, migration);
      state.applied.push(migration.version);
      state.failed = null;
      saveState(state);
      console.log("ok");
    } catch (error) {
      if (isAlreadyAppliedError(error.message)) {
        try {
          await recordVersion(token, migration);
          state.applied.push(migration.version);
          state.failed = null;
          saveState(state);
          console.log("skipped (already applied)");
          continue;
        } catch (recordError) {
          console.log("FAILED (record)");
          console.error(recordError.message);
          process.exit(1);
        }
      }
      state.failed = { file: migration.file, message: error.message };
      saveState(state);
      console.log("FAILED");
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log(`Done. Applied ${pending.length} migration(s).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
