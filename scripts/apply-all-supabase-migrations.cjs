#!/usr/bin/env node
/**
 * Apply all pending local Supabase migrations via Management API or db push.
 *
 * Auth (pick one):
 *   export SUPABASE_ACCESS_TOKEN=...   # from https://supabase.com/dashboard/account/tokens
 *   npx supabase login
 *
 * Usage:
 *   node scripts/apply-all-supabase-migrations.cjs
 *   node scripts/apply-all-supabase-migrations.cjs --from 20260610400000
 */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const ROOT = path.join(__dirname, "..");
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");
const STATE_FILE = path.join(ROOT, ".supabase-migration-state.json");
const fromVersion = process.argv.includes("--from")
  ? process.argv[process.argv.indexOf("--from") + 1]
  : null;

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
    .filter((m) => !fromVersion || m.version >= fromVersion);
}

async function fetchAppliedVersions(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
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
      body: JSON.stringify({
        name: migration.name,
        query: migration.sql,
      }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Migration ${migration.file} failed (${res.status}): ${text}`);
  }
  return text;
}

async function applyViaApi() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("SUPABASE_ACCESS_TOKEN is not set");
  }

  const local = listLocalMigrations();
  const appliedRemote = await fetchAppliedVersions(token);
  const pending = local.filter((m) => !appliedRemote.has(m.version));
  const state = loadState();

  console.log(`Pending migrations: ${pending.length}`);
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
      state.failed = {
        file: migration.file,
        message: error.message,
      };
      saveState(state);
      console.log("FAILED");
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log(`Done. Applied ${pending.length} migration(s).`);
}

function applyViaCli() {
  execSync("npx supabase db push --linked --include-all --yes", {
    cwd: ROOT,
    stdio: "inherit",
  });
}

async function main() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    await applyViaApi();
    return;
  }

  try {
    execSync("npx supabase projects list", { stdio: "pipe" });
    applyViaCli();
  } catch {
    console.error(
      [
        "Cannot apply migrations — no Supabase auth in this shell.",
        "",
        "Option A (recommended):",
        "  export SUPABASE_ACCESS_TOKEN=<personal-access-token>",
        "  node scripts/apply-all-supabase-migrations.cjs",
        "",
        "Option B:",
        "  npx supabase login",
        "  npm run supabase:link",
        "  npm run supabase:push",
      ].join("\n")
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
