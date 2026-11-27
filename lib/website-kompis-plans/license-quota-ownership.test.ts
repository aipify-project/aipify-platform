import assert from "node:assert/strict";
import { mapWebsiteKompisLicenseQuotaRead } from "./license-quota-read";

function ok<T>(data: T) {
  return { ok: true as const, data };
}

/** Enabled module + incomplete quota must stay owned (unknown_plan), not unavailable. */
const ownedIncomplete = mapWebsiteKompisLicenseQuotaRead({
  moduleResult: ok(true),
  licenseResult: ok({ plan: "free", state: "active" }),
  quotaResult: { ok: false },
});
assert.equal(ownedIncomplete.kind, "unknown_plan");

const ownedUnknownPlan = mapWebsiteKompisLicenseQuotaRead({
  moduleResult: ok(true),
  licenseResult: ok({ plan: null }),
  quotaResult: ok({}),
});
assert.equal(ownedUnknownPlan.kind, "unknown_plan");

const notLicensed = mapWebsiteKompisLicenseQuotaRead({
  moduleResult: ok(false),
  licenseResult: ok({ plan: "pro" }),
  quotaResult: ok({}),
});
assert.equal(notLicensed.kind, "no_module");

console.log("license-quota-ownership.test.ts: ok");
