import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseSubscriptionTab,
  subscriptionTabHref,
  legacyPathToSubscriptionTab,
  SUBSCRIPTION_TAB_IDS,
} from "./subscription-tabs";
import { KOMPIS_WEB_FLAT_NAV, KOMPIS_BEDRIFT_FLAT_NAV } from "@/lib/app-portal/nav-config";

assert.equal(parseSubscriptionTab(null), "overview");
assert.equal(parseSubscriptionTab("bogus"), "overview");
assert.equal(parseSubscriptionTab("invoices"), "invoices");
assert.equal(parseSubscriptionTab("Fakturaer"), "invoices");
assert.equal(parseSubscriptionTab("modules"), "addons");
assert.equal(subscriptionTabHref("overview"), "/app/account/subscription");
assert.equal(subscriptionTabHref("license"), "/app/account/subscription?tab=license");
assert.equal(legacyPathToSubscriptionTab("/app/account/invoices"), "invoices");
assert.equal(legacyPathToSubscriptionTab("/app/settings/modules"), "addons");
assert.equal(legacyPathToSubscriptionTab("/app/license"), "license");
assert.equal(SUBSCRIPTION_TAB_IDS.length, 7);

assert.ok(!KOMPIS_WEB_FLAT_NAV.some((i) => i.id === "accountInvoices"));
assert.ok(!KOMPIS_WEB_FLAT_NAV.some((i) => i.id === "kompisWebModules"));
assert.ok(KOMPIS_WEB_FLAT_NAV.some((i) => i.id === "accountSubscription"));
assert.ok(!KOMPIS_BEDRIFT_FLAT_NAV.some((i) => i.id === "accountInvoices"));
assert.ok(KOMPIS_BEDRIFT_FLAT_NAV.some((i) => i.id === "accountSubscription"));

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
assert.match(read("app/app/account/subscription/page.tsx"), /SubscriptionWorkspace/);
assert.match(read("app/app/account/invoices/page.tsx"), /redirect/);
assert.match(read("app/app/settings/modules/page.tsx"), /redirect/);
assert.match(read("app/app/license/page.tsx"), /redirect/);
assert.match(read("components/app/settings/billing/SubscriptionWorkspace.tsx"), /SubscriptionTabNav/);

const no = JSON.parse(read("locales/no/customer-app/settings.json")).commercialPackages.portfolio;
assert.equal(no.tabOverview, "Oversikt");
assert.equal(no.tabAddons, "Tilleggsmoduler");
assert.equal(no.tabInvoices, "Fakturaer");

console.log("subscription-tabs.test.ts: ok");
