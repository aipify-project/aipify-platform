import assert from "node:assert/strict";
import {
  COMPANY_CONFIG,
  PLATFORM_COMPANY_IDENTITY,
} from "./company.config";

assert.equal(PLATFORM_COMPANY_IDENTITY.companyName, "Aipify Group AS");
assert.equal(PLATFORM_COMPANY_IDENTITY.postalCode, "5008");
assert.equal(PLATFORM_COMPANY_IDENTITY.city, "Bergen");
assert.equal(PLATFORM_COMPANY_IDENTITY.countryCode, "NO");
assert.equal(PLATFORM_COMPANY_IDENTITY.countryName, "Norway");
assert.equal(PLATFORM_COMPANY_IDENTITY.supportEmail, "support@aipify.ai");
assert.equal(PLATFORM_COMPANY_IDENTITY.organizationNumber, "937978960");
assert.equal(PLATFORM_COMPANY_IDENTITY.organizationNumberDisplay, "937 978 960");

assert.equal(COMPANY_CONFIG.organizationNumber, "937978960");
assert.match(COMPANY_CONFIG.organizationNumber, /^\d+$/);
assert.notEqual(
  COMPANY_CONFIG.organizationNumber,
  COMPANY_CONFIG.organizationNumberDisplay,
);

assert.deepEqual(PLATFORM_COMPANY_IDENTITY, {
  companyName: COMPANY_CONFIG.legalCompanyName,
  postalCode: COMPANY_CONFIG.postalCode,
  city: COMPANY_CONFIG.city,
  countryCode: COMPANY_CONFIG.countryCode,
  countryName: COMPANY_CONFIG.country,
  supportEmail: COMPANY_CONFIG.supportEmail,
  organizationNumber: COMPANY_CONFIG.organizationNumber,
  organizationNumberDisplay: COMPANY_CONFIG.organizationNumberDisplay,
});
