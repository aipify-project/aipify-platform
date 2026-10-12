/**
 * Job 59 — product hubs & account center route contract.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { APP_PORTAL_NAV_GROUPS, getAppPortalActiveNavId } from "@/lib/app-portal/nav-config";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

const ROOT = process.cwd();

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

assert.deepEqual(APP_PORTAL_NAV_GROUPS.map((g) => g.id), ["kompisWeb", "kompisBedrift", "account"]);

// Canonical Bedrift + Account hubs
assert.equal(FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard, "/app/kompis-bedrift");
assert.equal(FOUNDATION_NAV_BINDINGS.kompisBedriftEmployees, "/app/kompis-bedrift/employees");
assert.equal(FOUNDATION_NAV_BINDINGS.kompisBedriftFaq, "/app/kompis-bedrift/knowledge");
assert.equal(FOUNDATION_NAV_BINDINGS.accountHome, "/app/account");
assert.equal(FOUNDATION_NAV_BINDINGS.accountSubscription, "/app/account/subscription");
assert.equal(FOUNDATION_NAV_BINDINGS.accountInvoices, "/app/account/invoices");
assert.equal(FOUNDATION_NAV_BINDINGS.accountIntegrations, "/app/account/integrations");
assert.equal(FOUNDATION_NAV_BINDINGS.accountNotifications, "/app/account/notifications");

// Nav registry uses those hrefs
const hrefs = APP_PORTAL_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
assert.ok(hrefs.includes("/app/kompis-bedrift"));
assert.ok(hrefs.includes("/app/account/subscription"));
assert.ok(!hrefs.includes("/app/settings/billing"));
assert.ok(!hrefs.includes("/app/kompis"));

// Active state — hubs + legacy aliases
assert.equal(getAppPortalActiveNavId("/app/kompis-bedrift/employees"), "kompisBedriftEmployees");
assert.equal(getAppPortalActiveNavId("/app/organization/team"), "kompisBedriftEmployees");
assert.equal(getAppPortalActiveNavId("/app/account/invoices"), "accountInvoices");
assert.equal(getAppPortalActiveNavId("/app/settings/billing/invoice-details"), "accountInvoices");
assert.equal(getAppPortalActiveNavId("/app/account/subscription"), "accountSubscription");
assert.equal(getAppPortalActiveNavId("/app/website-kompis"), "kompisWebDashboard");

// Hub shell exists; Companion not remounted
assert.ok(fs.existsSync(path.join(ROOT, "components/app/hubs/AppHubShell.tsx")));
const shell = read("components/dashboard/DashboardShell.tsx");
assert.doesNotMatch(shell, /CompanionShell/);

// Locale parity for productHubs
for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const parsed = JSON.parse(read(`locales/${locale}/customer-app/portalStructure.json`)) as {
    portalStructure: { productHubs?: { account?: { overviewTitle?: string } } };
  };
  assert.ok(parsed.portalStructure.productHubs?.account?.overviewTitle, `missing productHubs in ${locale}`);
}

// Freeze hashes
const manifest = JSON.parse(read("docs/integrations/website-kompis-public-chain-frozen-manifest.json")) as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256").update(read(entry.path)).digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

// Route files exist for every visible nav target
for (const href of hrefs) {
  // /app/website-kompis → app/app/website-kompis/page.tsx
  const file = path.join(
    ROOT,
    "app",
    "app",
    ...href.replace(/^\/app\/?/, "").split("/").filter(Boolean),
    "page.tsx"
  );
  assert.ok(fs.existsSync(file), `missing page for nav href ${href} → ${file}`);
}

console.log("foundation-nav-contract-59.test.ts: all assertions passed");
