import {
  isAppCommerceCheckoutEnabled,
  isStripeSecretTestMode,
  resolveAppCommerceCheckoutGate,
} from "./checkout-policy";
import { findPublishedOffer } from "./published-catalog";
import { createCommerceStripeCheckoutSession } from "./stripe-commerce-session";
import type { AppCommerceCatalog, CommerceCheckoutResult } from "./types";

export type CommerceCheckoutContext = {
  catalog: AppCommerceCatalog;
  offerId: string;
  customerId: string;
  organizationId: string;
  customerEmail?: string | null;
  successUrl: string;
  cancelUrl: string;
  /** Optional CSP attribution already verified server-side. */
  csp?: {
    productKey?: string;
    periodOrdinal?: number;
    billingInterval?: "monthly" | "annual";
  } | null;
  env?: Record<string, string | undefined>;
  hasActivePaidSubscription?: boolean;
};

export async function createAppCommerceCheckout(
  input: CommerceCheckoutContext
): Promise<CommerceCheckoutResult> {
  const env = input.env ?? process.env;
  const gate = resolveAppCommerceCheckoutGate(env);
  if (!gate.checkoutEnabled || !isAppCommerceCheckoutEnabled(env)) {
    return {
      ok: false,
      error: "checkout_closed",
      message: "Purchase is not open in this environment.",
    };
  }

  if (!input.customerId || !input.organizationId) {
    return {
      ok: false,
      error: "tenant_unresolved",
      message: "Organization could not be resolved for checkout.",
    };
  }

  if (input.hasActivePaidSubscription) {
    return {
      ok: false,
      error: "active_subscription_exists",
      message: "An active subscription already exists for this organization.",
    };
  }

  const matched = findPublishedOffer(input.catalog, input.offerId);
  if (!matched) {
    return {
      ok: false,
      error: "offer_not_found",
      message: "Published offer was not found.",
    };
  }
  if (!matched.product.purchasable || matched.product.publicationStatus !== "published") {
    return {
      ok: false,
      error: "offer_not_purchasable",
      message: "This offer is not available for purchase.",
    };
  }
  if (!matched.price.stripePriceId || !matched.price.stripePriceId.startsWith("price_")) {
    return {
      ok: false,
      error: "offer_not_purchasable",
      message: "Published offer is missing an authorized Stripe price.",
    };
  }

  const secret = env.STRIPE_SECRET_KEY;
  if (!secret || !isStripeSecretTestMode(secret)) {
    return {
      ok: true,
      demoMode: true,
      sessionId: `commerce_test_blocked_${Date.now()}`,
      offerId: matched.price.offerId,
      reason: "stripe_test_credentials_missing",
    };
  }

  try {
    const session = await createCommerceStripeCheckoutSession({
      priceId: matched.price.stripePriceId,
      customerEmail: input.customerEmail ?? undefined,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      trialDays: matched.price.trialDays,
      metadata: {
        aipify_customer_id: input.customerId,
        customer_id: input.customerId,
        aipify_org_id: input.organizationId,
        csp_customer_org_id: input.organizationId,
        commerce_offer_id: matched.price.offerId,
        product_key: matched.product.productKey,
        csp_product_key: input.csp?.productKey ?? matched.product.productKey,
        plan_key: matched.product.productKey,
        billing_interval: matched.price.interval === "year" ? "annual" : "monthly",
        csp_billing_interval: matched.price.interval === "year" ? "annual" : "monthly",
        csp_period_ordinal: String(input.csp?.periodOrdinal ?? 1),
        currency: matched.price.currency,
        amount: String(matched.price.amount),
        market: matched.price.market,
      },
      idempotencyKey: `commerce:${input.organizationId}:${matched.price.offerId}`,
    });

    if (!session.url) {
      return {
        ok: false,
        error: "stripe_error",
        message: "Stripe did not return a checkout URL.",
      };
    }

    return {
      ok: true,
      demoMode: false,
      checkoutUrl: session.url,
      sessionId: session.sessionId,
      offerId: matched.price.offerId,
      productKey: matched.product.productKey,
      interval: matched.price.interval,
      currency: matched.price.currency,
      amount: matched.price.amount,
    };
  } catch (error) {
    return {
      ok: false,
      error: "stripe_error",
      message: error instanceof Error ? error.message : "Stripe checkout failed.",
    };
  }
}
