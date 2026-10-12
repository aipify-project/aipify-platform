/**
 * Job 58 — foundation navigation contract.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { APP_PORTAL_NAV_GROUPS, getAppPortalActiveNavId } from "@/lib/app-portal/nav-config";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { assertCanonicalNavIntegrity, buildCanonicalNavContracts } from "@/lib/app-portal/canonical-nav/contract";
import { resolveAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability/resolve";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// 1. Exact allowed group structure
assert.deepEqual(
  APP_PORTAL_NAV_GROUPS.map((g) => g.id),
  ["kompisWeb", "kompisBedrift", "account"]
);
assert.equal(APP_PORTAL_NAV_GROUPS[0]?.items.length, 7);
assert.equal(APP_PORTAL_NAV_GROUPS[1]?.items.length, 8);
assert.equal(APP_PORTAL_NAV_GROUPS[2]?.items.length, 4);

// 2. No duplicate routes / ids / label keys
const hrefs = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
const ids = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
const labelKeys = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.labelKey));
assert.equal(new Set(hrefs).size, hrefs.length, "duplicate href in foundation nav");
assert.equal(new Set(ids).size, ids.length, "duplicate id in foundation nav");
assert.equal(new Set(labelKeys).size, labelKeys.length, "duplicate labelKey in foundation nav");

// 3. Account items appear once
assert.equal(ids.filter((id) => id.startsWith("account")).length, 4);
assert.ok(!ids.includes("kompisOperator"));
assert.ok(!hrefs.includes("/app/kompis"));

// 4. Active state for nested routes (canonical hubs + legacy aliases)
assert.equal(getAppPortalActiveNavId("/app/account/invoices"), "accountInvoices");
assert.equal(getAppPortalActiveNavId("/app/settings/billing/invoice-details"), "accountInvoices");
assert.equal(getAppPortalActiveNavId("/app/account/subscription"), "accountSubscription");
assert.equal(getAppPortalActiveNavId("/app/website-kompis/faq"), "kompisWebFaq");
assert.equal(getAppPortalActiveNavId("/app/kompis-bedrift/employees"), "kompisBedriftEmployees");
assert.equal(getAppPortalActiveNavId("/app/organization/team"), "kompisBedriftEmployees");
assert.equal(getAppPortalActiveNavId("/app"), "appDashboard");

// 5. Module entitlement filtering (website_kompis denied)
const denied = resolveAppMenuCapabilityBundle({
  organizationId: "org",
  userId: "user",
  role: "organization_owner",
  featureEnabled: new Map([
    ["billing", true],
    ["integrations", true],
  ]),
  permissionGranted: new Map(),
  activePackKeys: new Set(),
  pendingPackKeys: new Set(),
  revokedPackKeys: new Set(),
  activeModuleKeys: new Set(["__website_kompis_denied__"]),
});
const deniedVisible = new Set(
  denied.capabilities.filter((c) => c.visibleInNavigation).map((c) => c.capabilityId)
);
assert.equal(deniedVisible.has("kompisWebDashboard"), false);
assert.equal(deniedVisible.has("kompisBedriftDashboard"), true);
assert.equal(deniedVisible.has("accountSubscription"), true);

// 6. Canonical integrity
assertCanonicalNavIntegrity(buildCanonicalNavContracts());

// 7. Floating companion not reintroduced in shell
const shell = read("components/dashboard/DashboardShell.tsx");
assert.doesNotMatch(shell, /CompanionShell/);
assert.doesNotMatch(shell, /CompanionFloatingButton/);

// 8. Frozen Website Kompis hashes unchanged
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

// 9. Bindings file matches registry hrefs
for (const group of APP_PORTAL_NAV_GROUPS) {
  for (const item of group.items) {
    const key = Object.entries(FOUNDATION_NAV_BINDINGS).find(([, href]) => href === item.href)?.[0];
    assert.ok(key, `missing binding for ${item.id} → ${item.href}`);
  }
}

console.log("foundation-nav-contract-58.test.ts: all assertions passed");
