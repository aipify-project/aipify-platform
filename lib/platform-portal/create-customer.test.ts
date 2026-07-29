import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  classifyNorwegianCompanyQuery,
  mapBrregEnhet,
} from "../brreg/validate-organization";
import {
  isValidIsoAlpha2Country,
  listIsoAlpha2Countries,
  countryHasCompanyLookupProvider,
} from "./countries";
import {
  isReservedCustomerSlug,
  mapCreateCustomerRpcError,
  normalizeCustomerSlug,
  normalizeOrganizationNumber,
  normalizeRegistrationNumber,
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

test("classifies Brreg org number and name queries", () => {
  assert.deepEqual(classifyNorwegianCompanyQuery("937 978 960"), {
    kind: "organization_number",
    value: "937978960",
  });
  assert.deepEqual(classifyNorwegianCompanyQuery("Aipify"), {
    kind: "name",
    value: "Aipify",
  });
  assert.equal(classifyNorwegianCompanyQuery("a").kind, "invalid");
  assert.equal(classifyNorwegianCompanyQuery("").kind, "invalid");
});

test("maps Brreg enhet without leaking secrets", () => {
  const mapped = mapBrregEnhet({
    organisasjonsnummer: "937978960",
    navn: "Example AS",
    organisasjonsform: { kode: "AS", beskrivelse: "Aksjeselskap" },
    forretningsadresse: {
      adresse: ["Gate 1"],
      postnummer: "0150",
      poststed: "OSLO",
    },
  });
  assert.ok(mapped);
  assert.equal(mapped?.registrationNumber, "937978960");
  assert.equal(mapped?.city, "OSLO");
  assert.equal(mapped?.organizationType, "AS — Aksjeselskap");
});

test("global ISO country list is not Norway-locked", () => {
  const countries = listIsoAlpha2Countries("en");
  assert.ok(countries.length > 50);
  assert.ok(countries.some((c) => c.code === "NO"));
  assert.ok(countries.some((c) => c.code === "US"));
  assert.ok(countries.some((c) => c.code === "DE"));
  assert.equal(isValidIsoAlpha2Country("NO"), true);
  assert.equal(isValidIsoAlpha2Country("XX"), false);
  assert.equal(countryHasCompanyLookupProvider("NO"), true);
  assert.equal(countryHasCompanyLookupProvider("SE"), false);
});

test("normalizes Norwegian organization number to nine digits", () => {
  assert.equal(normalizeOrganizationNumber("937 978 960"), "937978960");
  assert.equal(normalizeOrganizationNumber("NO937978960"), "937978960");
  assert.equal(normalizeOrganizationNumber("123"), null);
  assert.equal(normalizeRegistrationNumber("NO", "937 978 960"), "937978960");
});

test("non-Norwegian registration numbers preserve alphanumeric form", () => {
  assert.equal(normalizeRegistrationNumber("SE", "556677-8899"), "556677-8899");
  assert.equal(normalizeRegistrationNumber("GB", "AB123456"), "AB123456");
  assert.equal(normalizeRegistrationNumber("US", "12-3456789"), "12-3456789");
  assert.equal(normalizeRegistrationNumber("DE", " HRB 12345 "), "HRB 12345");
  assert.equal(normalizeRegistrationNumber("SE", "1"), null);
  assert.equal(normalizeRegistrationNumber("SE", ""), null);
  // Must not strip letters for non-NO
  assert.notEqual(normalizeRegistrationNumber("GB", "AB123456"), "123456");
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

test("parser accepts Norwegian creation input", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "937 978 960",
    legalName: "Example AS",
    displayName: "Example",
    slug: "Example Customer",
    country: "no",
    verificationSource: "brreg",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.organizationNumber, "937978960");
  assert.equal(parsed.value.slug, "example-customer");
  assert.equal(parsed.value.country, "NO");
  assert.equal(parsed.value.verificationSource, "brreg");
});

test("parser accepts non-Norwegian alphanumeric registration number", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "AB-12 345",
    legalName: "Example Ltd",
    displayName: "Example",
    slug: "example-uk",
    country: "GB",
    verificationSource: "operator",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.organizationNumber, "AB-12 345");
  assert.equal(parsed.value.country, "GB");
});

test("parser rejects Brreg verification for non-NO", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "AB123456",
    legalName: "Example Ltd",
    displayName: "Example",
    slug: "example-uk",
    country: "GB",
    verificationSource: "brreg",
  });
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "invalid_verification_source");
});

test("parser requires country and does not default to NO", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "937978960",
    legalName: "Example AS",
    displayName: "Example",
    slug: "example",
  });
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.code, "invalid_country");
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

test("parser rejects invalid Norwegian organization number", () => {
  const parsed = parseCustomerCreationInput({
    organizationNumber: "123",
    legalName: "Example AS",
    displayName: "Example",
    slug: "example",
    country: "NO",
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

test("maps RPC duplicate and auth errors", () => {
  assert.deepEqual(mapCreateCustomerRpcError("DUPLICATE_ORGANIZATION_NUMBER"), {
    status: 409,
    code: "duplicate_organization_number",
  });
  assert.deepEqual(mapCreateCustomerRpcError("Platform portal access denied"), {
    status: 403,
    code: "forbidden",
  });
});

test("global identity migration updates RPC without Norway-only lock", () => {
  const sql = readFileSync(
    join(
      process.cwd(),
      "supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql",
    ),
    "utf8",
  );
  assert.match(sql, /create_platform_portal_customer/);
  assert.match(sql, /v_country = 'NO'/);
  assert.match(sql, /upper\(coalesce\(nullif\(btrim\(cu\.country\)/);
  assert.match(sql, /char_length\(v_org_number\) > 64/);
  assert.match(sql, /'UTC'/);
  assert.doesNotMatch(sql, /p_country text default 'NO'/);
  assert.doesNotMatch(sql, /stripe/i);
  assert.doesNotMatch(sql, /fiken/i);
});

test("company lookup route supports name/number and non-NO unavailable", () => {
  const route = readFileSync(
    join(process.cwd(), "app/api/platform-portal/customers/company-lookup/route.ts"),
    "utf8",
  );
  assert.match(route, /searchNorwegianCompanies/);
  assert.match(route, /lookup_unavailable/);
  assert.match(route, /countryCode/);
  assert.match(route, /query/);
  assert.doesNotMatch(route, /rawResponse/);
});

test("creation panel has country-first flow and no initial error banner", () => {
  const panel = readFileSync(
    join(
      process.cwd(),
      "components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx",
    ),
    "utf8",
  );
  assert.match(panel, /listIsoAlpha2Countries/);
  assert.match(panel, /searchNorwegianCompany/);
  assert.match(panel, /registrationNumber/);
  assert.match(panel, /showOrgError/);
  assert.match(panel, /submitted/);
  assert.match(panel, /noValidate/);
  assert.match(panel, /disabled=\{!canSubmit\}/);
  assert.doesNotMatch(panel, /useState\("NO"\)/);
});

test("locale parity for creation namespace", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;
  const en = JSON.parse(
    readFileSync(join(process.cwd(), "locales/en/platform.json"), "utf8"),
  ) as { customers: { creation: Record<string, unknown> } };
  const enKeys = Object.keys(en.customers.creation).sort();
  for (const locale of locales) {
    const dict = JSON.parse(
      readFileSync(join(process.cwd(), `locales/${locale}/platform.json`), "utf8"),
    ) as { customers: { creation: Record<string, unknown> } };
    assert.deepEqual(Object.keys(dict.customers.creation).sort(), enKeys, locale);
  }
  assert.equal(
    (
      JSON.parse(readFileSync(join(process.cwd(), "locales/no/platform.json"), "utf8")) as {
        customers: { creation: { searchNorwegianCompany: string } };
      }
    ).customers.creation.searchNorwegianCompany,
    "Søk etter norsk virksomhet",
  );
});

test("global platform cursor rule exists", () => {
  const rule = readFileSync(
    join(process.cwd(), ".cursor/rules/aipify-global-platform.mdc"),
    "utf8",
  );
  assert.match(rule, /global by default/i);
  assert.match(rule, /never be hardcoded globally to Norway/i);
});

console.log("platform-portal-create-customer-global: all tests passed");
