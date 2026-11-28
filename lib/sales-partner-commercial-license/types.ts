/**
 * Commercial Sales Partner license foundation — types only.
 * Distinct from free Aipify Partner (CSP) identity access.
 */

/** Who owns / operates the seller program. */
export type SalesPartnerProgramKind =
  /** Free certified Aipify seller program — partner_identity, no paid SKU. */
  | "aipify_certified_free"
  /** Customer company owns a paid (or internal-system) seller program license. */
  | "tenant_commercial";

export type SalesPartnerLicenseStatus =
  | "active"
  | "grace_period"
  | "expired"
  | "missing"
  | "suspended"
  | "internal_system";

export type SalesPartnerLicenseSource =
  | "paid_subscription"
  | "internal_system"
  | "none";

export type SalesPartnerMembershipStatus = "active" | "inactive" | "invited" | "removed";

export type SalesPartnerSellerRole =
  | "program_owner"
  | "program_admin"
  | "seller"
  | "read_only";

/**
 * Configurable license level — never hardcode seat counts or prices in Core.
 * `maxActiveSellers: null` means not configured (fail-closed for commercial activation).
 */
export type SalesPartnerLicenseLevelConfig = {
  licenseLevelKey: string;
  /** Display label key / business label — not a price. */
  label: string;
  /**
   * Maximum concurrently active sellers for this level.
   * null = unset (commercial programs must not invent a default).
   * Explicit 0 = zero seats allowed (valid configured value).
   */
  maxActiveSellers: number | null;
  /** Optional commercial metadata; never treated as Stripe amount here. */
  currency: string | null;
  priceAmountMajor: number | null;
};

export type SalesPartnerProgramRef = {
  programId: string;
  /** Owning tenant / organization. Aipify program uses a reserved internal tenant key. */
  ownerTenantId: string;
  kind: SalesPartnerProgramKind;
};

export type SalesPartnerLicenseSnapshot = {
  program: SalesPartnerProgramRef;
  status: SalesPartnerLicenseStatus;
  source: SalesPartnerLicenseSource;
  licenseLevelKey: string | null;
  maxActiveSellers: number | null;
  activeSellerCount: number;
  /** ISO timestamp when paid license expires; null for internal_system / missing. */
  expiresAt: string | null;
};

export type SalesPartnerMembershipRef = {
  membershipId: string;
  programId: string;
  sellerUserId: string;
  role: SalesPartnerSellerRole;
  status: SalesPartnerMembershipStatus;
};

export type SeatActivationDecision =
  | {
      ok: true;
      action: "activate";
      nextActiveCount: number;
      maxActiveSellers: number;
      capacityReachedAfter: boolean;
    }
  | {
      ok: false;
      reason:
        | "license_missing"
        | "license_expired"
        | "license_suspended"
        | "license_paused_grace_blocks_activation"
        | "capacity_not_configured"
        | "capacity_exhausted"
        | "seller_already_active"
        | "cross_tenant_forbidden"
        | "program_kind_mismatch";
    };

export type CapacityLimitNotificationContract = {
  /** Contract marker — delivery not implemented in this foundation. */
  event: "sales_partner_seller_capacity_reached";
  deliveryImplemented: false;
  channelsPlanned: readonly ["in_app", "email"];
  requiresOwnerTenantId: true;
  requiresProgramId: true;
  requiresActiveCount: true;
  requiresMaxActiveSellers: true;
  neverFabricatesPurchaseCta: true;
};
