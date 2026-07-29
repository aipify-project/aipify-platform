import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  agreementStatusVariant,
  filterCustomerAgreements,
  formatAgreementAmount,
  normalizeAgreementDuration,
  normalizeAgreementStatus,
  parsePlatformCustomerAgreementsOverview,
  type PlatformCustomerAgreement,
} from "./customer-agreements";

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
  "supabase/migrations/20261934800000_platform_portal_customer_agreements_overview.sql",
  "utf8",
);
const apiRoute = readFileSync(
  "app/api/platform-portal/customer-agreements/route.ts",
  "utf8",
);
const page = readFileSync("app/platform/subscriptions/page.tsx", "utf8");
const panel = readFileSync(
  "components/platform/platform-portal/PlatformCustomerAgreementsOverviewPanel.tsx",
  "utf8",
);
const successPanel = readFileSync(
  "components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel.tsx",
  "utf8",
);
const customersPage = readFileSync("app/platform/customers/page.tsx", "utf8");
const dashboardPage = readFileSync("app/platform/page.tsx", "utf8");

const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

function sampleAgreement(
  overrides: Partial<PlatformCustomerAgreement> = {},
): PlatformCustomerAgreement {
  return {
    agreementId: "a1111111-1111-4111-8111-111111111111",
    customerId: "32d748eb-9a66-4174-a416-18a813610d3e",
    companyId: "7126b75f-0cd9-4727-ab89-e7970df9a163",
    customerKey: "unonight",
    companyName: "Unonight",
    registrationNumber: "123456789",
    countryCode: "NO",
    agreementName: "Unonight Lifetime",
    planKey: "lifetime",
    planType: "lifetime",
    agreementStatus: "active",
    rawAgreementStatus: "active",
    duration: "lifetime",
    rawDuration: "lifetime",
    isCurrent: true,
    startedAt: "2025-01-01T00:00:00.000Z",
    endsAt: null,
    trialStartsAt: null,
    trialEndsAt: null,
    renewsAt: null,
    pausedAt: null,
    cancelledAt: null,
    currency: "NOK",
    amount: 0,
    billingInterval: "lifetime",
    ...overrides,
  };
}

test("migration creates only the read-only overview RPC", () => {
  assert.match(migration, /get_platform_portal_customer_agreements_overview/);
  assert.match(migration, /_ppsf258_require_platform_access/);
  assert.match(migration, /security definer/i);
  assert.match(migration, /set search_path = public/);
  assert.match(
    migration,
    /revoke all on function public\.get_platform_portal_customer_agreements_overview\(\)/,
  );
  assert.match(
    migration,
    /grant execute on function public\.get_platform_portal_customer_agreements_overview\(\)\s+to authenticated/,
  );
  assert.doesNotMatch(migration, /create table/i);
  assert.doesNotMatch(migration, /insert into/i);
  assert.doesNotMatch(migration, /update\s+public\./i);
  assert.doesNotMatch(migration, /delete from/i);
  assert.match(migration, /my-company-1/);
  assert.match(migration, /2697c432-d03d-44f6-839c-66200fd20b55/);
  assert.match(migration, /is_platform/);
  assert.match(migration, /from public\.subscriptions/);
});

test("API route is protected and read-only", () => {
  assert.match(apiRoute, /getUser\(\)/);
  assert.match(apiRoute, /Unauthorized/);
  assert.match(apiRoute, /Forbidden/);
  assert.match(apiRoute, /no-store/);
  assert.match(apiRoute, /get_platform_portal_customer_agreements_overview/);
  assert.doesNotMatch(apiRoute, /\.insert\(/);
  assert.doesNotMatch(apiRoute, /\.update\(/);
  assert.doesNotMatch(apiRoute, /\.delete\(/);
});

test("subscriptions page uses agreements panel", () => {
  assert.match(page, /PlatformCustomerAgreementsOverviewPanel/);
  assert.match(page, /buildPlatformCustomerAgreementsLabels/);
  assert.doesNotMatch(page, /redirect\(/);
});

test("loading uses centered AipifyLoader without white strip", () => {
  assert.match(panel, /AipifyLoader/);
  assert.match(panel, /min-h-\[240px\]/);
  assert.match(panel, /items-center justify-center/);
  assert.match(panel, /!bg-transparent/);
  assert.doesNotMatch(panel, /TableSkeleton/);
});

test("panel links to Customer Detail and avoids raw status labels", () => {
  assert.match(panel, /\/platform\/customers\/\$\{agreement\.customerId\}/);
  assert.match(panel, /mapAgreementDisplayName/);
  assert.doesNotMatch(panel, /\{agreement\.rawAgreementStatus\}/);
  assert.doesNotMatch(panel, /Lifetime(?!Agreement)/);
});

test("parser handles overview payload", () => {
  const parsed = parsePlatformCustomerAgreementsOverview({
    generated_at: "2026-07-15T10:00:00.000Z",
    metrics: {
      total_agreements: 1,
      active_agreements: 1,
      trial_agreements: 0,
      attention_agreements: 0,
      ended_agreements: 0,
      unlimited_agreements: 1,
    },
    agreements: [
      {
        agreement_id: "a1111111-1111-4111-8111-111111111111",
        customer_id: "32d748eb-9a66-4174-a416-18a813610d3e",
        company_id: "7126b75f-0cd9-4727-ab89-e7970df9a163",
        customer_key: "unonight",
        company_name: "Unonight",
        registration_number: "123456789",
        country_code: "NO",
        agreement_name: "Unonight Lifetime",
        plan_key: "lifetime",
        plan_type: "lifetime",
        agreement_status: "active",
        duration: "lifetime",
        is_current: true,
        started_at: "2025-01-01T00:00:00Z",
        ends_at: null,
        trial_starts_at: null,
        trial_ends_at: null,
        renews_at: null,
        paused_at: null,
        cancelled_at: null,
        currency: "nok",
        amount: 0,
        billing_interval: "lifetime",
      },
    ],
  });

  assert.equal(parsed.agreements.length, 1);
  assert.equal(parsed.metrics.totalAgreements, 1);
  assert.equal(parsed.metrics.unlimitedAgreements, 1);
  assert.equal(parsed.agreements[0]?.agreementStatus, "active");
  assert.equal(parsed.agreements[0]?.duration, "lifetime");
  assert.equal(parsed.agreements[0]?.currency, "NOK");
  assert.equal(parsed.agreements[0]?.isCurrent, true);
  assert.equal(parsed.generatedAt, "2026-07-15T10:00:00.000Z");
});

test("parser recovers metrics from rows and handles malformed payload", () => {
  const parsed = parsePlatformCustomerAgreementsOverview({
    generated_at: "not-a-date",
    agreements: [
      {
        agreement_id: "a1111111-1111-4111-8111-111111111111",
        customer_id: "32d748eb-9a66-4174-a416-18a813610d3e",
        company_name: "Acme",
        customer_key: "acme",
        agreement_name: "Growth",
        agreement_status: "past_due",
        duration: "monthly",
      },
      { not_an_agreement: true },
      null,
    ],
  });
  assert.equal(parsed.agreements.length, 1);
  assert.equal(parsed.metrics.totalAgreements, 1);
  assert.equal(parsed.metrics.attentionAgreements, 1);
  assert.equal(parsed.generatedAt, new Date(0).toISOString());
});

test("parser missing array becomes empty", () => {
  const parsed = parsePlatformCustomerAgreementsOverview({ metrics: {} });
  assert.deepEqual(parsed.agreements, []);
  assert.equal(parsed.metrics.totalAgreements, 0);
});

test("status mapping covers known and unknown values", () => {
  assert.equal(normalizeAgreementStatus("active"), "active");
  assert.equal(normalizeAgreementStatus("trialing"), "trialing");
  assert.equal(normalizeAgreementStatus("pending"), "pending");
  assert.equal(normalizeAgreementStatus("past_due"), "past_due");
  assert.equal(normalizeAgreementStatus("paused"), "paused");
  assert.equal(normalizeAgreementStatus("suspended"), "suspended");
  assert.equal(normalizeAgreementStatus("cancelled"), "cancelled");
  assert.equal(normalizeAgreementStatus("canceled"), "cancelled");
  assert.equal(normalizeAgreementStatus("expired"), "expired");
  assert.equal(normalizeAgreementStatus("weird"), "unknown");
  assert.equal(agreementStatusVariant("active"), "success");
  assert.equal(agreementStatusVariant("trialing"), "warning");
  assert.equal(agreementStatusVariant("past_due"), "danger");
  assert.equal(agreementStatusVariant("cancelled"), "muted");
});

test("duration mapping covers monthly yearly unlimited and annual", () => {
  assert.equal(normalizeAgreementDuration("monthly"), "monthly");
  assert.equal(normalizeAgreementDuration("yearly"), "yearly");
  assert.equal(normalizeAgreementDuration("annual"), "yearly");
  assert.equal(normalizeAgreementDuration("lifetime"), "lifetime");
  assert.equal(normalizeAgreementDuration("odd"), "unknown");
});

test("null renewal amount and currency handling", () => {
  const agreement = sampleAgreement({
    renewsAt: null,
    amount: null,
    currency: null,
  });
  assert.equal(agreement.renewsAt, null);
  assert.equal(formatAgreementAmount(null, "NOK", "en"), null);
  assert.equal(formatAgreementAmount(100, null, "en"), null);
  assert.match(formatAgreementAmount(6999, "NOK", "en") ?? "", /6.?999|NOK|kr/i);
});

test("search and filters", () => {
  const rows = [
    sampleAgreement(),
    sampleAgreement({
      agreementId: "a2222222-2222-4222-8222-222222222222",
      customerId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      customerKey: "acme",
      companyName: "Acme AS",
      registrationNumber: "99887766",
      agreementName: "Business Monthly",
      planKey: "business",
      planType: "business",
      agreementStatus: "trialing",
      rawAgreementStatus: "trialing",
      duration: "monthly",
      rawDuration: "monthly",
      countryCode: "SE",
    }),
    sampleAgreement({
      agreementId: "a3333333-3333-4333-8333-333333333333",
      customerId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      customerKey: "past",
      companyName: "Past Co",
      agreementName: "Enterprise Yearly",
      planKey: "enterprise",
      planType: "enterprise",
      agreementStatus: "cancelled",
      rawAgreementStatus: "cancelled",
      duration: "yearly",
      rawDuration: "yearly",
    }),
  ];

  assert.equal(filterCustomerAgreements(rows, { query: "unonight" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { query: "acme" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { query: "99887766" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { query: "business" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { status: "active" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { status: "trialing" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { status: "ended" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { duration: "lifetime" }).length, 1);
  assert.equal(filterCustomerAgreements(rows, { duration: "monthly" }).length, 1);
  assert.equal(
    filterCustomerAgreements(rows, {
      query: "zzz",
      status: "all",
      duration: "all",
    }).length,
    0,
  );
  assert.equal(filterCustomerAgreements(rows, {}).length, 3);
});

test("locale parity for agreementsOverview", () => {
  const en = JSON.parse(readFileSync("locales/en/platform.json", "utf8"));
  const enKeys = Object.keys(en.customers.agreementsOverview).sort();
  for (const locale of locales) {
    const data = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
    assert.deepEqual(
      Object.keys(data.customers.agreementsOverview).sort(),
      enKeys,
      `locale ${locale} key mismatch`,
    );
  }
  const no = JSON.parse(readFileSync("locales/no/platform.json", "utf8")).customers
    .agreementsOverview;
  assert.equal(no.title, "Kundeavtaler");
  assert.equal(no.durationLabels.lifetime, "Ubegrenset");
  assert.doesNotMatch(no.durationLabels.lifetime, /lifetime/i);
  assert.equal(no.agreementStatuses.trialing, "Prøveperiode");
  assert.equal(no.emptyTitle, "Ingen kundeavtaler");
});

test("Customer Success loading fix preserved", () => {
  assert.match(successPanel, /AipifyLoader/);
  assert.match(successPanel, /!bg-transparent/);
  assert.doesNotMatch(successPanel, /TableSkeleton/);
});

test("Customer Registry and Dashboard pages unchanged by this feature", () => {
  assert.match(customersPage, /./);
  assert.match(dashboardPage, /./);
  assert.doesNotMatch(customersPage, /customer-agreements/);
  assert.doesNotMatch(dashboardPage, /customer-agreements/);
});

console.log("\nAll customer agreements overview tests passed.");
