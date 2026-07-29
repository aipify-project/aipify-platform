import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  createDomainInstallationIdempotencyKey,
  domainStatusVariant,
  installationStatusVariant,
  mapDomainInstallationRpcError,
  normalizeHostnamePreview,
  parseCreateDomainInstallationInput,
  parsePlatformPortalCustomerDomain,
  parsePlatformPortalCustomerDomainInstallationResult,
  parsePlatformPortalCustomerDomainsPayload,
  parsePlatformPortalCustomerInstallation,
  parsePlatformPortalCustomerInstallationsPayload,
  parsePlatformPortalEligibleLicense,
} from "./domain-installation";
import { buildPlatformPortalDomainInstallationLabels } from "./labels";
import { parsePlatformPortalCustomerDetail } from "./parse";

const CUSTOMER_ID = "32d748eb-9a66-4174-a416-18a813610d3e";
const LICENSE_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const DOMAIN_ID = "bbbbbbbb-cccc-dddd-eeee-ffffffffffff";
const INSTALL_ID = "cccccccc-dddd-eeee-ffff-000000000000";

describe("domain installation hostname", () => {
  it("normalizes protocol, trailing slash, and case", () => {
    assert.equal(
      normalizeHostnamePreview("https://www.Example.com/"),
      "www.example.com",
    );
    assert.equal(normalizeHostnamePreview("  HTTP://Example.com  "), "example.com");
  });

  it("rejects path, query, fragment, credentials, port, IP, localhost", () => {
    assert.equal(normalizeHostnamePreview("example.com/path"), null);
    assert.equal(normalizeHostnamePreview("example.com?x=1"), null);
    assert.equal(normalizeHostnamePreview("example.com#hash"), null);
    assert.equal(normalizeHostnamePreview("user@example.com"), null);
    assert.equal(normalizeHostnamePreview("example.com:443"), null);
    assert.equal(normalizeHostnamePreview("127.0.0.1"), null);
    assert.equal(normalizeHostnamePreview("localhost"), null);
    assert.equal(normalizeHostnamePreview(""), null);
    assert.equal(normalizeHostnamePreview("nodot"), null);
  });
});

describe("domain installation parsers", () => {
  it("parses domains and eligible licenses", () => {
    const payload = parsePlatformPortalCustomerDomainsPayload({
      customer_id: CUSTOMER_ID,
      domains: [
        {
          id: DOMAIN_ID,
          hostname: "example.com",
          status: "pending",
          verification_status: "pending",
          install_id: INSTALL_ID,
          created_at: "2026-07-29T00:00:00Z",
          verified_at: null,
        },
      ],
      eligible_licenses: [
        {
          id: LICENSE_ID,
          product_code: "app_subscription",
          product_name: "APP subscription",
          status: "active",
          domain: null,
          install_id: null,
          provisioning_status: "requires_domain",
          eligible: true,
        },
        {
          id: "dddddddd-eeee-ffff-aaaa-111111111111",
          product_code: "app_subscription",
          status: "suspended",
          provisioning_status: "requires_domain",
          eligible: false,
        },
      ],
      generated_at: "2026-07-29T00:00:00Z",
    });

    assert.equal(payload.domains.length, 1);
    assert.equal(payload.domains[0]?.hostname, "example.com");
    assert.equal(payload.eligibleLicenses.length, 2);
    assert.equal(payload.eligibleLicenses[0]?.eligible, true);
    assert.equal(payload.eligibleLicenses[1]?.eligible, false);
  });

  it("parses installations with installId as UUID", () => {
    const payload = parsePlatformPortalCustomerInstallationsPayload({
      customer_id: CUSTOMER_ID,
      installations: [
        {
          id: INSTALL_ID,
          install_id: INSTALL_ID,
          status: "draft",
          system_type: "custom",
          created_at: "2026-07-29T00:00:00Z",
          activated_at: null,
        },
      ],
      generated_at: "2026-07-29T00:00:00Z",
    });
    assert.equal(payload.installations.length, 1);
    assert.equal(payload.installations[0]?.installId, INSTALL_ID);
    assert.equal(payload.installations[0]?.status, "draft");
  });

  it("rejects invalid domain and installation rows", () => {
    assert.equal(parsePlatformPortalCustomerDomain({ id: "bad", hostname: "x" }), null);
    assert.equal(parsePlatformPortalCustomerInstallation({ id: INSTALL_ID }), null);
    assert.equal(parsePlatformPortalEligibleLicense({ id: "??", status: "active" }), null);
  });

  it("validates create input", () => {
    const ok = parseCreateDomainInstallationInput(CUSTOMER_ID, {
      licenseId: LICENSE_ID,
      hostname: "https://www.example.com/",
      internalReason: "Pilot domain link",
      idempotencyKey: "dom-key-123456",
    });
    assert.equal(ok.ok, true);
    if (ok.ok) {
      assert.equal(ok.value.hostname, "www.example.com");
    }

    const badHost = parseCreateDomainInstallationInput(CUSTOMER_ID, {
      licenseId: LICENSE_ID,
      hostname: "localhost",
      internalReason: "Pilot domain link",
      idempotencyKey: "dom-key-123456",
    });
    assert.equal(badHost.ok, false);
    if (!badHost.ok) assert.equal(badHost.code, "invalid_hostname");

    const badReason = parseCreateDomainInstallationInput(CUSTOMER_ID, {
      licenseId: LICENSE_ID,
      hostname: "example.com",
      internalReason: "ab",
      idempotencyKey: "dom-key-123456",
    });
    assert.equal(badReason.ok, false);
    if (!badReason.ok) assert.equal(badReason.code, "invalid_internal_reason");
  });

  it("parses write result and maps rpc errors", () => {
    const result = parsePlatformPortalCustomerDomainInstallationResult({
      customer_id: CUSTOMER_ID,
      license_id: LICENSE_ID,
      domain: {
        id: DOMAIN_ID,
        hostname: "example.com",
        status: "pending",
        verified_at: null,
        created_at: "2026-07-29T00:00:00Z",
      },
      installation: {
        id: INSTALL_ID,
        install_id: INSTALL_ID,
        status: "draft",
        created_at: "2026-07-29T00:00:00Z",
        activated_at: null,
      },
      license: {
        id: LICENSE_ID,
        status: "active",
        provisioning_status: "domain_linked",
        domain_id: DOMAIN_ID,
        installation_id: INSTALL_ID,
        install_id: INSTALL_ID,
      },
      created: { domain: true, installation: true },
      idempotent_replay: false,
    });

    assert.ok(result);
    assert.equal(result?.domain.status, "pending");
    assert.equal(result?.installation.status, "draft");
    assert.equal(result?.license.provisioningStatus, "domain_linked");
    assert.equal(result?.domain.verifiedAt, null);

    assert.deepEqual(mapDomainInstallationRpcError("DOMAIN_ALREADY_EXISTS"), {
      status: 409,
      code: "domain_already_exists",
    });
    assert.deepEqual(mapDomainInstallationRpcError("LICENSE_DOMAIN_CONFLICT"), {
      status: 409,
      code: "license_domain_conflict",
    });
    assert.deepEqual(mapDomainInstallationRpcError("INVALID_HOSTNAME"), {
      status: 422,
      code: "invalid_hostname",
    });
    assert.deepEqual(mapDomainInstallationRpcError("COMMERCIAL_PLAN_REQUIRED"), {
      status: 422,
      code: "commercial_plan_required",
    });
    assert.deepEqual(mapDomainInstallationRpcError("IDEMPOTENCY_CONFLICT"), {
      status: 409,
      code: "idempotency_conflict",
    });
  });

  it("maps semantic status colors", () => {
    assert.equal(domainStatusVariant("pending"), "warning");
    assert.equal(domainStatusVariant("active"), "success");
    assert.equal(domainStatusVariant("failed"), "danger");
    assert.equal(installationStatusVariant("draft"), "warning");
    assert.equal(installationStatusVariant("active"), "success");
  });

  it("creates idempotency keys", () => {
    const key = createDomainInstallationIdempotencyKey();
    assert.match(key, /^dom-/);
    assert.ok(key.length >= 8);
  });

  it("keeps detail parser compatible after domain link", () => {
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
        domain_count: 1,
        installation_count: 1,
        open_support_count: 0,
      },
      licenses: [
        {
          id: LICENSE_ID,
          status: "active",
          product_code: "app_subscription",
          product_name: "lifetime",
          domain: "example.com",
          install_id: INSTALL_ID,
          masked_license_code: "AIP-****CDEF",
          provisioning_status: "domain_linked",
          created_at: "2026-07-29T00:00:00Z",
          activated_at: "2026-07-29T00:00:00Z",
          expires_at: null,
        },
      ],
      domains: [
        {
          id: DOMAIN_ID,
          hostname: "example.com",
          status: "pending",
          install_id: INSTALL_ID,
          created_at: "2026-07-29T00:00:00Z",
          verified_at: null,
        },
      ],
      entitlements: [],
      metadata: { generated_at: "2026-07-29T00:00:00Z" },
    });

    assert.ok(parsed);
    assert.equal(parsed?.licenses[0]?.provisioningStatus, "domain_linked");
    assert.equal(parsed?.licenses[0]?.installId, INSTALL_ID);
    assert.equal(parsed?.domains[0]?.hostname, "example.com");
    assert.equal(parsed?.usage.domainCount, 1);
    assert.equal(parsed?.usage.installationCount, 1);
  });
});

describe("domain installation migration guards", () => {
  const sql = readFileSync(
    "supabase/migrations/20261934300000_platform_portal_customer_domain_installation.sql",
    "utf8",
  );

  it("creates required RPCs without parallel models or activation side effects", () => {
    assert.match(sql, /get_platform_portal_customer_domains/);
    assert.match(sql, /get_platform_portal_customer_installations/);
    assert.match(sql, /create_platform_portal_customer_domain_installation/);
    assert.match(sql, /_platform_portal_normalize_hostname/);
    assert.match(sql, /organization_domains/);
    assert.match(sql, /customer_domains/);
    assert.match(sql, /installations/);
    assert.match(sql, /aipify_billing_license_links/);
    assert.match(sql, /domain_linked/);
    assert.match(sql, /IDEMPOTENCY_CONFLICT/);
    assert.match(sql, /DOMAIN_ALREADY_EXISTS/);
    assert.match(sql, /LICENSE_DOMAIN_CONFLICT/);
    assert.match(sql, /INVALID_HOSTNAME/);
    assert.match(sql, /'draft'/);
    assert.match(sql, /verification_status/);
    assert.doesNotMatch(sql, /create table public\./i);
    assert.doesNotMatch(sql, /activate_website_kompis/i);
    assert.doesNotMatch(sql, /verified_at\s*=\s*now\(\)/i);
    assert.doesNotMatch(sql, /from\s+stripe\./i);
    assert.doesNotMatch(sql, /from\s+fiken\./i);
    assert.doesNotMatch(sql, /vercel\.com/i);
  });

  it("stores token hash only and never returns raw token in JSON", () => {
    assert.match(sql, /installation_token_hash/);
    assert.match(sql, /hash_installation_token/);
    assert.doesNotMatch(sql, /'installation_token',\s*v_token/);
    assert.doesNotMatch(sql, /'token',\s*v_token/);
  });
});

describe("domain installation locale parity", () => {
  const locales = ["en", "no", "da", "sv", "pl", "uk"] as const;

  it("has matching domainInstallation keys", () => {
    const en = JSON.parse(readFileSync("locales/en/platform.json", "utf8"));
    const enKeys = Object.keys(en.customers.domainInstallation).sort();
    for (const locale of locales) {
      const dict = JSON.parse(readFileSync(`locales/${locale}/platform.json`, "utf8"));
      assert.deepEqual(
        Object.keys(dict.customers.domainInstallation).sort(),
        enKeys,
        locale,
      );
      assert.ok(dict.customers.detail.addDomainInstallation);
      assert.ok(dict.customers.domainInstallation.domainStatuses.pending);
      assert.ok(dict.customers.domainInstallation.installationStatuses.draft);
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
    const labels = buildPlatformPortalDomainInstallationLabels(t);
    assert.equal(labels.addDomainInstallation, "Legg til domene og installasjon");
    assert.equal(labels.dnsNotChanged, "DNS blir ikke endret");
    assert.equal(labels.websiteKompisNotActivated, "Website Kompis blir ikke aktivert");
    assert.equal(labels.create, "Opprett domene og installasjon");
  });
});

describe("domain installation UI and API wiring", () => {
  it("wires Customer Detail action and panel", () => {
    const panel = readFileSync(
      "components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx",
      "utf8",
    );
    const modal = readFileSync(
      "components/platform/platform-portal/PlatformPortalDomainInstallationPanel.tsx",
      "utf8",
    );
    const page = readFileSync("app/platform/customers/[id]/page.tsx", "utf8");
    assert.match(panel, /addDomainInstallation/);
    assert.match(panel, /PlatformPortalDomainInstallationPanel/);
    assert.match(panel, /domainInstallationLabels\.success/);
    assert.match(modal, /disabled=\{!canSubmit\}/);
    assert.match(modal, /canonicalHostname/);
    assert.match(modal, /websiteKompisNotActivated/);
    assert.match(page, /buildPlatformPortalDomainInstallationLabels/);
  });

  it("exposes protected API routes", () => {
    const domains = readFileSync(
      "app/api/platform-portal/customers/[id]/domains/route.ts",
      "utf8",
    );
    const installations = readFileSync(
      "app/api/platform-portal/customers/[id]/installations/route.ts",
      "utf8",
    );
    const write = readFileSync(
      "app/api/platform-portal/customers/[id]/domain-installation/route.ts",
      "utf8",
    );
    assert.match(domains, /get_platform_portal_customer_domains/);
    assert.match(installations, /get_platform_portal_customer_installations/);
    assert.match(write, /create_platform_portal_customer_domain_installation/);
    assert.match(write, /no-store/);
    assert.match(domains, /no-store/);
    assert.doesNotMatch(write, /generate_installation_token/);
    assert.doesNotMatch(write, /fetch\(/);
  });

  it("preserves registry license and commercial regressions in scope", () => {
    assert.ok(readFileSync("lib/platform-portal/license-provisioning.ts", "utf8").length > 100);
    assert.ok(readFileSync("lib/platform-portal/commercial-plan.ts", "utf8").length > 100);
    assert.match(
      readFileSync("lib/platform-portal/labels.ts", "utf8"),
      /buildPlatformPortalLicenseProvisioningLabels/,
    );
    assert.match(
      readFileSync("lib/platform-portal/labels.ts", "utf8"),
      /buildPlatformPortalCommercialPlanLabels/,
    );
  });
});
