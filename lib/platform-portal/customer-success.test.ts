import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  deriveSuccessStatusFromReasons,
  filterCustomerSuccessCustomers,
  parsePlatformCustomerSuccessOverview,
  primarySuccessReasonCode,
  type PlatformCustomerSuccessCustomer,
  type PlatformCustomerSuccessReasonCode,
} from "./customer-success";

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
  "supabase/migrations/20261934700000_platform_portal_customer_success_overview.sql",
  "utf8",
);
const apiRoute = readFileSync(
  "app/api/platform-portal/customer-success/route.ts",
  "utf8",
);
const page = readFileSync("app/platform/customer-success/page.tsx", "utf8");
const panel = readFileSync(
  "components/platform/platform-portal/PlatformCustomerSuccessOverviewPanel.tsx",
  "utf8",
);

const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

function sampleCustomer(
  overrides: Partial<PlatformCustomerSuccessCustomer> = {},
): PlatformCustomerSuccessCustomer {
  return {
    customerId: "32d748eb-9a66-4174-a416-18a813610d3e",
    companyId: "7126b75f-0cd9-4727-ab89-e7970df9a163",
    customerKey: "unonight",
    companyName: "Unonight",
    organizationNumber: "123456789",
    countryCode: "NO",
    lifecycleStatus: "active",
    successStatus: "healthy",
    successReasonCodes: [
      "agreement_active",
      "license_active",
      "service_active",
      "setup_complete",
    ],
    agreement: {
      status: "active",
      duration: "lifetime",
      trialEndsAt: null,
    },
    license: {
      count: 1,
      activeCount: 1,
      primaryStatus: "active",
      provisioningStatus: "active",
    },
    domains: {
      count: 1,
      verifiedCount: 1,
      primaryDomain: "unonight.com",
    },
    installations: {
      count: 1,
      activeCount: 1,
      revokedCount: 0,
    },
    services: {
      activeCount: 1,
      websiteKompisStatus: "active",
    },
    registeredUsers: 2,
    support: { openCount: 0 },
    lastRelevantActivityAt: "2026-07-01T12:00:00.000Z",
    ...overrides,
  };
}

test("migration creates only the read-only overview RPC", () => {
  assert.match(migration, /get_platform_portal_customer_success_overview/);
  assert.match(migration, /_ppsf258_require_platform_access/);
  assert.match(migration, /security definer/i);
  assert.match(migration, /set search_path = public/);
  assert.match(
    migration,
    /revoke all on function public\.get_platform_portal_customer_success_overview\(\)/,
  );
  assert.match(
    migration,
    /grant execute on function public\.get_platform_portal_customer_success_overview\(\)\s+to authenticated/,
  );
  assert.doesNotMatch(migration, /create table/i);
  assert.doesNotMatch(migration, /insert into/i);
  assert.doesNotMatch(migration, /update\s+public\./i);
  assert.doesNotMatch(migration, /delete from/i);
  assert.match(migration, /my-company-1/);
  assert.match(migration, /2697c432-d03d-44f6-839c-66200fd20b55/);
  assert.match(migration, /9a2a6eab-e47d-4473-9fd5-baee226d4db7/);
  assert.match(migration, /97a4bbcd-a223-47bd-9a3e-eadab02aaf1c/);
});

test("parser handles overview payload", () => {
  const parsed = parsePlatformCustomerSuccessOverview({
    generated_at: "2026-07-15T10:00:00.000Z",
    metrics: {
      total_customers: 1,
      healthy_customers: 1,
      attention_customers: 0,
      critical_customers: 0,
      incomplete_customers: 0,
      unknown_customers: 0,
    },
    customers: [
      {
        customer_id: "32d748eb-9a66-4174-a416-18a813610d3e",
        company_id: "7126b75f-0cd9-4727-ab89-e7970df9a163",
        customer_key: "unonight",
        company_name: "Unonight",
        organization_number: "123456789",
        country_code: "NO",
        lifecycle_status: "active",
        success_status: "healthy",
        success_reason_codes: ["setup_complete", "service_active"],
        agreement: {
          status: "active",
          duration: "lifetime",
          trial_ends_at: null,
        },
        license: {
          count: 1,
          active_count: 1,
          primary_status: "active",
          provisioning_status: "active",
        },
        domains: {
          count: 1,
          verified_count: 1,
          primary_domain: "unonight.com",
        },
        installations: { count: 1, active_count: 1, revoked_count: 0 },
        services: { active_count: 1, website_kompis_status: "active" },
        registered_users: 2,
        support: { open_count: 0 },
        last_relevant_activity_at: "2026-07-01T12:00:00.000Z",
      },
    ],
  });

  assert.equal(parsed.generatedAt, "2026-07-15T10:00:00.000Z");
  assert.equal(parsed.metrics.totalCustomers, 1);
  assert.equal(parsed.customers.length, 1);
  assert.equal(parsed.customers[0]?.companyName, "Unonight");
  assert.equal(parsed.customers[0]?.agreement.trialEndsAt, null);
  assert.equal(parsed.customers[0]?.registeredUsers, 2);
  assert.equal(parsed.customers[0]?.support.openCount, 0);
});

test("parser normalizes malformed payload", () => {
  const parsed = parsePlatformCustomerSuccessOverview({
    generated_at: "not-a-date",
    metrics: null,
    customers: null,
  });
  assert.equal(parsed.generatedAt, new Date(0).toISOString());
  assert.equal(parsed.metrics.totalCustomers, 0);
  assert.deepEqual(parsed.customers, []);
});

test("parser normalizes missing arrays and unknown status", () => {
  const parsed = parsePlatformCustomerSuccessOverview({
    generated_at: "2026-07-15T10:00:00.000Z",
    customers: [
      {
        customer_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        company_name: "Example",
        success_status: "invented",
        success_reason_codes: ["agreement_missing", "not_a_code"],
      },
    ],
  });
  assert.equal(parsed.customers[0]?.successStatus, "unknown");
  assert.deepEqual(parsed.customers[0]?.successReasonCodes, ["agreement_missing"]);
  assert.equal(parsed.metrics.totalCustomers, 1);
  assert.equal(parsed.metrics.unknownCustomers, 1);
});

test("null registered users and support handling", () => {
  const parsed = parsePlatformCustomerSuccessOverview({
    generated_at: "2026-07-15T10:00:00.000Z",
    customers: [
      {
        customer_id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        company_name: "Example",
        success_status: "incomplete",
        registered_users: null,
        support: { open_count: null },
      },
    ],
  });
  assert.equal(parsed.customers[0]?.registeredUsers, null);
  assert.equal(parsed.customers[0]?.support.openCount, null);
});

test("status priority critical > attention > incomplete > healthy > unknown", () => {
  assert.equal(
    deriveSuccessStatusFromReasons(["setup_complete", "agreement_suspended"]),
    "critical",
  );
  assert.equal(
    deriveSuccessStatusFromReasons(["setup_complete", "domain_missing"]),
    "attention",
  );
  assert.equal(
    deriveSuccessStatusFromReasons(["license_missing", "agreement_active"]),
    "incomplete",
  );
  assert.equal(deriveSuccessStatusFromReasons(["setup_complete"]), "healthy");
  assert.equal(deriveSuccessStatusFromReasons([]), "unknown");
});

test("suspended agreement is critical", () => {
  assert.equal(deriveSuccessStatusFromReasons(["agreement_suspended"]), "critical");
});

test("missing license is incomplete", () => {
  assert.equal(deriveSuccessStatusFromReasons(["license_missing"]), "incomplete");
});

test("missing domain is attention", () => {
  assert.equal(deriveSuccessStatusFromReasons(["domain_missing"]), "attention");
});

test("revoked installation is critical", () => {
  assert.equal(deriveSuccessStatusFromReasons(["installation_revoked"]), "critical");
});

test("service ready for activation is attention", () => {
  assert.equal(
    deriveSuccessStatusFromReasons(["service_ready_for_activation"]),
    "attention",
  );
});

test("active Website Kompis remains a healthy signal", () => {
  const codes: PlatformCustomerSuccessReasonCode[] = [
    "agreement_active",
    "license_active",
    "service_active",
    "setup_complete",
  ];
  assert.equal(deriveSuccessStatusFromReasons(codes), "healthy");
  assert.equal(
    primarySuccessReasonCode(sampleCustomer({ successReasonCodes: codes })),
    "setup_complete",
  );
});

test("UI maps reason codes through labels", () => {
  assert.equal(panel.includes("success_reason_codes"), false);
  assert.match(panel, /labels\.reasonCodes/);
  assert.doesNotMatch(panel, /health score/i);
  assert.doesNotMatch(panel, /churn/i);
});

{
  const customers = [
    sampleCustomer(),
    sampleCustomer({
      customerId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      customerKey: "acme",
      companyName: "Acme AS",
      organizationNumber: "998877665",
      countryCode: "SE",
      successStatus: "attention",
      successReasonCodes: ["domain_missing"],
      agreement: { status: "trialing", duration: "monthly", trialEndsAt: null },
      license: {
        count: 1,
        activeCount: 1,
        primaryStatus: "active",
        provisioningStatus: "requires_domain",
      },
      domains: { count: 0, verifiedCount: 0, primaryDomain: null },
      services: { activeCount: 0, websiteKompisStatus: "not_ready" },
    }),
  ];

  test("search by customer name and key", () => {
    assert.equal(
      filterCustomerSuccessCustomers(customers, { query: "unonight" }).length,
      1,
    );
    assert.equal(filterCustomerSuccessCustomers(customers, { query: "Acme" }).length, 1);
    assert.equal(
      filterCustomerSuccessCustomers(customers, { query: "998877665" }).length,
      1,
    );
    assert.equal(
      filterCustomerSuccessCustomers(customers, { query: "unonight.com" }).length,
      1,
    );
  });

  test("status and secondary filters", () => {
    assert.equal(
      filterCustomerSuccessCustomers(customers, { status: "healthy" }).length,
      1,
    );
    assert.equal(
      filterCustomerSuccessCustomers(customers, { status: "attention" }).length,
      1,
    );
    assert.equal(
      filterCustomerSuccessCustomers(customers, { agreementStatus: "active" }).length,
      1,
    );
    assert.equal(
      filterCustomerSuccessCustomers(customers, { countryCode: "SE" }).length,
      1,
    );
  });

  test("reset filters returns full set", () => {
    assert.equal(
      filterCustomerSuccessCustomers(customers, {
        query: "",
        status: "all",
        agreementStatus: "all",
        licenseStatus: "all",
        serviceStatus: "all",
        countryCode: "all",
      }).length,
      2,
    );
  });
}

test("API protects auth and controlled errors", () => {
  assert.match(apiRoute, /getUser/);
  assert.match(apiRoute, /Unauthorized/);
  assert.match(apiRoute, /Forbidden/);
  assert.match(apiRoute, /Cache-Control": "no-store"/);
  assert.match(apiRoute, /get_platform_portal_customer_success_overview/);
  assert.match(apiRoute, /parsePlatformCustomerSuccessOverview/);
  assert.match(apiRoute, /Unable to load customer success overview/);
});

test("page and panel wire Customer Detail links and states", () => {
  assert.match(page, /PlatformCustomerSuccessOverviewPanel/);
  assert.match(panel, /\/platform\/customers\/\$\{customer\.customerId\}/);
  assert.match(panel, /labels\.openCustomer/);
  assert.match(panel, /filteredEmptyTitle/);
  assert.match(panel, /emptyTitle/);
  assert.match(panel, /errorTitle/);
  assert.match(panel, /AipifyLoader/);
  assert.match(panel, /items-center justify-center/);
  assert.match(panel, /!bg-transparent/);
  assert.doesNotMatch(panel, /TableSkeleton/);
});

test("locale parity for successOverview", () => {
  const en = JSON.parse(readFileSync("locales/en/platform.json", "utf8"));
  const enKeys = Object.keys(en.customers.successOverview).sort();
  for (const locale of locales) {
    const data = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
    assert.deepEqual(Object.keys(data.customers.successOverview).sort(), enKeys);
  }
});

test("Norwegian business language without English fallback", () => {
  const no = JSON.parse(readFileSync("locales/no/platform.json", "utf8"));
  const overview = no.customers.successOverview;
  assert.equal(overview.title, "Kundesuksess");
  assert.match(overview.subtitle, /kundeavtaler/);
  assert.equal(overview.kpiHealthy, "God status");
  assert.equal(overview.kpiAttention, "Trenger oppfølging");
  assert.equal(overview.kpiCritical, "Kritisk");
  assert.equal(overview.kpiIncomplete, "Ikke ferdig konfigurert");
  assert.equal(overview.filterUnknown, "Ukjent status");
  assert.equal(overview.openCustomer, "Åpne kunde");
  assert.equal(overview.reasonCodes.setup_complete, "Kundens oppsett er komplett");
  assert.equal(overview.reasonCodes.status_unknown, "Status kan ikke fastslås");
  assert.doesNotMatch(
    JSON.stringify(overview),
    /Health score|Churn|Provisioning|payload|RPC/i,
  );
});

test("regression: migration does not rewrite frozen RPCs", () => {
  assert.doesNotMatch(migration, /create or replace function public\.get_platform_portal_customers\(/);
  assert.doesNotMatch(
    migration,
    /create or replace function public\.get_platform_portal_customer_detail\(/,
  );
  assert.doesNotMatch(migration, /activate_platform_portal_customer_website_kompis/);
  assert.doesNotMatch(
    migration,
    /create or replace function public\.get_platform_portal_dashboard\(/,
  );
});

console.log("customer-success overview tests passed");
