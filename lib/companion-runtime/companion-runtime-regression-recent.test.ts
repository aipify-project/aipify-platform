/**
 * Recent-phase Companion regression aggregator (Phase 36B → 43).
 * Does not chain into older phase test files (e.g. phase33.test.ts).
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..", "..");

const recentPhaseTests = [
  "phase36b.test.ts",
  "phase37.test.ts",
  "phase38.test.ts",
  "phase39.test.ts",
  "phase40.test.ts",
  "phase41.test.ts",
  "phase42.test.ts",
  "phase43.test.ts",
  "phase43b.test.ts",
  "phase43c.test.ts",
  "phase-p1-01.test.ts",
  "phase-p1-02.test.ts",
  "phase-p1-03.test.ts",
  "phase-p1-04.test.ts",
] as const;

for (const testFile of recentPhaseTests) {
  const result = spawnSync("npx", ["--yes", "tsx", path.join("lib/companion-runtime", testFile)], {
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

assert.ok(recentPhaseTests.length >= 6);
console.log("companion-runtime-regression-recent.test.ts passed");
