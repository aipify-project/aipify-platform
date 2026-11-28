/**
 * Documented commercial Sales Partner license foundation.
 * Pure contract — no Stripe, checkout, settlement, or portal rename.
 *
 * Reuses existing CSP free-program identity (`userHasCspPartnerAccess`) and
 * prefers future binding to `tenant_modules` / access-control-plane when SKU ships.
 */

import type { CapacityLimitNotificationContract } from "./types";

export const SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION = {
  version: "V1",
  moduleKey: "sales_partner_commercial",
  /** Reserved APP route surface — preserved free CSP hosts stay under /app/sales-partner. */
  preservedAppRoutePrefix: "/app/sales-partner",
  aipifyCertifiedFreeProgram: {
    id: "aipify_certified_sales_partner",
    kind: "aipify_certified_free" as const,
    access: "partner_identity",
    entitlementReuse: "userHasCspPartnerAccess / csp_partner_profiles.status",
    purchaseRequired: false,
    internalSystemLicense: true,
    dataPlane: "csp_* tables + /api/certified-sales-partner/*",
    automaticAppProductEntitlement: false,
  },
  tenantCommercialProgram: {
    id: "tenant_sales_partner_program",
    kind: "tenant_commercial" as const,
    owner: "customer_organization",
    purchaseRequired: true,
    capacityModel: "configurable_active_seller_seats",
    hardcodedSeatLimitsForbidden: true,
    hardcodedPricesForbidden: true,
    multipleMembershipsPerSeller: true,
    isolation: "per ownerTenantId + programId — no cross-tenant ledger or settlement",
    entitlementEngineReuse: "tenant_modules / access-control-plane when commercial SKU ships",
  },
  failClosed: {
    missingLicense: true,
    expiredLicense: true,
    suspendedLicense: true,
    unconfiguredCapacity: true,
  },
  atomicSeatActivation: {
    required: true,
    compareActivePlusOneAgainstMax: true,
    concurrentRace: "reject_when_capacity_exhausted",
  },
  settlement: {
    aipifyProgram: "csp_* ledger only",
    tenantProgram: "must not mix with Aipify program settlement",
    changedInThisFoundation: false,
  },
  purchaseUi: {
    mayClaimPurchasableBeforePaymentIntegration: false,
  },
  sqlCandidate: {
    path: "docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql",
    applyStatus: "PREPARED_ONLY",
    runtimeDependencyForFoundationTs: false,
  },
} as const;

export const SALES_PARTNER_CAPACITY_LIMIT_NOTIFICATION_CONTRACT: CapacityLimitNotificationContract =
  {
    event: "sales_partner_seller_capacity_reached",
    deliveryImplemented: false,
    channelsPlanned: ["in_app", "email"],
    requiresOwnerTenantId: true,
    requiresProgramId: true,
    requiresActiveCount: true,
    requiresMaxActiveSellers: true,
    neverFabricatesPurchaseCta: true,
  };

/** Reserved owner tenant key for Aipify Group’s own certified program (not a customer). */
export const AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY = "aipify_group_internal" as const;

export const COMMERCIAL_LICENSE_STATUSES_ALLOWING_SELLER_OPS = [
  "active",
  "grace_period",
  "internal_system",
] as const;
