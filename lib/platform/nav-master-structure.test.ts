import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  PLATFORM_NAV_GROUPS,
  PLATFORM_COLLAPSIBLE_GROUPS,
  PLATFORM_FIXED_NAV_GROUPS,
} from "./nav-groups";
import { getPlatformActiveNavId, PLATFORM_ADMIN_NAV } from "./nav-config";
import { LOCALES } from "@/lib/i18n/config";

const ROOT = process.cwd();

test("dashboard and support are pinned first outside collapsible groups", () => {
  assert.deepEqual(PLATFORM_FIXED_NAV_GROUPS, ["dashboard", "support"]);
  assert.equal(PLATFORM_NAV_GROUPS[0]?.id, "dashboard");
  assert.equal(PLATFORM_NAV_GROUPS[1]?.id, "support");
  assert.deepEqual(PLATFORM_NAV_GROUPS[0]!.items.map((i) => i.id), ["overview"]);
  assert.deepEqual(PLATFORM_NAV_GROUPS[1]!.items.map((i) => i.id), ["support"]);
  assert.equal(PLATFORM_COLLAPSIBLE_GROUPS.includes("dashboard"), false);
  assert.equal(PLATFORM_COLLAPSIBLE_GROUPS.includes("support"), false);
});

test("daily sidebar order is Dashboard Support Kunder Moduler Selgere Betaling Drift Innstillinger", () => {
  assert.deepEqual(
    PLATFORM_NAV_GROUPS.map((g) => g.id),
    ["dashboard", "support", "customers", "modules", "sellers", "billing", "operations", "settings"],
  );
});

test("operations owns Drift hubs plus system; modules exclude productManagement stub", () => {
  const operations = PLATFORM_NAV_GROUPS.find((g) => g.id === "operations");
  const modules = PLATFORM_NAV_GROUPS.find((g) => g.id === "modules");
  assert.deepEqual(operations!.items.map((i) => i.id), [
    "operationsOverview",
    "publishAndVerify",
    "kompisAi",
    "system",
  ]);
  assert.deepEqual(modules!.items.map((i) => i.id), [
    "licenses",
    "marketplace",
    "websiteKompisPlans",
  ]);
  assert.equal(modules!.items.some((i) => i.id === "productManagement"), false);
  assert.equal(modules!.items.some((i) => i.id === "businessPacks"), false);
});

test("settings keeps live advanced routes; stubs stay out of daily sidebar", () => {
  const settings = PLATFORM_NAV_GROUPS.find((g) => g.id === "settings");
  const allIds = PLATFORM_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
  assert.deepEqual(settings!.items.map((i) => i.id), [
    "knowledgeCenter",
    "communications",
    "superRevision",
    "superRoleAccess",
    "governanceRecords",
    "securityReviews",
  ]);
  for (const stub of ["documentation", "translationManagement", "activityLogs", "productManagement"]) {
    assert.equal(allIds.includes(stub as never), false, `${stub} must leave daily sidebar`);
  }
});

test("dashboard active only on /platform exact path", () => {
  assert.equal(getPlatformActiveNavId("/platform"), "overview");
  assert.equal(getPlatformActiveNavId("/platform/"), "overview");
  assert.notEqual(getPlatformActiveNavId("/platform/operations/overview"), "overview");
  assert.equal(getPlatformActiveNavId("/platform/installations"), "operationsOverview");
  assert.equal(getPlatformActiveNavId("/platform/system"), "system");
  assert.equal(getPlatformActiveNavId("/platform/website-verification"), "publishAndVerify");
  assert.equal(getPlatformActiveNavId("/platform/operations/deployments"), "publishAndVerify");
  assert.equal(getPlatformActiveNavId("/platform/kompis-ai"), "kompisAi");
  assert.equal(getPlatformActiveNavId("/platform/support"), "support");
});

test("dashboard href remains /platform", () => {
  const overview = PLATFORM_ADMIN_NAV.find((i) => i.id === "overview");
  assert.ok(overview);
  assert.equal(overview!.href, "/platform");
});

test("locale parity for dashboard and reorganized labels", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8")) as {
      navGroups?: Record<string, string>;
      nav?: Record<string, string>;
      sellersHub?: { tabsLabel?: string };
    };
    assert.ok(data.navGroups?.dashboard, locale);
    assert.ok(data.navGroups?.support, locale);
    assert.ok(data.navGroups?.modules, locale);
    assert.ok(data.navGroups?.billing, locale);
    assert.ok(data.navGroups?.settings, locale);
    assert.ok(data.nav?.overview, locale);
    assert.ok(data.nav?.system, locale);
    assert.ok(data.sellersHub?.tabsLabel, locale);
  }
  const no = JSON.parse(readFileSync(join(ROOT, "locales/no/platform.json"), "utf8")) as {
    navGroups: Record<string, string>;
    nav: Record<string, string>;
  };
  assert.equal(no.navGroups.dashboard, "Dashboard");
  assert.equal(no.navGroups.support, "Support");
  assert.equal(no.navGroups.modules, "Moduler");
  assert.equal(no.navGroups.billing, "Betaling");
  assert.equal(no.navGroups.settings, "Innstillinger");
  assert.equal(no.nav.overview, "Dashboard");
  assert.equal(no.nav.system, "Systeminnstillinger");
});

console.log("platform-nav-master-structure: all tests passed");
