import assert from "node:assert/strict";
import {
  buildCustomerProfileChangePrefill,
  CUSTOMER_PROFILE_CHANGE_CATEGORY,
  CUSTOMER_PROFILE_CHANGE_INTENT,
  CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF,
  isCustomerProfileChangeIntent,
} from "./profile-change-intent";

assert.equal(
  CUSTOMER_PROFILE_CHANGE_SUPPORT_HREF,
  `/app/support/requests?new=1&category=${CUSTOMER_PROFILE_CHANGE_CATEGORY}&intent=${CUSTOMER_PROFILE_CHANGE_INTENT}`,
);
assert.equal(isCustomerProfileChangeIntent(CUSTOMER_PROFILE_CHANGE_INTENT), true);
assert.equal(isCustomerProfileChangeIntent("other"), false);

const prefill = buildCustomerProfileChangePrefill({
  title: "Change request",
  description: "Describe the change",
});
assert.equal(prefill.category, "account");
assert.equal(prefill.relatedModule, "organization");
assert.equal(prefill.title, "Change request");

console.log("profile-change-intent.test.ts: ok");
