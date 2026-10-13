/**
 * Kompis Web answer-plan catalog — presentation & communication source of truth.
 * Not Stripe products, not entitlements, not a usage ledger.
 */

export type WebsiteKompisPlanId = "free" | "standard" | "pro";

export type WebsiteKompisQuotaKind = "lifetime_total" | "monthly_renewing";

export type WebsiteKompisPlanOfferStatus =
  /** Decided product rules — not checkout-active until billing job authorizes. */
  | "planned"
  /** Should never appear for WK free/standard/pro until ledger+Stripe live. */
  | "commercially_active";

export type WebsiteKompisPlanPrice = {
  currency: "NOK";
  /** Amounts are planned list prices; VAT display UNKNOWN until tax policy locked. */
  amountMinor: number;
  amountDisplay: string;
  billingPeriod: "month" | "year";
  /** Annual = pay 10 for 12 months (owner decision 2026-10-13). */
  yearEquivalentMonthsPaid?: 10;
  vatStatus: "unknown";
};

export type WebsiteKompisPlanDefinition = {
  id: WebsiteKompisPlanId;
  answerQuota: number;
  quotaKind: WebsiteKompisQuotaKind;
  offerStatus: WebsiteKompisPlanOfferStatus;
  requiresCard: boolean;
  monthlyPrice: WebsiteKompisPlanPrice | null;
  annualPrice: WebsiteKompisPlanPrice | null;
  /** Annual payment still renews answers monthly — never one year dump. */
  annualRenewsAnswersMonthly: boolean;
  /** Checkout must not be offered until separate authorization. */
  checkoutEnabled: false;
};

export type WebsiteKompisCommunicationTemplateId =
  | "welcome_free"
  | "quota_remaining_30"
  | "quota_remaining_10"
  | "quota_remaining_0"
  | "upgrade_confirmed"
  | "invoice_paid"
  | "payment_failed"
  | "payment_grace_3_days"
  | "reactivated";

export type WebsiteKompisCommunicationTemplate = {
  id: WebsiteKompisCommunicationTemplateId;
  /** Delivery pipeline not live for customer transactional mail. */
  deliveryStatus: "draft_preview_only";
  requiresLedgerEvent: boolean;
  requiresStripeEvent: boolean;
};
