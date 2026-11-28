/**
 * AIPIFY_COMMERCIAL_BILLING_SALES_COMPLETE_MASTER_V1 — master contract constants.
 * Feature owner: PLATFORM (control plane, mapping, commission policy) + APP (read-only surfaces).
 * Everything here is fail-closed: no live Stripe, no real payments, no payout activation.
 */

export const COMMERCIAL_BILLING_SALES_MASTER = {
  version: "V1",
  id: "AIPIFY_COMMERCIAL_BILLING_SALES_COMPLETE_MASTER_V1",
  flow: [
    "product_center",
    "price_version_mapping",
    "checkout_intent",
    "verified_webhook",
    "payment_ledger",
    "entitlement_license",
    "invoice_receipt_read",
    "commission_ledger",
    "manual_settlement",
  ] as const,
  /** Compile-time switches. Changing any requires a separate owner task. */
  switches: {
    stripeLiveEnabled: false as const,
    liveCheckoutSessionCreationEnabled: false as const,
    realPaymentsEnabled: false as const,
    productionSqlApplied: false as const,
    payoutActivationEnabled: false as const,
    percentCommissionActivatable: false as const,
    invoiceSendingEnabled: false as const,
    purchaseUiOwnedByThisModule: false as const,
  },
  paymentProof: {
    redirectOrSuccessUrlIsProof: false as const,
    checkoutSessionCompletedIsProof: false as const,
    onlyVerifiedCapturedPaymentActivates: true as const,
  },
  catalog: {
    browseRequiresLicense: false as const,
    operateRequiresActiveEntitlement: true as const,
  },
  freeAipifyPartner: {
    purchaseRequired: false as const,
    accessPolicy: "partner_identity" as const,
  },
  commission: {
    model: "fixed_one_time_or_percent_blocked" as const,
    monthlyEarnAfterPaidPeriods: 2,
    yearlyEarnAfterPaidPeriods: 1,
    oneTimeEarnAfterPaidPeriods: 1,
    recurringRenewalCommission: false as const,
    settlement: "manual_only" as const,
    legacyRatesAutoIntroduced: false as const,
  },
  future: {
    nordicFounderExchangeHooks: "documented_only_no_data_link_no_product_start" as const,
  },
} as const;

export const COMMERCIAL_BILLING_SQL_CANDIDATES = {
  /** Staging-applied by parent (migration version 20261128201827). Bytes must never change. */
  foundation: {
    path: "docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql",
    sha256: "2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d",
    stagingApplied: true,
    productionApplied: false,
  },
  /** PREPARED_ONLY snapshot read RPC. revoke all, no grants. Not applied anywhere. */
  snapshotRead: {
    path: "docs/platform/sql-candidates/sales_partner_license_snapshot_read_v1.sql",
    sha256: "57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d",
    applyStatus: "PREPARED_ONLY",
    grants: "none",
  },
} as const;

export const SALES_PARTNER_LICENSE_SNAPSHOT_RPC = "get_sales_partner_program_license_snapshot" as const;

export const COMMERCIAL_OPEN_OWNER_APPROVALS = [
  "stripe_live_activation_and_secrets",
  "live_checkout_session_creation",
  "production_sql_apply_license_foundation",
  "staging_apply_snapshot_read_rpc_and_execute_grants",
  "percent_commission_basis_and_core_contract",
  "vat_rate_source_and_stripe_tax_vs_manual",
  "stripe_invoice_vs_accounting_system_of_record",
  "payout_activation_and_settlement_automation",
  "commission_rate_values_per_variant_interval",
  "license_levels_and_seat_caps_catalog",
] as const;

/** Mirrors lib/license PAYMENT_GRACE_PERIOD_DAYS without importing server modules. */
export const COMMERCIAL_PAYMENT_GRACE_DAYS = 3 as const;
