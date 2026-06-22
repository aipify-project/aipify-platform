/**
 * Recent-phase Companion regression aggregator (Phase 36B → 38).
 * Does not chain into older phase test files (e.g. phase33.test.ts).
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const node = process.execPath;

const recentPhaseTests = ["phase36b.test.ts", "phase37.test.ts", "phase38.test.ts"] as const;

for (const testFile of recentPhaseTests) {
  const result = spawnSync(node, ["--import", "tsx", path.join("lib/companion-runtime", testFile)], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? "" },
  });
  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    throw new Error(`${testFile} failed with exit code ${result.status}`);
  }
}

assert.ok(recentPhaseTests.length >= 3);
console.log("companion-runtime-regression-recent.test.ts passed");
