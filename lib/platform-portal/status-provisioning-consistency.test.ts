import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canShowCreateLicenseAction,
  canShowDomainInstallationAction,
  deriveLicenseProvisioningStatus,
  hasAuthoritativeTrial,
  mapAgreementDisplayName,
  mapAgreementDuration,
  mapAgreementStatus,
  mapCustomerLifecycleStatus,
  mapDomainRole,
  mapLicenseProductName,
  mapLookupLabel,
  shouldShowTrialBadge,
} from "./business-language";

const ROOT = process.cwd();

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("no-false-trial-badge from customer.status=trial", () => {
  assert.equal(
    shouldShowTrialBadge({
      customerStatus: "trial",
      subscriptionStatus: "active",
      trialStartsAt: null,
      trialEndsAt: null,
    }),
    false,
  );
  assert.equal(
    mapCustomerLifecycleStatus({
      customerStatus: "trial",
      subscriptionStatus: "active",
      map: { trial: "Prøveperiode", active: "Aktiv" },
      agreementMap: { active: "Aktiv", trialing: "Prøveperiode" },
      unknownFallback: "Ukjent status",
    }),
    "Aktiv",
  );
});

test("trialing-shows-trial", () => {
  assert.equal(hasAuthoritativeTrial({ subscriptionStatus: "trialing" }), true);
  assert.equal(
    shouldShowTrialBadge({ subscriptionStatus: "trialing" }),
    true,
  );
  assert.equal(
    mapAgreementStatus({
      status: "trialing",
      map: { active: "Aktiv", trialing: "Prøveperiode" },
      unknownFallback: "Ukjent status",
    }),
    "Prøveperiode",
  );
});

test("active-unlimited-status", () => {
  assert.equal(
    mapAgreementStatus({
      status: "active",
      lifetime: true,
      map: { active: "Aktiv", trialing: "Prøveperiode" },
      unknownFallback: "Ukjent status",
    }),
    "Aktiv",
  );
  assert.equal(
    mapAgreementDuration("lifetime", { lifetime: "Ubegrenset" }, "Ukjent"),
    "Ubegrenset",
  );
});

test("Registry/Detail status parity helpers", () => {
  const shared = {
    customerStatus: "trial",
    subscriptionStatus: "active",
    map: { trial: "Prøveperiode", active: "Aktiv" },
    agreementMap: { active: "Aktiv", trialing: "Prøveperiode" },
    unknownFallback: "Ukjent status",
  };
  assert.equal(mapCustomerLifecycleStatus(shared), "Aktiv");
  assert.equal(
    mapAgreementStatus({
      status: "active",
      map: shared.agreementMap,
      unknownFallback: shared.unknownFallback,
    }),
    "Aktiv",
  );
});

test("agreement display-name mapping", () => {
  assert.equal(
    mapAgreementDisplayName({
      planName: "Unonight Lifetime",
      lifetime: true,
      customerName: "Unonight",
      labels: {
        unonightPilotAgreement: "Unonight pilotavtale",
        unonightUnlimitedAgreement: "Unonight ubegrenset avtale",
      },
    }),
    "Unonight pilotavtale",
  );
  assert.notEqual(
    mapAgreementDisplayName({
      planName: "Unonight Lifetime",
      lifetime: true,
      labels: {
        unonightPilotAgreement: "Unonight pilotavtale",
        unonightUnlimitedAgreement: "Unonight ubegrenset avtale",
      },
    }),
    "Unonight Lifetime",
  );
});

test("provisioning status derivation", () => {
  assert.equal(deriveLicenseProvisioningStatus({ domain: null }), "requires_domain");
  assert.equal(
    deriveLicenseProvisioningStatus({ domain: "example.com" }),
    "requires_installation",
  );
  assert.equal(
    deriveLicenseProvisioningStatus({
      domain: "example.com",
      installId: "180c9d31-3340-4633-b210-3b64edf1e1be",
      storedStatus: "requires_domain",
    }),
    "ready_for_activation",
  );
});

test("create-license action visibility", () => {
  assert.equal(
    canShowCreateLicenseAction({
      hasQualifiedAgreement: true,
      licenses: [{ status: "active", productCode: "app_subscription" }],
    }),
    false,
  );
  assert.equal(
    canShowCreateLicenseAction({
      hasQualifiedAgreement: true,
      licenses: [],
    }),
    true,
  );
});

test("domain-installation action visibility", () => {
  assert.equal(
    canShowDomainInstallationAction({
      licenses: [
        {
          status: "active",
          productCode: "app_subscription",
          domain: "unonight.com",
          provisioningStatus: "ready_for_activation",
        },
      ],
    }),
    false,
  );
  assert.equal(
    canShowDomainInstallationAction({
      licenses: [
        {
          status: "active",
          productCode: "app_subscription",
          domain: null,
          provisioningStatus: "requires_domain",
        },
      ],
    }),
    true,
  );
});

test("domain role mapping without guessing", () => {
  assert.equal(
    mapDomainRole({
      hostname: "unonight.com",
      installId: "abc",
      licenseDomain: "unonight.com",
    }),
    "license",
  );
  assert.equal(
    mapDomainRole({
      hostname: "unonight.aipify.app",
      isPrimary: true,
      installId: null,
      licenseDomain: "unonight.com",
    }),
    "customer",
  );
  assert.equal(
    mapDomainRole({
      hostname: "other.com",
      status: "removed",
    }),
    "historical",
  );
  assert.equal(mapDomainRole({ hostname: "other.com" }), "unknown");
});

test("expired trial dates are not authoritative", () => {
  assert.equal(
    hasAuthoritativeTrial({
      subscriptionStatus: "active",
      trialEndsAt: "2020-01-01T00:00:00.000Z",
      now: Date.parse("2026-07-15T00:00:00.000Z"),
    }),
    false,
  );
});

test("Detail panel source guards", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx"),
    "utf8",
  );
  assert.match(source, /mapCustomerLifecycleStatus/);
  assert.match(source, /mapAgreementDisplayName/);
  assert.match(source, /canShowCreateLicenseAction/);
  assert.match(source, /canShowDomainInstallationAction/);
  assert.match(source, /labels\.domainCountLabel/);
  assert.match(source, /labels\.installationCountLabel/);
  assert.match(source, /labels\.lastChecked/);
  assert.match(source, /labels\.viewLicense/);
  assert.match(source, /labels\.viewSetup/);
  assert.doesNotMatch(source, /\$\{usage\.domainCount\} · \$\{usage\.installationCount\}/);
  assert.doesNotMatch(source, /Unonight Lifetime/);
});

test("Registry panel source guards", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCustomersPanel.tsx"),
    "utf8",
  );
  assert.match(source, /mapCustomerLifecycleStatus/);
  assert.match(source, /mapAgreementDisplayName/);
});

test("Norwegian labels for status provisioning consistency", () => {
  const no = JSON.parse(readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"))
    .customers.detail as Record<string, unknown>;
  assert.equal(no.lastChecked, "Sist kontrollert");
  assert.equal(no.generatedAt, "Sist kontrollert");
  assert.equal(no.viewLicense, "Vis lisens");
  assert.equal(no.viewSetup, "Vis oppsett");
  assert.equal(no.domainCountLabel, "Domener");
  assert.equal(no.installationCountLabel, "Installasjoner");
  assert.equal(
    (no.agreementDisplayNames as Record<string, string>).unonightPilotAgreement,
    "Unonight pilotavtale",
  );
  assert.doesNotMatch(String(no.generatedAt), /Data generert/i);
  assert.equal(
    (no.domainRoles as Record<string, string>).license,
    "Lisensdomene",
  );
});

test("locale parity for new detail keys", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;
  function flatten(value: unknown, prefix = ""): Set<string> {
    const keys = new Set<string>();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      keys.add(prefix);
      return keys;
    }
    for (const [key, next] of Object.entries(value as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (next && typeof next === "object" && !Array.isArray(next)) {
        for (const child of flatten(next, path)) keys.add(child);
      } else {
        keys.add(path);
      }
    }
    return keys;
  }
  const en = JSON.parse(readFileSync(join(ROOT, "locales/en/platform.json"), "utf8"))
    .customers.detail;
  const baseline = flatten(en);
  for (const locale of locales) {
    const dict = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"))
      .customers.detail;
    assert.deepEqual([...flatten(dict)].sort(), [...baseline].sort(), locale);
  }
});

test("migration exists and is read-only", () => {
  const sql = readFileSync(
    join(
      ROOT,
      "supabase/migrations/20261934500000_platform_portal_customer_status_provisioning_consistency.sql",
    ),
    "utf8",
  );
  assert.match(sql, /_platform_portal_derive_license_provisioning_status/);
  assert.match(sql, /get_platform_portal_customer_detail/);
  assert.match(sql, /ready_for_activation/);
  assert.doesNotMatch(sql, /activate website kompis/i);
  assert.match(sql, /No Website Kompis activation/i);
  assert.doesNotMatch(sql, /insert into public\.(customers|installations|organization_domains)/i);
  assert.doesNotMatch(sql, /update public\.customers/i);
  assert.doesNotMatch(sql, /update public\.aipify_billing_license_links/i);
});

test("app_subscription product mapping still works", () => {
  assert.equal(
    mapLicenseProductName(
      "app_subscription",
      "lifetime",
      { app_subscription: { name: "Aipify APP-lisens" } },
      "Ukjent",
    ),
    "Aipify APP-lisens",
  );
  assert.equal(mapLookupLabel("weird", { active: "Aktiv" }, "Ukjent status"), "Ukjent status");
});

console.log("platform-portal-status-provisioning-consistency: all tests passed");
