import assert from "node:assert/strict";
import test from "node:test";
import { CSP_SETTLEMENT_STATUSES } from "./constants";
import {
  canTransitionSettlement,
  requirePaidReference,
  requireRejectionReason,
  settlementBusinessLabel,
} from "./settlement-rules";

test("maps DB statuses to business labels", () => {
  assert.equal(settlementBusinessLabel("open"), "in_review");
  assert.equal(settlementBusinessLabel("approved"), "approved");
  assert.equal(settlementBusinessLabel("closed"), "sent_to_payout");
  assert.equal(settlementBusinessLabel("paid"), "paid");
  assert.equal(settlementBusinessLabel("voided"), "rejected");
});

test("DB enum strings are unchanged", () => {
  assert.deepEqual([...CSP_SETTLEMENT_STATUSES], ["open", "closed", "approved", "paid", "voided"]);
});

test("transition matrix", () => {
  const allowed = new Set(["open>approved", "open>voided", "approved>closed", "closed>paid", "closed>voided"]);
  for (const from of CSP_SETTLEMENT_STATUSES) {
    for (const to of CSP_SETTLEMENT_STATUSES) {
      assert.equal(canTransitionSettlement(from, to), allowed.has(`${from}>${to}`), `${from}>${to}`);
    }
  }
});

test("rejection requires a reason", () => {
  assert.equal(requireRejectionReason("voided", "  ").ok, false);
  assert.equal(requireRejectionReason("voided", null).ok, false);
  assert.equal(requireRejectionReason("voided", "duplicate claim").ok, true);
  assert.equal(requireRejectionReason("approved").ok, true);
});

test("paid requires paidAt, reference and admin", () => {
  const good = { paidAt: "2026-02-01T10:00:00Z", paymentReference: "REF-1", adminId: "admin-1" };
  assert.equal(requirePaidReference("paid", good).ok, true);
  assert.equal(requirePaidReference("paid", { ...good, paidAt: null }).ok, false);
  assert.equal(requirePaidReference("paid", { ...good, paidAt: "not-a-date" }).ok, false);
  assert.equal(requirePaidReference("paid", { ...good, paymentReference: " " }).ok, false);
  assert.equal(requirePaidReference("paid", { ...good, adminId: undefined }).ok, false);
  assert.equal(requirePaidReference("closed", {}).ok, true);
});
