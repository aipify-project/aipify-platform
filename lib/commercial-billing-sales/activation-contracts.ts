/**
 * AIPIFY_COMMERCIAL_PAYMENT_REVENUE_ACTIVATION_MASTER_V2 — typed contracts for Agent 2 / 3 / 4.
 * Types + pure builders only. No UI panels, no delivery, no network, no statusbar changes.
 * Extends (never duplicates) checkout.ts / entitlement.ts / invoices.ts / webhook.ts.
 */

import type { CheckoutFailure, CheckoutPrepareResult } from "./checkout";
import {
  resolveEffectiveEntitlement,
  type EffectiveEntitlement,
  type EffectiveEntitlementState,
  type EntitlementInterval,
  type EntitlementRecord,
  type EntitlementSource,
} from "./entitlement";
import { evaluateActivation } from "./activation-gates";
import {
  isSellerSideNotification,
  type CommercialNotificationDto,
  type CustomerPaymentHistoryDto,
  type CustomerPaymentHistoryItemDto,
} from "./invoices";
import type { PaymentRecord } from "./webhook";

// ------------------------------------------------------------------ Agent 2

/**
 * Product detail → checkout intent. Client-safe projection: no provider price id, no attribution
 * partner ids, no commission. `purchaseCtaAllowed` is the literal `false` — the purchase button is
 * owned by Agent 2 and opens only after an owner YES flips the live gates (see activation-gates).
 */
export type Agent2CheckoutIntentDto = {
  tenantId: string | null;
  productKey: string;
  variantKey: string;
  interval: "month" | "year" | "one_time";
  purchaseCtaAllowed: false;
  checkoutLive: false;
  /** Present only when prepareCheckoutIntent succeeded (test/staging adapters). Never payment proof. */
  intent: {
    intentId: string;
    priceVersionId: string;
    currency: string;
    listAmountMinor: number;
    vatMinor: number;
    grossMinor: number;
    expectedFirstChargeMinor: number;
    expectedRecurringChargeMinor: number | null;
    attributed: boolean;
    replayed: boolean;
    status: "prepared";
    paymentConfirmed: false;
    liveSessionCreationEnabled: false;
  } | null;
  /** Why no intent exists (or "live_checkout_closed" when one exists but live is closed). */
  blocker: CheckoutFailure | "live_checkout_closed" | null;
};

export function buildAgent2CheckoutIntentDto(input: {
  callerTenantId: string | null | undefined;
  productKey: string;
  variantKey: string;
  interval: "month" | "year" | "one_time";
  result: CheckoutPrepareResult;
}): Agent2CheckoutIntentDto {
  const tenantId = typeof input.callerTenantId === "string" && input.callerTenantId.trim() ? input.callerTenantId.trim() : null;
  const base = {
    tenantId,
    productKey: input.productKey,
    variantKey: input.variantKey,
    interval: input.interval,
    purchaseCtaAllowed: false as const,
    checkoutLive: false as const,
  };
  if (!tenantId) return { ...base, intent: null, blocker: "tenant_required" };
  if (!input.result.ok) return { ...base, intent: null, blocker: input.result.reason };
  const i = input.result.intent;
  // Defense in depth: an intent for another tenant is never projected.
  if (i.tenantId !== tenantId) return { ...base, intent: null, blocker: "cross_tenant_forbidden" };
  return {
    ...base,
    intent: {
      intentId: i.intentId,
      priceVersionId: i.priceVersionId,
      currency: i.pricing.currency,
      listAmountMinor: i.pricing.listAmountMinor,
      vatMinor: i.pricing.vatMinor,
      grossMinor: i.pricing.grossMinor,
      expectedFirstChargeMinor: i.expectedFirstChargeMinor,
      expectedRecurringChargeMinor: i.expectedRecurringChargeMinor,
      attributed: i.attribution != null,
      replayed: input.result.replayed,
      status: "prepared",
      paymentConfirmed: false,
      liveSessionCreationEnabled: false,
    },
    blocker: "live_checkout_closed",
  };
}

export type Agent2EntitlementAccessKind = "paid" | "free_access" | "internal_system" | "none";

export type Agent2EntitlementStateDto = {
  tenantId: string;
  productKey: string;
  accessKind: Agent2EntitlementAccessKind;
  interval: EntitlementInterval | null;
  state: EffectiveEntitlementState;
  mayOperate: boolean;
  mayExpand: boolean;
  reason: string | null;
  /** Absence of an entitlement record is NOT free access; free access is an explicit record. */
  isFreeAccess: boolean;
  /** Billing + recovery stay reachable in every state. */
  billingReachable: true;
  /** Catalog browsing never needs an entitlement. */
  browseOpen: true;
  purchaseCtaAllowed: false;
};

export function buildAgent2EntitlementStateDto(input: {
  callerTenantId: string;
  productKey: string;
  record: EntitlementRecord | null | undefined;
  now: Date;
}): Agent2EntitlementStateDto {
  // A record belonging to another tenant or product is treated as absent.
  const rec =
    input.record && input.record.tenantId === input.callerTenantId && input.record.productKey === input.productKey
      ? input.record
      : null;
  const eff: EffectiveEntitlement = resolveEffectiveEntitlement(rec, input.now);
  const source: EntitlementSource | null = rec ? rec.source : null;
  return {
    tenantId: input.callerTenantId,
    productKey: input.productKey,
    accessKind: source ?? "none",
    interval: rec ? rec.interval : null,
    state: eff.state,
    mayOperate: eff.mayOperate,
    mayExpand: eff.mayExpand,
    reason: eff.reason,
    isFreeAccess: source === "free_access" && eff.mayOperate,
    billingReachable: true,
    browseOpen: true,
    purchaseCtaAllowed: false,
  };
}

export type Agent2ReceiptReadDto =
  | {
      available: true;
      tenantId: string;
      receipt: CustomerPaymentHistoryItemDto;
      /** Provider-hosted link only; null means "no document", never a fabricated one. */
      documentUrl: string | null;
      doubleBillingSuspected: boolean;
      fabricatesDocuments: false;
      sendsEmail: false;
    }
  | {
      available: false;
      tenantId: string;
      reason: "no_authoritative_payment_source" | "payment_not_found";
      fabricatesDocuments: false;
      sendsEmail: false;
    };

/** Receipt read from the tenant-scoped payment history DTO (ledger from verified webhooks only). */
export function buildAgent2ReceiptReadDto(input: {
  history: CustomerPaymentHistoryDto;
  paymentId: string;
}): Agent2ReceiptReadDto {
  const closed = (reason: "no_authoritative_payment_source" | "payment_not_found"): Agent2ReceiptReadDto => ({
    available: false,
    tenantId: input.history.tenantId,
    reason,
    fabricatesDocuments: false,
    sendsEmail: false,
  });
  if (!input.history.available) return closed("no_authoritative_payment_source");
  const item = input.history.items.find((i) => i.paymentId === input.paymentId);
  if (!item) return closed("payment_not_found");
  return {
    available: true,
    tenantId: input.history.tenantId,
    receipt: item,
    documentUrl: item.documentUrl,
    doubleBillingSuspected: input.history.doubleBillingSuspected,
    fabricatesDocuments: false,
    sendsEmail: false,
  };
}

/** Everything Agent 2 may render for a Kompis product detail page. One object, all fail-closed. */
export type Agent2ProductDetailActivationContract = {
  checkout: Agent2CheckoutIntentDto;
  entitlement: Agent2EntitlementStateDto;
  receipt: Agent2ReceiptReadDto | null;
  /** Always false in this module — see activation-gates for the owner-approved enablement path. */
  purchaseCtaAllowed: false;
  /** Gate verdict for enabling the purchase CTA; closed until owner YES + live gates. */
  purchaseCtaGate: ReturnType<typeof evaluateActivation>;
};

export function buildAgent2ProductDetailActivationContract(input: {
  checkout: Agent2CheckoutIntentDto;
  entitlement: Agent2EntitlementStateDto;
  receipt?: Agent2ReceiptReadDto | null;
}): Agent2ProductDetailActivationContract {
  return {
    checkout: input.checkout,
    entitlement: input.entitlement,
    receipt: input.receipt ?? null,
    purchaseCtaAllowed: false,
    purchaseCtaGate: evaluateActivation("enable_purchase_cta"),
  };
}

// ------------------------------------------------------------------ Agent 3

export type Agent3NotificationAudience = "customer_tenant" | "seller_side";

/** Support/analytics notification envelope. Delivery, channels and preferences stay with Agent 3. */
export type Agent3SupportNotificationEnvelope = {
  notification: CommercialNotificationDto;
  audience: Agent3NotificationAudience;
  /** Seller-side events (commission) must never reach the customer tenant. */
  routeToCustomerTenant: boolean;
  supportVisible: boolean;
  dedupeKey: string;
  deliveryImplemented: false;
  containsSensitiveData: false;
};

export function buildAgent3SupportNotificationEnvelope(n: CommercialNotificationDto): Agent3SupportNotificationEnvelope {
  const seller = isSellerSideNotification(n);
  return {
    notification: n,
    audience: seller ? "seller_side" : "customer_tenant",
    routeToCustomerTenant: !seller,
    supportVisible: !seller,
    dedupeKey: n.dedupeKey,
    deliveryImplemented: false,
    containsSensitiveData: false,
  };
}

export const COMMERCIAL_PURCHASE_ANALYTICS_EVENT = "commercial.purchase_verified" as const;

export type AnalyticsConsent = {
  /** Explicit, recorded analytics consent for this tenant/user context. Absent => no event. */
  analyticsConsentGranted: boolean | null | undefined;
};

export type VerifiedPurchaseAnalyticsEvent = {
  event: typeof COMMERCIAL_PURCHASE_ANALYTICS_EVENT;
  tenantId: string;
  productKey: string;
  variantKey: string;
  interval: "month" | "year" | "one_time";
  amountMinor: number;
  currency: string;
  /** Stable dedupe key: event|tenant|intent|payment. */
  dedupeKey: string;
  consentGranted: true;
  /** Emitted only from a captured payment in the verified-webhook ledger. */
  source: "verified_payment_ledger";
  containsPii: false;
  containsSensitiveData: false;
  deliveryImplemented: false;
};

export type VerifiedPurchaseAnalyticsResult =
  | { ok: true; event: VerifiedPurchaseAnalyticsEvent }
  | {
      ok: false;
      reason:
        | "consent_missing"
        | "payment_not_verified_captured"
        | "not_first_purchase_period"
        | "tenant_mismatch"
        | "already_emitted";
    };

/**
 * Purchase analytics only from a verified, captured, first-period ledger payment, only with consent,
 * and only once (caller supplies already-emitted dedupe keys). Redirect/success pages, checkout
 * sessions and intents can NOT produce this event — the input type is a ledger PaymentRecord.
 */
export function buildVerifiedPurchaseAnalyticsEvent(input: {
  payment: PaymentRecord;
  callerTenantId: string;
  consent: AnalyticsConsent;
  emittedDedupeKeys?: ReadonlySet<string> | readonly string[];
}): VerifiedPurchaseAnalyticsResult {
  if (input.consent?.analyticsConsentGranted !== true) return { ok: false, reason: "consent_missing" };
  const p = input.payment;
  if (!p || p.tenantId !== input.callerTenantId || !input.callerTenantId) return { ok: false, reason: "tenant_mismatch" };
  // refunded / disputed payments are no longer a clean verified purchase signal
  if (p.status !== "captured" || !(p.amountMinor > 0) || p.refundedMinor > 0) {
    return { ok: false, reason: "payment_not_verified_captured" };
  }
  if (p.periodOrdinal !== 1) return { ok: false, reason: "not_first_purchase_period" };
  const dedupeKey = [COMMERCIAL_PURCHASE_ANALYTICS_EVENT, p.tenantId, p.intentId, p.paymentId].join("|");
  const seen = input.emittedDedupeKeys;
  const already = seen ? (seen instanceof Set ? seen.has(dedupeKey) : (seen as readonly string[]).includes(dedupeKey)) : false;
  if (already) return { ok: false, reason: "already_emitted" };
  return {
    ok: true,
    event: {
      event: COMMERCIAL_PURCHASE_ANALYTICS_EVENT,
      tenantId: p.tenantId,
      productKey: p.productKey,
      variantKey: p.variantKey,
      interval: p.interval,
      amountMinor: p.amountMinor,
      currency: p.currency,
      dedupeKey,
      consentGranted: true,
      source: "verified_payment_ledger",
      containsPii: false,
      containsSensitiveData: false,
      deliveryImplemented: false,
    },
  };
}

// ------------------------------------------------------------------ Agent 4

/**
 * Presence: NO global statusbar change, NO panel. Event names only, reserved for Agent 4 to
 * consume if/when it chooses. Nothing in this module emits them.
 */
export const AGENT4_PRESENCE_CONTRACT = {
  globalStatusbarChanges: false as const,
  uiPanels: false as const,
  emitsEvents: false as const,
  eventNames: [
    "commercial.presence.entitlement_state_changed",
    "commercial.presence.payment_grace_started",
  ] as const,
} as const;

export type Agent4PresenceEventName = (typeof AGENT4_PRESENCE_CONTRACT.eventNames)[number];

// ------------------------------------------------------------------ Kompis-first path

/** Ordered, owner-gated path to the first paying Kompis customer. Reuses the existing product catalog. */
export const KOMPIS_FIRST_REVENUE_PATH = [
  { step: 1, id: "catalog_product", note: "Existing Kompis product + variant + price per interval from Product Center (#525/#530). No new catalog.", gate: null },
  { step: 2, id: "foundation_sql_production", note: "Foundation tables/RPCs on Production.", gate: "production_sql_apply_license_foundation" },
  { step: 3, id: "snapshot_rpc_staging_then_production", note: "Snapshot read RPC on Staging first; Production needs its own YES.", gate: "staging_apply_snapshot_read_rpc_only" },
  { step: 4, id: "execute_role_matrix", note: "Server-side-only EXECUTE; never to anon/authenticated.", gate: "execute_grant_role_matrix" },
  { step: 5, id: "license_levels_and_vat", note: "License level/seat catalog, VAT source and commission amounts decided by owner.", gate: "license_levels_and_seat_caps_catalog" },
  { step: 6, id: "stripe_live_and_checkout", note: "Stripe live + live Checkout Session creation (server-priced).", gate: "stripe_live_activation_and_secrets" },
  { step: 7, id: "verified_payment_activation", note: "Only a verified captured webhook payment activates the entitlement.", gate: null },
  { step: 8, id: "receipt_and_notifications", note: "Receipt read + Agent 3 notifications + consented purchase analytics.", gate: null },
  { step: 9, id: "manual_commission_settlement", note: "Fixed commission, manual settlement only.", gate: null },
] as const;
