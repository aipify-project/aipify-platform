import assert from "node:assert/strict";
import { CSP_STRIPE_LIVE_WIRING_ENABLED } from "./stripe-adapter";
import {
  CSP_STRIPE_TEST_BRIDGE_ENABLED,
  buildCspPaymentEventFromVerifiedStripeTest,
} from "./stripe-test-bridge";

assert.equal(CSP_STRIPE_LIVE_WIRING_ENABLED, false);
assert.equal(CSP_STRIPE_TEST_BRIDGE_ENABLED, false);

const disabled = buildCspPaymentEventFromVerifiedStripeTest({
  signatureVerified: true,
  eventId: "evt_test_1",
  eventType: "invoice.payment_succeeded",
  amountPaid: 1000,
  customerOrgId: "00000000-0000-4000-8000-000000000001",
  productKey: "kompis_web",
  periodOrdinal: 1,
  currentPaidPeriods: 0,
});
assert.equal(disabled.ok, false);
if (!disabled.ok) assert.equal(disabled.reason, "bridge_disabled");

console.log("stripe-test-bridge.test.ts: ok (default disabled)");
