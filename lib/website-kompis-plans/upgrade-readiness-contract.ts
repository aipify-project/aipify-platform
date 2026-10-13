/**
 * Contract notes for future authorized ledger / Stripe / multisite jobs.
 * Not executable entitlement logic.
 */

export const WEBSITE_KOMPIS_BILLABLE_ANSWER_DEFINITION = {
  countsWhen:
    "One completed, visitor-visible AI assistant answer successfully delivered under public ask policy.",
  doesNotCount: [
    "Security / private-scope / disabled denials",
    "Technical failures before a visitor-visible answer is delivered",
    "Non-delivered responses",
  ] as const,
  openQuestions: [
    "Whether deterministic FAQ/index/page answers consume the customer meter",
    "Streaming/retry idempotency keys before schema lock",
  ] as const,
} as const;

export const WEBSITE_KOMPIS_UPGRADE_ACTIVATION_CHAIN = [
  "Server-verified Stripe subscription / payment (not client redirect alone)",
  "Business Pack / Website Kompis activation gate (install + verified domain + module)",
  "Site license entitlement update fail-closed",
  "Quota max switch free 150 lifetime → paid monthly max (2500 or 10000)",
  "Do not double-count free usage against first paid period",
  "Customer confirmation communication (idempotent)",
] as const;

export const WEBSITE_KOMPIS_FUTURE_APPROVAL_GATES = {
  A_ledger_sql_and_frozen_ask_reopen: {
    requires: ["SQL/schema/RLS", "possibly frozen public ask files"],
    status: "blocked_until_owner_auth",
  },
  B_multisite_knowledge_acl: {
    requires: ["site selector server context", "possibly domain SOT unification"],
    status: "blocked_until_owner_auth",
  },
  C_stripe_sku_checkout_webhooks: {
    requires: ["Stripe Products/Prices", "webhook idempotency", "no global 14-day trial for WK"],
    status: "blocked_until_owner_auth",
  },
  D_platform_email_delivery: {
    requires: ["locales/**/emails or equivalent", "Resend/customer transport", "event triggers"],
    status: "blocked_until_owner_auth",
  },
  E_invoice_site_lines: {
    requires: ["enterprise invoice lines ↔ site license", "optional Stripe invoice sync"],
    status: "blocked_until_owner_auth",
  },
} as const;

/** Hardcoded Stripe trial in shared checkout — must not be reused blindly for WK free→paid. */
export const WEBSITE_KOMPIS_STRIPE_TRIAL_NOTE =
  "Shared createStripeCheckoutSession defaults trial_period_days=14. WK paid activation needs an isolated path with trialDays=0 (or omitted) under separate Stripe authorization — do not change global trial in this presentation job.";
