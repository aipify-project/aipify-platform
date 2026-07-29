import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mapLookupLabel } from "./business-language";
import { buildPlatformPortalLabels } from "./labels";

const LOCALES = ["en", "no", "da", "sv", "pl", "uk"] as const;

function loadPlatform(locale: string) {
  return JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
}

function tFor(locale: string) {
  const dict = { platform: loadPlatform(locale) };
  return (key: string) => {
    const parts = key.split(".");
    let cur: unknown = dict;
    for (const part of parts) {
      if (!cur || typeof cur !== "object") return key;
      cur = (cur as Record<string, unknown>)[part];
    }
    return typeof cur === "string" ? cur : key;
  };
}

const FORBIDDEN_NO = [
  "PLATFORM Dashboard",
  "Operations Overview",
  "Platform Health",
  "Deployments",
  "Audit Logs",
  "INSTALLATION OVERSIGHT",
  "Data generated",
  "SUBSCRIPTIONS",
];

const no = loadPlatform("no");

assert.equal(no.portalStructure.dashboard.title, "Platformoversikt");
assert.match(
  no.portalStructure.dashboard.subtitle,
  /Samlet oversikt over kunder, avtaler, tjenester og plattformstatus/,
);
assert.equal(no.navGroups.operations, "Drift");
assert.equal(no.navGroups.customers, "Kunder");
assert.equal(no.navGroups.commercial, "Avtaler og salg");
assert.equal(no.navGroups.knowledge, "Kunnskap");
assert.equal(no.navGroups.product, "Produkt");
assert.equal(no.navGroups.auditGovernance, "Kontroll og styring");
assert.equal(no.nav.overview, "Platformoversikt");
assert.equal(no.nav.operationsOverview, "Driftsoversikt");
assert.equal(no.nav.platformHealth, "Plattformstatus");
assert.equal(no.nav.deployments, "Publiseringer");
assert.equal(no.nav.operationsAuditLogs, "Hendelseslogg");
assert.equal(no.nav.subscriptions, "Kundeavtaler");
assert.equal(no.nav.installationOversight, "Installasjonsoversikt");
assert.equal(no.portalStructure.dashboard.activeSubscriptions, "Aktive avtaler");
assert.equal(no.portalStructure.dashboard.published, "Publisert");
assert.equal(no.portalStructure.dashboard.lastChecked, "Sist kontrollert");
assert.equal(no.status.dashboard.unknown, "Ukjent status");
assert.equal(no.status.dashboard.healthy, "Normal drift");
assert.equal(no.status.dashboard.degraded, "Redusert drift");
assert.equal(no.status.dashboard.lifetime, "Ubegrenset");
assert.ok(no.navSearch?.results);
assert.ok(no.billingCommerceCenter?.nav?.commissions);

for (const needle of FORBIDDEN_NO) {
  const blob = JSON.stringify({
    dashboard: no.portalStructure.dashboard,
    navGroups: no.navGroups,
    nav: {
      overview: no.nav.overview,
      operationsOverview: no.nav.operationsOverview,
      platformHealth: no.nav.platformHealth,
      deployments: no.nav.deployments,
      operationsAuditLogs: no.nav.operationsAuditLogs,
      subscriptions: no.nav.subscriptions,
      installationOversight: no.nav.installationOversight,
    },
  });
  assert.equal(blob.includes(needle), false, `Norwegian UI still contains "${needle}"`);
}

for (const locale of LOCALES) {
  const data = loadPlatform(locale);
  assert.ok(data.portalStructure.dashboard.title);
  assert.ok(data.portalStructure.dashboard.subtitle);
  assert.ok(data.portalStructure.dashboard.updateClassifications.patch);
  assert.ok(data.navGroups.operations);
  assert.ok(data.navGroups.commercial);
  assert.ok(data.nav.overview);
  assert.ok(data.nav.deployments);
  assert.ok(data.navSearch.results);
  assert.ok(data.status.dashboard.unknown);
  const labels = buildPlatformPortalLabels(tFor(locale) as never);
  assert.ok(labels.dashboard.updateClassifications.security);
  assert.equal(
    mapLookupLabel("database_migration", labels.dashboard.updateClassifications, labels.dashboard.unknownStatus),
    labels.dashboard.updateClassifications.database_migration,
  );
  assert.equal(
    mapLookupLabel("not_a_real_status", labels.dashboard.updateClassifications, labels.dashboard.unknownStatus),
    labels.dashboard.unknownStatus,
  );
}

assert.notEqual(no.portalStructure.dashboard.title, loadPlatform("en").portalStructure.dashboard.title);
assert.notEqual(no.navGroups.operations, "Operations");
assert.notEqual(no.nav.subscriptions, "Subscriptions");

const panel = readFileSync(
  "components/platform/platform-portal/PlatformPortalDashboardPanel.tsx",
  "utf8",
);
assert.match(panel, /mapLookupLabel/);
assert.match(panel, /updateClassifications/);
assert.doesNotMatch(panel, /PLATFORM Dashboard/);
assert.doesNotMatch(panel, /Operations Overview/);

const customerDetail = readFileSync(
  "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
  "utf8",
);
assert.match(customerDetail, /website-kompis/);

console.log("platform-dashboard-business-language: all tests passed");
