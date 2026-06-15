#!/usr/bin/env node
/**
 * Apply Supabase SQL before shipping new features.
 *
 * Uses the Management API (database/query) so it works even when
 * `supabase db push` fails due to migration history drift.
 *
 * Token resolution (first match):
 *   1. SUPABASE_ACCESS_TOKEN env
 *   2. ~/.supabase/access-token
 *   3. macOS Keychain ("Supabase CLI")
 *
 * Usage:
 *   node scripts/supabase-apply-sql.mjs list
 *   node scripts/supabase-apply-sql.mjs list --from 20261461000000
 *   node scripts/supabase-apply-sql.mjs apply
 *   node scripts/supabase-apply-sql.mjs apply --from 20261469000000
 *   node scripts/supabase-apply-sql.mjs apply --file supabase/migrations/20261469000000_workspace_productivity_hub_phase282.sql
 *   node scripts/supabase-apply-sql.mjs apply --dry-run
 *   node scripts/supabase-apply-sql.mjs exec "SELECT 1"
 *   node scripts/supabase-apply-sql.mjs exec --file path/to/query.sql
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PROJECT_REF = "qbcqoixhrvhnuwphefvw";
const MIGRATIONS_DIR = path.join(ROOT, "supabase", "migrations");

const argv = process.argv.slice(2);
const command = argv[0] || "list";
const dryRun = argv.includes("--dry-run");

function argValue(flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

const fromVersion = argValue("--from") || "0";
const fileArg = argValue("--file");

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) {
    return fs.readFileSync(tokenPath, "utf8").trim();
  }
  try {
    return execSync('security find-generic-password -s "Supabase CLI" -w 2>/dev/null', {
      encoding: "utf8",
      timeout: 5000,
    }).trim();
  } catch {
    return null;
  }
}

function parseMigrationFile(file) {
  const match = file.match(/^(\d+)_(.+)\.sql$/);
  if (!match) {
    throw new Error(`Invalid migration filename: ${file}`);
  }
  return {
    file,
    version: match[1],
    name: match[2],
    path: path.join(MIGRATIONS_DIR, file),
  };
}

function listLocalMigrations() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map(parseMigrationFile)
    .filter((m) => m.version >= fromVersion);
}

function escapeSqlLiteral(value) {
  return value.replace(/'/g, "''");
}

async function fetchRemoteMigrations(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(`List migrations failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const rows = Array.isArray(data) ? data : data.migrations || [];
  return {
    rows,
    versions: new Set(rows.map((m) => m.version)),
    names: new Set(rows.map((m) => m.name)),
  };
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

function isAlreadyExistsError(message) {
  const lower = String(message).toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate object") ||
    (lower.includes("relation") && lower.includes("already exists"))
  );
}

async function recordMigration(token, migration) {
  const sql = `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${escapeSqlLiteral(migration.version)}', '${escapeSqlLiteral(migration.name)}') ON CONFLICT (version) DO NOTHING`;
  await executeQuery(token, sql);
}

async function applyMigrationFile(token, migration, remote) {
  const sql = fs.readFileSync(migration.path, "utf8");

  if (dryRun) {
    console.log(`[dry-run] would apply ${migration.file} (${sql.length} bytes)`);
    return "dry-run";
  }

  if (remote.versions.has(migration.version) || remote.names.has(migration.name)) {
    console.log(`skip (recorded) ${migration.file}`);
    return "skipped";
  }

  try {
  await executeQuery(token, sql);
  await recordMigration(token, migration);
  try {
    await executeQuery(token, "NOTIFY pgrst, 'reload schema';");
  } catch {
    // PostgREST reload is best-effort after DDL changes.
  }
    remote.versions.add(migration.version);
    remote.names.add(migration.name);
    console.log(`applied ${migration.file}`);
    return "applied";
  } catch (error) {
    const msg = error.message || String(error);
    if (isAlreadyExistsError(msg)) {
      await recordMigration(token, migration);
      remote.versions.add(migration.version);
      remote.names.add(migration.name);
      console.log(`record-only (objects exist) ${migration.file}`);
      return "record-only";
    }
    throw error;
  }
}

async function cmdList(token) {
  const remote = await fetchRemoteMigrations(token);
  const local = listLocalMigrations();
  const pending = local.filter(
    (m) => !remote.versions.has(m.version) && !remote.names.has(m.name)
  );

  console.log(`Project: ${PROJECT_REF}`);
  console.log(`Remote migrations: ${remote.rows.length}`);
  console.log(`Local migrations (from ${fromVersion}): ${local.length}`);
  console.log(`Pending: ${pending.length}`);

  if (pending.length > 0) {
    console.log("\nPending files:");
    for (const m of pending) {
      console.log(`  ${m.file}`);
    }
  }
}

async function cmdApply(token) {
  const remote = await fetchRemoteMigrations(token);

  let migrations;
  if (fileArg) {
    const rel = fileArg.startsWith("supabase/")
      ? path.basename(fileArg)
      : path.basename(fileArg);
    migrations = [parseMigrationFile(rel)];
  } else {
    const local = listLocalMigrations();
    migrations = local.filter(
      (m) => !remote.versions.has(m.version) && !remote.names.has(m.name)
    );
  }

  if (migrations.length === 0) {
    console.log("Nothing to apply.");
    return;
  }

  console.log(`${dryRun ? "Dry run:" : "Applying"} ${migrations.length} migration(s)...`);

  let applied = 0;
  for (const migration of migrations) {
    const result = await applyMigrationFile(token, migration, remote);
    if (result === "applied" || result === "record-only" || result === "dry-run") {
      applied += 1;
    }
  }

  console.log(`Done. ${applied} migration(s) processed.`);
}

async function cmdExec(token) {
  const inlineSql = argv[1] && !argv[1].startsWith("--") ? argv[1] : undefined;
  const sql = fileArg
    ? fs.readFileSync(path.resolve(ROOT, fileArg), "utf8")
    : inlineSql;

  if (!sql?.trim()) {
    console.error("Provide SQL as an argument or via --file.");
    process.exit(1);
  }

  if (dryRun) {
    console.log(`[dry-run] would execute ${sql.length} bytes of SQL`);
    return;
  }

  const result = await executeQuery(token, sql);
  console.log(result || "OK");
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error(
      "No Supabase access token. Run: npx supabase login\nOr set SUPABASE_ACCESS_TOKEN."
    );
    process.exit(1);
  }

  switch (command) {
    case "list":
      await cmdList(token);
      break;
    case "apply":
      await cmdApply(token);
      break;
    case "exec":
      await cmdExec(token);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error("Commands: list | apply | exec");
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
