/**
 * APP Commerce V1 — published offer contract (Platform → APP).
 * Amounts and Stripe Price IDs are authoritative only when publication_status = published.
 * Never treat client-supplied amounts or price IDs as source of truth.
 */

export type CommerceBillingInterval = "month" | "year";

export type CommerceMarketCode = string; // ISO-like market id, e.g. NO, EU, PL

export type CommerceLocaleCode = "en" | "no" | "sv" | "da" | "pl" | "uk" | "es" | string;

export type PublishedCommercePrice = {
  offerId: string;
  productKey: string;
  amount: number;
  currency: string;
  interval: CommerceBillingInterval;
  market: CommerceMarketCode;
  /** Stripe Price ID — server-only; never trust from browser. */
  stripePriceId: string;
  trialDays: number;
  publicationStatus: "published";
  locales: Partial<Record<CommerceLocaleCode, { title?: string; description?: string }>>;
};

export type PublishedCommerceProduct = {
  productKey: string;
  categoryId: string;
  publicationStatus: "published" | "draft" | "unpublished";
  purchasable: boolean;
  title: string | null;
  description: string | null;
  imagePath: string | null;
  features: string[];
  prices: PublishedCommercePrice[];
};

export type AppCommerceCatalog = {
  source: "core_rpc" | "billing_payload" | "empty";
  checkoutEnabled: boolean;
  productionCheckoutClosed: true;
  products: PublishedCommerceProduct[];
  blockers: string[];
};

export type CommerceCheckoutRequest = {
  /** Server-published offer id only — not a raw Stripe price. */
  offerId: string;
};

export type CommerceCheckoutResult =
  | {
      ok: true;
      demoMode: false;
      checkoutUrl: string;
      sessionId: string;
      offerId: string;
      productKey: string;
      interval: CommerceBillingInterval;
      currency: string;
      amount: number;
    }
  | {
      ok: true;
      demoMode: true;
      sessionId: string;
      offerId: string;
      reason: "stripe_test_credentials_missing";
    }
  | {
      ok: false;
      error:
        | "unauthorized"
        | "checkout_closed"
        | "offer_not_found"
        | "offer_not_purchasable"
        | "active_subscription_exists"
        | "tenant_unresolved"
        | "stripe_error";
      message: string;
    };

export type CommerceSubscriptionChangePolicy = {
  allowed: false;
  reason: "policy_not_finalized";
  mode: "read_only_fail_closed";
};

export type CommerceInvoiceReadModel = {
  available: boolean;
  source: "none" | "stripe_hosted" | "platform_enterprise";
  invoices: Array<{
    id: string;
    number: string | null;
    status: string;
    currency: string | null;
    amount: number | null;
    issuedAt: string | null;
    pdfUrl: string | null;
  }>;
  blocker: string | null;
};
