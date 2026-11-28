/**
 * Phase B — license architecture contract (documentation + foundation pointer).
 * No grants, prices, tenant writes, or commercial activation in Phase B hosts.
 *
 * Executable validation lives in `lib/sales-partner-commercial-license/` (V1 foundation).
 * Core SQL remains PREPARED_ONLY — see sql-candidates/sales_partner_commercial_license_foundation_v1.sql.
 */

import { SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION } from "@/lib/sales-partner-commercial-license/contract";

export { SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION };

export const SALES_PARTNER_LICENSE_ARCHITECTURE = {
  phase: "B",
  activationInThisPhase: false,
  foundationModule: "lib/sales-partner-commercial-license",
  foundationVersion: SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION.version,
  aipifyPartner: {
    label: "Aipify Partner",
    kind: "certified_free_program",
    access: "Approved CSP identity (partner_identity) — not a paid APP product SKU",
    entitlementReuse: "userHasCspPartnerAccess / csp_partner_profiles.status",
    automaticProductEntitlement: false,
    purchaseRequired: false,
  },
  commercialSalesPartnerModule: {
    label: "Sales Partner (commercial)",
    kind: "future_tenant_licensed_module",
    status: "foundation_ts_ready_sql_prepared_only",
    capacity: "Configurable active-seller seats per customer organization — no hard-coded limits in Core",
    internalSystemLicense: "Aipify Group may hold an internal system license for its own program",
    memberships: "Per sales program memberships; isolated from other tenants",
    entitlementEngineReuse:
      "Prefer existing tenant_modules / access-control-plane when commercial SKU ships — SQL candidate prepared",
    isolation: "No cross-tenant seller data, balances, or settlement",
    sqlCandidate: SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION.sqlCandidate.path,
  },
  commissionSeparation: {
    aipifyProgramCommissions: "csp_* ledger/settlements for Aipify certified program",
    externalCompanySales: "Future tenant-owned programs must not mix with Aipify program settlement",
  },
  gaps: [
    "Core SQL candidate not applied (owner Staging + Production gates)",
    "tenant_modules SKU binding / commercial package mapping not shipped",
    "Capacity-limit notification delivery not implemented (contract only)",
    "No purchase/checkout UI until payment integration exists",
  ],
} as const;
