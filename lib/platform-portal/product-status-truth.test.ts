import assert from "node:assert/strict";
import test from "node:test";
import type { PlatformPortalCustomerDetail } from "./types";
import { buildProductStatusTruth } from "./product-status-truth";
import type { PlatformPortalKompisBedriftStatus } from "./kompis-bedrift-activation";
import type { PlatformPortalWebsiteKompisStatus } from "./website-kompis-activation";

function baseDetail(
  overrides: Partial<PlatformPortalCustomerDetail> = {},
): PlatformPortalCustomerDetail {
  return {
    customer: {
      id: "11111111-1111-1111-1111-111111111111",
      companyId: "22222222-2222-2222-2222-222222222222",
      name: "Example Customer",
      legalName: "Example Customer AS",
      slug: "example",
      organizationNumber: "123456789",
      status: "active",
      requiresAttention: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
    commercial: {
      subscriptionStatus: "active",
      lifetime: true,
      planName: "Example",
      trialStartsAt: null,
      trialEndsAt: null,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      partnerAttributed: false,
      partnerName: null,
    },
    usage: {
      memberCount: 2,
      activeLicenseCount: 1,
      totalLicenseCount: 1,
      domainCount: 1,
      installationCount: 1,
      openSupportCount: 0,
    },
    licenses: [],
    domains: [],
    entitlements: [],
    metadata: { generatedAt: "2026-10-15T12:00:00.000Z" },
    ...overrides,
  };
}

test("web-only: active website_kompis entitlement, no bedrift", () => {
  const truth = buildProductStatusTruth(
    baseDetail({
      entitlements: [
        {
          id: "e1",
          code: "website_kompis",
          name: "Website Kompis",
          status: "active",
          grantedAt: null,
          expiresAt: null,
        },
      ],
      licenses: [
        {
          id: "l1",
          status: "active",
          productCode: "website_kompis",
          productName: "Website Kompis",
          domain: "example.com",
          installId: "inst-1",
          maskedLicenseCode: null,
          provisioningStatus: "active",
          createdAt: null,
          activatedAt: null,
          expiresAt: null,
        },
      ],
    }),
  );
  assert.equal(truth.websiteKompis.status, "active");
  assert.equal(truth.kompisBedrift.status, "unavailable");
  assert.equal(truth.kompisBedrift.reasonCode, "product_not_entitled");
  assert.equal(truth.productChips.length, 2);
  assert.equal(
    truth.productChips.some((c) => c.productId === "kompis_bedrift" && c.status === "active"),
    false,
  );
});

test("membership + lifetime must not activate Bedrift", () => {
  const truth = buildProductStatusTruth(
    baseDetail({
      usage: {
        memberCount: 5,
        activeLicenseCount: 1,
        totalLicenseCount: 1,
        domainCount: 1,
        installationCount: 1,
        openSupportCount: 0,
      },
      entitlements: [],
    }),
  );
  assert.equal(truth.agreement.status, "active");
  assert.notEqual(truth.kompisBedrift.status, "active");
  assert.equal(truth.kompisBedrift.status, "unavailable");
});

test("bedrift-only from Core overlay active", () => {
  const bedrift: PlatformPortalKompisBedriftStatus = {
    customerId: "11111111-1111-1111-1111-111111111111",
    moduleKey: "kompis_bedrift",
    active: true,
    eligible: false,
    displayStatus: "active",
    reasons: [],
    subscription: null,
    existingActivation: {
      id: "a1",
      status: "active",
      licensed: true,
      enabled: true,
      activatedAt: "2026-01-01T00:00:00Z",
    },
    notes: {
      noMembershipDefault: true,
      noEmployeeKnowledgeAlias: true,
      grantsOnlyViaPlatformActivate: true,
    },
    activateAuthorized: false,
  };
  const truth = buildProductStatusTruth(baseDetail({ entitlements: [] }), { bedrift });
  assert.equal(truth.kompisBedrift.status, "active");
  assert.equal(truth.kompisBedrift.source, "kompis_bedrift_status_rpc");
});

test("bedrift overlay no grant stays unavailable", () => {
  const bedrift: PlatformPortalKompisBedriftStatus = {
    customerId: "11111111-1111-1111-1111-111111111111",
    moduleKey: "kompis_bedrift",
    active: false,
    eligible: false,
    displayStatus: "inactive",
    reasons: [],
    subscription: null,
    existingActivation: null,
    notes: {
      noMembershipDefault: true,
      noEmployeeKnowledgeAlias: true,
      grantsOnlyViaPlatformActivate: true,
    },
    activateAuthorized: false,
  };
  const truth = buildProductStatusTruth(
    baseDetail({
      usage: {
        memberCount: 3,
        activeLicenseCount: 1,
        totalLicenseCount: 1,
        domainCount: 1,
        installationCount: 1,
        openSupportCount: 0,
      },
    }),
    { bedrift },
  );
  assert.equal(truth.kompisBedrift.status, "unavailable");
  assert.notEqual(truth.kompisBedrift.status, "active");
});

test("install signal without entitlement → pending unverified, not unavailable", () => {
  const truth = buildProductStatusTruth(
    baseDetail({
      entitlements: [],
      licenses: [],
      usage: {
        memberCount: 1,
        activeLicenseCount: 0,
        totalLicenseCount: 0,
        domainCount: 1,
        installationCount: 1,
        openSupportCount: 0,
      },
    }),
  );
  assert.equal(truth.websiteKompis.status, "pending");
  assert.equal(truth.websiteKompis.unverified, true);
  assert.notEqual(truth.websiteKompis.status, "unavailable");
});

test("website kompis RPC active wins over empty entitlements", () => {
  const websiteKompis = {
    customerId: "11111111-1111-1111-1111-111111111111",
    eligible: false,
    active: true,
    activationStatus: "active",
    reasons: [],
    agreement: { eligible: true, status: "active", duration: "lifetime" },
    license: {
      eligible: true,
      id: "l1",
      status: "active",
      productCode: "website_kompis",
      provisioningStatus: "active",
      domainReference: "example.com",
    },
    domain: {
      eligible: true,
      id: "d1",
      hostname: "example.com",
      status: "active",
      verified: true,
    },
    installation: {
      eligible: true,
      id: "i1",
      installId: "inst-1",
      status: "active",
    },
    approval: { required: false, satisfied: true },
    existingActivation: {
      id: "act",
      status: "active",
      activatedAt: "2026-01-01T00:00:00Z",
      entitlementEnabled: true,
    },
  } as PlatformPortalWebsiteKompisStatus;

  const truth = buildProductStatusTruth(baseDetail({ entitlements: [], licenses: [] }), {
    websiteKompis,
  });
  assert.equal(truth.websiteKompis.status, "active");
  assert.equal(truth.websiteKompis.source, "website_kompis_status_rpc");
});

test("no chips invent active bedrift without entitlement", () => {
  const truth = buildProductStatusTruth(baseDetail());
  for (const chip of truth.productChips) {
    if (chip.productId === "kompis_bedrift") {
      assert.notEqual(chip.status, "active");
    }
  }
});

console.log("product-status-truth: all tests passed");
