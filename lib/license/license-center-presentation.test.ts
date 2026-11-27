import assert from "node:assert/strict";
import {
  presentAgreementName,
  presentLicensePaymentStatus,
  presentLicenseStatusLabelKey,
} from "./license-center-presentation";

assert.equal(presentAgreementName("  Unonight Lifetime  "), "Unonight Lifetime");
assert.equal(presentAgreementName(" "), null);

assert.equal(presentLicenseStatusLabelKey("active"), "licenseActive");
assert.equal(presentLicenseStatusLabelKey("lifetime"), "licenseLifetime");
assert.equal(presentLicenseStatusLabelKey("pending_setup"), "licenseUnknown");

const lifetime = presentLicensePaymentStatus({
  paymentStatus: "pending_setup",
  licenseStatus: "lifetime",
  planName: "Workspace Lifetime",
  renewalDate: null,
});
assert.equal(lifetime.kind, "lifetime");
assert.equal(lifetime.labelKey, "lifetimeAgreement");

const pending = presentLicensePaymentStatus({
  paymentStatus: "pending_setup",
  licenseStatus: "active",
  planName: "Business",
  renewalDate: "2027-01-01",
});
assert.equal(pending.kind, "mapped");
assert.equal(pending.labelKey, "paymentPendingSetup");

console.log("license-center-presentation.test.ts: ok");
