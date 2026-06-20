#!/usr/bin/env node
/** Smoke test: APP nav must not resolve to legacy /dashboard/* routes. */
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { resolveAppHref } from "../lib/app/route-aliases.ts";
import { resolveLegacyDashboardPath } from "../lib/app/legacy-dashboard-redirects.ts";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

assert.equal(resolveAppHref("/app/support"), "/app/support/history");
assert.equal(resolveAppHref("/app/billing"), "/app/billing");
assert.equal(resolveAppHref("/app/analytics"), "/app/analytics");
assert.doesNotMatch(resolveAppHref("/app/support"), /^\/dashboard/);
assert.doesNotMatch(resolveAppHref("/app/billing"), /^\/dashboard/);

assert.equal(resolveLegacyDashboardPath("/dashboard/support"), "/app/support/history");
assert.equal(resolveLegacyDashboardPath("/dashboard/support/history"), "/app/support/history");
assert.equal(resolveLegacyDashboardPath("/dashboard/billing"), "/app/billing");
assert.equal(resolveLegacyDashboardPath("/dashboard/installs"), "/app/installations");
assert.equal(resolveLegacyDashboardPath("/dashboard/settings/security"), "/app/settings/security");
assert.equal(resolveLegacyDashboardPath("/dashboard/intelligence/scenario-planning"), "/app/intelligence/scenario-planning");

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
      walk(full, acc);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const appRoots = [
  path.join(root, "components/app"),
  path.join(root, "lib/app"),
  path.join(root, "lib/app-portal"),
  path.join(root, "app/app"),
];

const badHref = /href=["']\/dashboard(?:\/|["'])/;
const offenders = [];
for (const base of appRoots) {
  for (const file of walk(base)) {
    const text = readFileSync(file, "utf8");
    if (badHref.test(text)) offenders.push(path.relative(root, file));
  }
}

assert.equal(offenders.length, 0, `Hardcoded /dashboard hrefs in APP: ${offenders.join(", ")}`);

console.log("APP legacy navigation fix smoke tests passed");
