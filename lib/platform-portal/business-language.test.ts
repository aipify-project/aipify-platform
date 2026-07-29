import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  hasAuthoritativeTrial,
  mapAgreementDuration,
  mapAgreementStatus,
  mapLicenseProductName,
  mapLookupLabel,
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

test("lifetime maps to unlimited duration label", () => {
  assert.equal(
    mapAgreementDuration("lifetime", { lifetime: "Ubegrenset", monthly: "Månedlig", yearly: "Årlig" }, "Ukjent"),
    "Ubegrenset",
  );
});

test("monthly and yearly duration mapping", () => {
  const map = { lifetime: "Unlimited", monthly: "Monthly", yearly: "Yearly" };
  assert.equal(mapAgreementDuration("monthly", map, "Unknown"), "Monthly");
  assert.equal(mapAgreementDuration("yearly", map, "Unknown"), "Yearly");
  assert.equal(mapAgreementDuration("annual", map, "Unknown"), "Yearly");
});

test("trial only when authoritative", () => {
  assert.equal(hasAuthoritativeTrial({ subscriptionStatus: "trialing" }), true);
  assert.equal(
    hasAuthoritativeTrial({
      subscriptionStatus: "active",
      trialStartsAt: "2024-01-01",
    }),
    true,
  );
  assert.equal(
    hasAuthoritativeTrial({ subscriptionStatus: "active", trialStartsAt: null }),
    false,
  );
});

test("lifetime with non-authoritative trialing maps to active", () => {
  assert.equal(
    mapAgreementStatus({
      status: "trialing",
      lifetime: true,
      map: { active: "Aktiv", trialing: "Prøveperiode" },
      unknownFallback: "Ukjent status",
    }),
    "Aktiv",
  );
});

test("app_subscription maps to Aipify APP license", () => {
  assert.equal(
    mapLicenseProductName(
      "app_subscription",
      "lifetime",
      { app_subscription: { name: "Aipify APP-lisens" } },
      "Ukjent",
    ),
    "Aipify APP-lisens",
  );
  assert.equal(
    mapLicenseProductName(
      "app_subscription",
      "APP subscription license",
      { app_subscription: { name: "Aipify APP license" } },
      "Unknown",
    ),
    "Aipify APP license",
  );
});

test("unknown status fallback does not render raw value", () => {
  assert.equal(mapLookupLabel("weird_status", { active: "Aktiv" }, "Ukjent status"), "Ukjent status");
  assert.notEqual(mapLookupLabel("weird_status", { active: "Aktiv" }, "Ukjent status"), "weird_status");
});

test("Registry and Detail Norwegian business language labels", () => {
  const no = JSON.parse(readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"))
    .customers as Record<string, unknown>;
  assert.equal(no.columnMembers, "Registrerte brukere");
  assert.equal(no.columnSubscription, "Avtale");
  assert.equal(no.lifetime, "Ubegrenset");
  const detail = no.detail as Record<string, string>;
  assert.equal(detail.sectionCommercial, "Kundeavtale");
  assert.equal(detail.sectionLicenses, "Lisenser og oppsett");
  assert.equal(detail.slug, "Kundenøkkel");
  assert.equal(detail.members, "Registrerte brukere");
  assert.equal(detail.lifetime, "Ubegrenset");
  assert.equal(detail.duration, "Varighet");
  assert.equal(detail.managePlan, "Administrer avtale");
  assert.equal(detail.product, "Lisenspakke");
  assert.doesNotMatch(detail.sectionLicenses, /provisioning/i);
  assert.doesNotMatch(detail.slug, /slug/i);
  assert.doesNotMatch(detail.lifetime, /lifetime/i);
  const commercial = no.commercialPlan as Record<string, string>;
  assert.equal(commercial.title, "Kundeavtale");
  assert.equal(commercial.activate, "Aktiver avtale");
  assert.equal(commercial.activePlanConflict, "Kunden har allerede en aktiv avtale.");
  assert.match(commercial.activeAgreementChangeUnsupported, /støttes ikke/i);
  const license = no.licenseProvisioning as Record<string, unknown>;
  assert.equal(license.maskedLicenseCode, "Lisensnøkkel");
  assert.equal(license.provisioningStatus, "Oppsettstatus");
  assert.equal(license.alreadyExists, "Kunden har allerede denne lisensen.");
  assert.equal(
    (license.productNames as Record<string, string>).app_subscription,
    "Aipify APP-lisens",
  );
  assert.doesNotMatch(String(license.maskedLicenseCode), /maskert/i);
  assert.doesNotMatch(String(license.provisioningStatus), /provisioning/i);
  const domain = no.domainInstallation as Record<string, string>;
  assert.equal(domain.eligibleLicenses, "Lisenser klare for oppsett");
  assert.equal(domain.canonicalHostname, "Standardisert domenenavn");
  assert.equal(domain.installId, "Installasjonsnøkkel");
  assert.doesNotMatch(domain.canonicalHostname, /canonical/i);
  assert.doesNotMatch(domain.installId, /InstallId/i);
});

test("Commercial modal read-only conflict UI", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCommercialPlanPanel.tsx"),
    "utf8",
  );
  assert.match(source, /activeAgreementChangeUnsupported/);
  assert.match(source, /blocked \? \(/);
  assert.match(source, /labels\.close/);
  assert.doesNotMatch(source, /disabled=\{\s*blocked\s*\|\|/);
});

test("License modal existing-license read-only", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalLicenseProvisioningPanel.tsx"),
    "utf8",
  );
  assert.match(source, /readOnlyConflict/);
  assert.match(source, /mapLicenseProductName/);
  assert.doesNotMatch(source, /\{product\.code\}/);
});

test("Domain modal conflict read-only", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalDomainInstallationPanel.tsx"),
    "utf8",
  );
  assert.match(source, /domainConflict/);
  assert.match(source, /conflictReadOnly/);
  assert.match(source, /labels\.close/);
});

test("Detail panel uses duration and customer key terminology", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx"),
    "utf8",
  );
  assert.match(source, /labels\.duration/);
  assert.match(source, /labels\.domainCountLabel/);
  assert.match(source, /labels\.installationCountLabel/);
  assert.match(source, /mapLicenseProductName/);
  assert.match(source, /hasAuthoritativeTrial/);
  assert.match(source, /slugHelp/);
});

test("locale parity for business language keys", () => {
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

  const sections = ["detail", "commercialPlan", "licenseProvisioning", "domainInstallation"] as const;

  for (const section of sections) {
    const en = JSON.parse(readFileSync(join(ROOT, "locales/en/platform.json"), "utf8"))
      .customers[section];
    const baseline = flatten(en);
    for (const locale of locales) {
      const dict = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"))
        .customers[section];
      assert.deepEqual(
        [...flatten(dict)].sort(),
        [...baseline].sort(),
        `${section} key mismatch for ${locale}`,
      );
    }
  }

  for (const locale of locales) {
    const customers = JSON.parse(readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"))
      .customers as Record<string, unknown>;
    assert.ok(typeof customers.columnMembers === "string");
    assert.ok(typeof customers.lifetime === "string");
    assert.ok(
      (customers.detail as Record<string, unknown>).duration,
      `missing detail.duration in ${locale}`,
    );
    assert.ok(
      (customers.commercialPlan as Record<string, unknown>).activeAgreementChangeUnsupported,
    );
    assert.ok((customers.licenseProvisioning as Record<string, unknown>).close);
    assert.ok((customers.domainInstallation as Record<string, unknown>).conflictReadOnly);
  }

  const noValues = JSON.parse(readFileSync(join(ROOT, "locales/no/platform.json"), "utf8"))
    .customers as {
    detail: Record<string, string>;
    commercialPlan: Record<string, string>;
  };
  assert.notEqual(noValues.detail.lifetime, "Lifetime");
  assert.notEqual(noValues.detail.slug, "Slug");
  assert.notEqual(noValues.commercialPlan.title, "Commercial plan");
});

console.log("platform-portal-business-language: all tests passed");
