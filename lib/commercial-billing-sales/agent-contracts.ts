/**
 * I. Interop contracts for Agent 2 (APP / Product Center purchase surfaces) and Agent 3
 * (support / analytics / notifications). Types + constants only; no panels, no UI.
 */

import type { CustomerPaymentHistoryDto, CommercialNotificationDto } from "./invoices";
import type { LicenseCapacityView, SalesPartnerLicenseReadResult } from "./license-snapshot";
import type { EntitlementAuthorization, EffectiveEntitlement } from "./entitlement";
import type { CheckoutFailure, CheckoutIntent } from "./checkout";

/** Agent 2 reads. All fail-closed; none implies a purchase CTA. */
export type Agent2CommercialContracts = {
  licenseRead: SalesPartnerLicenseReadResult;
  licenseCapacity: LicenseCapacityView;
  entitlementGate: EntitlementAuthorization;
  effectiveEntitlement: EffectiveEntitlement;
  paymentHistory: CustomerPaymentHistoryDto;
  checkoutIntent: { ok: true; intent: CheckoutIntent; replayed: boolean } | { ok: false; reason: CheckoutFailure };
};

/** Agent 3 consumes notification DTOs; delivery stays theirs. */
export type Agent3CommercialContracts = {
  notification: CommercialNotificationDto;
};

export const AGENT_CONTRACT_RULES = {
  agent2: {
    catalogBrowseRequiresLicense: false,
    operationsRequireActiveEntitlement: true,
    billingAndRecoveryAlwaysReachable: true,
    successRedirectIsPaymentProof: false,
    purchaseCtaFromThisModule: false,
    commissionVisibleInApp: false,
  },
  agent3: {
    deliveryImplementedHere: false,
    sellerSideEventsMustNotReachCustomerTenant: true,
    notificationsContainSecrets: false,
    dedupeKeyProvided: true,
  },
} as const;

export const COMMERCIAL_END_TO_END_FLOW = [
  "1. Product Center defines product, variant, price per interval, commission rule (#525/#530) — unchanged.",
  "2. planProductCenterStripeMapping → immutable price versions (test adapter only; live disabled).",
  "3. APP browses catalog (no license). Operating a product needs an active entitlement.",
  "4. prepareCheckoutIntent: server-priced, gate-closed in Production, idempotent, attribution tenant-bound.",
  "5. Redirect/success is NOT proof (interpretCheckoutReturn).",
  "6. Verified webhook (signature + mapping + tenant + amount + currency) → payment ledger.",
  "7. Only a captured payment activates the entitlement; failure → grace; refund/chargeback → revoke/suspend; recovery restores.",
  "8. Payment history/receipt DTO from the ledger (provider document links only; nothing fabricated).",
  "9. Commission ledger: monthly earns after 2nd paid period, yearly on first annual, one-time on first capture; no renewal commission; reversals append.",
  "10. Manual settlement only; payout activation is not implemented.",
] as const;

/** Reusable hooks for a future Nordic Founder Exchange. No data link and no product start today. */
export const NORDIC_FOUNDER_EXCHANGE_HOOKS = {
  status: "documented_only",
  dataLinked: false,
  productStarted: false,
  reusableContracts: [
    "price_version_mapping_plan",
    "checkout_intent_with_idempotency",
    "verified_webhook_reducer",
    "entitlement_authorization",
    "commission_ledger",
    "payment_history_dto",
  ],
} as const;

export const PRESERVED_SURFACES = [
  "free Aipify Partner (partner_identity, no paid license)",
  "/app/sales-partner",
  "/s/* and /p/* certificate verification and attribution routes",
  "Product Center + commission editor (#525/#530)",
] as const;
