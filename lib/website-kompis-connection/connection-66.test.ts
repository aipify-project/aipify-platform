/**
 * Job 66 — Kompis Web connection / license / domain visibility contract.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  CONNECTION_UNSUPPORTED_WITHOUT_MIGRATION,
  WEBSITE_KOMPIS_CONNECTION_CENTER_VERSION,
  WEBSITE_KOMPIS_CONNECTION_TRUTH_SOURCES,
} from "@/lib/website-kompis-connection/source-inventory";
import {
  connectionShowsActiveLicenseWithoutPublicView,
  websiteKompisLicenseStatusKey,
} from "@/lib/website-kompis-connection/customer-copy";
import {
  buildConnectionStatusSummary,
  composeConnectionAggregate,
  maskWebsiteKompisInstallId,
} from "@/lib/website-kompis-connection/status-model";

const ROOT = process.cwd();

assert.equal(FOUNDATION_NAV_BINDINGS.kompisWebConnection, "/app/website-kompis/connection");
assert.equal(WEBSITE_KOMPIS_CONNECTION_CENTER_VERSION, "66.1");

const byId = Object.fromEntries(
  WEBSITE_KOMPIS_CONNECTION_TRUTH_SOURCES.map((row) => [row.id, row]),
);
assert.equal(byId.page_visibility.customerCanMutate, false);
assert.equal(byId.public_runtime.customerCanMutate, false);
assert.ok(CONNECTION_UNSUPPORTED_WITHOUT_MIGRATION.includes("app_install_heartbeat_last_seen"));
assert.ok(
  CONNECTION_UNSUPPORTED_WITHOUT_MIGRATION.includes("customer_editable_page_include_exclude_rules"),
);

assert.equal(maskWebsiteKompisInstallId("abcdef12-3456-7890-abcd-ef1234567890"), "abcd…7890");
assert.equal(maskWebsiteKompisInstallId(null), null);

assert.equal(
  composeConnectionAggregate([
    { id: "product", state: "ok" },
    { id: "subscription", state: "ok" },
    { id: "license", state: "ok" },
    { id: "domain", state: "ok" },
    { id: "installation", state: "ok" },
    { id: "public_runtime", state: "unavailable" },
  ]),
  "active",
);

assert.equal(
  composeConnectionAggregate([
    { id: "product", state: "ok" },
    { id: "subscription", state: "ok" },
    { id: "license", state: "suspended" },
    { id: "domain", state: "ok" },
    { id: "installation", state: "ok" },
    { id: "public_runtime", state: "unavailable" },
  ]),
  "suspended",
);

const activeSummary = buildConnectionStatusSummary({
  orgContextState: "ready",
  planName: "Business",
  licenseStatus: "active",
  productEnabled: true,
  canManage: true,
  domainCenterLoaded: true,
  accessDenied: false,
  pendingDomainCount: 0,
  domains: [
    {
      domainId: "d1",
      domain: "customer.example",
      isPrimary: true,
      domainStatus: "active",
      verificationStatus: "verified",
      licenseStatus: "active",
      hasCustomerBinding: true,
      bindingVerified: true,
      hasInstallId: true,
      installIdMasked: "abcd…7890",
    },
  ],
  correlationSeed: "tenant01",
});
assert.equal(activeSummary.aggregate, "active");
assert.equal(activeSummary.diagnosis, "all_clear");
assert.equal(activeSummary.pageVisibilityEditable, false);
assert.equal(activeSummary.runtimeLastSeenAvailable, false);
assert.equal(connectionShowsActiveLicenseWithoutPublicView(activeSummary), true);
assert.equal(websiteKompisLicenseStatusKey("active"), "active");
assert.equal(websiteKompisLicenseStatusKey("ACTIVE"), "active");
assert.equal(websiteKompisLicenseStatusKey("ready"), "unknown");
assert.equal(websiteKompisLicenseStatusKey(null), "unknown");
assert.match(activeSummary.supportReference, /^WK-CONN-/);

const noDomain = buildConnectionStatusSummary({
  orgContextState: "ready",
  planName: "Business",
  licenseStatus: "active",
  productEnabled: true,
  canManage: true,
  domainCenterLoaded: true,
  accessDenied: false,
  pendingDomainCount: 0,
  domains: [],
});
assert.equal(noDomain.aggregate, "unconfigured");
assert.equal(noDomain.diagnosis, "no_domain");

const page = readFileSync(join(ROOT, "app/app/website-kompis/connection/page.tsx"), "utf8");
assert.match(page, /WebsiteKompisConnectionCenterPanel/);
assert.match(page, /loadWebsiteKompisConnectionSummary/);
assert.match(page, /DomainLicenseCenterPanel/);
assert.doesNotMatch(page, /force.?active|kompis_design_studio/i);

const hub = readFileSync(join(ROOT, "app/app/website-kompis/page.tsx"), "utf8");
assert.match(hub, /loadWebsiteKompisConnectionSummary/);
assert.match(hub, /section=domains/);
assert.match(hub, /section=help/);

const panel = readFileSync(
  join(ROOT, "components/app/website-kompis/WebsiteKompisConnectionCenterPanel.tsx"),
  "utf8",
);
assert.match(panel, /activeLicenseRuntimeUnavailable/);
assert.match(panel, /websiteKompisLicenseStatusKey/);
assert.doesNotMatch(panel, /summary\.licenseStatus \?\?/);
assert.match(panel, /pageVisibilityNoRules/);
assert.match(panel, /installNeverSecrets/);
assert.match(panel, /accountSubscription/);
assert.doesNotMatch(panel, /private[_-]?key|secret_key/i);

function flatten(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      flatten(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

const en = JSON.parse(readFileSync(join(ROOT, "locales/en/customer-app/core.json"), "utf8"))
  .websiteKompisConnection;
const enKeys = flatten(en).sort();
for (const locale of ["en", "no", "sv", "da", "pl", "uk"] as const) {
  const block = JSON.parse(
    readFileSync(join(ROOT, `locales/${locale}/customer-app/core.json`), "utf8"),
  ).websiteKompisConnection;
  assert.ok(block, `missing websiteKompisConnection in ${locale}`);
  assert.deepEqual(flatten(block).sort(), enKeys, `key parity ${locale}`);
}

const norwegianConnection = JSON.parse(
  readFileSync(join(ROOT, "locales/no/customer-app/core.json"), "utf8"),
).websiteKompisConnection;
assert.equal(
  norwegianConnection.activeLicenseRuntimeUnavailable,
  "Lisensen er aktiv, men offentlig Kompis Web-visning er ikke tilgjengelig ennå.",
);
assert.equal(norwegianConnection.checkpoints.public_runtime, "Offentlig visning");
assert.equal(norwegianConnection.licenseStatusValue.active, "Aktiv");

console.log("connection-66.test.ts: OK");
