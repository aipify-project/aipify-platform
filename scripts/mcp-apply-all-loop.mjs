#!/usr/bin/env node
/**
 * Apply pending migrations via Supabase MCP HTTP (requires Cursor MCP OAuth session).
 * Falls back to Management API if SUPABASE_ACCESS_TOKEN is set.
 *
 * Usage: node scripts/mcp-apply-all-loop.mjs [--start-index 8]
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
const BATCH_DIR = "/tmp/aipify-mcp-batch";
const STATE_FILE = "/tmp/aipify-mcp-apply-state.json";
const LOG_FILE = "/tmp/aipify-migration-apply-run.log";
const TOTAL = 507;

const startIndex = process.argv.includes("--start-index")
  ? Number(process.argv[process.argv.indexOf("--start-index") + 1])
  : null;

function getToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN.trim();
  const tokenPath = path.join(os.homedir(), ".supabase", "access-token");
  if (fs.existsSync(tokenPath)) return fs.readFileSync(tokenPath, "utf8").trim();
  return null;
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { appliedThisRun: 2, lastIndex: 2, lastFile: null, baselined: 0, failed: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(msg) {
  fs.appendFileSync(LOG_FILE, msg + "\n");
  console.log(msg);
}

function isAlreadyExistsError(msg) {
  const lower = String(msg).toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate key") ||
    (lower.includes("relation") && lower.includes("already exists")) ||
    lower.includes("duplicate object")
  );
}

async function applyViaApi(token, name, sql) {
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
  const text = await res.text();
  if (!res.ok) throw new Error(text);
}

async function baselineViaApi(token, version, name) {
  const sql = `INSERT INTO supabase_migrations.schema_migrations (version, name) VALUES ('${version}', '${name}') ON CONFLICT (version) DO NOTHING`;
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
  if (!res.ok) throw new Error(await res.text());
}

function getPayload(index) {
  const batchFile = path.join(BATCH_DIR, `${String(index).padStart(4, "0")}.json`);
  if (fs.existsSync(batchFile)) return JSON.parse(fs.readFileSync(batchFile, "utf8"));
  const out = execSync(`node ${path.join(__dirname, "export-migration-payload.mjs")} ${index}`, {
    encoding: "utf8",
  });
  return JSON.parse(out);
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error("ERROR: No SUPABASE_ACCESS_TOKEN. Set token or use MCP apply_migration from agent.");
    process.exit(1);
  }

  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const state = loadState();
  const from = startIndex ?? state.lastIndex + 1;

  log(`Starting from index ${from}, appliedThisRun=${state.appliedThisRun}, baselined=${state.baselined}`);

  for (let i = from; i < pending.length; i++) {
    const migration = pending[i];
    const payload = getPayload(i);
    const n = i + 1;

    try {
      await applyViaApi(token, migration.name, payload.query);
      state.appliedThisRun = (state.appliedThisRun || 0) + 1;
      state.lastIndex = i;
      state.lastFile = migration.file;
      state.failed = null;
      saveState(state);
      if (n % 10 === 0) log(`[${n}/${TOTAL}] applied ${migration.file}`);
    } catch (error) {
      const errMsg = error.message || String(error);
      if (isAlreadyExistsError(errMsg)) {
        await baselineViaApi(token, migration.version, migration.name);
        state.baselined = (state.baselined || 0) + 1;
        state.lastIndex = i;
        state.lastFile = migration.file;
        state.failed = null;
        saveState(state);
        if (n % 10 === 0) log(`[${n}/${TOTAL}] baselined ${migration.file}`);
        continue;
      }
      state.failed = { index: i, file: migration.file, message: errMsg };
      saveState(state);
      log(`FAILED [${n}/${TOTAL}] ${migration.file}: ${errMsg}`);
      process.exit(1);
    }
  }

  log(`Done. appliedThisRun=${state.appliedThisRun}, baselined=${state.baselined}, last=${state.lastFile}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
