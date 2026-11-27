import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  CUSTOMERS_HUB_TABS,
  CUSTOMERS_KPI_DEFINITIONS,
  CUSTOMERS_REGISTER_PAGE_SIZE,
  CUSTOMERS_SUPPORT_HREF,
  getCustomersHubActiveTabId,
  shouldShowCustomersHubTabs,
} from "./customers-hub";
import { PLATFORM_NAV_GROUPS } from "./nav-groups";
import { getPlatformActiveNavId } from "./nav-config";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();

function read(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

test("customers hub tabs are Overview | Organizations | Customer success", () => {
  assert.deepEqual(
    CUSTOMERS_HUB_TABS.map((tab) => tab.id),
    ["overview", "organizations", "customerSuccess"],
  );
  assert.equal(CUSTOMERS_HUB_TABS[0]?.href, "/platform/customers/overview");
  assert.equal(CUSTOMERS_HUB_TABS[1]?.href, "/platform/customers");
  assert.equal(CUSTOMERS_HUB_TABS[2]?.href, "/platform/customer-success");
  assert.equal(CUSTOMERS_SUPPORT_HREF, "/platform/support");
  assert.equal(CUSTOMERS_REGISTER_PAGE_SIZE, 25);
});

test("sidebar Customers group stays short without Overview or Support duplicate", () => {
  const customers = PLATFORM_NAV_GROUPS.find((group) => group.id === "customers");
  assert.deepEqual(customers?.items.map((item) => item.id), [
    "organizations",
    "customerSuccess",
  ]);
  const support = PLATFORM_NAV_GROUPS.find((group) => group.id === "support");
  assert.deepEqual(support?.items.map((item) => item.id), ["support"]);
});

test("hub tab and sidebar active ids resolve for Kunder paths", () => {
  assert.equal(getCustomersHubActiveTabId("/platform/customers/overview"), "overview");
  assert.equal(getCustomersHubActiveTabId("/platform/customers"), "organizations");
  assert.equal(getCustomersHubActiveTabId("/platform/customer-success"), "customerSuccess");
  assert.equal(shouldShowCustomersHubTabs("/platform/customers/overview"), true);
  assert.equal(shouldShowCustomersHubTabs("/platform/customers"), true);
  assert.equal(shouldShowCustomersHubTabs("/platform/customer-success"), true);
  assert.equal(shouldShowCustomersHubTabs("/platform/customers/new"), false);
  assert.equal(shouldShowCustomersHubTabs("/platform/customer-success/risks"), false);
  assert.equal(getPlatformActiveNavId("/platform/customers/overview"), "organizations");
  assert.equal(getPlatformActiveNavId("/platform/customers"), "organizations");
  assert.equal(getPlatformActiveNavId("/platform/customer-success"), "customerSuccess");
});

test("KPI definitions separate organizations, subscriptions, and support", () => {
  const byId = Object.fromEntries(CUSTOMERS_KPI_DEFINITIONS.map((row) => [row.id, row]));
  assert.equal(byId.customerOrganizations?.counts, "organizations");
  assert.equal(byId.activeSubscriptions?.counts, "subscriptions");
  assert.equal(byId.trialingSubscriptions?.counts, "subscriptions");
  assert.equal(byId.paymentAttention?.counts, "subscriptions");
  assert.equal(byId.requiresFollowUp?.counts, "organizations");
  assert.equal(byId.openSupport?.counts, "support_cases");
  assert.match(byId.customerOrganizations?.excludes ?? "", /is_platform/);
  assert.match(byId.paymentAttention?.excludes ?? "", /churn/i);
});

test("Kunder hub pages and APIs enforce auth and fail-closed copy", () => {
  const overviewPage = read("app/platform/customers/overview/page.tsx");
  const customersPage = read("app/platform/customers/page.tsx");
  const successPage = read("app/platform/customer-success/page.tsx");
  const customersApi = read("app/api/platform-portal/customers/route.ts");
  const dashboardApi = read("app/api/platform-portal/dashboard/route.ts");
  const successPanel = read(
    "components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel.tsx",
  );
  const customersPanel = read(
    "components/platform/platform-portal/PlatformPortalCustomersPanel.tsx",
  );

  assert.match(overviewPage, /PlatformCustomersHubShell/);
  assert.match(overviewPage, /PlatformCustomersOverviewPanel/);
  assert.match(customersPage, /PlatformCustomersHubShell/);
  assert.match(successPage, /PlatformCustomersHubShell/);

  assert.match(customersApi, /getUser\(\)/);
  assert.match(customersApi, /getPlatformProfile/);
  assert.match(customersApi, /Unauthorized/);
  assert.match(dashboardApi, /getUser\(\)/);
  assert.match(dashboardApi, /getPlatformProfile/);

  assert.match(successPanel, /labels\.notAvailable/);
  assert.doesNotMatch(successPanel, /loading \? "—" : 0/);
  assert.match(customersPanel, /CUSTOMERS_REGISTER_PAGE_SIZE/);
  assert.match(customersPanel, /AipifyStatusBadge/);
  assert.match(successPanel, /AipifyStatusBadge/);
});

test("customersHub i18n keys exist for core locales", () => {
  for (const locale of LOCALES) {
    const path = join(ROOT, "locales", locale, "platform.json");
    const dict = JSON.parse(readFileSync(path, "utf8")) as {
      customersHub?: {
        tabs?: Record<string, string>;
        overview?: Record<string, string>;
      };
      customers?: Record<string, string>;
    };
    assert.ok(dict.customersHub?.tabs?.overview, `${locale} missing overview tab`);
    assert.ok(dict.customersHub?.tabs?.organizations, `${locale} missing organizations tab`);
    assert.ok(dict.customersHub?.tabs?.customerSuccess, `${locale} missing success tab`);
    assert.ok(dict.customersHub?.overview?.unavailable, `${locale} missing unavailable`);
    assert.ok(dict.customersHub?.overview?.kpiCustomerOrgsHelp, `${locale} missing KPI help`);
    assert.ok(dict.customers?.paginationShowing, `${locale} missing pagination`);
    assert.ok(dict.customers?.statusOk, `${locale} missing statusOk`);
  }
});

console.log("platform-customers-hub: all tests passed");
