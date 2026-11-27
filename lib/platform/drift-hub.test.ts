import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  DRIFT_OPERATIONS_TABS,
  DRIFT_PUBLISH_VERIFY_TABS,
  PUBLISH_AND_VERIFY_HREF,
  getDriftActiveTabId,
  getDriftSidebarNavId,
  isDriftOperationsPath,
  isDriftPublishVerifyPath,
} from "./drift-hub";
import { PLATFORM_NAV_GROUPS } from "./nav-groups";
import { getPlatformActiveNavId } from "./nav-config";
import { LOCALES } from "@/lib/i18n/config";
import { deriveInstallationHealth } from "./ai-dashboard";
import type { PlatformInstallationRow } from "./types";

const ROOT = process.cwd();

test("sidebar Drift group keeps three hubs plus system status", () => {
  const operations = PLATFORM_NAV_GROUPS.find((g) => g.id === "operations");
  assert.deepEqual(operations?.items.map((i) => i.id), [
    "operationsOverview",
    "publishAndVerify",
    "kompisAi",
    "system",
  ]);
});

test("operations hub tabs cover former sidebar destinations", () => {
  assert.deepEqual(
    DRIFT_OPERATIONS_TABS.map((t) => t.id),
    ["overview", "platformHealth", "installations", "auditLogs", "pilot"],
  );
  assert.deepEqual(
    DRIFT_PUBLISH_VERIFY_TABS.map((t) => t.id),
    ["deployments", "websiteVerification", "verificationHistory"],
  );
});

test("legacy Drift paths highlight parent hubs", () => {
  assert.equal(getDriftSidebarNavId("/platform/operations/platform-health"), "operationsOverview");
  assert.equal(getDriftSidebarNavId("/platform/installations"), "operationsOverview");
  assert.equal(getDriftSidebarNavId("/platform/unonight-pilot"), "operationsOverview");
  assert.equal(getDriftSidebarNavId("/platform/website-verification"), "publishAndVerify");
  assert.equal(getDriftSidebarNavId("/platform/operations/deployments"), "publishAndVerify");
  assert.equal(getPlatformActiveNavId("/platform/operations/audit-logs"), "operationsOverview");
  assert.equal(getPlatformActiveNavId("/platform/updates"), "publishAndVerify");
});

test("active tab resolves including verification history query", () => {
  assert.equal(getDriftActiveTabId("/platform/operations/overview"), "overview");
  assert.equal(getDriftActiveTabId("/platform/installations"), "installations");
  assert.equal(
    getDriftActiveTabId("/platform/website-verification", new URLSearchParams("section=history")),
    "verificationHistory",
  );
  assert.equal(getDriftActiveTabId("/platform/website-verification"), "websiteVerification");
  assert.ok(isDriftOperationsPath("/platform/operations/platform-health"));
  assert.ok(isDriftPublishVerifyPath("/platform/operations/publish-verify"));
});

test("installation freshness never invents minutes when sync is missing", () => {
  const row = {
    id: "1",
    customer_id: "c1",
    customer_number: "C-1",
    customer_name: "Example",
    customer_email: "ops@example.com",
    site_url: "https://customer.example",
    system_type: "custom",
    status: "active",
    modules: [],
    integrations: [],
    last_synced_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
  } as unknown as PlatformInstallationRow;
  const health = deriveInstallationHealth(row);
  assert.equal(health.lastScanMinutesAgo, null);
  // Active agreement without sync evidence is attention — not healthy/Frisk.
  assert.equal(health.health, "attention");
  assert.equal(health.automationActive, false);
});

test("publishAndVerify hub href lands on deployments without redirect hop", () => {
  assert.equal(PUBLISH_AND_VERIFY_HREF, "/platform/operations/deployments");
  assert.equal(getPlatformActiveNavId("/platform/operations/deployments"), "publishAndVerify");
});

test("locale parity for Drift hub keys", () => {
  for (const locale of LOCALES) {
    const data = JSON.parse(
      readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
    ) as {
      nav?: { publishAndVerify?: string; kompisAi?: string };
      driftHub?: {
        tabsAria?: string;
        tabs?: Record<string, string>;
        auditLogs?: { notConfiguredTitle?: string };
        deployments?: { notConfiguredTitle?: string };
      };
      installations?: { neverSynced?: string; syncStale?: string };
    };
    assert.ok(data.nav?.publishAndVerify, `missing publishAndVerify for ${locale}`);
    assert.ok(data.driftHub?.tabsAria, `missing driftHub.tabsAria for ${locale}`);
    assert.ok(data.driftHub?.tabs?.overview, `missing overview tab for ${locale}`);
    assert.ok(data.driftHub?.tabs?.pilot, `missing pilot tab for ${locale}`);
    assert.ok(
      data.driftHub?.auditLogs?.notConfiguredTitle,
      `missing audit empty for ${locale}`,
    );
    assert.ok(
      data.driftHub?.deployments?.notConfiguredTitle,
      `missing deployments empty for ${locale}`,
    );
    assert.ok(data.installations?.neverSynced, `missing neverSynced for ${locale}`);
    assert.ok(data.installations?.syncStale, `missing syncStale for ${locale}`);
  }

  const no = JSON.parse(
    readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"),
  ) as {
    nav: { publishAndVerify: string; kompisAi: string };
    driftHub: { tabs: { overview: string; platformHealth: string } };
  };
  assert.equal(no.nav.publishAndVerify, "Publisering og verifisering");
  assert.equal(no.nav.kompisAi, "Kompis");
  assert.equal(no.driftHub.tabs.overview, "Oversikt");
  assert.equal(no.driftHub.tabs.platformHealth, "Plattformstatus");
});

console.log("platform-drift-hub: all tests passed");
