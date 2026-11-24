import assert from "node:assert/strict";
import test from "node:test";
import { applyVerifiedPaidPeriod } from "./payment-periods";

const ev = (over: Partial<Parameters<typeof applyVerifiedPaidPeriod>[0]>) =>
  applyVerifiedPaidPeriod({
    currentPaidPeriods: 0,
    eventPeriodOrdinal: 1,
    isSuccessfulCharge: true,
    isDuplicate: false,
    isRefundOrChargeback: false,
    ...over,
  });

test("period 1 registers, no commission", () => {
  const s = ev({});
  assert.equal(s.paidPeriods, 1);
  assert.equal(s.status, "registered_awaiting_second_payment");
  assert.equal(s.commissionEarned, false);
});

test("period 2 earns exactly once", () => {
  const s = ev({ currentPaidPeriods: 1, eventPeriodOrdinal: 2 });
  assert.equal(s.status, "earned");
  assert.equal(s.commissionEarned, true);
  assert.equal(s.earnOnce, true);
  assert.equal(s.newlyEarned, true);
});

test("duplicate period 2 does not change state", () => {
  const s = ev({ currentPaidPeriods: 1, eventPeriodOrdinal: 2, isDuplicate: true });
  assert.equal(s.changed, false);
  assert.equal(s.paidPeriods, 1);
  assert.equal(s.commissionEarned, false);
});

test("period 3+ yields no new commission", () => {
  const s = ev({ currentPaidPeriods: 2, eventPeriodOrdinal: 3 });
  assert.equal(s.paidPeriods, 3);
  assert.equal(s.newlyEarned, false);
  assert.equal(s.commissionEarned, true);
});

test("replayed period 2 after earn does not re-earn", () => {
  const s = ev({ currentPaidPeriods: 2, eventPeriodOrdinal: 2 });
  assert.equal(s.changed, false);
  assert.equal(s.newlyEarned, false);
});

test("failed charge changes nothing", () => {
  const s = ev({ currentPaidPeriods: 1, eventPeriodOrdinal: 2, isSuccessfulCharge: false });
  assert.equal(s.changed, false);
  assert.equal(s.paidPeriods, 1);
});

test("refund after earn flags reversal review without deleting history", () => {
  const s = ev({ currentPaidPeriods: 2, eventPeriodOrdinal: 2, isSuccessfulCharge: false, isRefundOrChargeback: true });
  assert.equal(s.needsReversalReview, true);
  assert.equal(s.paidPeriods, 2);
  assert.equal(s.status, "earned");
  assert.equal(s.commissionEarned, true);
});

test("refund before earn does not flag review", () => {
  const s = ev({ currentPaidPeriods: 1, eventPeriodOrdinal: 1, isSuccessfulCharge: false, isRefundOrChargeback: true });
  assert.equal(s.needsReversalReview, false);
  assert.equal(s.paidPeriods, 1);
});
