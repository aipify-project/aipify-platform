/**
 * Job 60 — flat product menus + Platform billing contract.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  APP_PORTAL_NAV,
  APP_PORTAL_NAV_GROUPS,
  APP_SETTINGS_SURFACE_ITEMS,
  KOMPIS_BEDRIFT_FLAT_NAV,
  KOMPIS_WEB_FLAT_NAV,
  getAppPortalActiveNavId,
  getAppPortalSettingsActiveNavId,
} from "@/lib/app-portal/nav-config";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  assertCanonicalNavIntegrity,
  buildCanonicalNavContracts,
  presentAppNavFromCapabilities,
} from "@/lib/app-portal/canonical-nav";
import { availableProductsFromBundle } from "@/lib/app-portal/product-context/available-from-bundle";
import { resolveActiveProductContext } from "@/lib/app-portal/product-context/resolve";
import { resolveAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability/resolve";
import type { Translator } from "@/lib/i18n/translate";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const t: Translator = ((key: string) => key) as Translator;

const WEB_ORDER = [
  "kompisWebDashboard",
  "kompisWebQa",
  "kompisWebFaq",
  "accountInvoices",
  "kompisWebModules",
  "kompisWebConnection",
  "accountSubscription",
  "kompisWebSettings",
];

const BEDRIFT_ORDER = [
  "kompisBedriftDashboard",
  "kompisBedriftEmployees",
  "kompisBedriftDocuments",
  "kompisBedriftFaq",
  "kompisBedriftComms",
  "kompisBedriftMeetings",
  "accountInvoices",
  "kompisBedriftModules",
  "accountSubscription",
  "kompisBedriftConnection",
  "kompisBedriftSettings",
];

// 1. Exact flat order
assert.deepEqual(
  KOMPIS_WEB_FLAT_NAV.map((i) => i.id),
  WEB_ORDER
);
assert.deepEqual(
  KOMPIS_BEDRIFT_FLAT_NAV.map((i) => i.id),
  BEDRIFT_ORDER
);

// 2. No Account sidebar group; product groups only
assert.deepEqual(
  APP_PORTAL_NAV_GROUPS.map((g) => g.id),
  ["kompisWeb", "kompisBedrift"]
);

// 3. Integrations / notifications / appearance are settings surfaces, not primary rows
const primaryIds = [...KOMPIS_WEB_FLAT_NAV, ...KOMPIS_BEDRIFT_FLAT_NAV].map((i) => i.id);
assert.ok(!primaryIds.includes("accountIntegrations"));
assert.ok(!primaryIds.includes("accountNotifications"));
assert.ok(!primaryIds.includes("kompisWebAppearance"));
assert.ok(APP_SETTINGS_SURFACE_ITEMS.some((i) => i.id === "accountIntegrations"));
assert.ok(APP_SETTINGS_SURFACE_ITEMS.some((i) => i.id === "accountNotifications"));

// 4. Operator not in primary nav
assert.ok(!primaryIds.includes("kompisOperator"));
assert.ok(!APP_PORTAL_NAV.some((i) => i.href === "/app/kompis"));

// 5. Presentation: one product at a time, never mixed
const bothBundle = resolveAppMenuCapabilityBundle({
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
  activeModuleKeys: new Set(["website_kompis", "kompis_bedrift"]),
});
const webPresented = presentAppNavFromCapabilities(bothBundle, t, { activeProduct: "kompisWeb" });
assert.equal(webPresented.navGroups.length, 1);
assert.deepEqual(
  webPresented.navConfig.map((i) => i.id),
  WEB_ORDER
);
assert.ok(!webPresented.navConfig.some((i) => i.id.startsWith("kompisBedrift")));

const bedriftPresented = presentAppNavFromCapabilities(bothBundle, t, {
  activeProduct: "kompisBedrift",
});
assert.deepEqual(
  bedriftPresented.navConfig.map((i) => i.id),
  BEDRIFT_ORDER
);
assert.ok(!bedriftPresented.navConfig.some((i) => i.id.startsWith("kompisWeb")));

// 6. Web-only when website_kompis denied
const denied = resolveAppMenuCapabilityBundle({
  organizationId: "org",
  userId: "user",
  role: "organization_owner",
  featureEnabled: new Map([["billing", true], ["integrations", true]]),
  permissionGranted: new Map(),
  activePackKeys: new Set(),
  pendingPackKeys: new Set(),
  revokedPackKeys: new Set(),
  activeModuleKeys: new Set(["__website_kompis_denied__"]),
});
const availableDenied = availableProductsFromBundle(denied);
assert.deepEqual(availableDenied, []);
const deniedPresented = presentAppNavFromCapabilities(denied, t, {
  activeProduct: resolveActiveProductContext({
    availableProducts: availableDenied,
    cookieValue: "kompisWeb",
    pathname: "/app",
  }),
});
assert.ok(deniedPresented.navConfig.every((i) => !i.id.startsWith("kompisBedrift")));
assert.equal(deniedPresented.activeProduct === "kompisBedrift", false);

// 7. Active state + settings remap helpers
assert.equal(getAppPortalActiveNavId("/app/account/invoices"), "accountInvoices");
assert.equal(getAppPortalActiveNavId("/app/account/subscription"), "accountSubscription");
assert.equal(getAppPortalActiveNavId("/app/account/integrations"), "accountIntegrations");
assert.equal(getAppPortalActiveNavId("/app/account/notifications"), "accountNotifications");
assert.equal(getAppPortalActiveNavId("/app/website-kompis/connection"), "kompisWebConnection");
assert.equal(getAppPortalActiveNavId("/app/kompis-bedrift/connection"), "kompisBedriftConnection");
assert.equal(getAppPortalSettingsActiveNavId("kompisWeb"), "kompisWebSettings");
assert.equal(getAppPortalSettingsActiveNavId("kompisBedrift"), "kompisBedriftSettings");

// 8. Context resolution priority: path > cookie > first available
assert.equal(
  resolveActiveProductContext({
    pathname: "/app/kompis-bedrift/employees",
    cookieValue: "kompisWeb",
    availableProducts: ["kompisWeb", "kompisBedrift"],
  }),
  "kompisBedrift"
);
assert.equal(
  resolveActiveProductContext({
    pathname: "/app/account/invoices",
    cookieValue: "kompisBedrift",
    availableProducts: ["kompisWeb", "kompisBedrift"],
  }),
  "kompisBedrift"
);
assert.equal(
  resolveActiveProductContext({
    pathname: "/app",
    cookieValue: null,
    availableProducts: ["kompisWeb", "kompisBedrift"],
  }),
  "kompisWeb"
);
assert.equal(
  resolveActiveProductContext({
    pathname: "/app",
    cookieValue: "kompisWeb",
    availableProducts: ["kompisBedrift"],
  }),
  "kompisBedrift"
);

// 9. Canonical integrity + bindings
assertCanonicalNavIntegrity(buildCanonicalNavContracts());
for (const item of APP_PORTAL_NAV) {
  const key = Object.entries(FOUNDATION_NAV_BINDINGS).find(([, href]) => href === item.href)?.[0];
  assert.ok(key, `missing binding for ${item.id} → ${item.href}`);
}

// 10. FlatSidebar present; GroupedSidebar not required for customer product nav
const shell = read("components/dashboard/DashboardShell.tsx");
assert.match(shell, /FlatSidebar/);
assert.match(shell, /ProductContextSwitcher/);
assert.doesNotMatch(shell, /CompanionShell/);
assert.doesNotMatch(shell, /CompanionFloatingButton/);

// 11. Invoice page asserts Aipify-only semantics in copy keys
const en = JSON.parse(read("locales/en/customer-app/portalStructure.json")) as {
  portalStructure: {
    productHubs: { account: { invoicesTitle: string; invoicesDescription: string } };
  };
};
assert.match(en.portalStructure.productHubs.account.invoicesTitle, /Aipify/i);
assert.match(en.portalStructure.productHubs.account.invoicesDescription, /does not create invoices/i);

// 12. Frozen Website Kompis hashes unchanged
const manifest = JSON.parse(
  read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

console.log("flat-account-nav-contract-60.test.ts: all assertions passed");
