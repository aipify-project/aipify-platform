import assert from "node:assert/strict";
import {
  WEBSITE_KOMPIS_CAPABILITY_KEY,
  canManageWebsiteKompisDomainSettings,
  evaluateWebsiteKompisLicensedAvailability,
  evaluateWebsiteKompisLicensedAvailabilityFromAppContext,
  mapWebsiteKompisAvailabilityToPublicReason,
} from "@/lib/marketing/website-kompis-licensed-availability";

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

  const appInactive = evaluateWebsiteKompisLicensedAvailabilityFromAppContext({
    context: {
      state: "license_inactive",
      license_status: "suspended",
      customer_id: "11111111-1111-4111-8111-111111111111",
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

  console.log("website-kompis-licensed-availability.test.ts: all assertions passed");
}

runWebsiteKompisLicensedAvailabilityTests();
