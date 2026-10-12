/**
 * Job 57 — floating APP Companion decommission contract.
 * Mount must be absent from Customer APP shell; /app/kompis + frozen Website Kompis untouched.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function sha256File(relativePath: string): string {
  return createHash("sha256").update(read(relativePath)).digest("hex");
}

const dashboardShell = read("components/dashboard/DashboardShell.tsx");
const appLayout = read("app/app/layout.tsx");

// 1. APP shell must not mount floating Companion / launcher / drawer.
assert.doesNotMatch(dashboardShell, /CompanionShell/);
assert.doesNotMatch(dashboardShell, /CompanionTopBarButton/);
assert.doesNotMatch(dashboardShell, /CompanionFloatingButton/);
assert.doesNotMatch(dashboardShell, /CompanionDrawer/);
assert.doesNotMatch(dashboardShell, /companion-experience/);
assert.doesNotMatch(dashboardShell, /companionExperienceLabels/);

// 2. Layout must not supply floating Companion labels (no mount enablement).
assert.doesNotMatch(appLayout, /buildLayoutCompanionExperienceLabels/);
assert.doesNotMatch(appLayout, /companionExperienceLabels/);

// 3. SPA remount path: shell no longer wraps children in CompanionShell for any /app route.
assert.doesNotMatch(dashboardShell, /withCompanionExperience/);

// 4. /app/kompis operator route preserved (page + binding; intentionally off primary nav).
const bindings = read("lib/app-portal/foundation-nav/bindings.ts");
assert.match(bindings, /kompisOperatorPreserved:\s*"\/app\/kompis"/);
assert.ok(fs.existsSync(path.join(ROOT, "app/app/kompis/page.tsx")));
assert.doesNotMatch(read("lib/app-portal/nav-config.ts"), /href:\s*FOUNDATION_NAV_BINDINGS\.kompisOperatorPreserved/);

// 5. Frozen Website Kompis manifest hashes unchanged for protected runtime files.
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
assert.ok(Array.isArray(manifest.protectedRuntimeFiles));
assert.ok(manifest.protectedRuntimeFiles.length > 0);
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = sha256File(entry.path);
  assert.equal(
    actual,
    entry.sha256,
    `frozen hash mismatch: ${entry.path}\n expected ${entry.sha256}\n actual   ${actual}`
  );
}

// 6. Decommission files are not in the freeze manifest.
const frozenPaths = new Set(manifest.protectedRuntimeFiles.map((e) => e.path));
assert.equal(frozenPaths.has("components/dashboard/DashboardShell.tsx"), false);
assert.equal(frozenPaths.has("app/app/layout.tsx"), false);

console.log("floating-companion-decommission-57.test.ts: all assertions passed");
