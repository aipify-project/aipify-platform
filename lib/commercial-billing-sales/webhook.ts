/**
 * E. Webhook + fulfillment — signature verification contract and a pure, idempotent reducer.
 *
 * FIXTURES ONLY. No Stripe SDK, no network, no secrets read from env. `livemode: true` events are
 * rejected (LIVE wiring is disabled — see CSP_STRIPE_LIVE_WIRING_ENABLED). The verification secret is
 * always passed in by the caller; tests use a clearly fake constant.
 *
 * Guarantees:
 *  - Only a verified, mapped, CAPTURED payment activates an entitlement. checkout.session.completed and
 *    redirects never do.
 *  - Duplicate / replayed events are no-ops. invoice.paid + invoice.payment_succeeded for the same invoice
 *    count once. Out-of-order events are held (not lost) and re-applied once their prerequisite exists.
 *  - Product / variant / tenant / amount / currency must match the server-created checkout intent.
 *    Unknown mapping => quarantine, never activation.
 *  - Refund / chargeback / cancellation / failure / recovery update state without deleting history.
 *  - Commission is driven from the same payment ledger (one authoritative payment source).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { VariantIntervalCommissionRule } from "@/lib/product-catalog/variant-commission";
import { CSP_STRIPE_LIVE_WIRING_ENABLED } from "@/lib/certified-sales-partner/stripe-adapter";
import type { CheckoutIntent } from "./checkout";
import {
  applyCommissionPaymentCaptured,
  applyCommissionReinstatement,
  applyCommissionReversal,
  applyCommissionSubscriptionCancelled,
  createEmptyCommissionLedger,
  type CommissionLedger,
  type CommissionOutcome,
} from "./commission";
import { COMMERCIAL_PAYMENT_GRACE_DAYS } from "./contract";
import {
  computeGraceUntil,
  entitlementKey,
  type EntitlementRecord,
  type EntitlementState,
} from "./entitlement";
import { normalizeCurrency } from "./money";

// ---------------------------------------------------------------------------
// Signature verification (Stripe-style `t=<unix>,v1=<hex hmac-sha256 of "t.payload">`).
// ---------------------------------------------------------------------------

export const WEBHOOK_SIGNATURE_TOLERANCE_SECONDS = 300;

export function computeWebhookSignature(payload: string, secret: string, timestampSeconds: number): string {
  return createHmac("sha256", secret).update(`${timestampSeconds}.${payload}`).digest("hex");
}

export function buildWebhookSignatureHeader(payload: string, secret: string, timestampSeconds: number): string {
  return `t=${timestampSeconds},v1=${computeWebhookSignature(payload, secret, timestampSeconds)}`;
}

export type SignatureVerification =
  | { verified: true; timestamp: number }
  | {
      verified: false;
      reason:
        | "secret_not_configured"
        | "header_missing"
        | "header_malformed"
        | "timestamp_out_of_tolerance"
        | "signature_mismatch";
    };

export function verifyWebhookSignature(input: {
  payload: string;
  header: string | null | undefined;
  secret: string | null | undefined;
  nowSeconds: number;
  toleranceSeconds?: number;
}): SignatureVerification {
  if (!input.secret) return { verified: false, reason: "secret_not_configured" };
  if (!input.header) return { verified: false, reason: "header_missing" };
  let t: number | null = null;
  const sigs: string[] = [];
  for (const part of input.header.split(",")) {
    const [k, v] = part.split("=");
    if (k?.trim() === "t" && v) t = Number(v);
    if (k?.trim() === "v1" && v) sigs.push(v.trim());
  }
  if (t == null || !Number.isInteger(t) || sigs.length === 0) return { verified: false, reason: "header_malformed" };
  const tolerance = input.toleranceSeconds ?? WEBHOOK_SIGNATURE_TOLERANCE_SECONDS;
  if (Math.abs(input.nowSeconds - t) > tolerance) return { verified: false, reason: "timestamp_out_of_tolerance" };
  const expected = Buffer.from(computeWebhookSignature(input.payload, input.secret, t), "hex");
  const ok = sigs.some((s) => {
    if (!/^[0-9a-f]+$/i.test(s)) return false;
    const given = Buffer.from(s, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  return ok ? { verified: true, timestamp: t } : { verified: false, reason: "signature_mismatch" };
}

// ---------------------------------------------------------------------------
// Normalization of (already verified) provider events.
// ---------------------------------------------------------------------------

export type RawProviderEvent = {
  id?: unknown;
  type?: unknown;
  created?: unknown;
  livemode?: unknown;
  data?: { object?: unknown };
};

export type BillingEventKind =
  | "checkout_completed"
  | "payment_captured"
  | "payment_failed"
  | "subscription_canceled"
  | "cancel_scheduled"
  | "refund"
  | "chargeback"
  | "chargeback_won";

export type NormalizedBillingEvent = {
  eventId: string;
  providerType: string;
  occurredAtEpoch: number;
  kind: BillingEventKind;
  intentId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  paymentId: string | null;
  paymentIntentId: string | null;
  billingReason: "subscription_create" | "subscription_cycle" | "one_time" | null;
  providerPriceId: string | null;
  metadataTenantId: string | null;
  currency: string | null;
  amountMinor: number | null;
  netExVatMinor: number | null;
  periodStartEpoch: number | null;
  periodEndEpoch: number | null;
  refundedMinor: number | null;
};

export type NormalizeResult =
  | { ok: true; event: NormalizedBillingEvent }
  | { ok: false; reason: "invalid_event" | "live_event_rejected" | "event_type_not_mapped" };

function s(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
function n(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function normalizeProviderEvent(raw: RawProviderEvent | null | undefined): NormalizeResult {
  if (!raw || typeof raw !== "object") return { ok: false, reason: "invalid_event" };
  const eventId = s(raw.id);
  const type = s(raw.type);
  const created = n(raw.created);
  if (!eventId || !type || created == null) return { ok: false, reason: "invalid_event" };
  // LIVE traffic is not supported; fail closed regardless of signature validity.
  if (raw.livemode === true || CSP_STRIPE_LIVE_WIRING_ENABLED !== false) {
    return { ok: false, reason: "live_event_rejected" };
  }
  const o = obj(raw.data?.object);
  const meta = obj(o.metadata);
  const subMeta = obj(obj(o.subscription_details).metadata);
  const intentId = s(subMeta.aipify_intent_id) ?? s(meta.aipify_intent_id);
  const tenant = s(subMeta.aipify_tenant_id) ?? s(meta.aipify_tenant_id);

  const base: NormalizedBillingEvent = {
    eventId,
    providerType: type,
    occurredAtEpoch: created,
    kind: "checkout_completed",
    intentId,
    subscriptionId: null,
    customerId: s(o.customer),
    paymentId: null,
    paymentIntentId: null,
    billingReason: null,
    providerPriceId: null,
    metadataTenantId: tenant,
    currency: normalizeCurrency(s(o.currency)),
    amountMinor: null,
    netExVatMinor: null,
    periodStartEpoch: null,
    periodEndEpoch: null,
    refundedMinor: null,
  };

  switch (type) {
    case "checkout.session.completed":
      return { ok: true, event: { ...base, kind: "checkout_completed", subscriptionId: s(o.subscription), paymentIntentId: s(o.payment_intent) } };

    case "invoice.paid":
    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const line = obj((Array.isArray(obj(o.lines).data) ? (obj(o.lines).data as unknown[]) : [])[0]);
      const period = obj(line.period);
      const priceId =
        s(obj(line.price).id) ?? s(obj(obj(line.pricing).price_details).price) ?? null;
      const reason = s(o.billing_reason);
      return {
        ok: true,
        event: {
          ...base,
          kind: type === "invoice.payment_failed" ? "payment_failed" : "payment_captured",
          subscriptionId: s(o.subscription),
          paymentId: s(o.id),
          paymentIntentId: s(o.payment_intent),
          billingReason: reason === "subscription_create" || reason === "subscription_cycle" ? reason : null,
          providerPriceId: priceId,
          amountMinor: type === "invoice.payment_failed" ? n(o.amount_due) : n(o.amount_paid),
          netExVatMinor: n(o.total_excluding_tax) ?? n(o.subtotal_excluding_tax),
          periodStartEpoch: n(period.start),
          periodEndEpoch: n(period.end),
        },
      };
    }

    case "payment_intent.succeeded":
      // One-time purchases (payment mode). Subscription invoices are handled via invoice.* above.
      return {
        ok: true,
        event: {
          ...base,
          kind: "payment_captured",
          paymentId: s(o.id),
          paymentIntentId: s(o.id),
          billingReason: "one_time",
          providerPriceId: s(meta.aipify_provider_price_id),
          amountMinor: n(o.amount_received),
          netExVatMinor: n(meta.aipify_net_ex_vat_minor),
        },
      };

    case "customer.subscription.deleted":
      return { ok: true, event: { ...base, kind: "subscription_canceled", subscriptionId: s(o.id) } };

    case "customer.subscription.updated":
      if (o.cancel_at_period_end === true) {
        return { ok: true, event: { ...base, kind: "cancel_scheduled", subscriptionId: s(o.id), periodEndEpoch: n(o.current_period_end) } };
      }
      return { ok: false, reason: "event_type_not_mapped" };

    case "charge.refunded":
      return {
        ok: true,
        event: {
          ...base,
          kind: "refund",
          paymentId: s(o.invoice) ?? s(o.payment_intent),
          paymentIntentId: s(o.payment_intent),
          amountMinor: n(o.amount),
          refundedMinor: n(o.amount_refunded),
        },
      };

    case "charge.dispute.created":
    case "charge.dispute.funds_withdrawn":
      return {
        ok: true,
        event: { ...base, kind: "chargeback", paymentIntentId: s(o.payment_intent), amountMinor: n(o.amount) },
      };

    case "charge.dispute.closed":
      return o.status === "won"
        ? { ok: true, event: { ...base, kind: "chargeback_won", paymentIntentId: s(o.payment_intent), amountMinor: n(o.amount) } }
        : { ok: false, reason: "event_type_not_mapped" };

    default:
      return { ok: false, reason: "event_type_not_mapped" };
  }
}

// ---------------------------------------------------------------------------
// State + reducer.
// ---------------------------------------------------------------------------

export type PaymentStatus = "captured" | "refunded" | "partially_refunded" | "disputed";

export type PaymentRecord = {
  paymentId: string;
  alternateIds: string[];
  intentId: string;
  tenantId: string;
  productKey: string;
  variantKey: string;
  interval: "month" | "year" | "one_time";
  amountMinor: number;
  currency: string;
  netExVatMinor: number | null;
  vatMinor: number | null;
  periodOrdinal: number;
  periodStartEpoch: number | null;
  periodEndEpoch: number | null;
  status: PaymentStatus;
  refundedMinor: number;
  eventIds: string[];
};

export type SubscriptionStatus = "pending_payment" | "active" | "past_due" | "cancel_scheduled" | "canceled";

export type SubscriptionState = {
  intentId: string;
  subscriptionId: string | null;
  paidPeriods: number;
  lastPeriodStartEpoch: number | null;
  status: SubscriptionStatus;
};

export type BillingState = {
  processedEventIds: string[];
  quarantine: Array<{ eventId: string; reason: string }>;
  held: Array<{ event: NormalizedBillingEvent; reason: string }>;
  intents: Record<string, CheckoutIntent>;
  subscriptionToIntent: Record<string, string>;
  payments: Record<string, PaymentRecord>;
  subscriptions: Record<string, SubscriptionState>;
  entitlements: Record<string, EntitlementRecord>;
  commission: CommissionLedger;
};

export function createEmptyBillingState(): BillingState {
  return {
    processedEventIds: [],
    quarantine: [],
    held: [],
    intents: {},
    subscriptionToIntent: {},
    payments: {},
    subscriptions: {},
    entitlements: {},
    commission: createEmptyCommissionLedger(),
  };
}

/** Server registers an intent (never the webhook). Creates a pending entitlement: NOT operational. */
export function registerCheckoutIntentInState(state: BillingState, intent: CheckoutIntent): BillingState {
  if (state.intents[intent.intentId]) return state;
  const ek = entitlementKey(intent.tenantId, intent.productKey);
  const existingEnt = state.entitlements[ek];
  return {
    ...state,
    intents: { ...state.intents, [intent.intentId]: intent },
    subscriptions: {
      ...state.subscriptions,
      [intent.intentId]: {
        intentId: intent.intentId,
        subscriptionId: null,
        paidPeriods: 0,
        lastPeriodStartEpoch: null,
        status: "pending_payment",
      },
    },
    entitlements: existingEnt
      ? state.entitlements
      : {
          ...state.entitlements,
          [ek]: {
            entitlementId: ek,
            tenantId: intent.tenantId,
            productKey: intent.productKey,
            variantKey: intent.variantKey,
            interval: intent.interval,
            state: "pending_payment",
            source: "paid",
            validFrom: null,
            validUntil: null,
            graceUntil: null,
          },
        },
  };
}

export type BillingEffectType =
  | "payment_succeeded"
  | "payment_failed"
  | "entitlement_activated"
  | "entitlement_state_changed"
  | "refund_processed"
  | "chargeback_opened"
  | "chargeback_won"
  | "subscription_cancel_scheduled"
  | "subscription_canceled"
  | "payment_after_cancel_review"
  | "commission_registered"
  | "commission_earned"
  | "commission_reversed"
  | "commission_reinstated"
  | "commission_review_flagged";

export type BillingEffect = {
  type: BillingEffectType;
  tenantId: string;
  intentId: string;
  paymentId: string | null;
  detail: string | null;
};

export type BillingOutcome =
  | { kind: "applied" }
  | { kind: "noop"; reason: string }
  | { kind: "duplicate_ignored"; reason: "event_replayed" | "payment_already_recorded" | "refund_already_recorded" }
  | { kind: "held_out_of_order"; reason: string }
  | { kind: "quarantined"; reason: string };

export type BillingContext = {
  now: Date;
  /** Core commission rule lookup for the intent's (variant, interval). null = not configured. */
  resolveCommissionRule: (intent: CheckoutIntent) => VariantIntervalCommissionRule | null | undefined;
  graceDays?: number;
};

export type BillingStepResult = {
  state: BillingState;
  outcome: BillingOutcome;
  effects: BillingEffect[];
};

const iso = (epoch: number | null): string | null => (epoch == null ? null : new Date(epoch * 1000).toISOString());

function markProcessed(state: BillingState, eventId: string): BillingState {
  return state.processedEventIds.includes(eventId)
    ? state
    : { ...state, processedEventIds: [...state.processedEventIds, eventId] };
}

function quarantine(state: BillingState, ev: NormalizedBillingEvent, reason: string): BillingStepResult {
  return {
    state: { ...state, quarantine: [...state.quarantine, { eventId: ev.eventId, reason }] },
    outcome: { kind: "quarantined", reason },
    effects: [],
  };
}

function hold(state: BillingState, ev: NormalizedBillingEvent, reason: string): BillingStepResult {
  if (state.held.some((h) => h.event.eventId === ev.eventId)) {
    return { state, outcome: { kind: "held_out_of_order", reason }, effects: [] };
  }
  return {
    state: { ...state, held: [...state.held, { event: ev, reason }] },
    outcome: { kind: "held_out_of_order", reason },
    effects: [],
  };
}

export function findPaymentRecord(state: BillingState, ids: Array<string | null>): PaymentRecord | null {
  for (const id of ids) {
    if (!id) continue;
    if (state.payments[id]) return state.payments[id];
    const alt = Object.values(state.payments).find((p) => p.alternateIds.includes(id));
    if (alt) return alt;
  }
  return null;
}

function resolveIntent(
  state: BillingState,
  ev: NormalizedBillingEvent,
): { intent: CheckoutIntent; state: BillingState } | { error: string } {
  const bound = ev.subscriptionId ? state.subscriptionToIntent[ev.subscriptionId] ?? null : null;
  if (bound && ev.intentId && bound !== ev.intentId) return { error: "subscription_binding_conflict" };
  const intentId = ev.intentId ?? bound;
  const intent = intentId ? state.intents[intentId] : undefined;
  if (!intent) return { error: "unknown_mapping" };
  if (ev.metadataTenantId && ev.metadataTenantId !== intent.tenantId) return { error: "tenant_mismatch" };
  let next = state;
  if (ev.subscriptionId && !bound) {
    next = {
      ...state,
      subscriptionToIntent: { ...state.subscriptionToIntent, [ev.subscriptionId]: intent.intentId },
      subscriptions: {
        ...state.subscriptions,
        [intent.intentId]: { ...state.subscriptions[intent.intentId], subscriptionId: ev.subscriptionId },
      },
    };
  }
  return { intent, state: next };
}

function setEntitlement(
  state: BillingState,
  intent: CheckoutIntent,
  patch: Partial<EntitlementRecord> & { state: EntitlementState },
): BillingState {
  const ek = entitlementKey(intent.tenantId, intent.productKey);
  const current = state.entitlements[ek];
  const base: EntitlementRecord = current ?? {
    entitlementId: ek,
    tenantId: intent.tenantId,
    productKey: intent.productKey,
    variantKey: intent.variantKey,
    interval: intent.interval,
    state: "pending_payment",
    source: "paid",
    validFrom: null,
    validUntil: null,
    graceUntil: null,
  };
  return { ...state, entitlements: { ...state.entitlements, [ek]: { ...base, ...patch } } };
}

function commissionEffects(outcome: CommissionOutcome, intent: CheckoutIntent, paymentId: string | null): BillingEffect[] {
  const mk = (type: BillingEffectType, detail: string | null): BillingEffect => ({
    type,
    tenantId: intent.tenantId,
    intentId: intent.intentId,
    paymentId,
    detail,
  });
  switch (outcome.kind) {
    case "registered":
      return [mk("commission_registered", null)];
    case "registered_earn_blocked":
      return [mk("commission_registered", outcome.reason)];
    case "earned":
      return [mk("commission_registered", null), mk("commission_earned", String(outcome.amountMinor))];
    case "reversed":
      return [mk("commission_reversed", String(outcome.amountMinor))];
    case "reinstated":
      return [mk("commission_reinstated", String(outcome.amountMinor))];
    case "review_flagged":
      return [mk("commission_review_flagged", outcome.reason)];
    default:
      return [];
  }
}

function isLatestPayment(state: BillingState, p: PaymentRecord): boolean {
  const sub = state.subscriptions[p.intentId];
  return !sub || p.periodOrdinal === sub.paidPeriods;
}

export function applyBillingEvent(state: BillingState, ev: NormalizedBillingEvent, ctx: BillingContext): BillingStepResult {
  if (state.processedEventIds.includes(ev.eventId) || state.quarantine.some((q) => q.eventId === ev.eventId)) {
    return { state, outcome: { kind: "duplicate_ignored", reason: "event_replayed" }, effects: [] };
  }
  const result = applyOne(state, ev, ctx);
  if (result.outcome.kind === "applied") {
    return drainHeld(result, ctx);
  }
  return result;
}

function drainHeld(step: BillingStepResult, ctx: BillingContext): BillingStepResult {
  let { state } = step;
  const effects = [...step.effects];
  for (let guard = 0; guard < 50 && state.held.length > 0; guard += 1) {
    let progressed = false;
    for (const h of [...state.held]) {
      const without: BillingState = { ...state, held: state.held.filter((x) => x.event.eventId !== h.event.eventId) };
      const r = applyOne(without, h.event, ctx);
      if (r.outcome.kind === "held_out_of_order") continue; // still blocked; keep original
      state = r.state;
      effects.push(...r.effects);
      progressed = true;
      break;
    }
    if (!progressed) break;
  }
  return { state, outcome: step.outcome, effects };
}

function applyOne(state: BillingState, ev: NormalizedBillingEvent, ctx: BillingContext): BillingStepResult {
  switch (ev.kind) {
    case "checkout_completed":
      return onCheckoutCompleted(state, ev);
    case "payment_captured":
      return onPaymentCaptured(state, ev, ctx);
    case "payment_failed":
      return onPaymentFailed(state, ev, ctx);
    case "subscription_canceled":
    case "cancel_scheduled":
      return onSubscriptionEnding(state, ev);
    case "refund":
      return onRefund(state, ev);
    case "chargeback":
      return onChargeback(state, ev);
    case "chargeback_won":
      return onChargebackWon(state, ev);
    default:
      return quarantine(state, ev, "event_kind_unknown");
  }
}

function onCheckoutCompleted(state: BillingState, ev: NormalizedBillingEvent): BillingStepResult {
  const r = resolveIntent(state, ev);
  if ("error" in r) return quarantine(state, ev, r.error);
  // Linking only. NOT payment proof: entitlement is untouched.
  return { state: markProcessed(r.state, ev.eventId), outcome: { kind: "noop", reason: "checkout_completed_is_not_payment_proof" }, effects: [] };
}

function onPaymentCaptured(state: BillingState, ev: NormalizedBillingEvent, ctx: BillingContext): BillingStepResult {
  // Same invoice delivered under two event types (paid + payment_succeeded) counts once.
  const dup = findPaymentRecord(state, [ev.paymentId]);
  if (dup) {
    return {
      state: markProcessed(
        { ...state, payments: { ...state.payments, [dup.paymentId]: { ...dup, eventIds: [...dup.eventIds, ev.eventId] } } },
        ev.eventId,
      ),
      outcome: { kind: "duplicate_ignored", reason: "payment_already_recorded" },
      effects: [],
    };
  }
  if (!ev.paymentId) return quarantine(state, ev, "payment_id_missing");

  const r = resolveIntent(state, ev);
  if ("error" in r) return quarantine(state, ev, r.error);
  const intent = r.intent;
  let st = r.state;

  if (ev.providerPriceId && ev.providerPriceId !== intent.providerPriceId) return quarantine(st, ev, "unknown_mapping");
  if (ev.currency == null || ev.currency !== intent.pricing.currency) return quarantine(st, ev, "currency_mismatch");
  if (ev.amountMinor == null) return quarantine(st, ev, "amount_missing");
  if (ev.amountMinor === 0) {
    // A zero invoice is not a paid capture: never activates, never earns.
    return { state: markProcessed(st, ev.eventId), outcome: { kind: "noop", reason: "zero_amount_not_a_paid_capture" }, effects: [] };
  }

  const reason = ev.billingReason;
  if (!reason) return quarantine(st, ev, "billing_reason_unknown");
  const expectedMinor = reason === "subscription_cycle" ? intent.expectedRecurringChargeMinor : intent.expectedFirstChargeMinor;
  if (expectedMinor == null) return quarantine(st, ev, "unknown_mapping");
  if (ev.amountMinor !== expectedMinor) return quarantine(st, ev, "amount_mismatch");
  if ((reason === "one_time") !== (intent.interval === "one_time")) return quarantine(st, ev, "unknown_mapping");

  const sub = st.subscriptions[intent.intentId];
  let ordinal: number;
  if (intent.interval === "one_time" || reason === "subscription_create") {
    if (sub.paidPeriods >= 1) return quarantine(st, ev, "double_billing_first_period");
    ordinal = 1;
  } else {
    if (sub.paidPeriods === 0) return hold(st, ev, "awaiting_first_payment");
    if (
      ev.periodStartEpoch == null ||
      (sub.lastPeriodStartEpoch != null && ev.periodStartEpoch <= sub.lastPeriodStartEpoch)
    ) {
      return quarantine(st, ev, "double_billing_same_period");
    }
    ordinal = sub.paidPeriods + 1;
  }

  const payment: PaymentRecord = {
    paymentId: ev.paymentId,
    alternateIds: ev.paymentIntentId && ev.paymentIntentId !== ev.paymentId ? [ev.paymentIntentId] : [],
    intentId: intent.intentId,
    tenantId: intent.tenantId,
    productKey: intent.productKey,
    variantKey: intent.variantKey,
    interval: intent.interval,
    amountMinor: ev.amountMinor,
    currency: ev.currency,
    netExVatMinor: ordinal === 1 ? intent.pricing.netAfterDiscountExVatMinor : ev.netExVatMinor,
    vatMinor: ordinal === 1 ? intent.pricing.vatMinor : null,
    periodOrdinal: ordinal,
    periodStartEpoch: ev.periodStartEpoch,
    periodEndEpoch: ev.periodEndEpoch,
    status: "captured",
    refundedMinor: 0,
    eventIds: [ev.eventId],
  };
  const nextSubStatus: SubscriptionStatus = sub.status === "canceled" ? "canceled" : sub.status === "cancel_scheduled" ? "cancel_scheduled" : "active";
  st = {
    ...st,
    payments: { ...st.payments, [payment.paymentId]: payment },
    subscriptions: {
      ...st.subscriptions,
      [intent.intentId]: {
        ...sub,
        paidPeriods: ordinal,
        lastPeriodStartEpoch: ev.periodStartEpoch ?? sub.lastPeriodStartEpoch,
        status: nextSubStatus,
      },
    },
  };

  const effects: BillingEffect[] = [
    { type: "payment_succeeded", tenantId: intent.tenantId, intentId: intent.intentId, paymentId: payment.paymentId, detail: null },
  ];

  // Entitlement follows the captured payment.
  const ek = entitlementKey(intent.tenantId, intent.productKey);
  const prior = st.entitlements[ek];
  const untilCandidate = intent.interval === "one_time" ? null : iso(ev.periodEndEpoch);
  if (intent.interval !== "one_time" && untilCandidate == null) {
    // A paid recurring capture with no period end cannot define validity: quarantine the activation.
    return quarantine(state, ev, "period_end_missing");
  }
  const priorUntil = prior?.validUntil ?? null;
  const validUntil =
    untilCandidate == null
      ? null
      : priorUntil && new Date(priorUntil).getTime() > new Date(untilCandidate).getTime()
        ? priorUntil
        : untilCandidate;
  const entState: EntitlementState =
    nextSubStatus === "canceled" ? "canceled" : nextSubStatus === "cancel_scheduled" ? "cancel_scheduled" : "active";
  st = setEntitlement(st, intent, {
    state: entState,
    source: "paid",
    interval: intent.interval,
    variantKey: intent.variantKey,
    validFrom: prior?.validFrom ?? iso(ev.periodStartEpoch) ?? ctx.now.toISOString(),
    validUntil,
    graceUntil: null,
  });
  effects.push({
    type: entState === "canceled" ? "payment_after_cancel_review" : "entitlement_activated",
    tenantId: intent.tenantId,
    intentId: intent.intentId,
    paymentId: payment.paymentId,
    detail: entState,
  });

  // Commission from the same payment ledger.
  if (intent.attribution) {
    const a = intent.attribution;
    const c = applyCommissionPaymentCaptured(st.commission, {
      eventId: ev.eventId,
      paymentId: payment.paymentId,
      programId: a.programId,
      programKind: a.programKind,
      ownerTenantId: a.ownerTenantId,
      partnerId: a.partnerId,
      partnerAuthUserId: a.partnerAuthUserId,
      customerTenantId: intent.tenantId,
      productKey: intent.productKey,
      variantKey: intent.variantKey,
      interval: intent.interval,
      currency: intent.pricing.currency,
      subscriptionId: st.subscriptions[intent.intentId].subscriptionId,
      periodOrdinal: ordinal,
      capturedMinor: payment.amountMinor,
      netExVatMinor: payment.netExVatMinor,
      rule: ctx.resolveCommissionRule(intent),
      at: ctx.now.toISOString(),
    });
    st = { ...st, commission: c.ledger };
    effects.push(...commissionEffects(c.outcome, intent, payment.paymentId));
  }

  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

function onPaymentFailed(state: BillingState, ev: NormalizedBillingEvent, ctx: BillingContext): BillingStepResult {
  const r = resolveIntent(state, ev);
  if ("error" in r) return quarantine(state, ev, r.error);
  const intent = r.intent;
  let st = r.state;
  const sub = st.subscriptions[intent.intentId];
  const effect: BillingEffect = {
    type: "payment_failed",
    tenantId: intent.tenantId,
    intentId: intent.intentId,
    paymentId: ev.paymentId,
    detail: null,
  };

  if (sub.paidPeriods === 0) {
    // Never paid: stays pending_payment, nothing to take away, nothing to earn.
    return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects: [effect] };
  }
  if (ev.periodStartEpoch != null && sub.lastPeriodStartEpoch != null && ev.periodStartEpoch <= sub.lastPeriodStartEpoch) {
    // Stale failure for a period that has since been paid (retry succeeded first).
    return { state: markProcessed(st, ev.eventId), outcome: { kind: "noop", reason: "stale_failure_ignored" }, effects: [] };
  }
  if (sub.status === "canceled") {
    return { state: markProcessed(st, ev.eventId), outcome: { kind: "noop", reason: "subscription_already_canceled" }, effects: [effect] };
  }
  const ent = st.entitlements[entitlementKey(intent.tenantId, intent.productKey)];
  st = {
    ...st,
    subscriptions: { ...st.subscriptions, [intent.intentId]: { ...sub, status: "past_due" } },
  };
  const effects: BillingEffect[] = [effect];
  if (ent?.validUntil) {
    st = setEntitlement(st, intent, {
      state: "grace_period",
      graceUntil: computeGraceUntil(ent.validUntil, ctx.graceDays ?? COMMERCIAL_PAYMENT_GRACE_DAYS),
    });
    effects.push({ type: "entitlement_state_changed", tenantId: intent.tenantId, intentId: intent.intentId, paymentId: ev.paymentId, detail: "grace_period" });
  }
  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

function onSubscriptionEnding(state: BillingState, ev: NormalizedBillingEvent): BillingStepResult {
  const r = resolveIntent(state, ev);
  if ("error" in r) return quarantine(state, ev, r.error);
  const intent = r.intent;
  let st = r.state;
  const sub = st.subscriptions[intent.intentId];
  const ek = entitlementKey(intent.tenantId, intent.productKey);
  const ent = st.entitlements[ek];
  const effects: BillingEffect[] = [];

  if (ev.kind === "cancel_scheduled") {
    if (sub.status === "canceled") return { state: markProcessed(st, ev.eventId), outcome: { kind: "noop", reason: "already_canceled" }, effects: [] };
    st = { ...st, subscriptions: { ...st.subscriptions, [intent.intentId]: { ...sub, status: "cancel_scheduled" } } };
    if (ent && ent.state === "active") st = setEntitlement(st, intent, { state: "cancel_scheduled" });
    effects.push({ type: "subscription_cancel_scheduled", tenantId: intent.tenantId, intentId: intent.intentId, paymentId: null, detail: null });
    return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
  }

  st = { ...st, subscriptions: { ...st.subscriptions, [intent.intentId]: { ...sub, status: "canceled" } } };
  st = setEntitlement(st, intent, { state: "canceled" });
  effects.push({ type: "subscription_canceled", tenantId: intent.tenantId, intentId: intent.intentId, paymentId: null, detail: null });
  const subId = st.subscriptions[intent.intentId].subscriptionId;
  if (subId) {
    const c = applyCommissionSubscriptionCancelled(st.commission, { eventId: ev.eventId, subscriptionId: subId, at: new Date(ev.occurredAtEpoch * 1000).toISOString() });
    st = { ...st, commission: c.ledger };
  }
  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

function onRefund(state: BillingState, ev: NormalizedBillingEvent): BillingStepResult {
  const p = findPaymentRecord(state, [ev.paymentId, ev.paymentIntentId]);
  if (!p) return hold(state, ev, "awaiting_payment");
  if (ev.refundedMinor == null || ev.refundedMinor <= 0) return quarantine(state, ev, "refund_amount_invalid");
  if (ev.refundedMinor <= p.refundedMinor) {
    return { state: markProcessed(state, ev.eventId), outcome: { kind: "duplicate_ignored", reason: "refund_already_recorded" }, effects: [] };
  }
  const full = ev.refundedMinor >= p.amountMinor;
  const intent = state.intents[p.intentId];
  let st: BillingState = {
    ...state,
    payments: {
      ...state.payments,
      [p.paymentId]: {
        ...p,
        refundedMinor: Math.min(ev.refundedMinor, p.amountMinor),
        status: full ? "refunded" : "partially_refunded",
        eventIds: [...p.eventIds, ev.eventId],
      },
    },
  };
  const effects: BillingEffect[] = [
    { type: "refund_processed", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: full ? "full" : "partial" },
  ];
  if (full && isLatestPayment(st, p)) {
    st = setEntitlement(st, intent, { state: "revoked" });
    effects.push({ type: "entitlement_state_changed", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: "revoked" });
  }
  const c = applyCommissionReversal(st.commission, { eventId: ev.eventId, paymentId: p.paymentId, kind: "refund", full, at: new Date(ev.occurredAtEpoch * 1000).toISOString() });
  st = { ...st, commission: c.ledger };
  effects.push(...commissionEffects(c.outcome, intent, p.paymentId));
  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

function onChargeback(state: BillingState, ev: NormalizedBillingEvent): BillingStepResult {
  const p = findPaymentRecord(state, [ev.paymentId, ev.paymentIntentId]);
  if (!p) return hold(state, ev, "awaiting_payment");
  if (p.status === "disputed") {
    return { state: markProcessed(state, ev.eventId), outcome: { kind: "duplicate_ignored", reason: "payment_already_recorded" }, effects: [] };
  }
  const intent = state.intents[p.intentId];
  let st: BillingState = {
    ...state,
    payments: { ...state.payments, [p.paymentId]: { ...p, status: "disputed", eventIds: [...p.eventIds, ev.eventId] } },
  };
  const effects: BillingEffect[] = [
    { type: "chargeback_opened", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: null },
  ];
  if (isLatestPayment(st, p)) {
    st = setEntitlement(st, intent, { state: "suspended" });
    effects.push({ type: "entitlement_state_changed", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: "suspended" });
  }
  const c = applyCommissionReversal(st.commission, { eventId: ev.eventId, paymentId: p.paymentId, kind: "chargeback", full: true, at: new Date(ev.occurredAtEpoch * 1000).toISOString() });
  st = { ...st, commission: c.ledger };
  effects.push(...commissionEffects(c.outcome, intent, p.paymentId));
  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

function onChargebackWon(state: BillingState, ev: NormalizedBillingEvent): BillingStepResult {
  const p = findPaymentRecord(state, [ev.paymentId, ev.paymentIntentId]);
  if (!p) return hold(state, ev, "awaiting_payment");
  if (p.status !== "disputed") {
    return { state: markProcessed(state, ev.eventId), outcome: { kind: "noop", reason: "payment_not_disputed" }, effects: [] };
  }
  const intent = state.intents[p.intentId];
  const sub = state.subscriptions[p.intentId];
  let st: BillingState = {
    ...state,
    payments: { ...state.payments, [p.paymentId]: { ...p, status: "captured", eventIds: [...p.eventIds, ev.eventId] } },
  };
  const effects: BillingEffect[] = [
    { type: "chargeback_won", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: null },
  ];
  const ent = st.entitlements[entitlementKey(intent.tenantId, intent.productKey)];
  if (ent?.state === "suspended" && isLatestPayment(st, p)) {
    st = setEntitlement(st, intent, { state: sub.status === "canceled" ? "canceled" : sub.status === "cancel_scheduled" ? "cancel_scheduled" : "active" });
    effects.push({ type: "entitlement_state_changed", tenantId: p.tenantId, intentId: p.intentId, paymentId: p.paymentId, detail: "restored" });
  }
  const c = applyCommissionReinstatement(st.commission, { eventId: ev.eventId, paymentId: p.paymentId, at: new Date(ev.occurredAtEpoch * 1000).toISOString() });
  st = { ...st, commission: c.ledger };
  effects.push(...commissionEffects(c.outcome, intent, p.paymentId));
  return { state: markProcessed(st, ev.eventId), outcome: { kind: "applied" }, effects };
}

/** Full pipeline for a raw verified payload: normalize → reduce. Unmapped types are no-ops. */
export function processVerifiedProviderEvent(
  state: BillingState,
  raw: RawProviderEvent,
  ctx: BillingContext,
): BillingStepResult & { normalized: NormalizeResult } {
  const normalized = normalizeProviderEvent(raw);
  if (!normalized.ok) {
    return {
      state,
      outcome: normalized.reason === "live_event_rejected" ? { kind: "quarantined", reason: normalized.reason } : { kind: "noop", reason: normalized.reason },
      effects: [],
      normalized,
    };
  }
  return { ...applyBillingEvent(state, normalized.event, ctx), normalized };
}
