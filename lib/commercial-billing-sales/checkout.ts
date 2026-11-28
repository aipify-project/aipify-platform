/**
 * D. Checkout intent (server-priced) — NO live checkout, NO real payments.
 *
 * - Every price comes from the immutable price-version mapping; client amounts are only compared.
 * - Requires: checkout gate open (production always closed), product published + checkout_ready,
 *   exact mapping (no fallback), dependencies operational, no duplicate active entitlement.
 * - Idempotent per (tenant, idempotencyKey) with a request fingerprint.
 * - Redirect / success URL is NEVER payment proof — see `interpretCheckoutReturn`.
 * - Live session creation stays disabled; the test adapter is offline.
 */

import { createHash } from "node:crypto";
import type { CommerceCheckoutGate } from "@/lib/app-commerce/checkout-policy";
import type { ProductCatalogPurchaseReadiness } from "@/lib/product-catalog/types";
import { COMMERCIAL_BILLING_SALES_MASTER } from "./contract";
import {
  assertAttributionBoundToTenant,
  resolveSalesAttribution,
  type AttributionRejectionReason,
  type SalesAttribution,
  type SalesLinkRecord,
  type SellerStanding,
} from "./attribution";
import {
  authorizeProductOperation,
  resolveEffectiveEntitlement,
  type EntitlementRecord,
} from "./entitlement";
import { validateServerPricing, type ApprovedDiscount, type PricingFailure, type ServerPricing } from "./pricing";
import { resolveMappedPrice, type BillingInterval, type PriceMappingIndex } from "./stripe-mapping";

export type CheckoutRequest = {
  callerTenantId: string | null | undefined;
  callerAuthUserId?: string | null;
  productKey: string;
  variantKey: string;
  interval: BillingInterval;
  currency: string;
  idempotencyKey: string | null | undefined;
  salesLinkCode?: string | null;
  discountCode?: string | null;
  /** Compared, never trusted. */
  clientClaimedGrossMinor?: number | null;
};

export type CheckoutProductState = {
  productKey: string;
  published: boolean;
  purchaseReadiness: ProductCatalogPurchaseReadiness;
};

export type CheckoutContext = {
  gate: CommerceCheckoutGate;
  product: CheckoutProductState | null;
  mapping: PriceMappingIndex;
  vatRateBp: number | null | undefined;
  approvedDiscounts?: readonly ApprovedDiscount[];
  entitlements: readonly EntitlementRecord[];
  /** productKey -> direct dependency product keys (server-resolved). */
  dependencies?: Readonly<Record<string, readonly string[]>>;
  /** Server-resolved link for `salesLinkCode` (null when unknown / not provided). */
  salesLink?: SalesLinkRecord | null;
  seller?: SellerStanding;
  /** Existing intents keyed by `${tenantId}::${idempotencyKey}`. */
  existingIntents?: Readonly<Record<string, CheckoutIntent>>;
  now: Date;
};

export type CheckoutIntent = {
  intentId: string;
  tenantId: string;
  idempotencyKey: string;
  requestFingerprint: string;
  productKey: string;
  variantKey: string;
  interval: BillingInterval;
  priceVersionId: string;
  providerPriceId: string;
  pricing: ServerPricing;
  /** Amount that must be captured by the first payment (gross, minor units). */
  expectedFirstChargeMinor: number;
  /** Amount expected on each renewal (list price net of recurring discount; discounts are first-period only by default). */
  expectedRecurringChargeMinor: number | null;
  attribution: SalesAttribution | null;
  attributionRejectedReason: AttributionRejectionReason | null;
  createdAt: string;
  status: "prepared";
  /** Marker: an intent is NEVER payment proof. */
  paymentConfirmed: false;
  liveSessionCreationEnabled: false;
};

export type CheckoutFailure =
  | "checkout_closed"
  | "tenant_required"
  | "idempotency_key_required"
  | "idempotency_key_conflict"
  | "product_not_found"
  | "product_not_published"
  | "product_not_checkout_ready"
  | "mapping_missing"
  | "mapping_ambiguous"
  | "provider_price_not_bound"
  | "currency_invalid"
  | "already_entitled"
  | "dependency_missing"
  | "dependency_not_operational"
  | "cross_tenant_forbidden"
  | PricingFailure;

export type CheckoutPrepareResult =
  | { ok: true; intent: CheckoutIntent; replayed: boolean }
  | { ok: false; reason: CheckoutFailure; detail?: string };

function fingerprint(req: CheckoutRequest): string {
  const canonical = [
    req.productKey,
    req.variantKey,
    req.interval,
    req.currency.toUpperCase(),
    req.salesLinkCode ?? "",
    req.discountCode ?? "",
  ].join("|");
  return createHash("sha256").update(canonical).digest("hex").slice(0, 24);
}

export function prepareCheckoutIntent(req: CheckoutRequest, ctx: CheckoutContext): CheckoutPrepareResult {
  const tenantId = typeof req.callerTenantId === "string" ? req.callerTenantId.trim() : "";
  if (!tenantId) return { ok: false, reason: "tenant_required" };
  const idem = typeof req.idempotencyKey === "string" ? req.idempotencyKey.trim() : "";
  if (!idem) return { ok: false, reason: "idempotency_key_required" };

  if (!ctx.gate.checkoutEnabled) return { ok: false, reason: "checkout_closed", detail: ctx.gate.reasons.join(",") };

  const fp = fingerprint(req);
  const replayKey = `${tenantId}::${idem}`;
  const prior = ctx.existingIntents?.[replayKey];
  if (prior) {
    if (prior.tenantId !== tenantId) return { ok: false, reason: "cross_tenant_forbidden" };
    if (prior.requestFingerprint !== fp) return { ok: false, reason: "idempotency_key_conflict" };
    return { ok: true, intent: prior, replayed: true };
  }

  if (!ctx.product || ctx.product.productKey !== req.productKey) return { ok: false, reason: "product_not_found" };
  if (!ctx.product.published) return { ok: false, reason: "product_not_published" };
  if (ctx.product.purchaseReadiness !== "checkout_ready") return { ok: false, reason: "product_not_checkout_ready" };

  const mapped = resolveMappedPrice(ctx.mapping, {
    productKey: req.productKey,
    variantKey: req.variantKey,
    interval: req.interval,
    currency: req.currency,
  });
  if (!mapped.ok) return { ok: false, reason: mapped.reason };
  const mapping = mapped.mapping;

  // Already entitled (operational) for this product => no second purchase.
  const own = ctx.entitlements.filter((e) => e.tenantId === tenantId && e.productKey === req.productKey);
  if (own.some((e) => resolveEffectiveEntitlement(e, ctx.now).mayOperate)) {
    return { ok: false, reason: "already_entitled" };
  }

  // Dependencies must be operational for the buyer tenant BEFORE payment.
  for (const dep of ctx.dependencies?.[req.productKey] ?? []) {
    const depAuth = authorizeProductOperation({
      callerTenantId: tenantId,
      operation: "operate",
      productKey: dep,
      entitlements: ctx.entitlements,
      now: ctx.now,
    });
    if (!depAuth.allowed) {
      return {
        ok: false,
        // A foreign tenant's record must look exactly like "missing" — no cross-tenant signal.
        reason:
          depAuth.reason === "entitlement_missing" || depAuth.reason === "cross_tenant_forbidden"
            ? "dependency_missing"
            : "dependency_not_operational",
        detail: dep,
      };
    }
  }

  const priced = validateServerPricing({
    mapping,
    requestedCurrency: req.currency,
    vatRateBp: ctx.vatRateBp,
    discountCode: req.discountCode,
    approvedDiscounts: ctx.approvedDiscounts,
    clientClaimedGrossMinor: req.clientClaimedGrossMinor,
    now: ctx.now,
  });
  if (!priced.ok) return { ok: false, reason: priced.reason };

  let attribution: SalesAttribution | null = null;
  let rejected: AttributionRejectionReason | null = null;
  if (req.salesLinkCode) {
    const res = resolveSalesAttribution({
      link: ctx.salesLink ?? null,
      seller: ctx.seller ?? {},
      buyerTenantId: tenantId,
      buyerAuthUserId: req.callerAuthUserId,
      productKey: req.productKey,
      now: ctx.now,
    });
    if (res.attributed && res.attribution.linkCode === req.salesLinkCode.trim()) {
      attribution = res.attribution;
    } else {
      rejected = res.attributed ? "no_link" : res.reason;
    }
  }
  if (!assertAttributionBoundToTenant(attribution, tenantId)) {
    return { ok: false, reason: "cross_tenant_forbidden" };
  }

  // Recurring: discount applies to the first period only unless a later task says otherwise.
  const recurring =
    req.interval === "one_time"
      ? null
      : validateServerPricing({
          mapping,
          requestedCurrency: req.currency,
          vatRateBp: ctx.vatRateBp,
          now: ctx.now,
        });

  const intentId = `ci_${createHash("sha256").update(`${tenantId}|${idem}`).digest("hex").slice(0, 20)}`;
  return {
    ok: true,
    replayed: false,
    intent: {
      intentId,
      tenantId,
      idempotencyKey: idem,
      requestFingerprint: fp,
      productKey: req.productKey,
      variantKey: req.variantKey,
      interval: req.interval,
      priceVersionId: mapping.priceVersionId,
      providerPriceId: mapping.providerPriceId as string,
      pricing: priced.pricing,
      expectedFirstChargeMinor: priced.pricing.grossMinor,
      expectedRecurringChargeMinor: recurring && recurring.ok ? recurring.pricing.grossMinor : null,
      attribution,
      attributionRejectedReason: rejected,
      createdAt: ctx.now.toISOString(),
      status: "prepared",
      paymentConfirmed: false,
      liveSessionCreationEnabled: COMMERCIAL_BILLING_SALES_MASTER.switches.liveCheckoutSessionCreationEnabled,
    },
  };
}

/** Redirect / success URL parameters are NEVER payment proof. Activation requires a verified webhook. */
export function interpretCheckoutReturn(_params: {
  sessionId?: string | null;
  status?: string | null;
}): { paymentConfirmed: false; activation: "webhook_required"; entitlementChange: "none" } {
  return { paymentConfirmed: false, activation: "webhook_required", entitlementChange: "none" };
}

export type CheckoutSessionResult =
  | { ok: true; sessionId: string; fixture: true }
  | { ok: false; reason: "live_checkout_disabled" | "intent_not_prepared" };

export type CheckoutSessionAdapter = {
  readonly isLive: boolean;
  createSession(intent: CheckoutIntent): Promise<CheckoutSessionResult>;
};

export const LIVE_CHECKOUT_ADAPTER_DISABLED: CheckoutSessionAdapter = {
  isLive: false,
  async createSession() {
    return { ok: false, reason: "live_checkout_disabled" };
  },
};

/** Offline fixture. Session ids are clearly fake and never reach any provider. */
export function createTestCheckoutAdapter(): CheckoutSessionAdapter & { sessions: ReadonlyMap<string, string> } {
  const sessions = new Map<string, string>();
  return {
    isLive: false,
    sessions,
    async createSession(intent) {
      if (intent.status !== "prepared") return { ok: false, reason: "intent_not_prepared" };
      const existing = sessions.get(intent.intentId);
      if (existing) return { ok: true, sessionId: existing, fixture: true };
      const id = `cs_fixture_${intent.intentId}`;
      sessions.set(intent.intentId, id);
      return { ok: true, sessionId: id, fixture: true };
    },
  };
}
