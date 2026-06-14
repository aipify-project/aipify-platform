#!/usr/bin/env node
/**
 * Apply all pending migrations via Supabase Management API.
 * Equivalent to MCP apply_migration — uses same endpoint.
 *
 * Token sources (first match wins):
 *   1. SUPABASE_ACCESS_TOKEN env var
 *   2. ~/.supabase/access-token
 *   3. macOS Keychain "Supabase CLI" entry
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
const LOG_FILE = "/tmp/aipify-migration-apply.log";

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
  return text;
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
  log(`Remote migrations: ${appliedRemote.size}, Pending list: ${pending.length}`);

  let appliedThisRun = 0;
  for (let i = 0; i < pending.length; i++) {
    const migration = pending[i];
    if (appliedRemote.has(migration.version)) continue;

    const n = i + 1;
    if (n % 25 === 0 || n === 1 || n === pending.length) {
      log(`[${n}/${pending.length}] ${migration.file}`);
    }

    try {
      await applyMigration(token, migration);
      appliedRemote.add(migration.version);
      appliedThisRun++;
    } catch (error) {
      log(`FAILED [${n}/${pending.length}] ${migration.file}`);
      log(`ERROR: ${error.message}`);
      process.exit(1);
    }
  }

  log(`Done. Applied ${appliedThisRun} migration(s) this run.`);
  log(`Final remote count: ${appliedRemote.size}`);
}

main().catch((e) => {
  log(`FATAL: ${e.message}`);
  process.exit(1);
});
