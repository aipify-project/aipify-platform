import assert from "node:assert/strict";
import {
  WEBSITE_KOMPIS_CAPABILITY_KEY,
  canManageWebsiteKompisDomainSettings,
  evaluateWebsiteKompisLicensedAvailability,
  evaluateWebsiteKompisLicensedAvailabilityFromAppContext,
  evaluateWebsiteKompisPublicInstallDomainTrust,
  mapWebsiteKompisAvailabilityToPublicReason,
} from "@/lib/marketing/website-kompis-licensed-availability";

const NEUTRAL_INSTALL_ID = "11111111-1111-4111-8111-111111111111";
const NEUTRAL_TENANT_ID = "22222222-2222-4222-8222-222222222222";
const NEUTRAL_DOMAIN_A = "example-a.test";
const NEUTRAL_DOMAIN_B = "example-b.test";

function runWebsiteKompisLicensedAvailabilityTests() {
  assert.equal(WEBSITE_KOMPIS_CAPABILITY_KEY, "website_kompis");

  const available = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "active",
    entitlementEnabled: true,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(available.available, true);
  assert.equal(available.reason, "available");

  const inactive = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "paused",
    entitlementEnabled: true,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(inactive.available, false);
  assert.equal(inactive.reason, "license_inactive");

  const missingEntitlement = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "active",
    entitlementEnabled: false,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(missingEntitlement.reason, "entitlement_missing");

  const unknown = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: null,
    subscriptionStatus: null,
    entitlementEnabled: true,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: false,
  });
  assert.equal(unknown.available, false);
  assert.equal(unknown.reason, "license_unknown");

  const unverifiedDomain = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "active",
    entitlementEnabled: true,
    domainVerified: false,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(unverifiedDomain.reason, "domain_unverified");

  const installOnlyTrusted = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: NEUTRAL_INSTALL_ID,
    requestedDomain: null,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: NEUTRAL_INSTALL_ID,
    resolvedDomain: NEUTRAL_DOMAIN_A,
    hasVerifiedActiveBinding: true,
  });
  assert.equal(installOnlyTrusted.trusted, true);
  assert.equal(installOnlyTrusted.installId, NEUTRAL_INSTALL_ID);
  assert.equal(installOnlyTrusted.domain, NEUTRAL_DOMAIN_A);
  assert.equal(installOnlyTrusted.tenantId, NEUTRAL_TENANT_ID);

  const installOnlyNoBinding = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: NEUTRAL_INSTALL_ID,
    requestedDomain: null,
    hasVerifiedActiveBinding: false,
  });
  assert.equal(installOnlyNoBinding.trusted, false);
  assert.equal(installOnlyNoBinding.reason, "domain_unverified");

  const domainOnlyTrusted = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: null,
    requestedDomain: NEUTRAL_DOMAIN_A,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: NEUTRAL_INSTALL_ID,
    resolvedDomain: NEUTRAL_DOMAIN_A,
    hasVerifiedActiveBinding: true,
  });
  assert.equal(domainOnlyTrusted.trusted, true);

  const domainOnlyUnverified = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: null,
    requestedDomain: NEUTRAL_DOMAIN_A,
    hasVerifiedActiveBinding: false,
  });
  assert.equal(domainOnlyUnverified.trusted, false);
  assert.equal(domainOnlyUnverified.reason, "install_missing");

  const domainOnlyInactive = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: null,
    requestedDomain: NEUTRAL_DOMAIN_B,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: null,
    resolvedDomain: null,
    hasVerifiedActiveBinding: false,
  });
  assert.equal(domainOnlyInactive.trusted, false);

  const installDomainMismatch = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: NEUTRAL_INSTALL_ID,
    requestedDomain: NEUTRAL_DOMAIN_B,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: null,
    resolvedDomain: null,
    hasVerifiedActiveBinding: false,
  });
  assert.equal(installDomainMismatch.trusted, false);

  const installWrongDomain = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: NEUTRAL_INSTALL_ID,
    requestedDomain: NEUTRAL_DOMAIN_B,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: NEUTRAL_INSTALL_ID,
    resolvedDomain: NEUTRAL_DOMAIN_A,
    hasVerifiedActiveBinding: true,
  });
  assert.equal(installWrongDomain.trusted, false);
  assert.equal(installWrongDomain.reason, "domain_unverified");

  const installIdMismatch = evaluateWebsiteKompisPublicInstallDomainTrust({
    requestedInstallId: NEUTRAL_INSTALL_ID,
    requestedDomain: NEUTRAL_DOMAIN_A,
    tenantId: NEUTRAL_TENANT_ID,
    resolvedInstallId: "33333333-3333-4333-8333-333333333333",
    resolvedDomain: NEUTRAL_DOMAIN_A,
    hasVerifiedActiveBinding: true,
  });
  assert.equal(installIdMismatch.trusted, false);
  assert.equal(installIdMismatch.reason, "domain_unverified");

  const licenseInactive = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "paused",
    entitlementEnabled: true,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(licenseInactive.available, false);
  assert.equal(licenseInactive.reason, "license_inactive");

  const entitlementMissing = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: "active",
    entitlementEnabled: false,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: true,
  });
  assert.equal(entitlementMissing.available, false);
  assert.equal(entitlementMissing.reason, "entitlement_missing");

  const appInactive = evaluateWebsiteKompisLicensedAvailabilityFromAppContext({
    context: {
      state: "license_inactive",
      license_status: "suspended",
      customer_id: NEUTRAL_TENANT_ID,
      organization_role: "owner",
      user_role: "owner",
    },
    entitlementEnabled: true,
    domainVerified: true,
    installTrusted: true,
  });
  assert.equal(appInactive.reason, "license_inactive");

  assert.equal(canManageWebsiteKompisDomainSettings({ organization_role: "owner", user_role: "owner" }), true);
  assert.equal(canManageWebsiteKompisDomainSettings({ organization_role: "staff", user_role: "staff" }), false);

  assert.equal(mapWebsiteKompisAvailabilityToPublicReason("license_inactive"), "license_required");
  assert.equal(mapWebsiteKompisAvailabilityToPublicReason("install_missing"), "not_available");
  assert.equal(mapWebsiteKompisAvailabilityToPublicReason("domain_unverified"), "not_available");

  console.log("website-kompis-licensed-availability.test.ts: all assertions passed");
}

runWebsiteKompisLicensedAvailabilityTests();
