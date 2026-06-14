#!/usr/bin/env node
/**
 * Track MCP migration apply progress.
 * Usage:
 *   node scripts/mcp-apply-state.mjs status
 *   node scripts/mcp-apply-state.mjs mark <index> <file> ok|fail [error]
 *   node scripts/mcp-apply-state.mjs next [count]
 */
import fs from "node:fs";

const STATE = "/tmp/aipify-mcp-apply-state.json";
const MISSING = "/tmp/aipify-missing-migrations.json";
const cmd = process.argv[2];

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, "utf8"));
  } catch {
    return { applied: [], failed: null, session_applied: 0 };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
}

const missing = JSON.parse(fs.readFileSync(MISSING, "utf8"));

if (cmd === "status") {
  const state = loadState();
  console.log(JSON.stringify({
    missing_total: missing.length,
    session_applied: state.session_applied,
    applied_indices: state.applied.length,
    last_failed: state.failed,
  }, null, 2));
} else if (cmd === "mark") {
  const index = Number(process.argv[3]);
  const file = process.argv[4];
  const status = process.argv[5];
  const error = process.argv[6];
  const state = loadState();
  if (status === "ok") {
    state.applied.push({ index, file });
    state.session_applied += 1;
    state.failed = null;
  } else {
    state.failed = { index, file, error: error ?? "unknown" };
  }
  saveState(state);
  console.log(`marked ${index} ${status}`);
} else if (cmd === "next") {
  const count = Number(process.argv[3] ?? 1);
  const state = loadState();
  const done = new Set(state.applied.map((a) => a.index));
  const next = missing.filter((m) => !done.has(m.index)).slice(0, count);
  console.log(JSON.stringify(next, null, 2));
} else {
  console.error("Usage: status | mark <index> <file> ok|fail [error] | next [count]");
  process.exit(1);
}
