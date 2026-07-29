import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  filterPlatformLicenses,
  looksLikeFullLicenseKey,
  normalizeLicenseStatus,
  normalizeProvisioningStatus,
  parsePlatformLicensesOverview,
  type PlatformLicenseRow,
} from "./licenses-overview";
import { mapLicenseProductName } from "./business-language";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

const migration = readFileSync(
  "supabase/migrations/20261934900000_platform_portal_licenses_overview.sql",
  "utf8",
);
const apiRoute = readFileSync("app/api/platform-portal/licenses/route.ts", "utf8");
const page = readFileSync("app/platform/licenses/page.tsx", "utf8");
const panel = readFileSync(
  "components/platform/platform-portal/PlatformLicensesOverviewPanel.tsx",
  "utf8",
);
const agreementsPanel = readFileSync(
  "components/platform/platform-portal/PlatformCustomerAgreementsOverviewPanel.tsx",
  "utf8",
);
const successPanel = readFileSync(
  "components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel.tsx",
  "utf8",
);
const nav = readFileSync("lib/platform/nav-config.ts", "utf8");

const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

function sampleLicense(overrides: Partial<PlatformLicenseRow> = {}): PlatformLicenseRow {
  return {
    licenseId: "l1111111-1111-4111-8111-111111111111",
    customerId: "32d748eb-9a66-4174-a416-18a813610d3e",
    companyId: "7126b75f-0cd9-4727-ab89-e7970df9a163",
    customerKey: "unonight",
    companyName: "Unonight",
    registrationNumber: "123456789",
    countryCode: "NO",
    licenseProductCode: "app_subscription",
    licenseStatus: "active",
    rawLicenseStatus: "active",
    provisioningStatus: "active",
    rawProvisioningStatus: "active",
    maskedLicenseKey: "AIP-****************************CDEF",
    agreement: {
      status: "active",
      duration: "lifetime",
      name: "Unonight Lifetime",
    },
    domain: {
      hostname: "unonight.com",
      status: "active",
      verified: true,
    },
    installation: {
      id: "i1111111-1111-4111-8111-111111111111",
      installId: "i1111111-1111-4111-8111-111111111111",
      status: "active",
    },
    services: {
      activeCount: 1,
      websiteKompisStatus: "active",
    },
    createdAt: "2026-06-10T15:00:00.000Z",
    activatedAt: null,
    expiresAt: null,
    ...overrides,
  };
}

test("migration creates only the read-only overview RPC", () => {
  assert.match(migration, /get_platform_portal_licenses_overview/);
  assert.match(migration, /_ppsf258_require_platform_access/);
  assert.match(migration, /security definer/i);
  assert.match(migration, /set search_path = public/);
  assert.match(migration, /_ube586_mask_license_key/);
  assert.match(migration, /_platform_portal_derive_license_provisioning_status/);
  assert.match(migration, /aipify_billing_license_links/);
  assert.match(migration, /my-company-1/);
  assert.doesNotMatch(migration, /create table/i);
  assert.doesNotMatch(migration, /insert into/i);
  assert.doesNotMatch(migration, /update\s+public\./i);
  assert.doesNotMatch(migration, /delete from/i);
  assert.doesNotMatch(migration, /'license_key',\s*ll\.license_key/);
});

test("API route is protected and read-only", () => {
  assert.match(apiRoute, /getUser\(\)/);
  assert.match(apiRoute, /Unauthorized/);
  assert.match(apiRoute, /Forbidden/);
  assert.match(apiRoute, /no-store/);
  assert.match(apiRoute, /get_platform_portal_licenses_overview/);
});

test("licenses page and nav wiring", () => {
  assert.match(page, /PlatformLicensesOverviewPanel/);
  assert.match(page, /buildPlatformLicensesOverviewLabels/);
  assert.match(nav, /href: "\/platform\/licenses"/);
  assert.match(nav, /platform\.nav\.licenses/);
  assert.match(nav, /pathname\.startsWith\("\/platform\/licenses"\)/);
});

test("loading uses centered AipifyLoader without white strip", () => {
  assert.match(panel, /AipifyLoader/);
  assert.match(panel, /min-h-\[240px\]/);
  assert.match(panel, /!bg-transparent/);
  assert.doesNotMatch(panel, /TableSkeleton/);
});

test("panel never exposes full license key or raw product as primary", () => {
  assert.match(panel, /looksLikeFullLicenseKey/);
  assert.match(panel, /mapLicenseProductName/);
  assert.match(panel, /\/platform\/customers\/\$\{/);
  assert.doesNotMatch(panel, /license_key(?!s)/);
});

test("parser handles overview payload", () => {
  const parsed = parsePlatformLicensesOverview({
    generated_at: "2026-07-15T10:00:00.000Z",
    metrics: {
      total_licenses: 1,
      active_licenses: 1,
      pending_licenses: 0,
      attention_licenses: 0,
      ready_for_activation_licenses: 0,
      active_setup_licenses: 1,
    },
    licenses: [
      {
        license_id: "l1111111-1111-4111-8111-111111111111",
        customer_id: "32d748eb-9a66-4174-a416-18a813610d3e",
        company_name: "Unonight",
        customer_key: "unonight",
        license_product_code: "app_subscription",
        license_status: "active",
        provisioning_status: "active",
        masked_license_key: "AIP-****************************CDEF",
        agreement: { status: "active", duration: "lifetime", name: "Unonight Lifetime" },
        domain: { hostname: "unonight.com", status: "active", verified: true },
        installation: {
          id: "i1111111-1111-4111-8111-111111111111",
          install_id: "i1111111-1111-4111-8111-111111111111",
          status: "active",
        },
        services: { active_count: 1, website_kompis_status: "active" },
        activated_at: null,
        expires_at: null,
      },
    ],
  });
  assert.equal(parsed.licenses.length, 1);
  assert.equal(parsed.metrics.activeSetupLicenses, 1);
  assert.equal(parsed.licenses[0]?.domain.hostname, "unonight.com");
  assert.equal(parsed.licenses[0]?.licenseProductCode, "app_subscription");
  assert.equal(parsed.licenses[0]?.activatedAt, null);
  assert.equal(parsed.licenses[0]?.expiresAt, null);
});

test("parser recovers metrics and rejects malformed rows", () => {
  const parsed = parsePlatformLicensesOverview({
    licenses: [
      {
        license_id: "l2222222-2222-4222-8222-222222222222",
        customer_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        company_name: "Acme",
        customer_key: "acme",
        license_product_code: "app_subscription",
        license_status: "suspended",
        provisioning_status: "requires_domain",
      },
      null,
      { broken: true },
    ],
  });
  assert.equal(parsed.licenses.length, 1);
  assert.equal(parsed.metrics.totalLicenses, 1);
  assert.equal(parsed.metrics.attentionLicenses, 1);
});

test("status and provisioning mapping", () => {
  assert.equal(normalizeLicenseStatus("active"), "active");
  assert.equal(normalizeLicenseStatus("pending"), "pending");
  assert.equal(normalizeLicenseStatus("suspended"), "suspended");
  assert.equal(normalizeLicenseStatus("expired"), "expired");
  assert.equal(normalizeLicenseStatus("cancelled"), "cancelled");
  assert.equal(normalizeLicenseStatus("canceled"), "cancelled");
  assert.equal(normalizeLicenseStatus("revoked"), "revoked");
  assert.equal(normalizeLicenseStatus("weird"), "unknown");
  assert.equal(normalizeProvisioningStatus("requires_domain"), "requires_domain");
  assert.equal(normalizeProvisioningStatus("requires_installation"), "requires_installation");
  assert.equal(normalizeProvisioningStatus("ready_for_activation"), "ready_for_activation");
  assert.equal(normalizeProvisioningStatus("active"), "active");
  assert.equal(normalizeProvisioningStatus("provisioned"), "active");
  assert.equal(normalizeProvisioningStatus("failed"), "failed");
  assert.equal(normalizeProvisioningStatus("odd"), "unknown");
});

test("app_subscription product mapping", () => {
  assert.equal(
    mapLicenseProductName("app_subscription", null, {
      app_subscription: { name: "Aipify APP-lisens" },
    }, "Ukjent"),
    "Aipify APP-lisens",
  );
});

test("masked license key helpers", () => {
  assert.equal(looksLikeFullLicenseKey("AIP-****************************CDEF"), false);
  assert.equal(looksLikeFullLicenseKey("AIP-SUB-ABCDEF0123456789ABCDEF"), true);
  assert.equal(looksLikeFullLicenseKey(null), false);
});

test("search and filters", () => {
  const rows = [
    sampleLicense(),
    sampleLicense({
      licenseId: "l2222222-2222-4222-8222-222222222222",
      customerId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      customerKey: "acme",
      companyName: "Acme AS",
      registrationNumber: "99887766",
      licenseStatus: "pending",
      rawLicenseStatus: "pending",
      provisioningStatus: "requires_domain",
      rawProvisioningStatus: "requires_domain",
      maskedLicenseKey: "AIP-****************************AAAA",
      agreement: { status: "active", duration: "monthly", name: "Business Monthly" },
      domain: { hostname: "acme.example", status: "pending", verified: false },
      installation: { id: null, installId: null, status: null },
      countryCode: "SE",
      services: { activeCount: 0, websiteKompisStatus: "not_ready" },
    }),
  ];
  assert.equal(filterPlatformLicenses(rows, { query: "unonight" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, { query: "acme" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, { query: "99887766" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, { query: "unonight.com" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, { status: "active" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, { status: "pending" }).length, 1);
  assert.equal(
    filterPlatformLicenses(rows, { provisioning: "requires_domain" }).length,
    1,
  );
  assert.equal(
    filterPlatformLicenses(rows, { productCode: "app_subscription" }).length,
    2,
  );
  assert.equal(filterPlatformLicenses(rows, { countryCode: "NO" }).length, 1);
  assert.equal(filterPlatformLicenses(rows, {}).length, 2);
});

test("locale parity for licensesOverview", () => {
  const en = JSON.parse(readFileSync("locales/en/platform.json", "utf8"));
  const enKeys = Object.keys(en.customers.licensesOverview).sort();
  for (const locale of locales) {
    const data = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
    assert.deepEqual(
      Object.keys(data.customers.licensesOverview).sort(),
      enKeys,
      `locale ${locale}`,
    );
    assert.ok(data.nav.licenses);
  }
  const no = JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers
    .licensesOverview;
  assert.equal(no.title, "Lisenser");
  assert.equal(no.productNames.app_subscription, "Aipify APP-lisens");
  assert.doesNotMatch(no.productNames.app_subscription, /app_subscription/);
  assert.equal(no.provisioningStatuses.requires_domain, "Domene må kobles til");
  assert.equal(no.emptyTitle, "Ingen kundelisenser");
});

test("Customer Agreements and Success loading regressions preserved", () => {
  assert.match(agreementsPanel, /AipifyLoader/);
  assert.match(agreementsPanel, /!bg-transparent/);
  assert.doesNotMatch(agreementsPanel, /TableSkeleton/);
  assert.match(successPanel, /AipifyLoader/);
  assert.doesNotMatch(successPanel, /TableSkeleton/);
});

console.log("\nAll licenses overview tests passed.");
