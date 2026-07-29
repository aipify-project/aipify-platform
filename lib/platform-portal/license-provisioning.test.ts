import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  assertNoFullLicenseCodeLeak,
  createLicenseIdempotencyKey,
  licenseStatusVariant,
  mapLicenseProvisioningRpcError,
  parseCreateLicenseInput,
  parsePlatformPortalCustomerLicense,
  parsePlatformPortalCustomerLicenseResult,
  parsePlatformPortalCustomerLicensesPayload,
  parsePlatformPortalLicenseProduct,
  parsePlatformPortalLicenseProductsPayload,
  provisioningStatusVariant,
} from "./license-provisioning";
import { buildPlatformPortalLicenseProvisioningLabels } from "./labels";
import { parsePlatformPortalCustomerDetail } from "./parse";

const CUSTOMER_ID = "32d748eb-9a66-4174-a416-18a813610d3e";

describe("license provisioning contracts", () => {
  it("parses license products and filters assignable active only", () => {
    const parsed = parsePlatformPortalLicenseProductsPayload({
      products: [
        {
          id: "app_subscription",
          code: "app_subscription",
          name: "APP subscription license",
          description: "Org license",
          active: true,
          assignable_by_platform: true,
          requires_commercial_plan: true,
          requires_entitlement: false,
          requires_domain: false,
          requires_installation: false,
          license_mode: "app_subscription",
          default_status: "active",
        },
        {
          id: "domain_license",
          code: "domain_license",
          name: "Domain",
          active: true,
          assignable_by_platform: false,
          requires_commercial_plan: true,
          requires_entitlement: false,
          requires_domain: true,
          requires_installation: false,
        },
      ],
      generated_at: "2026-07-29T00:00:00Z",
    });

    assert.equal(parsed.products.length, 1);
    assert.equal(parsed.products[0]?.code, "app_subscription");
    assert.equal(parsed.products[0]?.assignableByPlatform, true);
  });

  it("rejects invalid product parser rows", () => {
    assert.equal(parsePlatformPortalLicenseProduct({ id: "??", code: "??", name: "x" }), null);
  });

  it("parses customer licenses with masked codes only", () => {
    const full = "AIP-SUB-0123456789ABCDEF0123456789ABCDEF";
    const payload = parsePlatformPortalCustomerLicensesPayload({
      customer_id: CUSTOMER_ID,
      licenses: [
        {
          id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          product_id: "app_subscription",
          product_code: "app_subscription",
          product_name: "lifetime",
          status: "active",
          masked_license_code: "AIP-****************************CDEF",
          provisioning_status: "requires_domain",
          provisioning_required: true,
          created_at: "2026-07-29T00:00:00Z",
        },
      ],
      generated_at: "2026-07-29T00:00:00Z",
    });

    assert.equal(payload.licenses.length, 1);
    assert.equal(payload.licenses[0]?.maskedLicenseCode?.includes("*"), true);
    assert.equal(assertNoFullLicenseCodeLeak(payload), true);
    assert.equal(assertNoFullLicenseCodeLeak({ license_code: full }), false);
  });

  it("validates create input", () => {
    const ok = parseCreateLicenseInput(CUSTOMER_ID, {
      productId: "app_subscription",
      internalReason: "Pilot provisioning",
      idempotencyKey: "idem-key-123456",
    });
    assert.equal(ok.ok, true);

    const badReason = parseCreateLicenseInput(CUSTOMER_ID, {
      productId: "app_subscription",
      internalReason: "ab",
      idempotencyKey: "idem-key-123456",
    });
    assert.equal(badReason.ok, false);
    if (!badReason.ok) assert.equal(badReason.code, "invalid_internal_reason");
  });

  it("parses write result and maps rpc errors", () => {
    const result = parsePlatformPortalCustomerLicenseResult({
      customer_id: CUSTOMER_ID,
      license: {
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        product_id: "app_subscription",
        product_code: "app_subscription",
        product_name: "lifetime",
        status: "active",
        masked_license_code: "AIP-****CDEF",
        provisioning_status: "requires_domain",
        created_at: "2026-07-29T00:00:00Z",
      },
      created: true,
      entitlement_created: false,
      provisioning_required: true,
      idempotent_replay: false,
    });
    assert.ok(result);
    assert.equal(result?.created, true);
    assert.equal(result?.entitlementCreated, false);

    assert.deepEqual(mapLicenseProvisioningRpcError("ACTIVE_LICENSE_CONFLICT"), {
      status: 409,
      code: "active_license_conflict",
    });
    assert.deepEqual(mapLicenseProvisioningRpcError("COMMERCIAL_PLAN_REQUIRED"), {
      status: 422,
      code: "commercial_plan_required",
    });
    assert.deepEqual(mapLicenseProvisioningRpcError("PRODUCT_NOT_ASSIGNABLE"), {
      status: 422,
      code: "product_not_assignable",
    });
  });

  it("maps semantic status colors", () => {
    assert.equal(licenseStatusVariant("active"), "success");
    assert.equal(licenseStatusVariant("pending"), "warning");
    assert.equal(licenseStatusVariant("revoked"), "danger");
    assert.equal(provisioningStatusVariant("requires_domain"), "warning");
    assert.equal(provisioningStatusVariant("domain_linked"), "success");
  });

  it("creates idempotency keys", () => {
    const key = createLicenseIdempotencyKey();
    assert.match(key, /^lic-/);
    assert.ok(key.length >= 8);
  });

  it("keeps detail parser compatible with masked license fields", () => {
    const parsed = parsePlatformPortalCustomerDetail({
      customer: {
        id: CUSTOMER_ID,
        company_id: "11111111-1111-1111-1111-111111111111",
        name: "TENANT",
        status: "active",
        requires_attention: false,
      },
      commercial: {
        lifetime: true,
        subscription_status: "active",
        plan_name: "Lifetime",
        partner_attributed: false,
      },
      usage: {
        member_count: 1,
        active_license_count: 1,
        total_license_count: 1,
        domain_count: 0,
        installation_count: 0,
        open_support_count: 0,
      },
      licenses: [
        {
          id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          status: "active",
          product_code: "app_subscription",
          product_name: "lifetime",
          domain: null,
          install_id: null,
          masked_license_code: "AIP-****CDEF",
          provisioning_status: "requires_domain",
          created_at: "2026-07-29T00:00:00Z",
          activated_at: "2026-07-29T00:00:00Z",
          expires_at: null,
        },
      ],
      domains: [],
      entitlements: [],
      metadata: { generated_at: "2026-07-29T00:00:00Z" },
    });

    assert.ok(parsed);
    assert.equal(parsed?.licenses[0]?.maskedLicenseCode, "AIP-****CDEF");
    assert.equal(parsed?.licenses[0]?.provisioningStatus, "requires_domain");
  });
});

describe("license provisioning migration guards", () => {
  const sql = readFileSync(
    "supabase/migrations/20261934200000_platform_portal_customer_license_provisioning.sql",
    "utf8",
  );

  it("creates required RPCs without parallel models", () => {
    assert.match(sql, /get_platform_portal_license_products/);
    assert.match(sql, /get_platform_portal_customer_licenses/);
    assert.match(sql, /create_platform_portal_customer_license/);
    assert.match(sql, /aipify_billing_license_links/);
    assert.match(sql, /_ube586_generate_license_key/);
    assert.match(sql, /_ube586_mask_license_key/);
    assert.match(sql, /COMMERCIAL_PLAN_REQUIRED/);
    assert.match(sql, /ACTIVE_LICENSE_CONFLICT/);
    assert.match(sql, /IDEMPOTENCY_CONFLICT/);
    assert.doesNotMatch(sql, /insert into public\.organization_module_activations/i);
    assert.doesNotMatch(sql, /create table public\./i);
    assert.doesNotMatch(sql, /insert into public\.organization_domains/i);
    assert.doesNotMatch(sql, /insert into public\.installations/i);
    assert.doesNotMatch(sql, /activate_website_kompis/i);
    assert.doesNotMatch(sql, /\bstripe\./i);
    assert.doesNotMatch(sql, /\bfiken\./i);
  });

  it("masks codes and never returns raw key in JSON builders", () => {
    assert.match(sql, /masked_license_code',\s*public\._ube586_mask_license_key/);
    assert.doesNotMatch(sql, /'license_code',\s*v_new_key/);
    assert.doesNotMatch(sql, /'license_key',\s*v_license\.license_key/);
  });
});

describe("license provisioning locale parity", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

  it("has matching licenseProvisioning keys", () => {
    const en = JSON.parse(readFileSync("locales/en/platform.json", "utf8"));
    const enKeys = Object.keys(en.customers.licenseProvisioning).sort();
    for (const locale of locales) {
      const dict = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
      assert.deepEqual(
        Object.keys(dict.customers.licenseProvisioning).sort(),
        enKeys,
        locale,
      );
      assert.ok(dict.customers.detail.createLicense);
      assert.ok(dict.customers.detail.provisioningStatuses.requires_domain);
    }
  });

  it("builds Norwegian labels", () => {
    const dict = JSON.parse(readFileSync("locales/no/platform.json", "utf8"));
    const t = (key: string) => {
      const parts = key.replace(/^platform\./, "").split(".");
      let cur: unknown = { ...dict };
      for (const part of parts) {
        if (!cur || typeof cur !== "object") return key;
        cur = (cur as Record<string, unknown>)[part];
      }
      return typeof cur === "string" ? cur : key;
    };
    const labels = buildPlatformPortalLicenseProvisioningLabels(t);
    assert.equal(labels.createLicense, "Opprett lisens");
    assert.equal(labels.commercialPlanMissing, "Kommersiell plan mangler");
    assert.equal(labels.summaryNoWebsiteKompis, "Website Kompis blir ikke aktivert");
  });
});
