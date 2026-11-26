import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildKompisAiGovernanceLabels } from "@/lib/platform/kompis-ai-labels";
import { buildPlatformHealthOperationsLabels } from "@/lib/platform-health-operations-center/labels";
import { buildPlatformPortalLabels } from "@/lib/platform-portal/labels";

const LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;

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

for (const locale of LOCALES) {
  const platform = loadPlatform(locale);
  assert.doesNotMatch(
    String(platform.overview?.note ?? ""),
    /Customer Control Center lives at \/dashboard/,
    `${locale} overview.note must not be the legacy customer placeholder`,
  );
  assert.ok(platform.overview?.loadErrorTitle, `${locale} overview.loadErrorTitle`);
  assert.ok(platform.overview?.linkPlatformHealth, `${locale} overview.linkPlatformHealth`);
  assert.ok(
    platform.platformHealthOperationsCenter?.loadErrorTitle,
    `${locale} health loadErrorTitle`,
  );
  assert.ok(platform.kompisAi?.scopeNote, `${locale} kompis scopeNote`);
  assert.ok(platform.kompisAi?.circuitBreakerHelp, `${locale} kompis circuitBreakerHelp`);
  assert.ok(
    platform.portalStructure?.dashboard?.customerOrganizations,
    `${locale} dashboard.customerOrganizations`,
  );
}

const noLabels = buildPlatformPortalLabels(tFor("no"));
assert.equal(noLabels.dashboard.customerOrganizations, "Kundeorganisasjoner");
assert.equal(noLabels.dashboard.activeSubscriptions, "Aktive kundeavtaler");
assert.equal(noLabels.dashboard.requiresActionTitle, "Krever handling");
assert.match(noLabels.dashboard.partnerScopeNote, /selgere/i);

const healthLabels = buildPlatformHealthOperationsLabels(tFor("no"));
assert.equal(healthLabels.retry, "Prøv igjen");
assert.match(healthLabels.unknownVerified, /ukjent/i);

const kompisLabels = buildKompisAiGovernanceLabels(tFor("no"));
assert.equal(kompisLabels.liveAiActive, "Provider tilgjengelig");
assert.equal(kompisLabels.ready, "Provider klar");
assert.match(kompisLabels.scopeNote, /Kompis Web/i);
assert.match(kompisLabels.circuitBreakerHelp, /sikkerhetsgaranti/i);

const dashboardPanel = readFileSync(
  "components/platform/platform-portal/PlatformPortalDashboardPanel.tsx",
  "utf8",
);
assert.match(dashboardPanel, /data-area="top-kpis"/);
assert.doesNotMatch(dashboardPanel, /data-area="quick-actions"/);
assert.match(dashboardPanel, /href="\/platform\/customers"/);
assert.match(dashboardPanel, /href="\/platform\/subscriptions"/);
assert.match(dashboardPanel, /href="\/platform\/support"/);
assert.doesNotMatch(dashboardPanel, /data-quick-action=/);

const overviewPanel = readFileSync("components/platform/PlatformOverviewPanel.tsx", "utf8");
assert.match(overviewPanel, /operationalLinksTitle/);
assert.match(overviewPanel, /\/platform\/operations\/platform-health/);
assert.doesNotMatch(overviewPanel, /AipifyEmptyState/);

const healthPanel = readFileSync(
  "components/platform/platform-health-operations-center/PlatformHealthOperationsCenterPanel.tsx",
  "utf8",
);
assert.match(healthPanel, /HEALTH_FETCH_TIMEOUT_MS/);
assert.match(healthPanel, /loadErrorTitle/);
assert.match(healthPanel, /AipifyLoader/);
assert.match(healthPanel, /finally/);

const kompisPanel = readFileSync(
  "components/platform/kompis-ai/KompisAiGovernancePanel.tsx",
  "utf8",
);
assert.match(kompisPanel, /scopeNote/);
assert.match(kompisPanel, /circuitBreakerHelp/);
assert.match(kompisPanel, /unverified/);

console.log("platform-dashboard-drift-premium-v2: ok");
