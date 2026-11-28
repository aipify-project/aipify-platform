/**
 * Phase B — license architecture contract (documentation only).
 * No grants, prices, tenant writes, or commercial activation in this phase.
 */

export const SALES_PARTNER_LICENSE_ARCHITECTURE = {
  phase: "B",
  activationInThisPhase: false,
  aipifyPartner: {
    label: "Aipify Partner",
    kind: "certified_free_program",
    access: "Approved CSP identity (partner_identity) — not a paid APP product SKU",
    entitlementReuse: "userHasCspPartnerAccess / csp_partner_profiles.status",
    automaticProductEntitlement: false,
  },
  commercialSalesPartnerModule: {
    label: "Sales Partner (commercial)",
    kind: "future_tenant_licensed_module",
    status: "not_activated",
    capacity: "Configurable active-seller seats per customer organization — no hard-coded limits in Core",
    internalSystemLicense: "Aipify Group may hold an internal system license for its own program",
    memberships: "Per sales program memberships; isolated from other tenants",
    entitlementEngineReuse:
      "Prefer existing tenant_modules / access-control-plane when commercial SKU ships — gaps TBD",
    isolation: "No cross-tenant seller data, balances, or settlement",
  },
  commissionSeparation: {
    aipifyProgramCommissions: "csp_* ledger/settlements for Aipify certified program",
    externalCompanySales: "Future tenant-owned programs must not mix with Aipify program settlement",
  },
  gaps: [
    "Commercial SKU / seat capacity schema not defined",
    "Per-program membership model for external companies not defined",
    "Mapping commercial module → APP sales-partner hosts not activated",
  ],
} as const;
