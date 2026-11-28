/**
 * Offline test fixtures — mocks only. Nothing here talks to Stripe, Supabase, or the network, and no
 * value here is a real secret, customer, or price. Not exported from index.ts.
 */

import { resolveAppCommerceCheckoutGate } from "@/lib/app-commerce/checkout-policy";
import type { VariantIntervalCommissionRule } from "@/lib/product-catalog/variant-commission";
import type { ProductVariantDefinition, ProductVariantPrice } from "@/lib/product-catalog/variants";
import type { SalesLinkRecord, SellerStanding } from "./attribution";
import {
  prepareCheckoutIntent,
  type CheckoutContext,
  type CheckoutIntent,
  type CheckoutRequest,
} from "./checkout";
import type { EntitlementRecord } from "./entitlement";
import {
  buildPriceMappingIndex,
  computePriceVersionId,
  type BillingInterval,
  type PriceVersionMapping,
} from "./stripe-mapping";
import {
  applyBillingEvent,
  processVerifiedProviderEvent,
  registerCheckoutIntentInState,
  createEmptyBillingState,
  type BillingContext,
  type BillingState,
  type BillingStepResult,
  type RawProviderEvent,
} from "./webhook";

export const FAKE_WEBHOOK_SECRET = "whsec_FIXTURE_NOT_A_REAL_SECRET";
export const T_A = "tenant_a";
export const T_B = "tenant_b";
export const NOW = new Date("2026-11-28T12:00:00.000Z");
export const NOW_EPOCH = Math.floor(NOW.getTime() / 1000);
export const DAY = 86400;
/** Period 1 started 10 days before NOW. */
export const P1_START = NOW_EPOCH - 10 * DAY;
export const P1_END = P1_START + 30 * DAY;
export const P2_START = P1_END;
export const P2_END = P2_START + 30 * DAY;
export const P3_START = P2_END;
export const P3_END = P3_START + 30 * DAY;

export const OPEN_GATE = resolveAppCommerceCheckoutGate({ NODE_ENV: "test", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1" });
export const PROD_GATE = resolveAppCommerceCheckoutGate({ VERCEL_ENV: "production", AIPIFY_APP_COMMERCE_TEST_CHECKOUT: "1" });

export function fixedRule(amountMajor: number | null, over: Partial<VariantIntervalCommissionRule> = {}): VariantIntervalCommissionRule {
  return {
    active: true,
    model: "fixed",
    amountMajor,
    ratePct: null,
    currency: "NOK",
    percentBasis: "net_ex_vat_after_discount",
    ...over,
  };
}

export function price(
  interval: BillingInterval,
  amountMajor: number | null,
  over: Partial<ProductVariantPrice> = {},
): ProductVariantPrice {
  return {
    currency: "NOK",
    amountMajor,
    amountMinor: amountMajor == null ? null : Math.round(amountMajor * 100),
    interval,
    vatLabel: "exclusive",
    providerPriceId: null,
    purchasable: false,
    commission: null,
    ...over,
  };
}

export function variant(over: Partial<ProductVariantDefinition> = {}): ProductVariantDefinition {
  return {
    variantKey: "standard",
    productKey: "kompis_web",
    adminName: "Standard",
    customerLabel: "Standard",
    sortOrder: 1,
    active: true,
    recommended: false,
    quotaValue: null,
    quotaUnit: null,
    quotaKind: "none",
    annualRenewsQuotaMonthly: false,
    monthlyPrice: price("month", 599),
    yearlyPrice: price("year", 5990),
    oneTimePrice: null,
    features: [],
    ...over,
  };
}

export function mapping(
  interval: BillingInterval,
  amountMinor: number,
  over: Partial<PriceVersionMapping> = {},
): PriceVersionMapping {
  const base = {
    productKey: "kompis_web",
    variantKey: "standard",
    interval,
    currency: "NOK",
    amountMinor,
    vatLabel: "exclusive" as const,
  };
  const priceVersionId = computePriceVersionId(base);
  return {
    ...base,
    priceVersionId,
    providerPriceId: `price_fixture_${priceVersionId}`,
    status: "active",
    supersedesPriceVersionId: null,
    ...over,
  };
}

export const MONTHLY = mapping("month", 59900);
export const YEARLY = mapping("year", 599000);
export const ONE_TIME = mapping("one_time", 100000);
export const MONTHLY_GROSS = 74875; // 59900 + 25% VAT
export const YEARLY_GROSS = 748750;
export const ONE_TIME_GROSS = 125000;

export function checkoutContext(over: Partial<CheckoutContext> = {}): CheckoutContext {
  return {
    gate: OPEN_GATE,
    product: { productKey: "kompis_web", published: true, purchaseReadiness: "checkout_ready" },
    mapping: buildPriceMappingIndex([MONTHLY, YEARLY, ONE_TIME]),
    vatRateBp: 2500,
    entitlements: [],
    now: NOW,
    ...over,
  };
}

export function request(over: Partial<CheckoutRequest> = {}): CheckoutRequest {
  return {
    callerTenantId: T_A,
    callerAuthUserId: "auth_buyer",
    productKey: "kompis_web",
    variantKey: "standard",
    interval: "month",
    currency: "NOK",
    idempotencyKey: "idem-1",
    ...over,
  };
}

export const SALES_CODE = "csp-abcdef123456";

export function salesLink(over: Partial<SalesLinkRecord> = {}): SalesLinkRecord {
  return {
    code: SALES_CODE,
    partnerId: "partner_1",
    partnerAuthUserId: "auth_partner",
    programId: "aipify_certified_sales_partner",
    programKind: "aipify_certified_free",
    ownerTenantId: "aipify_group_internal",
    productKey: null,
    active: true,
    firstTouchAt: new Date(NOW.getTime() - DAY * 1000).toISOString(),
    ...over,
  };
}

export const APPROVED_SELLER: SellerStanding = { cspPartnerStatus: "approved" };

export function makeIntent(reqOver: Partial<CheckoutRequest> = {}, ctxOver: Partial<CheckoutContext> = {}): CheckoutIntent {
  const res = prepareCheckoutIntent(request(reqOver), checkoutContext(ctxOver));
  if (!res.ok) throw new Error(`fixture intent failed: ${res.reason}`);
  return res.intent;
}

export function attributedIntent(reqOver: Partial<CheckoutRequest> = {}): CheckoutIntent {
  return makeIntent(
    { salesLinkCode: SALES_CODE, ...reqOver },
    { salesLink: salesLink(), seller: APPROVED_SELLER },
  );
}

export function billingCtx(rule: VariantIntervalCommissionRule | null | undefined = fixedRule(123), now: Date = NOW): BillingContext {
  return { now, resolveCommissionRule: () => rule };
}

export function stateWith(intent: CheckoutIntent): BillingState {
  return registerCheckoutIntentInState(createEmptyBillingState(), intent);
}

export function invoiceEvent(o: {
  eventId: string;
  type?: string;
  intent: CheckoutIntent;
  invoiceId: string;
  reason: "subscription_create" | "subscription_cycle";
  start: number;
  end: number;
  amount?: number;
  currency?: string;
  tenant?: string;
  priceId?: string;
  intentIdOverride?: string;
  sub?: string;
}): RawProviderEvent {
  const amount = o.amount ?? (o.reason === "subscription_create" ? o.intent.expectedFirstChargeMinor : (o.intent.expectedRecurringChargeMinor as number));
  return {
    id: o.eventId,
    type: o.type ?? "invoice.paid",
    created: o.start,
    livemode: false,
    data: {
      object: {
        id: o.invoiceId,
        subscription: o.sub ?? "sub_fixture_1",
        customer: "cus_fixture_1",
        currency: o.currency ?? "nok",
        amount_paid: amount,
        amount_due: amount,
        billing_reason: o.reason,
        payment_intent: `pi_${o.invoiceId}`,
        total_excluding_tax: o.intent.pricing.netAfterDiscountExVatMinor,
        subscription_details: {
          metadata: {
            aipify_intent_id: o.intentIdOverride ?? o.intent.intentId,
            aipify_tenant_id: o.tenant ?? o.intent.tenantId,
          },
        },
        lines: { data: [{ price: { id: o.priceId ?? o.intent.providerPriceId }, period: { start: o.start, end: o.end } }] },
      },
    },
  };
}

export function refundEvent(o: { eventId: string; invoiceId: string; amount: number; refunded: number; at?: number }): RawProviderEvent {
  return {
    id: o.eventId,
    type: "charge.refunded",
    created: o.at ?? NOW_EPOCH,
    livemode: false,
    data: { object: { id: "ch_fixture", invoice: o.invoiceId, payment_intent: `pi_${o.invoiceId}`, amount: o.amount, amount_refunded: o.refunded, currency: "nok" } },
  };
}

export function disputeEvent(o: { eventId: string; invoiceId: string; amount: number; type?: string; status?: string }): RawProviderEvent {
  return {
    id: o.eventId,
    type: o.type ?? "charge.dispute.created",
    created: NOW_EPOCH,
    livemode: false,
    data: { object: { id: "dp_fixture", payment_intent: `pi_${o.invoiceId}`, amount: o.amount, status: o.status ?? "needs_response" } },
  };
}

export function subscriptionEvent(o: { eventId: string; type: "customer.subscription.deleted" | "customer.subscription.updated"; intent: CheckoutIntent; cancelAtPeriodEnd?: boolean }): RawProviderEvent {
  return {
    id: o.eventId,
    type: o.type,
    created: NOW_EPOCH,
    livemode: false,
    data: {
      object: {
        id: "sub_fixture_1",
        customer: "cus_fixture_1",
        cancel_at_period_end: o.cancelAtPeriodEnd ?? false,
        metadata: { aipify_intent_id: o.intent.intentId, aipify_tenant_id: o.intent.tenantId },
      },
    },
  };
}

export function oneTimeEvent(o: { eventId: string; intent: CheckoutIntent; paymentIntentId: string; amount?: number }): RawProviderEvent {
  return {
    id: o.eventId,
    type: "payment_intent.succeeded",
    created: NOW_EPOCH,
    livemode: false,
    data: {
      object: {
        id: o.paymentIntentId,
        amount_received: o.amount ?? o.intent.expectedFirstChargeMinor,
        currency: "nok",
        metadata: {
          aipify_intent_id: o.intent.intentId,
          aipify_tenant_id: o.intent.tenantId,
          aipify_provider_price_id: o.intent.providerPriceId,
        },
      },
    },
  };
}

export function run(
  state: BillingState,
  raws: RawProviderEvent[],
  ctx: BillingContext = billingCtx(),
): { state: BillingState; steps: BillingStepResult[] } {
  const steps: BillingStepResult[] = [];
  let st = state;
  for (const raw of raws) {
    const r = processVerifiedProviderEvent(st, raw, ctx);
    steps.push(r);
    st = r.state;
  }
  return { state: st, steps };
}

export function entitlementsOf(state: BillingState): EntitlementRecord[] {
  return Object.values(state.entitlements);
}

export { applyBillingEvent };
