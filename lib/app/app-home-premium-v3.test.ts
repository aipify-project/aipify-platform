/**
 * APP Kundepanel Premium V3 — home landing, auth default, nav Home row.
 * Does not re-assert Website Kompis frozen hashes (separate frozen contract; do not touch).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { KOMPIS_BEDRIFT_FLAT_NAV, KOMPIS_WEB_FLAT_NAV } from "@/lib/app-portal/nav-config";
import { CUSTOMER_PORTAL_ROUTE } from "@/lib/portals/routes";
import { resolvePostLoginPath } from "@/lib/portals/separation";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

// Auth customers land on APP Home — not Command Center.
assert.equal(resolvePostLoginPath("app.aipify.ai", null), CUSTOMER_PORTAL_ROUTE);
assert.doesNotMatch(read("next.config.ts"), /source:\s*"\/app"[^]*destination:\s*"\/app\/command-center"/);
assert.match(read("components/auth/TwoFactorVerifyForm.tsx"), /defaultDestination = "\/app"/);

// Home is first in both product menus.
assert.equal(KOMPIS_WEB_FLAT_NAV[0]?.id, "appDashboard");
assert.equal(KOMPIS_BEDRIFT_FLAT_NAV[0]?.id, "appDashboard");
assert.equal(KOMPIS_WEB_FLAT_NAV[0]?.href, "/app");

const homePage = read("app/app/page.tsx");
assert.match(homePage, /AppFoundationDashboard/);
assert.match(homePage, /getDashboardProfile/);
assert.match(homePage, /buildWebsiteKompisConnectionAttention/);
assert.match(homePage, /helpHref="\/app\/support\/knowledge"/);
assert.doesNotMatch(homePage, /redirect\(["']\/app\/command-center/);

const home = read("components/app/foundation/AppFoundationDashboard.tsx");
assert.match(home, /quickActionsTitle/);
assert.match(home, /welcomePersonNamed/);
assert.match(home, /openInvoices/);
assert.match(home, /openHelp/);
assert.match(home, /attentionItems/);
assert.doesNotMatch(home, /createInvoice|opprett faktura/i);

const invoices = read("app/app/account/invoices/page.tsx");
assert.match(invoices, /EnterpriseInvoiceDetailsPanel/);
assert.doesNotMatch(invoices, /EnterpriseUpgradeInvoiceModal|createInvoiceDraft/);

// Locale keys present for core + es baseline.
for (const locale of ["en", "no", "sv", "da", "pl", "uk", "es"]) {
  const dict = JSON.parse(read(`locales/${locale}/customer-app/portalStructure.json`)) as {
    portalStructure: {
      nav: Record<string, string>;
      foundationDashboard: Record<string, string>;
    };
  };
  assert.ok(dict.portalStructure.nav.appDashboard);
  assert.ok(dict.portalStructure.foundationDashboard.welcomePersonNamed);
  assert.ok(dict.portalStructure.foundationDashboard.openInvoices);
  assert.ok(dict.portalStructure.foundationDashboard.helpTitle);
}

console.log("app-home-premium-v3.test.ts: all assertions passed");
