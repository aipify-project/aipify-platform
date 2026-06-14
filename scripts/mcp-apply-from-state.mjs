#!/usr/bin/env node
/**
 * MCP migration apply helper — state + payload export for agent MCP calls.
 *
 * Usage:
 *   node scripts/mcp-apply-from-state.mjs next          # print next payload JSON
 *   node scripts/mcp-apply-from-state.mjs mark ok       # success
 *   node scripts/mcp-apply-from-state.mjs mark baseline # already exists baseline
 *   node scripts/mcp-apply-from-state.mjs mark fail "error message"
 *   node scripts/mcp-apply-from-state.mjs status
 *   node scripts/mcp-apply-from-state.mjs export-all    # write /tmp/aipify-mcp-batch/*.json
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = "/tmp/aipify-mcp-apply-state.json";
const PENDING = "/tmp/aipify-pending-migrations.json";
const LOG_FILE = "/tmp/aipify-migration-apply-run.log";
const BATCH_DIR = "/tmp/aipify-mcp-batch";
const TOTAL = 507;
const exportScript = path.join(__dirname, "export-migration-payload.mjs");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { appliedThisRun: 0, lastIndex: 2, lastFile: null, baselined: 0, failed: null };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function logProgress(n, file) {
  if (n % 10 !== 0) return;
  const line = `[${n}/${TOTAL}] applied ${file}`;
  fs.appendFileSync(LOG_FILE, line + "\n");
  console.error(line);
}

function getPayload(index) {
  const batchFile = path.join(BATCH_DIR, `${String(index).padStart(4, "0")}.json`);
  if (fs.existsSync(batchFile)) {
    return JSON.parse(fs.readFileSync(batchFile, "utf8"));
  }
  const out = execSync(`node ${exportScript} ${index}`, { encoding: "utf8" });
  return JSON.parse(out);
}

const cmd = process.argv[2];

if (cmd === "status") {
  console.log(JSON.stringify(loadState(), null, 2));
} else if (cmd === "export-all") {
  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  fs.mkdirSync(BATCH_DIR, { recursive: true });
  const state = loadState();
  const start = Math.max(3, state.lastIndex + 1);
  for (let i = start; i < pending.length; i++) {
    const out = execSync(`node ${exportScript} ${i}`, { encoding: "utf8" });
    fs.writeFileSync(path.join(BATCH_DIR, `${String(i).padStart(4, "0")}.json`), out);
  }
  console.log(`Exported ${pending.length - start} payloads to ${BATCH_DIR}`);
} else if (cmd === "next") {
  const state = loadState();
  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const nextIndex = state.lastIndex + 1;
  if (nextIndex >= pending.length) {
    console.log(JSON.stringify({ done: true, state }));
    process.exit(0);
  }
  const payload = getPayload(nextIndex);
  console.log(JSON.stringify({ done: false, index: nextIndex, ...payload }));
} else if (cmd === "mark") {
  const kind = process.argv[3];
  const err = process.argv.slice(4).join(" ") || null;
  const state = loadState();
  const pending = JSON.parse(fs.readFileSync(PENDING, "utf8"));
  const index = state.lastIndex + 1;
  const migration = pending[index];
  if (!migration) {
    console.error("No migration to mark");
    process.exit(1);
  }
  const n = index + 1;
  if (kind === "ok") {
    state.appliedThisRun = (state.appliedThisRun || 0) + 1;
    state.failed = null;
  } else if (kind === "baseline") {
    state.baselined = (state.baselined || 0) + 1;
    state.failed = null;
  } else if (kind === "fail") {
    state.failed = { index, file: migration.file, message: err };
    saveState(state);
    console.log(JSON.stringify(state));
    process.exit(1);
  } else {
    console.error("mark ok|baseline|fail [message]");
    process.exit(1);
  }
  state.lastIndex = index;
  state.lastFile = migration.file;
  saveState(state);
  logProgress(n, migration.file);
  console.log(JSON.stringify(state));
} else {
  console.error("Usage: next | mark ok|baseline|fail | status | export-all");
  process.exit(1);
}
