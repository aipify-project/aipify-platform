import assert from "node:assert/strict";
import test from "node:test";
import { CSP_CERTIFICATE_PRODUCT_LABEL } from "./academy/certificate";
import {
  CSP_FIXTURE_FIXED_COMMISSION,
  CSP_INTEGRATION_FIXTURE_SOURCE,
  CspCommercialChainFixture,
} from "./integration-fixture";
import { CSP_STRIPE_LIVE_WIRING_ENABLED, type CspStripeFixtureEvent } from "./stripe-adapter";

const paid = (n: number, id = `evt_fixture_${n}`): CspStripeFixtureEvent => ({
  eventId: id,
  eventType: "invoice.paid",
  amountPaid: 4900,
  periodOrdinal: n,
});

/** Approved + certified + published + agreement → link issued. */
function readyPartner(): CspCommercialChainFixture {
  const f = new CspCommercialChainFixture("Kari Nordmann");
  f.applyAsPartner();
  f.adminSetPartnerStatus("approved", "Documents verified");
  f.acceptAgreement();
  f.publishProduct();
  f.submitExamAttempt(12);
  assert.equal(f.issueSalesLink().ok, true);
  return f;
}

test("fixture never claims to be live", () => {
  const f = new CspCommercialChainFixture();
  assert.equal(f.live, false);
  assert.equal(f.source, CSP_INTEGRATION_FIXTURE_SOURCE);
  assert.equal(f.stripeLiveWiringEnabled, false);
  assert.equal(CSP_STRIPE_LIVE_WIRING_ENABLED, false);
  const r = f.applyAsPartner();
  assert.equal(r.live, false);
  assert.equal(r.source, "deterministic_offline_fixture");
});

test("applicant → admin reject (reason required, no badge, no link)", () => {
  const f = new CspCommercialChainFixture();
  f.applyAsPartner();
  assert.equal(f.partnerStatus, "registered");
  const noReason = f.adminSetPartnerStatus("rejected", "  ");
  assert.equal(noReason.ok, false);
  assert.equal(noReason.error, "reason_required");
  assert.equal(f.partnerStatus, "registered");

  assert.equal(f.adminSetPartnerStatus("rejected", "Incomplete application").ok, true);
  assert.equal(f.partnerStatus, "rejected");
  assert.equal(f.badge().show, false);
  assert.equal(f.issueSalesLink().ok, false);
});

test("applicant → admin approve", () => {
  const f = new CspCommercialChainFixture();
  assert.equal(f.adminSetPartnerStatus("approved", "no partner yet").error, "partner_not_found");
  f.applyAsPartner();
  assert.equal(f.adminSetPartnerStatus("approved", "Documents verified").ok, true);
  assert.equal(f.partnerStatus, "approved");
  assert.equal(f.evaluateLinkGates().gates.partnerApproved, true);
});

test("exam attempt 1: 11/15 fails, attempt 2: 12/15 passes; certificate meta only when passed", () => {
  const f = new CspCommercialChainFixture("Kari Nordmann");
  f.applyAsPartner();

  const a1 = f.submitExamAttempt(11).attempt;
  assert.equal(a1.attemptNumber, 1);
  assert.equal(a1.result.correct, 11);
  assert.equal(a1.result.total, 15);
  assert.equal(a1.result.passed, false);
  assert.equal(a1.certificateMeta, null);
  assert.equal(f.certificateMeta, null);
  assert.equal(f.certificationPassed, false);

  const a2 = f.submitExamAttempt(12).attempt;
  assert.equal(a2.attemptNumber, 2);
  assert.equal(a2.result.correct, 12);
  assert.equal(a2.result.scorePct, 80);
  assert.equal(a2.result.passed, true);
  assert.notEqual(a2.variantId, a1.variantId);

  const meta = a2.certificateMeta;
  assert.ok(meta);
  assert.equal(meta.fullName, "Kari Nordmann");
  assert.equal(meta.productLabel, CSP_CERTIFICATE_PRODUCT_LABEL);
  assert.equal(meta.issuer, "Aipify Group AS");
  assert.equal(meta.verifyPath, `/partners/academy/verify/${meta.certificateId}`);
  assert.equal(f.certificationPassed, true);
});

test("badge on only when approved + certified; off when suspended", () => {
  const f = new CspCommercialChainFixture();
  f.applyAsPartner();
  assert.equal(f.badge().show, false);

  f.submitExamAttempt(12); // certified but not yet approved
  assert.equal(f.badge().show, false);

  f.adminSetPartnerStatus("approved", "Documents verified");
  const on = f.badge();
  assert.equal(on.show, true);
  assert.match(on.text, /Certified Aipify Sales Partner/);

  f.adminSetPartnerStatus("suspended", "Compliance review");
  assert.deepEqual(f.badge(), { show: false, text: "", html: "" });
});

test("approved but not certified has no badge", () => {
  const f = new CspCommercialChainFixture();
  f.applyAsPartner();
  f.adminSetPartnerStatus("approved", "Documents verified");
  f.submitExamAttempt(11);
  assert.equal(f.badge().show, false);
});

test("link gates fail until approved + certified + published + agreement", () => {
  const f = new CspCommercialChainFixture();
  f.applyAsPartner();
  assert.equal(f.evaluateLinkGates().allowed, false);

  f.adminSetPartnerStatus("approved", "Documents verified");
  assert.equal(f.evaluateLinkGates().allowed, false); // not certified / published / agreement

  f.submitExamAttempt(12);
  assert.equal(f.evaluateLinkGates().allowed, false); // not published

  f.publishProduct();
  const beforeAgreement = f.evaluateLinkGates();
  assert.equal(beforeAgreement.gates.agreementAccepted, false);
  assert.equal(beforeAgreement.allowed, false);
  assert.equal(f.issueSalesLink().error, "sales_link_gates_not_met");

  f.acceptAgreement();
  const ready = f.evaluateLinkGates();
  assert.deepEqual(ready.gates, {
    partnerApproved: true,
    productPublished: true,
    certificationPassed: true,
    agreementAccepted: true,
  });
  assert.equal(ready.allowed, true);
  assert.equal(f.issueSalesLink().ok, true);
});

test("suspension after gates were met blocks the link again", () => {
  const f = readyPartner();
  f.adminSetPartnerStatus("suspended", "Compliance review");
  assert.equal(f.evaluateLinkGates().allowed, false);
  assert.equal(f.linkIssued, false);
});

test("payment before a sales link exists is not attributed", () => {
  const f = new CspCommercialChainFixture();
  f.applyAsPartner();
  const r = f.recordPaymentEvent(paid(1));
  assert.equal(r.ok, false);
  assert.equal(r.error, "no_attribution_link");
  assert.equal(r.sale.paidPeriods, 0);
});

test("paid period #1 → registered_awaiting_second_payment, no earn", () => {
  const f = readyPartner();
  const r = f.recordPaymentEvent(paid(1));
  assert.equal(r.ok, true);
  assert.equal(r.reason, "first_period_paid");
  assert.equal(r.newlyEarned, false);
  assert.equal(r.sale.status, "registered_awaiting_second_payment");
  assert.equal(r.sale.paidPeriods, 1);
  assert.equal(r.sale.earnCount, 0);
  assert.equal(r.sale.commissionAmount, 0);
  assert.equal(r.sale.snapshotAmount, CSP_FIXTURE_FIXED_COMMISSION);
});

test("paid period #2 → earn once; duplicate #2 → no second earn; renewals never add commission", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));

  const second = f.recordPaymentEvent(paid(2));
  assert.equal(second.reason, "commission_earned");
  assert.equal(second.newlyEarned, true);
  assert.equal(second.sale.status, "earned");
  assert.equal(second.sale.earnCount, 1);
  assert.equal(second.sale.commissionAmount, CSP_FIXTURE_FIXED_COMMISSION);

  const dup = f.recordPaymentEvent(paid(2)); // same event id replayed
  assert.equal(dup.reason, "duplicate_event_ignored");
  assert.equal(dup.newlyEarned, false);
  assert.equal(dup.sale.earnCount, 1);
  assert.equal(dup.sale.paidPeriods, 2);

  const replayNewId = f.recordPaymentEvent(paid(2, "evt_fixture_2b")); // out of sequence
  assert.equal(replayNewId.reason, "period_out_of_sequence");
  assert.equal(replayNewId.sale.earnCount, 1);

  const renewal = f.recordPaymentEvent(paid(3));
  assert.equal(renewal.reason, "renewal_no_new_commission");
  assert.equal(renewal.newlyEarned, false);
  assert.equal(renewal.sale.earnCount, 1);
  assert.equal(renewal.sale.commissionAmount, CSP_FIXTURE_FIXED_COMMISSION);
});

test("zero-amount invoice and failed payment never count as a paid period", () => {
  const f = readyPartner();
  const zero = f.recordPaymentEvent({ ...paid(1, "evt_zero"), amountPaid: 0 });
  assert.equal(zero.sale.paidPeriods, 0);
  const failed = f.recordPaymentEvent({ eventId: "evt_failed", eventType: "invoice.payment_failed", periodOrdinal: 1 });
  assert.equal(failed.reason, "failed_charge_ignored");
  assert.equal(failed.sale.paidPeriods, 0);
});

test("refund after earn → reversal review flag; history and amount retained, no second earn", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));
  f.recordPaymentEvent(paid(2));

  const refund = f.recordPaymentEvent({ eventId: "evt_refund", eventType: "charge.refunded", periodOrdinal: 2 });
  assert.equal(refund.reason, "needs_reversal_review");
  assert.equal(refund.sale.needsReversalReview, true);
  assert.equal(refund.sale.earnCount, 1);
  assert.equal(refund.sale.paidPeriods, 2);
  assert.equal(refund.sale.status, "earned");
  assert.equal(refund.sale.commissionAmount, CSP_FIXTURE_FIXED_COMMISSION);

  const later = f.recordPaymentEvent(paid(3));
  assert.equal(later.sale.needsReversalReview, true); // flag is never silently cleared
});

test("refund before earn raises no reversal flag and earns nothing", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));
  const refund = f.recordPaymentEvent({ eventId: "evt_refund_early", eventType: "charge.refunded", periodOrdinal: 1 });
  assert.equal(refund.reason, "refund_before_earn_no_commission");
  assert.equal(refund.sale.needsReversalReview, false);
  assert.equal(refund.sale.commissionAmount, 0);
});

test("settlement requires an earned commission", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));
  assert.equal(f.openSettlement().error, "nothing_earned");
});

test("settlement open → approved → closed → paid with evidence", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));
  f.recordPaymentEvent(paid(2));

  const opened = f.openSettlement();
  assert.equal(opened.ok, true);
  assert.equal(opened.settlement?.totalAmount, CSP_FIXTURE_FIXED_COMMISSION);

  assert.equal(f.transitionSettlement("closed").error, "invalid_settlement_transition"); // skip not allowed
  assert.equal(f.transitionSettlement("approved").ok, true);
  assert.equal(f.transitionSettlement("closed").ok, true);

  const noEvidence = f.transitionSettlement("paid");
  assert.equal(noEvidence.error, "paid_at_required");
  assert.equal(f.transitionSettlement("paid", { paidAt: "2026-12-05T08:00:00Z" }).error, "payment_reference_required");
  assert.equal(
    f.transitionSettlement("paid", { paidAt: "2026-12-05T08:00:00Z", paymentReference: "REF-1" }).error,
    "admin_id_required",
  );

  const done = f.transitionSettlement("paid", {
    paidAt: "2026-12-05T08:00:00Z",
    paymentReference: "REF-1",
    adminId: "00000000-0000-4000-8000-0000000000d1",
  });
  assert.equal(done.ok, true);
  assert.deepEqual(done.settlement?.history, ["open", "approved", "closed", "paid"]);
  assert.equal(done.settlement?.paymentReference, "REF-1");
  assert.equal(done.settlement?.paidAt, "2026-12-05T08:00:00.000Z");

  // terminal: paid cannot move again
  assert.equal(f.transitionSettlement("voided", { rejectionReason: "late" }).error, "invalid_settlement_transition");
});

test("settlement voided requires a reason", () => {
  const f = readyPartner();
  f.recordPaymentEvent(paid(1));
  f.recordPaymentEvent(paid(2));
  f.openSettlement();

  const noReason = f.transitionSettlement("voided");
  assert.equal(noReason.ok, false);
  assert.equal(noReason.error, "rejection_reason_required");
  assert.equal(f.transitionSettlement("voided", { rejectionReason: "   " }).error, "rejection_reason_required");

  const voided = f.transitionSettlement("voided", { rejectionReason: "Bank details unverified" });
  assert.equal(voided.ok, true);
  assert.equal(voided.settlement?.status, "voided");
  assert.equal(voided.settlement?.rejectionReason, "Bank details unverified");
  assert.deepEqual(voided.settlement?.history, ["open", "voided"]);
});

test("full chain end to end is deterministic across runs", () => {
  const run = () => {
    const f = readyPartner();
    f.recordPaymentEvent(paid(1));
    f.recordPaymentEvent(paid(2));
    f.openSettlement();
    f.transitionSettlement("approved");
    return JSON.stringify({ sale: f.saleView(), badge: f.badge(), cert: f.certificateMeta });
  };
  assert.equal(run(), run());
});
