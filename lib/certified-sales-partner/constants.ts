/**
 * Certified Aipify Sales Partner (CSP) — domain constants.
 *
 * Feature owner: PLATFORM (governance, settlement) + APP/PARTNERS surfaces (later).
 * Distinct from the Growth Partner percentage-commission engines — CSP pays a
 * ONE-TIME fixed amount per product (see commission-rules.ts).
 */

/** Attribution link validity: a registration is credited to a partner for 90 days. */
export const CSP_ATTRIBUTION_WINDOW_DAYS = 90;

/** Minimum academy score (percent) required to certify for a product. */
export const CSP_CERTIFICATION_PASS_SCORE = 80;

/** Time zone used for monthly settlement cut-off boundaries. */
export const CSP_CUTOFF_TIME_ZONE = "Europe/Oslo";

/** A commission is earned once this many successful paid subscription periods exist. */
export const CSP_REQUIRED_PAID_PERIODS = 2;

export const CSP_SALE_STATUSES = [
  "registered_awaiting_second_payment",
  "pending_possible",
  "earned",
  "approved_for_payout",
  "queued_for_payout",
  "paid",
  "reversed",
  "rejected",
] as const;
export type CspSaleStatus = (typeof CSP_SALE_STATUSES)[number];

/** No further transitions possible (paid can still be reversed). */
export const CSP_TERMINAL_SALE_STATUSES: readonly CspSaleStatus[] = ["reversed", "rejected"];

export const CSP_PARTNER_STATUSES = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
] as const;
export type CspPartnerStatus = (typeof CSP_PARTNER_STATUSES)[number];

export const CSP_CHANNEL_ORIGINS = [
  "facebook",
  "instagram",
  "x",
  "snapchat",
  "tiktok",
  "linkedin",
  "email",
  "qr",
  "other",
  "referral_link",
  "partner_code",
  "manual_platform_assignment",
] as const;
export type CspChannelOrigin = (typeof CSP_CHANNEL_ORIGINS)[number];

export const CSP_CERTIFICATION_STATUSES = ["not_started", "in_progress", "passed", "expired", "revoked"] as const;
export type CspCertificationStatus = (typeof CSP_CERTIFICATION_STATUSES)[number];

export const CSP_SETTLEMENT_STATUSES = ["open", "closed", "approved", "paid", "voided"] as const;
export type CspSettlementStatus = (typeof CSP_SETTLEMENT_STATUSES)[number];

/** Business-facing settlement states (presentation only — DB enum strings are unchanged). */
export const CSP_SETTLEMENT_BUSINESS_STATUSES = [
  "in_review",
  "sent_to_payout",
  "approved",
  "paid",
  "rejected",
] as const;
export type CspSettlementBusinessLabel = (typeof CSP_SETTLEMENT_BUSINESS_STATUSES)[number];

export const CSP_SETTLEMENT_BUSINESS_LABELS: Readonly<Record<CspSettlementStatus, CspSettlementBusinessLabel>> = {
  open: "in_review",
  approved: "approved",
  closed: "sent_to_payout",
  paid: "paid",
  voided: "rejected",
};

export const CSP_LEDGER_ENTRY_TYPES = ["earned", "payout", "reversal", "adjustment"] as const;
export type CspLedgerEntryType = (typeof CSP_LEDGER_ENTRY_TYPES)[number];

/** Env flag that explicitly opens the backend gate (fail-closed when absent). */
export const CSP_BACKEND_READY_ENV = "AIPIFY_CSP_BACKEND_READY";

/** Read-only RPC probed to detect an applied backend. */
export const CSP_BACKEND_PROBE_RPC = "csp_get_backend_status";

/** Stable error code returned by stub RPCs until the migration is approved/applied. */
export const CSP_BACKEND_NOT_APPLIED_ERROR = "csp_backend_not_applied";
