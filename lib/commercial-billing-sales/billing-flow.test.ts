import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCommissionPaymentCaptured,
  applyCommissionReversal,
  applyCommissionReinstatement,
  authorizeProductOperation,
  buildCommercialNotifications,
  buildCustomerPaymentHistory,
  buildWebhookSignatureHeader,
  canEnterManualSettlement,
  COMMISSION_SETTLEMENT_POLICY,
  computePercentCommissionMinorForParityOnly,
  createEmptyCommissionLedger,
  normalizeProviderEvent,
  percentCommissionIsActivatable,
  queueSaleForManualSettlement,
  recordManualSettlementCompleted,
  resolveCommissionRuleSnapshot,
  resolveEffectiveEntitlement,
  saleLedgerBalanceMinor,
  verifyWebhookSignature,
  isSellerSideNotification,
  type CommissionCaptureInput,
} from "./index";
import {
  APPROVED_SELLER,
  SALES_CODE,
  salesLink,
  attributedIntent,
  billingCtx,
  disputeEvent,
  entitlementsOf,
  FAKE_WEBHOOK_SECRET,
  fixedRule,
  invoiceEvent,
  makeIntent,
  MONTHLY_GROSS,
  NOW,
  NOW_EPOCH,
  oneTimeEvent,
  ONE_TIME_GROSS,
  P1_END,
  P1_START,
  P2_END,
  P2_START,
  P3_END,
  P3_START,
  refundEvent,
  run,
  stateWith,
  subscriptionEvent,
  T_A,
  T_B,
  YEARLY_GROSS,
  DAY,
} from "./test-fixtures";

const month1 = (intent: ReturnType<typeof makeIntent>, id = "evt_1", inv = "in_1") =>
  invoiceEvent({ eventId: id, intent, invoiceId: inv, reason: "subscription_create", start: P1_START, end: P1_END });
const month2 = (intent: ReturnType<typeof makeIntent>, id = "evt_2", inv = "in_2") =>
  invoiceEvent({ eventId: id, intent, invoiceId: inv, reason: "subscription_cycle", start: P2_START, end: P2_END });
const month3 = (intent: ReturnType<typeof makeIntent>, id = "evt_3", inv = "in_3") =>
  invoiceEvent({ eventId: id, intent, invoiceId: inv, reason: "subscription_cycle", start: P3_START, end: P3_END });

function entOf(state: ReturnType<typeof stateWith>, tenant = T_A, product = "kompis_web") {
  return state.entitlements[`${tenant}::${product}`];
}
function sale(state: ReturnType<typeof stateWith>) {
  return Object.values(state.commission.sales)[0];
}

// ------------------------------------------------------------ E. signature contract

test("E: signature — valid verifies; tampered, stale, missing secret/header, malformed fail closed", () => {
  const payload = '{"id":"evt_x"}';
  const ts = NOW_EPOCH;
  const header = buildWebhookSignatureHeader(payload, FAKE_WEBHOOK_SECRET, ts);
  assert.deepEqual(verifyWebhookSignature({ payload, header, secret: FAKE_WEBHOOK_SECRET, nowSeconds: ts }), { verified: true, timestamp: ts });
  const f = (over: Partial<Parameters<typeof verifyWebhookSignature>[0]>) =>
    verifyWebhookSignature({ payload, header, secret: FAKE_WEBHOOK_SECRET, nowSeconds: ts, ...over });
  assert.deepEqual(f({ payload: payload + " " }), { verified: false, reason: "signature_mismatch" });
  assert.deepEqual(f({ secret: "whsec_other" }), { verified: false, reason: "signature_mismatch" });
  assert.deepEqual(f({ nowSeconds: ts + 301 }), { verified: false, reason: "timestamp_out_of_tolerance" });
  assert.deepEqual(f({ secret: null }), { verified: false, reason: "secret_not_configured" });
  assert.deepEqual(f({ header: null }), { verified: false, reason: "header_missing" });
  assert.deepEqual(f({ header: "garbage" }), { verified: false, reason: "header_malformed" });
  assert.deepEqual(f({ header: `t=${ts},v1=zz` }), { verified: false, reason: "signature_mismatch" });
});

test("E: live-mode events are rejected (LIVE wiring disabled) and unmapped types are no-ops", () => {
  const intent = makeIntent();
  const live = { ...month1(intent), livemode: true };
  const r = run(stateWith(intent), [live]);
  assert.deepEqual(r.steps[0].outcome, { kind: "quarantined", reason: "live_event_rejected" });
  assert.equal(entOf(r.state)?.state, "pending_payment");
  assert.deepEqual(normalizeProviderEvent({ id: "e", type: "customer.created", created: 1, data: { object: {} } }), { ok: false, reason: "event_type_not_mapped" });
  assert.deepEqual(normalizeProviderEvent({ type: "invoice.paid" }), { ok: false, reason: "invalid_event" });
  assert.deepEqual(normalizeProviderEvent(null), { ok: false, reason: "invalid_event" });
  const upd = normalizeProviderEvent({ id: "e", type: "customer.subscription.updated", created: 1, data: { object: { id: "s", cancel_at_period_end: false } } });
  assert.deepEqual(upd, { ok: false, reason: "event_type_not_mapped" });
});

// -------------------------------------------------------- E. payment proof / activation

test("E: checkout.session.completed and redirects never activate — only a captured payment does", () => {
  const intent = makeIntent();
  const completed = {
    id: "evt_cs",
    type: "checkout.session.completed",
    created: NOW_EPOCH,
    livemode: false,
    data: { object: { subscription: "sub_fixture_1", payment_status: "paid", metadata: { aipify_intent_id: intent.intentId, aipify_tenant_id: T_A } } },
  };
  const r = run(stateWith(intent), [completed]);
  assert.equal(r.steps[0].outcome.kind, "noop");
  assert.equal(entOf(r.state)?.state, "pending_payment");
  assert.equal(
    authorizeProductOperation({ callerTenantId: T_A, operation: "operate", productKey: "kompis_web", entitlements: entitlementsOf(r.state), now: NOW }).allowed,
    false,
  );
  // linking happened, so a later invoice with no metadata can still resolve
  assert.equal(r.state.subscriptionToIntent["sub_fixture_1"], intent.intentId);
});

test("E: confirmed first payment activates; operate allowed; validity = paid period", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [month1(intent)]);
  assert.equal(r.steps[0].outcome.kind, "applied");
  const ent = entOf(r.state);
  assert.equal(ent.state, "active");
  assert.equal(ent.validUntil, new Date(P1_END * 1000).toISOString());
  assert.equal(
    authorizeProductOperation({ callerTenantId: T_A, operation: "operate", productKey: "kompis_web", entitlements: entitlementsOf(r.state), now: NOW }).allowed,
    true,
  );
  // after the paid period elapses with no renewal the entitlement expires
  assert.equal(resolveEffectiveEntitlement(ent, new Date((P1_END + DAY) * 1000)).mayOperate, false);
  assert.ok(r.steps[0].effects.some((e) => e.type === "entitlement_activated"));
});

test("E: duplicate and replayed events are idempotent (same event id; invoice.paid + invoice.payment_succeeded)", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [
    month1(intent, "evt_1"),
    month1(intent, "evt_1"), // exact replay
    invoiceEvent({ eventId: "evt_1b", type: "invoice.payment_succeeded", intent, invoiceId: "in_1", reason: "subscription_create", start: P1_START, end: P1_END }),
  ]);
  assert.equal(r.steps[1].outcome.kind, "duplicate_ignored");
  assert.deepEqual(r.steps[2].outcome, { kind: "duplicate_ignored", reason: "payment_already_recorded" });
  assert.equal(Object.keys(r.state.payments).length, 1);
  assert.equal(r.state.subscriptions[intent.intentId].paidPeriods, 1);
});

test("E: out-of-order — renewal before first payment is held, then applied in order once the first arrives", () => {
  const intent = attributedIntent();
  const r = run(stateWith(intent), [month2(intent), month1(intent)]);
  assert.deepEqual(r.steps[0].outcome, { kind: "held_out_of_order", reason: "awaiting_first_payment" });
  assert.equal(r.steps[1].outcome.kind, "applied");
  assert.equal(r.state.held.length, 0);
  assert.equal(r.state.subscriptions[intent.intentId].paidPeriods, 2);
  assert.equal(entOf(r.state).validUntil, new Date(P2_END * 1000).toISOString());
  // commission reached earn because the ledger saw ordinal 1 then 2
  assert.equal(sale(r.state).status, "earned");
  assert.equal(r.state.commission.entries.filter((e) => e.type === "earned").length, 1);
});

test("E: stale / double-billed period for the same subscription is quarantined, never double-counted", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [
    month1(intent),
    invoiceEvent({ eventId: "evt_dup", intent, invoiceId: "in_other", reason: "subscription_create", start: P1_START, end: P1_END }),
    month2(intent),
    invoiceEvent({ eventId: "evt_dup2", intent, invoiceId: "in_dup2", reason: "subscription_cycle", start: P2_START, end: P2_END }),
  ]);
  assert.deepEqual(r.steps[1].outcome, { kind: "quarantined", reason: "double_billing_first_period" });
  assert.deepEqual(r.steps[3].outcome, { kind: "quarantined", reason: "double_billing_same_period" });
  assert.equal(r.state.subscriptions[intent.intentId].paidPeriods, 2);
});

test("E: mapping validation — wrong amount / currency / tenant / price / unknown intent => quarantine, no activation", () => {
  const intent = makeIntent();
  const cases: Array<[string, ReturnType<typeof month1>, string]> = [
    ["amount", invoiceEvent({ eventId: "e1", intent, invoiceId: "i1", reason: "subscription_create", start: P1_START, end: P1_END, amount: MONTHLY_GROSS - 1 }), "amount_mismatch"],
    ["currency", invoiceEvent({ eventId: "e2", intent, invoiceId: "i2", reason: "subscription_create", start: P1_START, end: P1_END, currency: "sek" }), "currency_mismatch"],
    ["tenant", invoiceEvent({ eventId: "e3", intent, invoiceId: "i3", reason: "subscription_create", start: P1_START, end: P1_END, tenant: T_B }), "tenant_mismatch"],
    ["price", invoiceEvent({ eventId: "e4", intent, invoiceId: "i4", reason: "subscription_create", start: P1_START, end: P1_END, priceId: "price_other" }), "unknown_mapping"],
    ["intent", invoiceEvent({ eventId: "e5", intent, invoiceId: "i5", reason: "subscription_create", start: P1_START, end: P1_END, intentIdOverride: "ci_unknown", sub: "sub_x" }), "unknown_mapping"],
  ];
  for (const [label, raw, reason] of cases) {
    const r = run(stateWith(intent), [raw]);
    assert.deepEqual(r.steps[0].outcome, { kind: "quarantined", reason }, label);
    assert.equal(entOf(r.state).state, "pending_payment", label);
    assert.equal(Object.keys(r.state.payments).length, 0, label);
    // replaying a quarantined event stays inert
    const again = run(r.state, [raw]);
    assert.equal(again.steps[0].outcome.kind, "duplicate_ignored", label);
  }
});

test("E: unknown billing reason and zero amount are never activations", () => {
  const intent = makeIntent();
  const noReason = invoiceEvent({ eventId: "e1", intent, invoiceId: "i1", reason: "subscription_create", start: P1_START, end: P1_END });
  (noReason.data!.object as Record<string, unknown>).billing_reason = "manual";
  assert.deepEqual(run(stateWith(intent), [noReason]).steps[0].outcome, { kind: "quarantined", reason: "billing_reason_unknown" });
  const zero = invoiceEvent({ eventId: "e2", intent, invoiceId: "i2", reason: "subscription_create", start: P1_START, end: P1_END, amount: 0 });
  const r = run(stateWith(intent), [zero]);
  assert.deepEqual(r.steps[0].outcome, { kind: "noop", reason: "zero_amount_not_a_paid_capture" });
  assert.equal(entOf(r.state).state, "pending_payment");
});

test("E: tenant isolation — tenant B intent cannot be fulfilled by tenant A's events", () => {
  const a = makeIntent({ callerTenantId: T_A, idempotencyKey: "a" });
  const b = makeIntent({ callerTenantId: T_B, idempotencyKey: "b" });
  let st = stateWith(a);
  st = { ...st, ...stateWith(b), intents: { ...st.intents, ...stateWith(b).intents }, subscriptions: { ...st.subscriptions, ...stateWith(b).subscriptions }, entitlements: { ...st.entitlements, ...stateWith(b).entitlements } };
  const r = run(st, [month1(a)]);
  assert.equal(entOf(r.state, T_A).state, "active");
  assert.equal(entOf(r.state, T_B).state, "pending_payment");
  // A's event claiming B's tenant in metadata is refused
  const forged = run(st, [invoiceEvent({ eventId: "f", intent: a, invoiceId: "in_f", reason: "subscription_create", start: P1_START, end: P1_END, tenant: T_B })]);
  assert.equal(forged.steps[0].outcome.kind, "quarantined");
});

// ------------------------------------------------- E. lifecycle: fail / cancel / refund

test("E: failed payment → grace (operate yes, expand no); expires after grace; recovery restores", () => {
  const intent = makeIntent();
  const failed = invoiceEvent({ eventId: "evt_f", type: "invoice.payment_failed", intent, invoiceId: "in_f", reason: "subscription_cycle", start: P2_START, end: P2_END });
  const r = run(stateWith(intent), [month1(intent), failed]);
  assert.equal(r.state.subscriptions[intent.intentId].status, "past_due");
  const ent = entOf(r.state);
  assert.equal(ent.state, "grace_period");
  const inGrace = new Date((P2_START + 2 * DAY) * 1000);
  assert.equal(resolveEffectiveEntitlement(ent, inGrace).mayOperate, true);
  assert.equal(resolveEffectiveEntitlement(ent, inGrace).mayExpand, false);
  assert.equal(resolveEffectiveEntitlement(ent, new Date((P2_START + 4 * DAY) * 1000)).mayOperate, false);
  assert.ok(r.steps[1].effects.some((e) => e.type === "payment_failed"));

  const recovered = run(r.state, [month2(intent)]);
  assert.equal(recovered.state.subscriptions[intent.intentId].status, "active");
  assert.equal(entOf(recovered.state).state, "active");
  assert.equal(entOf(recovered.state).graceUntil, null);
  assert.equal(recovered.state.subscriptions[intent.intentId].paidPeriods, 2);
});

test("E: failure before any payment keeps pending; stale failure after a successful retry is ignored", () => {
  const intent = makeIntent();
  const failFirst = invoiceEvent({ eventId: "ff", type: "invoice.payment_failed", intent, invoiceId: "in_ff", reason: "subscription_create", start: P1_START, end: P1_END });
  const r0 = run(stateWith(intent), [failFirst]);
  assert.equal(entOf(r0.state).state, "pending_payment");
  assert.equal(r0.state.subscriptions[intent.intentId].status, "pending_payment");

  const stale = invoiceEvent({ eventId: "fs", type: "invoice.payment_failed", intent, invoiceId: "in_fs", reason: "subscription_cycle", start: P1_START, end: P1_END });
  const r1 = run(stateWith(intent), [month1(intent), stale]);
  assert.deepEqual(r1.steps[1].outcome, { kind: "noop", reason: "stale_failure_ignored" });
  assert.equal(entOf(r1.state).state, "active");
});

test("E: cancel scheduled runs to period end; canceled stops; payment after cancel is recorded but not operational", () => {
  const intent = makeIntent();
  const sched = subscriptionEvent({ eventId: "s1", type: "customer.subscription.updated", intent, cancelAtPeriodEnd: true });
  const r = run(stateWith(intent), [month1(intent), sched]);
  assert.equal(entOf(r.state).state, "cancel_scheduled");
  assert.equal(resolveEffectiveEntitlement(entOf(r.state), NOW).mayOperate, true);
  assert.equal(resolveEffectiveEntitlement(entOf(r.state), new Date((P1_END + DAY) * 1000)).mayOperate, false);

  const del = subscriptionEvent({ eventId: "s2", type: "customer.subscription.deleted", intent });
  const c = run(r.state, [del]);
  assert.equal(entOf(c.state).state, "canceled");
  assert.equal(resolveEffectiveEntitlement(entOf(c.state), NOW).mayOperate, false);

  const late = run(c.state, [month2(intent)]);
  assert.equal(late.steps[0].outcome.kind, "applied");
  assert.equal(entOf(late.state).state, "canceled");
  assert.ok(late.steps[0].effects.some((e) => e.type === "payment_after_cancel_review"));
});

test("E: unknown subscription on cancel is quarantined", () => {
  const intent = makeIntent();
  const other = makeIntent({ idempotencyKey: "zzz" });
  const del = subscriptionEvent({ eventId: "s2", type: "customer.subscription.deleted", intent: { ...other, intentId: "ci_missing" } });
  assert.deepEqual(run(stateWith(intent), [del]).steps[0].outcome, { kind: "quarantined", reason: "unknown_mapping" });
});

test("E: full refund of the latest payment revokes the entitlement; history is kept", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [month1(intent), refundEvent({ eventId: "r1", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS })]);
  assert.equal(entOf(r.state).state, "revoked");
  assert.equal(r.state.payments["in_1"].status, "refunded");
  assert.equal(r.state.payments["in_1"].refundedMinor, MONTHLY_GROSS);
  assert.equal(resolveEffectiveEntitlement(entOf(r.state), NOW).mayOperate, false);
  const replay = run(r.state, [refundEvent({ eventId: "r2", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS })]);
  assert.deepEqual(replay.steps[0].outcome, { kind: "duplicate_ignored", reason: "refund_already_recorded" });
});

test("E: refund of an OLDER period does not revoke the current entitlement; partial refund keeps access", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [
    month1(intent),
    month2(intent),
    refundEvent({ eventId: "r1", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS }),
  ]);
  assert.equal(entOf(r.state).state, "active");
  const partial = run(stateWith(intent), [month1(intent), refundEvent({ eventId: "rp", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: 1000 })]);
  assert.equal(partial.state.payments["in_1"].status, "partially_refunded");
  assert.equal(entOf(partial.state).state, "active");
});

test("E: refund arriving BEFORE its payment is held and applied once the payment lands", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [
    refundEvent({ eventId: "r1", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS }),
    month1(intent),
  ]);
  assert.deepEqual(r.steps[0].outcome, { kind: "held_out_of_order", reason: "awaiting_payment" });
  assert.equal(r.state.held.length, 0);
  assert.equal(r.state.payments["in_1"].status, "refunded");
  assert.equal(entOf(r.state).state, "revoked");
});

test("E: chargeback suspends and reverses; winning the dispute restores access and commission", () => {
  const intent = attributedIntent({ interval: "year", idempotencyKey: "y" });
  const y1 = invoiceEvent({ eventId: "y1", intent, invoiceId: "in_y1", reason: "subscription_create", start: P1_START, end: P1_START + 365 * DAY });
  const r = run(stateWith(intent), [y1]);
  assert.equal(sale(r.state).status, "earned");
  assert.equal(saleLedgerBalanceMinor(r.state.commission, sale(r.state).saleKey), 12300);

  const cb = run(r.state, [disputeEvent({ eventId: "d1", invoiceId: "in_y1", amount: YEARLY_GROSS })]);
  assert.equal(entOf(cb.state).state, "suspended");
  assert.equal(cb.state.payments["in_y1"].status, "disputed");
  assert.equal(sale(cb.state).status, "reversed");
  assert.equal(saleLedgerBalanceMinor(cb.state.commission, sale(cb.state).saleKey), 0);

  const won = run(cb.state, [disputeEvent({ eventId: "d2", invoiceId: "in_y1", amount: YEARLY_GROSS, type: "charge.dispute.closed", status: "won" })]);
  assert.equal(entOf(won.state).state, "active");
  assert.equal(won.state.payments["in_y1"].status, "captured");
  assert.equal(sale(won.state).status, "earned");
  assert.equal(saleLedgerBalanceMinor(won.state.commission, sale(won.state).saleKey), 12300);
  // history kept: earned, reversal, reinstatement all present
  const types = won.state.commission.entries.map((e) => e.type);
  assert.deepEqual(types, ["registered", "earned", "reversal", "reinstatement"]);

  // a lost dispute is not reinstated
  const lost = run(cb.state, [disputeEvent({ eventId: "d3", invoiceId: "in_y1", amount: YEARLY_GROSS, type: "charge.dispute.closed", status: "lost" })]);
  assert.equal(lost.steps[0].outcome.kind, "noop");
  assert.equal(entOf(lost.state).state, "suspended");
});

test("E: one-time purchase activates without expiry on a captured payment_intent", () => {
  const intent = attributedIntent({ interval: "one_time", idempotencyKey: "ot" });
  const r = run(stateWith(intent), [oneTimeEvent({ eventId: "ot1", intent, paymentIntentId: "pi_ot1" })]);
  assert.equal(r.steps[0].outcome.kind, "applied");
  const ent = entOf(r.state);
  assert.equal(ent.state, "active");
  assert.equal(ent.validUntil, null);
  assert.equal(resolveEffectiveEntitlement(ent, new Date("2040-01-01T00:00:00Z")).mayOperate, true);
  assert.equal(sale(r.state).status, "earned");
  // wrong amount for one-time is refused
  const bad = run(stateWith(intent), [oneTimeEvent({ eventId: "ot2", intent, paymentIntentId: "pi_ot2", amount: ONE_TIME_GROSS - 1 })]);
  assert.deepEqual(bad.steps[0].outcome, { kind: "quarantined", reason: "amount_mismatch" });
});

// ------------------------------------------------------------- G. commission

test("G: monthly — registered and visible after the 1st paid period, earned only after the 2nd", () => {
  const intent = attributedIntent();
  const r1 = run(stateWith(intent), [month1(intent)]);
  assert.equal(sale(r1.state).status, "registered");
  assert.equal(saleLedgerBalanceMinor(r1.state.commission, sale(r1.state).saleKey), 0);
  assert.ok(r1.steps[0].effects.some((e) => e.type === "commission_registered"));
  assert.ok(!r1.steps[0].effects.some((e) => e.type === "commission_earned"));
  const r2 = run(r1.state, [month2(intent)]);
  assert.equal(sale(r2.state).status, "earned");
  assert.equal(saleLedgerBalanceMinor(r2.state.commission, sale(r2.state).saleKey), 12300);
  assert.ok(r2.steps[0].effects.some((e) => e.type === "commission_earned"));
});

test("G: no recurring renewal commission — 3rd period adds nothing", () => {
  const intent = attributedIntent();
  const r = run(stateWith(intent), [month1(intent), month2(intent), month3(intent)]);
  assert.equal(r.state.commission.entries.filter((e) => e.type === "earned").length, 1);
  assert.equal(saleLedgerBalanceMinor(r.state.commission, sale(r.state).saleKey), 12300);
  assert.equal(sale(r.state).paidPeriods, 3);
});

test("G: yearly earns on the first confirmed annual payment; second year is a renewal with no commission", () => {
  const intent = attributedIntent({ interval: "year", idempotencyKey: "y" });
  const y1 = invoiceEvent({ eventId: "y1", intent, invoiceId: "in_y1", reason: "subscription_create", start: P1_START, end: P1_START + 365 * DAY });
  const y2 = invoiceEvent({ eventId: "y2", intent, invoiceId: "in_y2", reason: "subscription_cycle", start: P1_START + 365 * DAY, end: P1_START + 730 * DAY });
  const r = run(stateWith(intent), [y1, y2]);
  assert.equal(sale(r.state).status, "earned");
  assert.equal(r.state.commission.entries.filter((e) => e.type === "earned").length, 1);
});

test("G: refund / cancel before the earn threshold — no commission; history preserved, nothing deleted", () => {
  const intent = attributedIntent();
  const refunded = run(stateWith(intent), [month1(intent), refundEvent({ eventId: "r", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS })]);
  assert.equal(sale(refunded.state).status, "reversed");
  assert.equal(saleLedgerBalanceMinor(refunded.state.commission, sale(refunded.state).saleKey), 0);
  assert.deepEqual(refunded.state.commission.entries.map((e) => e.type), ["registered", "reversal"]);

  const canceled = run(stateWith(intent), [month1(intent), subscriptionEvent({ eventId: "c", type: "customer.subscription.deleted", intent })]);
  assert.equal(sale(canceled.state).status, "cancelled_unearned");
  // a later 2nd payment after cancel can never earn
  const late = run(canceled.state, [month2(intent)]);
  assert.equal(sale(late.state).status, "cancelled_unearned");
  assert.equal(saleLedgerBalanceMinor(late.state.commission, sale(late.state).saleKey), 0);
});

test("G: reversal after earn is negative, partial refund only flags review, cancel after earn keeps the commission", () => {
  const intent = attributedIntent();
  const earned = run(stateWith(intent), [month1(intent), month2(intent)]);
  const refund1 = run(earned.state, [refundEvent({ eventId: "r", invoiceId: "in_1", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS })]);
  assert.equal(sale(refund1.state).status, "reversed");
  assert.equal(saleLedgerBalanceMinor(refund1.state.commission, sale(refund1.state).saleKey), 0);
  assert.ok(refund1.state.commission.entries.some((e) => e.type === "reversal" && e.amountMinor === -12300));
  assert.ok(refund1.steps[0].effects.some((e) => e.type === "commission_reversed" && e.detail === "-12300"));

  const partial = run(earned.state, [refundEvent({ eventId: "rp", invoiceId: "in_2", amount: MONTHLY_GROSS, refunded: 500 })]);
  assert.equal(sale(partial.state).status, "earned");
  assert.equal(sale(partial.state).needsReview, true);

  const cancel = run(earned.state, [subscriptionEvent({ eventId: "c", type: "customer.subscription.deleted", intent })]);
  assert.equal(sale(cancel.state).status, "earned");
  // refund of a non-qualifying renewal does not touch commission
  const withRenewal = run(earned.state, [month3(intent), refundEvent({ eventId: "r3", invoiceId: "in_3", amount: MONTHLY_GROSS, refunded: MONTHLY_GROSS })]);
  assert.equal(sale(withRenewal.state).status, "earned");
});

test("G: unattributed purchases never touch the commission ledger", () => {
  const intent = makeIntent();
  const r = run(stateWith(intent), [month1(intent), month2(intent)]);
  assert.equal(Object.keys(r.state.commission.sales).length, 0);
  assert.equal(r.state.commission.entries.length, 0);
});

test("G: commission amount is snapshotted at the first confirmed sale; later rule edits never change it", () => {
  const intent = attributedIntent();
  let rule = fixedRule(123);
  const ctx = { now: NOW, resolveCommissionRule: () => rule };
  const r1 = run(stateWith(intent), [month1(intent)], ctx);
  rule = fixedRule(999); // owner edits the rate after the first sale
  const r2 = run(r1.state, [month2(intent)], ctx);
  assert.equal(saleLedgerBalanceMinor(r2.state.commission, sale(r2.state).saleKey), 12300);
});

test("G: rule null = NOT configured (never defaulted); explicit 0 is a valid configured zero", () => {
  assert.deepEqual(resolveCommissionRuleSnapshot(null, "NOK"), { configured: false, reason: "not_configured" });
  assert.deepEqual(resolveCommissionRuleSnapshot(undefined, "NOK"), { configured: false, reason: "not_configured" });
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(null), "NOK"), { configured: false, reason: "amount_missing" });
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(0), "NOK"), { configured: true, model: "fixed", amountMinor: 0, currency: "NOK" });
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(123, { active: false }), "NOK"), { configured: false, reason: "rule_inactive" });
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(123), "SEK"), { configured: false, reason: "currency_mismatch" });
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(1.234), "NOK"), { configured: false, reason: "amount_invalid" });

  // unconfigured: sale is visible/registered but never earns and cannot be settled
  const intent = attributedIntent();
  const none = run(stateWith(intent), [month1(intent), month2(intent)], billingCtx(null));
  const s = sale(none.state);
  assert.equal(s.status, "registered");
  assert.equal(s.needsReview, true);
  assert.equal(saleLedgerBalanceMinor(none.state.commission, s.saleKey), 0);
  assert.deepEqual(canEnterManualSettlement(s), { ok: false, reason: "not_earned" });

  // explicit zero: earned with 0, settlement-eligible
  const zero = run(stateWith(intent), [month1(intent), month2(intent)], billingCtx(fixedRule(0)));
  const z = sale(zero.state);
  assert.equal(z.status, "earned");
  assert.equal(z.earnedAmountMinor, 0);
  assert.deepEqual(canEnterManualSettlement(z), { ok: true });
});

test("G: percent is CORE_BLOCKED — recorded as blocked, never earned; parity math exists but is not wired", () => {
  assert.equal(percentCommissionIsActivatable(), false);
  assert.deepEqual(resolveCommissionRuleSnapshot(fixedRule(null, { model: "percent", ratePct: 10 }), "NOK"), { configured: false, reason: "percent_core_blocked" });
  const intent = attributedIntent({ interval: "year", idempotencyKey: "y" });
  const y1 = invoiceEvent({ eventId: "y1", intent, invoiceId: "in_y1", reason: "subscription_create", start: P1_START, end: P1_START + 365 * DAY });
  const r = run(stateWith(intent), [y1], billingCtx(fixedRule(null, { model: "percent", ratePct: 10 })));
  assert.equal(sale(r.state).status, "registered");
  assert.equal(sale(r.state).rule.configured, false);
  assert.equal(r.state.commission.entries.filter((e) => e.type === "earned").length, 0);
  // net ex VAT after discount 53910 × 10% = 5391
  assert.equal(computePercentCommissionMinorForParityOnly(53910, 1000), 5391);
  assert.equal(computePercentCommissionMinorForParityOnly(5, 1000), 1); // 0.5 rounds half up
});

test("G: price ↔ commission parity — commission basis is net ex VAT after discount", () => {
  const plain = attributedIntent();
  assert.equal(plain.pricing.netAfterDiscountExVatMinor, 59900);
  const withDiscount = makeIntent(
    { discountCode: "TEN", idempotencyKey: "d", salesLinkCode: SALES_CODE },
    {
      salesLink: salesLink(),
      seller: APPROVED_SELLER,
      approvedDiscounts: [{ code: "TEN", active: true, kind: "percent", basisPoints: 1000 }],
    },
  );
  assert.equal(withDiscount.pricing.netAfterDiscountExVatMinor, 53910);
  const r = run(stateWith(withDiscount), [
    invoiceEvent({ eventId: "d1", intent: withDiscount, invoiceId: "in_d1", reason: "subscription_create", start: P1_START, end: P1_END }),
  ]);
  assert.equal(r.state.payments["in_d1"].netExVatMinor, 53910);
  assert.equal(r.state.payments["in_d1"].amountMinor, 67388);
});

function captureInput(over: Partial<CommissionCaptureInput> = {}): CommissionCaptureInput {
  return {
    eventId: "ev1",
    paymentId: "pay1",
    programId: "prog",
    programKind: "tenant_commercial",
    ownerTenantId: "owner_t",
    partnerId: "partner",
    partnerAuthUserId: "auth_partner",
    customerTenantId: T_A,
    customerAuthUserId: "auth_buyer",
    productKey: "kompis_web",
    variantKey: "standard",
    interval: "one_time",
    currency: "NOK",
    periodOrdinal: 1,
    capturedMinor: 1000,
    netExVatMinor: 800,
    rule: fixedRule(1),
    at: NOW.toISOString(),
    ...over,
  };
}

test("G: ledger is idempotent, self-referral blocked, cross-tenant/program isolated, sequences enforced", () => {
  const l0 = createEmptyCommissionLedger();
  const a = applyCommissionPaymentCaptured(l0, captureInput());
  assert.equal(a.outcome.kind, "earned");
  const replay = applyCommissionPaymentCaptured(a.ledger, captureInput());
  assert.deepEqual(replay.outcome, { kind: "duplicate_ignored", reason: "event_replayed" });
  assert.equal(replay.ledger.entries.length, a.ledger.entries.length);
  // new event, same payment => payment_already_recorded
  assert.deepEqual(applyCommissionPaymentCaptured(a.ledger, captureInput({ eventId: "ev2" })).outcome, {
    kind: "duplicate_ignored",
    reason: "payment_already_recorded",
  });
  // new payment, same (partner, customer, product) => at most one qualifying commission
  assert.deepEqual(applyCommissionPaymentCaptured(a.ledger, captureInput({ eventId: "ev3", paymentId: "pay3" })).outcome, {
    kind: "duplicate_ignored",
    reason: "sale_already_qualified",
  });
  assert.deepEqual(applyCommissionPaymentCaptured(l0, captureInput({ customerAuthUserId: "auth_partner" })).outcome, { kind: "rejected", reason: "self_referral" });
  assert.deepEqual(applyCommissionPaymentCaptured(l0, captureInput({ capturedMinor: 0 })).outcome, { kind: "rejected", reason: "no_confirmed_capture" });
  assert.deepEqual(applyCommissionPaymentCaptured(l0, captureInput({ periodOrdinal: 2 })).outcome, { kind: "rejected", reason: "sale_not_registered" });
  const m = applyCommissionPaymentCaptured(l0, captureInput({ interval: "month" }));
  assert.equal(m.outcome.kind, "registered");
  assert.deepEqual(
    applyCommissionPaymentCaptured(m.ledger, captureInput({ interval: "month", eventId: "e5", paymentId: "p5", periodOrdinal: 3 })).outcome,
    { kind: "rejected", reason: "period_out_of_sequence" },
  );
  // another program (same partner/customer/product) is a separate sale — ledgers never merge
  const other = applyCommissionPaymentCaptured(a.ledger, captureInput({ eventId: "e9", paymentId: "p9", programId: "other_prog" }));
  assert.equal(other.outcome.kind, "earned");
  assert.equal(Object.keys(other.ledger.sales).length, 2);
});

test("G: reversal and reinstatement are idempotent; partial reversal never auto-reverses", () => {
  const a = applyCommissionPaymentCaptured(createEmptyCommissionLedger(), captureInput());
  const rev = applyCommissionReversal(a.ledger, { eventId: "rv1", paymentId: "pay1", kind: "refund", full: true, at: NOW.toISOString() });
  assert.deepEqual(rev.outcome, { kind: "reversed", saleKey: Object.keys(a.ledger.sales)[0], amountMinor: -100, clawbackReview: false });
  const again = applyCommissionReversal(rev.ledger, { eventId: "rv1", paymentId: "pay1", kind: "refund", full: true, at: NOW.toISOString() });
  assert.equal(again.outcome.kind, "duplicate_ignored");
  // refunds are never reinstated
  const notReinstated = applyCommissionReinstatement(rev.ledger, { eventId: "ri1", paymentId: "pay1", at: NOW.toISOString() });
  assert.deepEqual(notReinstated.outcome, { kind: "no_commission_impact", reason: "not_reinstatable" });
  assert.deepEqual(applyCommissionReversal(a.ledger, { eventId: "x", paymentId: "unknown", kind: "refund", full: true, at: NOW.toISOString() }).outcome, { kind: "sale_not_found" });
  const part = applyCommissionReversal(a.ledger, { eventId: "rp", paymentId: "pay1", kind: "refund", full: false, at: NOW.toISOString() });
  assert.equal(part.outcome.kind, "review_flagged");
  assert.equal(Object.values(part.ledger.sales)[0].status, "earned");
});

test("G: settlement is manual only — approver required, no payout activation, clawback review after settlement", () => {
  assert.deepEqual(COMMISSION_SETTLEMENT_POLICY, { manualOnly: true, autoApprove: false, payoutActivation: false, programLedgersMixed: false });
  const a = applyCommissionPaymentCaptured(createEmptyCommissionLedger(), captureInput());
  const key = Object.keys(a.ledger.sales)[0];
  assert.deepEqual(queueSaleForManualSettlement(a.ledger, { saleKey: key, approvedByUserId: "" }), { ledger: a.ledger, ok: false, reason: "manual_approver_required" });
  assert.equal(queueSaleForManualSettlement(a.ledger, { saleKey: "nope", approvedByUserId: "ops" }).ok, false);
  const q = queueSaleForManualSettlement(a.ledger, { saleKey: key, approvedByUserId: "ops_user" });
  assert.ok(q.ok);
  assert.equal(queueSaleForManualSettlement(q.ledger, { saleKey: key, approvedByUserId: "ops_user" }).ok, false);
  const done = recordManualSettlementCompleted(q.ledger, { saleKey: key, recordedByUserId: "ops_user" });
  assert.ok(done.ok);
  assert.equal(recordManualSettlementCompleted(a.ledger, { saleKey: key, recordedByUserId: "ops" }).ok, false);
  const rev = applyCommissionReversal(done.ledger, { eventId: "late", paymentId: "pay1", kind: "chargeback", full: true, at: NOW.toISOString() });
  assert.equal(rev.outcome.kind === "reversed" && rev.outcome.clawbackReview, true);
  assert.equal(Object.values(rev.ledger.sales)[0].needsClawbackReview, true);
  assert.equal(Object.values(rev.ledger.sales)[0].settlementState, "settled"); // never silently un-settled
});

// -------------------------------------------------------------- F. invoices / history

test("F: payment history — authorized tenant sees only own rows; nothing fabricated; no source => closed", () => {
  const a = makeIntent({ callerTenantId: T_A, idempotencyKey: "a" });
  const r = run(stateWith(a), [month1(a), month2(a)]);
  const payments = Object.values(r.state.payments);
  const own = buildCustomerPaymentHistory({ callerTenantId: T_A, payments });
  assert.equal(own.available, true);
  assert.equal(own.items.length, 2);
  assert.deepEqual(own.items.map((i) => i.periodOrdinal), [1, 2]);
  assert.equal(own.items[0].documentUrl, null);
  assert.equal(own.fabricatesDocuments, false);
  assert.equal(own.sendsEmail, false);
  assert.equal(own.doubleBillingSuspected, false);
  assert.equal(own.items[0].amountMinor, MONTHLY_GROSS);
  assert.equal(own.items[0].vatMinor, 14975);

  const other = buildCustomerPaymentHistory({ callerTenantId: T_B, payments });
  assert.equal(other.available, true);
  assert.equal(other.items.length, 0);

  const linked = buildCustomerPaymentHistory({ callerTenantId: T_A, payments, documentLinks: { in_1: "https://provider.example/in_1" } });
  assert.equal(linked.items[0].documentUrl, "https://provider.example/in_1");
  assert.equal(linked.items[1].documentUrl, null);

  for (const bad of [buildCustomerPaymentHistory({ callerTenantId: "", payments }), buildCustomerPaymentHistory({ callerTenantId: T_A, payments: null })]) {
    assert.equal(bad.available, false);
    assert.equal(bad.blocker, "no_authoritative_payment_source");
    assert.equal(bad.items.length, 0);
  }
});

test("F: double billing is detected from the single payment source", () => {
  const a = makeIntent();
  const r = run(stateWith(a), [month1(a)]);
  const p = Object.values(r.state.payments)[0];
  const dup = buildCustomerPaymentHistory({ callerTenantId: T_A, payments: [p, { ...p, paymentId: "in_dup" }] });
  assert.equal(dup.doubleBillingSuspected, true);
});

test("F: notification DTOs for Agent 3 — deduped keys, no delivery, no sensitive data; seller events flagged", () => {
  const intent = attributedIntent();
  const r = run(stateWith(intent), [month1(intent), month2(intent)]);
  const effects = r.steps.flatMap((s) => s.effects);
  const notes = buildCommercialNotifications(effects);
  assert.ok(notes.length > 0);
  for (const n of notes) {
    assert.equal(n.deliveryImplemented, false);
    assert.equal(n.containsSensitiveData, false);
    assert.ok(n.dedupeKey.startsWith(n.event));
  }
  assert.ok(notes.some((n) => n.event === "commercial.payment_succeeded"));
  const earned = notes.find((n) => n.event === "commercial.commission_earned");
  assert.ok(earned && isSellerSideNotification(earned));
  assert.equal(isSellerSideNotification(notes.find((n) => n.event === "commercial.payment_succeeded")!), false);
  // registered commission is intentionally not a notification (visible in ledger only)
  assert.ok(!notes.some((n) => (n.event as string) === "commercial.commission_registered"));
  // identical effect lists produce identical dedupe keys (stable)
  const again = buildCommercialNotifications(effects);
  assert.deepEqual(again.map((n) => n.dedupeKey), notes.map((n) => n.dedupeKey));
});
