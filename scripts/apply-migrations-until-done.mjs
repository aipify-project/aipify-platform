#!/usr/bin/env node
/**
 * Run apply-all-migrations-mcp-style.mjs repeatedly until all pending migrations apply
 * or max consecutive failures reached.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";

const STATE = "/tmp/aipify-mcp-apply-state.json";
const LOG = "/tmp/aipify-migration-run.log";
const MAX_RUNS = 500;

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, "utf8"));
  } catch {
    return { lastIndex: -1 };
  }
}

let runs = 0;
while (runs < MAX_RUNS) {
  runs += 1;
  const before = loadState().lastIndex ?? -1;
  const start = Math.max(0, before + 1);

  const result = spawnSync(
    "node",
    ["scripts/apply-all-migrations-mcp-style.mjs", "--start-index", String(start)],
    { cwd: new URL("..", import.meta.url).pathname, encoding: "utf8", stdio: "pipe" }
  );

  const out = (result.stdout || "") + (result.stderr || "");
  fs.appendFileSync(LOG, out);

  const after = loadState();
  const state = loadState();

  if (result.status === 0) {
    console.log(`Run ${runs}: completed all migrations from index ${start}`);
    process.exit(0);
  }

  if ((state.lastIndex ?? -1) <= before) {
    console.log(`Run ${runs}: stopped at index ${state.failed?.index ?? "?"} — ${state.failed?.file ?? "unknown"}`);
    console.log(state.failed?.message?.slice(0, 500) ?? "no error message");
    process.exit(1);
  }

  console.log(`Run ${runs}: progressed ${before + 1} -> ${(state.lastIndex ?? -1) + 1}, retrying...`);
}

console.error(`Stopped after ${MAX_RUNS} runs without finishing`);
process.exit(1);
