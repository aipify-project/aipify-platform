/**
 * Job 58 foundation contract — superseded structurally by job 60 flat menus.
 * Kept as a thin freeze/companion regression probe; order assertions live in job 60.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { APP_PORTAL_NAV_GROUPS } from "@/lib/app-portal/nav-config";
import { assertCanonicalNavIntegrity, buildCanonicalNavContracts } from "@/lib/app-portal/canonical-nav/contract";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

assert.deepEqual(
  APP_PORTAL_NAV_GROUPS.map((g) => g.id),
  ["kompisWeb", "kompisBedrift"]
);
assertCanonicalNavIntegrity(buildCanonicalNavContracts());

const shell = read("components/dashboard/DashboardShell.tsx");
assert.doesNotMatch(shell, /CompanionShell/);
assert.doesNotMatch(shell, /CompanionFloatingButton/);

const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

console.log("foundation-nav-contract-58.test.ts: regression assertions passed (job 60 supersedes structure)");
