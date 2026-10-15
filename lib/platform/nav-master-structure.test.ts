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

test("dashboard is pinned first outside collapsible groups", () => {
  assert.deepEqual(PLATFORM_FIXED_NAV_GROUPS, ["dashboard"]);
  assert.equal(PLATFORM_NAV_GROUPS[0]?.id, "dashboard");
  assert.deepEqual(
    PLATFORM_NAV_GROUPS[0]!.items.map((i) => i.id),
    ["overview"],
  );
  assert.equal(PLATFORM_COLLAPSIBLE_GROUPS.includes("dashboard"), false);
  assert.equal(
    PLATFORM_NAV_GROUPS.find((g) => g.id === "operations")!.items.some((i) => i.id === "overview"),
    false,
    "Platformoversikt must not remain under Drift",
  );
});

test("operations owns installations; product does not", () => {
  const operations = PLATFORM_NAV_GROUPS.find((g) => g.id === "operations");
  const product = PLATFORM_NAV_GROUPS.find((g) => g.id === "product");
  assert.ok(operations!.items.some((i) => i.id === "installationOversight"));
  assert.equal(
    product!.items.some((i) => i.id === "installationOversight"),
    false,
  );
  assert.deepEqual(
    product!.items.map((i) => i.id),
    ["productManagement", "businessPacks", "licenses", "websiteKompisPlans"],
  );
});

test("knowledge keeps docs and communications; translations live under control & governance", () => {
  const knowledge = PLATFORM_NAV_GROUPS.find((g) => g.id === "knowledge");
  const audit = PLATFORM_NAV_GROUPS.find((g) => g.id === "auditGovernance");
  assert.deepEqual(
    knowledge!.items.map((i) => i.id),
    ["knowledgeCenter", "documentation", "communications"],
  );
  assert.deepEqual(
    audit!.items.map((i) => i.id),
    ["system", "translationManagement", "activityLogs", "governanceRecords", "securityReviews"],
  );
});

test("dashboard active only on /platform exact path", () => {
  assert.equal(getPlatformActiveNavId("/platform"), "overview");
  assert.equal(getPlatformActiveNavId("/platform/"), "overview");
  assert.notEqual(getPlatformActiveNavId("/platform/operations/overview"), "overview");
  assert.notEqual(getPlatformActiveNavId("/platform/customers"), "overview");
  assert.notEqual(getPlatformActiveNavId("/platform/billing"), "overview");
  assert.equal(getPlatformActiveNavId("/platform/installations"), "installationOversight");
  assert.equal(getPlatformActiveNavId("/platform/system"), "system");
  assert.equal(getPlatformActiveNavId("/platform/unonight-pilot"), "unonightPilot");
});

test("dashboard href remains /platform", () => {
  const overview = PLATFORM_ADMIN_NAV.find((i) => i.id === "overview");
  assert.ok(overview);
  assert.equal(overview!.href, "/platform");
});

test("locale parity for dashboard and reorganized labels", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      navGroups?: { dashboard?: string };
      nav?: {
        overview?: string;
        installationOversight?: string;
        translationManagement?: string;
        system?: string;
      };
    };
    assert.ok(data.navGroups?.dashboard, `missing navGroups.dashboard for ${locale}`);
    assert.ok(data.nav?.overview, `missing nav.overview for ${locale}`);
    assert.ok(data.nav?.installationOversight, `missing installationOversight for ${locale}`);
    assert.ok(data.nav?.translationManagement, `missing translationManagement for ${locale}`);
    assert.ok(data.nav?.system, `missing system for ${locale}`);
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as {
    navGroups: { dashboard: string };
    nav: {
      overview: string;
      installationOversight: string;
      translationManagement: string;
      system: string;
    };
  };
  assert.equal(no.navGroups.dashboard, "Dashboard");
  assert.equal(no.nav.overview, "Dashboard");
  assert.equal(no.nav.installationOversight, "Installasjoner");
  assert.equal(no.nav.translationManagement, "Språk og oversettelser");
  assert.equal(no.nav.system, "Systeminnstillinger");
});

console.log("platform-nav-master-structure: all tests passed");
