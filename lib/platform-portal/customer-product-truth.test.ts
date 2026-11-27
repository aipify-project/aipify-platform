import assert from "node:assert/strict";
import {
  buildCustomerProductTruthBundle,
  buildModulesTruth,
  formatModulesMetric,
} from "./customer-product-truth";
import type { PlatformPortalCustomerDetail } from "./types";

const emptyDetail: PlatformPortalCustomerDetail = {
  customer: {
    id: "cust-1",
    companyId: "co-1",
    name: "Example Org",
    legalName: "Example Org AS",
    slug: "example",
    organizationNumber: "123",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    requiresAttention: false,
    primaryContactName: null,
    primaryContactEmail: null,
    primaryContactPhone: null,
  },
  commercial: {
    lifetime: true,
    subscriptionStatus: "active",
    planName: "Business",
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
  licenses: [
    {
      id: "lic-1",
      status: "active",
      productCode: "app_license",
      productName: "APP License",
      domain: "example.com",
      installId: "inst-1",
      maskedLicenseCode: null,
      provisioningStatus: "active",
      createdAt: null,
      activatedAt: null,
      expiresAt: null,
    },
  ],
  domains: [],
  entitlements: [],
  metadata: { generatedAt: "2026-11-27T12:00:00.000Z" },
};

{
  const modules = buildModulesTruth(emptyDetail);
  assert.equal(modules.available, false);
  assert.equal(modules.activeCount, null);
  assert.equal(formatModulesMetric(modules, "Not available"), "Not available");
}

{
  const withEntitlements: PlatformPortalCustomerDetail = {
    ...emptyDetail,
    entitlements: [
      {
        id: "ent-1",
        code: "website_kompis",
        name: "Website Kompis",
        status: "active",
        grantedAt: null,
        expiresAt: null,
      },
    ],
  };
  const modules = buildModulesTruth(withEntitlements);
  assert.equal(modules.available, true);
  assert.equal(modules.activeCount, 1);
  assert.equal(formatModulesMetric(modules, "Not available"), "1/1");
}

{
  const bundle = buildCustomerProductTruthBundle({
    detail: emptyDetail,
    websiteKompis: null,
  });
  assert.equal(bundle.appLicense.status, "active");
  assert.equal(bundle.websiteKompis.status, "not_entitled");
  assert.equal(bundle.kompisBedrift.status, "not_entitled");
  assert.equal(bundle.modules.available, false);
}

console.log("customer-product-truth.test.ts: ok");
