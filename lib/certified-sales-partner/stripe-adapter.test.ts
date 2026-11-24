import assert from "node:assert/strict";
import test from "node:test";
import {
  CSP_STRIPE_LIVE_WIRING_ENABLED,
  mapVerifiedStripeEventToPaidPeriod,
  type CspStripeVerifiedEventInput,
} from "./stripe-adapter";

const ev = (over: Partial<CspStripeVerifiedEventInput> = {}): CspStripeVerifiedEventInput => ({
  signatureVerified: true,
  eventType: "invoice.paid",
  eventId: "evt_1",
  amountPaid: 4900,
  currentPaidPeriods: 0,
  periodOrdinal: 1,
  ...over,
});

test("live wiring stays disabled", () => {
  assert.equal(CSP_STRIPE_LIVE_WIRING_ENABLED, false);
});

test("unverified events are never mapped", () => {
  assert.deepEqual(mapVerifiedStripeEventToPaidPeriod(ev({ signatureVerified: false })), {
    mapped: false,
    reason: "unverified_event",
  });
  assert.deepEqual(
    mapVerifiedStripeEventToPaidPeriod(ev({ signatureVerified: undefined as unknown as boolean })),
    { mapped: false, reason: "unverified_event" },
  );
});

test("event id is required", () => {
  assert.deepEqual(mapVerifiedStripeEventToPaidPeriod(ev({ eventId: "  " })), {
    mapped: false,
    reason: "event_id_required",
  });
});

test("unknown event types are not mapped", () => {
  assert.deepEqual(mapVerifiedStripeEventToPaidPeriod(ev({ eventType: "customer.created" })), {
    mapped: false,
    reason: "event_type_not_mapped",
  });
});

test("first verified invoice.paid registers, no commission", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(ev());
  assert.ok(r.mapped && r.kind === "paid_period");
  if (r.mapped) {
    assert.equal(r.state.paidPeriods, 1);
    assert.equal(r.state.status, "registered_awaiting_second_payment");
    assert.equal(r.state.commissionEarned, false);
  }
});

test("second verified invoice.paid earns exactly once", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(
    ev({ eventId: "evt_2", currentPaidPeriods: 1, periodOrdinal: 2, eventType: "invoice.payment_succeeded" }),
  );
  assert.ok(r.mapped);
  if (r.mapped) {
    assert.equal(r.state.status, "earned");
    assert.equal(r.state.newlyEarned, true);
  }
});

test("replayed event id is a duplicate and changes nothing", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(
    ev({ eventId: "evt_2", currentPaidPeriods: 1, periodOrdinal: 2, processedEventIds: ["evt_2"] }),
  );
  assert.ok(r.mapped);
  if (r.mapped) {
    assert.equal(r.state.changed, false);
    assert.equal(r.state.commissionEarned, false);
    assert.equal(r.state.reason, "duplicate_event_ignored");
  }
});

test("out-of-sequence ordinal never earns", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(ev({ currentPaidPeriods: 0, periodOrdinal: 2 }));
  assert.ok(r.mapped);
  if (r.mapped) {
    assert.equal(r.state.paidPeriods, 0);
    assert.equal(r.state.commissionEarned, false);
    assert.equal(r.state.reason, "period_out_of_sequence");
  }
});

test("zero-amount invoice is not a paid period", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(ev({ amountPaid: 0 }));
  assert.ok(r.mapped);
  if (r.mapped) {
    assert.equal(r.state.changed, false);
    assert.equal(r.state.reason, "failed_charge_ignored");
  }
});

test("failed payment is ignored", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(ev({ eventType: "invoice.payment_failed", amountPaid: 0 }));
  assert.ok(r.mapped && r.kind === "failed_charge");
  if (r.mapped) assert.equal(r.state.changed, false);
});

test("refund after earn only flags reversal review", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(
    ev({ eventType: "charge.refunded", eventId: "evt_9", currentPaidPeriods: 2, periodOrdinal: 3 }),
  );
  assert.ok(r.mapped && r.kind === "reversal");
  if (r.mapped) {
    assert.equal(r.state.needsReversalReview, true);
    assert.equal(r.state.commissionEarned, true);
    assert.equal(r.state.status, "earned");
  }
});

test("refund before earn creates no commission", () => {
  const r = mapVerifiedStripeEventToPaidPeriod(
    ev({ eventType: "charge.dispute.created", eventId: "evt_10", currentPaidPeriods: 1, periodOrdinal: 2 }),
  );
  assert.ok(r.mapped && r.kind === "reversal");
  if (r.mapped) {
    assert.equal(r.state.commissionEarned, false);
    assert.equal(r.state.reason, "refund_before_earn_no_commission");
  }
});
