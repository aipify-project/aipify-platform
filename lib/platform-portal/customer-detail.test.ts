import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parsePlatformPortalCustomerDetail } from "./parse";

const ROOT = join(process.cwd());

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

const UNONIGHT_ID = "32d748eb-9a66-4174-a416-18a813610d3e";
const UNONIGHT_COMPANY = "7126b75f-0cd9-4727-ab89-e7970df9a163";

function sampleRpcPayload(overrides: Record<string, unknown> = {}) {
  return {
    customer: {
      id: UNONIGHT_ID,
      company_id: UNONIGHT_COMPANY,
      name: "Unonight",
      legal_name: "Unonight AS",
      slug: "unonight",
      organization_number: "937978960",
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-06-01T00:00:00.000Z",
      requires_attention: false,
    },
    commercial: {
      lifetime: false,
      subscription_status: "active",
      plan_name: "Business",
      trial_starts_at: null,
      trial_ends_at: null,
      current_period_starts_at: "2024-06-01T00:00:00.000Z",
      current_period_ends_at: "2024-07-01T00:00:00.000Z",
      partner_attributed: false,
      partner_name: null,
    },
    usage: {
      member_count: 3,
      active_license_count: 1,
      total_license_count: 1,
      domain_count: 1,
      installation_count: 1,
      open_support_count: 0,
    },
    licenses: [
      {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        status: "active",
        product_code: "website_kompis",
        product_name: "Website Kompis",
        domain: "example.com",
        install_id: null,
        created_at: "2024-02-01T00:00:00.000Z",
        activated_at: "2024-02-01T00:00:00.000Z",
        expires_at: null,
      },
    ],
    domains: [
      {
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        hostname: "example.com",
        status: "verified",
        install_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        created_at: "2024-02-01T00:00:00.000Z",
        verified_at: "2024-02-02T00:00:00.000Z",
      },
    ],
    entitlements: [
      {
        id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
        code: "support_ai",
        name: "Support",
        status: "active",
        granted_at: "2024-02-01T00:00:00.000Z",
        expires_at: null,
      },
    ],
    metadata: {
      generated_at: "2024-07-01T12:00:00.000Z",
    },
    ...overrides,
  };
}

test("parser accepts authoritative Unonight-shaped RPC payload", () => {
  const parsed = parsePlatformPortalCustomerDetail(sampleRpcPayload());
  assert.ok(parsed);
  assert.equal(parsed.customer.id, UNONIGHT_ID);
  assert.equal(parsed.customer.companyId, UNONIGHT_COMPANY);
  assert.equal(parsed.customer.organizationNumber, "937978960");
  assert.equal(parsed.customer.slug, "unonight");
  assert.equal(parsed.usage.memberCount, 3);
  assert.equal(parsed.licenses.length, 1);
  assert.equal(parsed.domains.length, 1);
  assert.equal(parsed.entitlements.length, 1);
  assert.equal(parsed.metadata.generatedAt, "2024-07-01T12:00:00.000Z");
});

test("parser rejects structurally invalid payloads", () => {
  assert.equal(parsePlatformPortalCustomerDetail(null), null);
  assert.equal(parsePlatformPortalCustomerDetail({}), null);
  assert.equal(
    parsePlatformPortalCustomerDetail(
      sampleRpcPayload({
        customer: {
          id: UNONIGHT_ID,
          company_id: UNONIGHT_COMPANY,
          name: null,
          status: "active",
        },
      }),
    ),
    null,
  );
});

test("parser normalizes missing arrays and negative counts", () => {
  const parsed = parsePlatformPortalCustomerDetail(
    sampleRpcPayload({
      licenses: null,
      domains: undefined,
      entitlements: [{ id: "bad" }],
      usage: {
        member_count: -4,
        active_license_count: "2",
        total_license_count: "nan",
        domain_count: null,
        installation_count: 1,
        open_support_count: -1,
      },
    }),
  );
  assert.ok(parsed);
  assert.deepEqual(parsed.licenses, []);
  assert.deepEqual(parsed.domains, []);
  assert.deepEqual(parsed.entitlements, []);
  assert.equal(parsed.usage.memberCount, 0);
  assert.equal(parsed.usage.activeLicenseCount, 2);
  assert.equal(parsed.usage.totalLicenseCount, 0);
  assert.equal(parsed.usage.domainCount, 0);
  assert.equal(parsed.usage.openSupportCount, 0);
});

test("migration SQL defines read-only customer detail RPC with exclusions", () => {
  const sql = readFileSync(
    join(ROOT, "supabase/migrations/20261933900000_platform_portal_customer_detail.sql"),
    "utf8",
  );
  assert.match(sql, /get_platform_portal_customer_detail\(p_customer_id uuid\)/);
  assert.match(sql, /_ppsf258_require_platform_access\(\)/);
  assert.match(sql, /security definer/i);
  assert.match(sql, /set search_path = public/);
  assert.match(sql, /2697c432-d03d-44f6-839c-66200fd20b55/);
  assert.match(sql, /97a4bbcd-a223-47bd-9a3e-eadab02aaf1c/);
  assert.match(sql, /9a2a6eab-e47d-4473-9fd5-baee226d4db7/);
  assert.match(sql, /my-company-1/);
  assert.match(sql, /aipify_billing_license_links/);
  assert.match(sql, /organization_domains/);
  assert.match(sql, /organization_module_activations/);
  assert.doesNotMatch(sql, /\b(insert|update|delete)\b/i);
  assert.match(sql, /revoke all on function public\.get_platform_portal_customer_detail/);
  assert.match(sql, /grant execute on function public\.get_platform_portal_customer_detail/);
});

test("API route enforces UUID, auth statuses, no-store, and RPC-only access", () => {
  const source = readFileSync(
    join(ROOT, "app/api/platform-portal/customers/[id]/route.ts"),
    "utf8",
  );
  assert.match(source, /Cache-Control["']?\s*:\s*["']no-store["']/);
  assert.match(source, /jsonError\("Invalid customer id\.", 400\)/);
  assert.match(source, /jsonError\("Unauthorized", 401\)/);
  assert.match(source, /jsonError\("Forbidden", 403\)/);
  assert.match(source, /jsonError\("Customer not found\.", 404\)/);
  assert.match(source, /jsonError\("Unable to load customer detail\.", 500\)/);
  assert.match(source, /get_platform_portal_customer_detail/);
  assert.match(source, /parsePlatformPortalCustomerDetail/);
  assert.doesNotMatch(source, /\.from\(/);
});

test("customer detail page wires portal panel and labels", () => {
  const source = readFileSync(
    join(ROOT, "app/platform/customers/[id]/page.tsx"),
    "utf8",
  );
  assert.match(source, /PlatformPortalCustomerDetailPanel/);
  assert.match(source, /buildPlatformPortalCustomerDetailLabels/);
  assert.doesNotMatch(source, /CustomerMasterDetailView/);
});

test("panel is read-only, localized, and never shows raw statuses", () => {
  const source = readFileSync(
    join(ROOT, "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx"),
    "utf8",
  );
  assert.match(source, /w-full space-y-6/);
  assert.doesNotMatch(source, /max-w-\[/);
  assert.doesNotMatch(source, /createClient|supabase/);
  assert.doesNotMatch(source, /Delete customer|Edit customer|Coming soon|kommer snart/i);
  assert.doesNotMatch(source, /Suspend customer|pauseSubscription|generateInvoice/i);
  assert.match(source, /labels\.backToCustomers/);
  assert.match(source, /\/platform\/customers/);
  assert.match(source, /statusLabel\(/);
  assert.match(source, /emptyLicenses|emptyDomains|emptyEntitlements/);
  assert.match(source, /kind: "unauthorized"|kind: "forbidden"|kind: "notFound"/);
});

test("locale parity for platform.customers.detail across core locales", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

  function flatten(value: unknown, prefix = ""): Set<string> {
    const keys = new Set<string>();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      if (prefix) keys.add(prefix);
      return keys;
    }
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        for (const child of flatten(nested, next)) keys.add(child);
      } else {
        keys.add(next);
      }
    }
    return keys;
  }

  const dictionaries = Object.fromEntries(
    locales.map((locale) => {
      const json = JSON.parse(
        readFileSync(join(ROOT, `locales/${locale}/platform.json`), "utf8"),
      ) as { customers?: { detail?: unknown } };
      assert.ok(json.customers?.detail, `missing detail for ${locale}`);
      return [locale, json.customers.detail];
    }),
  );

  const baseline = flatten(dictionaries.en);
  for (const locale of locales) {
    const keys = flatten(dictionaries[locale]);
    assert.deepEqual(
      [...keys].sort(),
      [...baseline].sort(),
      `locale key mismatch for ${locale}`,
    );
  }

  const no = dictionaries.no as Record<string, string>;
  assert.equal(no.title, "Kundedetaljer");
  assert.equal(no.backToCustomers, "Tilbake til kunder");
  assert.equal(no.sectionBusiness, "Kunde og virksomhet");
  assert.equal(no.sectionCommercial, "Kundeavtale");
  assert.equal(no.sectionLicenses, "Lisenser og oppsett");
  assert.equal(no.sectionDomains, "Domener og installasjoner");
  assert.equal(no.sectionEntitlements, "Aktiverte tjenester");
  assert.equal(no.sectionStatus, "Kundestatus");
  assert.equal(no.organizationNumber, "Organisasjonsnummer");
  assert.equal(no.emptyLicenses, "Ingen lisenser er opprettet");
  assert.equal(no.notFound, "Kunden ble ikke funnet");
  assert.equal(no.forbidden, "Du har ikke tilgang til denne kunden");
  assert.equal(no.slug, "Kundenøkkel");
  assert.equal(no.lifetime, "Ubegrenset");
  assert.equal(no.duration, "Varighet");
  assert.equal(no.members, "Registrerte brukere");
});

console.log("platform-portal-customer-detail: all tests passed");
