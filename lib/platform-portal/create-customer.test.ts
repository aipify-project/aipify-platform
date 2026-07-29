import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isReservedCustomerSlug,
  mapCreateCustomerRpcError,
  normalizeCustomerSlug,
  normalizeOrganizationNumber,
  parseCustomerCreationInput,
  parsePlatformPortalCustomerCreationResult,
  suggestCustomerSlug,
} from "./create-customer";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("normalizes organization number to nine digits", () => {
  assert.equal(normalizeOrganizationNumber("937 978 960"), "937978960");
  assert.equal(normalizeOrganizationNumber("NO937978960"), "937978960");
  assert.equal(normalizeOrganizationNumber("123"), null);
});

test("normalizes and validates slug", () => {
  assert.equal(normalizeCustomerSlug(" Acme Corp "), "acme-corp");
  assert.equal(normalizeCustomerSlug("--Acme--Corp--"), "acme-corp");
  assert.equal(normalizeCustomerSlug("a"), null);
  assert.equal(suggestCustomerSlug("Hello World"), "hello-world");
});

test("reserved slug protection", () => {
  assert.equal(isReservedCustomerSlug("platform"), true);
  assert.equal(isReservedCustomerSlug("my-company-1"), true);
  assert.equal(isReservedCustomerSlug("acme"), false);
});

test("parser accepts valid creation input", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "937 978 960",
    legalName: "Example AS",
    displayName: "Example",
    slug: "Example Customer",
    country: "no",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.organizationNumber, "937978960");
  assert.equal(parsed.value.slug, "example-customer");
  assert.equal(parsed.value.country, "NO");
});

test("parser rejects unknown fields", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "937978960",
    legalName: "Example AS",
    displayName: "Example",
    slug: "example",
    country: "NO",
    lifetime: true,
  });
  assert.equal(parsed.ok, false);
});

test("parser rejects invalid organization number", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "123",
    legalName: "Example AS",
    displayName: "Example",
    slug: "example",
  });
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "invalid_organization_number");
});

test("result parser maps snake_case RPC payload", () => {
  const parsed = parsePlatformPortalCustomerCreationResult({
    customer: {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      company_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Example",
      legal_name: "Example AS",
      slug: "example",
      organization_number: "937978960",
      status: "active",
      created_at: "2024-01-01T00:00:00.000Z",
    },
    created: {
      company: true,
      organization: true,
      customer: true,
      registration_profile: false,
      payment_profile: false,
    },
  });
  assert.ok(parsed);
  assert.equal(parsed.customer.companyId, "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
  assert.equal(parsed.created.registrationProfile, false);
  assert.equal(parsed.created.paymentProfile, false);
});

test("result parser rejects missing UUID", () => {
  assert.equal(
    parsePlatformPortalCustomerCreationResult({
      customer: {
        id: "not-a-uuid",
        company_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        name: "Example",
        status: "active",
      },
      created: {
        company: true,
        organization: true,
        customer: true,
        registration_profile: false,
        payment_profile: false,
      },
    }),
    null,
  );
});

test("maps RPC duplicate and auth errors", () => {
  assert.deepEqual(mapCreateCustomerRpcError("DUPLICATE_ORGANIZATION_NUMBER"), {
    status: 409,
    code: "duplicate_organization_number",
  });
  assert.deepEqual(mapCreateCustomerRpcError("DUPLICATE_SLUG"), {
    status: 409,
    code: "duplicate_slug",
  });
  assert.deepEqual(mapCreateCustomerRpcError("Platform portal access denied"), {
    status: 403,
    code: "forbidden",
  });
  assert.deepEqual(mapCreateCustomerRpcError("INVALID_ORGANIZATION_NUMBER"), {
    status: 400,
    code: "invalid_organization_number",
  });
});

test("migration defines create_platform_portal_customer with grants", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/20261934000000_platform_portal_customer_creation.sql"),
    "utf8",
  );
  assert.match(sql, /create_platform_portal_customer/);
  assert.match(sql, /_ppsf258_require_platform_access/);
  assert.match(sql, /_mta_sync_organization_from_customer/);
  assert.match(sql, /DUPLICATE_ORGANIZATION_NUMBER/);
  assert.match(sql, /DUPLICATE_SLUG/);
  assert.match(sql, /RESERVED_SLUG/);
  assert.match(sql, /security definer/);
  assert.match(sql, /revoke all on function public\.create_platform_portal_customer/);
  assert.match(sql, /grant execute on function public\.create_platform_portal_customer/);
  assert.doesNotMatch(sql, /stripe/i);
  assert.doesNotMatch(sql, /fiken/i);
  assert.doesNotMatch(sql, /insert into public\.subscriptions/i);
  assert.doesNotMatch(sql, /organization_registration_profiles/i);
  assert.doesNotMatch(sql, /payment_profiles/i);
});

test("POST route calls create RPC only and preserves GET", () => {
  const route = readFileSync(
    join(process.cwd(), "app/api/platform-portal/customers/route.ts"),
    "utf8",
  );
  assert.match(route, /export async function GET/);
  assert.match(route, /export async function POST/);
  assert.match(route, /create_platform_portal_customer/);
  assert.match(route, /get_platform_portal_customers/);
  assert.match(route, /status: 201/);
  assert.match(route, /Cache-Control": "no-store"/);
  assert.doesNotMatch(route, /\.from\(/);
});

test("company lookup route uses Brreg helper and Platform auth", () => {
  const route = readFileSync(
    join(
      process.cwd(),
      "app/api/platform-portal/customers/company-lookup/route.ts",
    ),
    "utf8",
  );
  assert.match(route, /validateNorwegianOrganization/);
  assert.match(route, /get_platform_portal_customers/);
  assert.match(route, /Unauthorized/);
  assert.doesNotMatch(route, /rawResponse/);
});

test("creation panel has required UX states and submit lock", () => {
  const panel = readFileSync(
    join(
      process.cwd(),
      "components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx",
    ),
    "utf8",
  );
  assert.match(panel, /lookupLoading/);
  assert.match(panel, /lookupSuccess/);
  assert.match(panel, /lookupNotFound/);
  assert.match(panel, /lookupUnavailable/);
  assert.match(panel, /duplicateOrganizationNumber/);
  assert.match(panel, /duplicateSlug/);
  assert.match(panel, /submitting/);
  assert.match(panel, /disabled=\{isSubmitting/);
  assert.match(panel, /submit\.kind === "submitting"/);
  assert.match(panel, /router\.push\(`\/platform\/customers\/\$\{customerId\}`\)/);
});

test("locale parity for creation namespace", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;
  const required = [
    "title",
    "description",
    "backToCustomers",
    "sectionIdentity",
    "sectionPlatform",
    "sectionSummary",
    "organizationNumber",
    "legalName",
    "customerName",
    "slug",
    "country",
    "lookupAction",
    "lookupLoading",
    "lookupSuccess",
    "lookupNotFound",
    "lookupUnavailable",
    "invalidOrganizationNumber",
    "duplicateOrganizationNumber",
    "invalidSlug",
    "duplicateSlug",
    "reservedSlug",
    "summaryTitle",
    "createsTitle",
    "createsNotTitle",
    "submit",
    "cancel",
    "submitting",
    "success",
    "error",
    "unauthorized",
    "forbidden",
    "retry",
    "slugPreview",
    "addressUnavailableNote",
  ];

  const en = JSON.parse(
    readFileSync(join(process.cwd(), "locales/en/platform.json"), "utf8"),
  ) as { customers: { creation: Record<string, unknown>; createCustomer: string } };

  for (const locale of locales) {
    const json = JSON.parse(
      readFileSync(join(process.cwd(), `locales/${locale}/platform.json`), "utf8"),
    ) as { customers: { creation: Record<string, unknown>; createCustomer: string } };
    assert.ok(json.customers.createCustomer);
    for (const key of required) {
      assert.ok(json.customers.creation[key], `${locale} missing ${key}`);
    }
    assert.deepEqual(
      Object.keys(json.customers.creation).sort(),
      Object.keys(en.customers.creation).sort(),
      `${locale} creation key mismatch`,
    );
  }

  assert.equal(
    (JSON.parse(readFileSync(join(process.cwd(), "locales/no/platform.json"), "utf8")) as {
      customers: { creation: { title: string; submit: string } };
    }).customers.creation.title,
    "Opprett kunde",
  );
});

test("registry panel exposes create customer CTA", () => {
  const panel = readFileSync(
    join(process.cwd(), "components/platform/platform-portal/PlatformPortalCustomersPanel.tsx"),
    "utf8",
  );
  assert.match(panel, /\/platform\/customers\/new/);
  assert.match(panel, /labels\.createCustomer/);
});

console.log("all create-customer tests passed");
