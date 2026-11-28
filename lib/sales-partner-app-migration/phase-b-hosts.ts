/**
 * Phase B — thin APP hosts for CSP seller surfaces.
 * Maps `/app/sales-partner/*` → existing `/partners/*` page modules (no new business logic).
 */

import { SALES_PARTNER_APP_ROUTE_MATRIX } from "@/lib/sales-partner-app-migration/phase-a-contract";

export const SALES_PARTNER_APP_MIGRATION_PHASE_B = "B" as const;

export type SalesPartnerThinHost = {
  capability: string;
  appPath: string;
  /** Existing partners page module path (repo-relative under app/). */
  partnersPageModule: string;
  /** Optional forced marketing section for materials host. */
  initialMarketingSection?: "center" | "library";
};

/** Thin-host rows only (reuse_app_surface stays on shared APP routes). */
export const SALES_PARTNER_THIN_HOSTS: readonly SalesPartnerThinHost[] = [
  {
    capability: "overview",
    appPath: "/app/sales-partner",
    partnersPageModule: "app/partners/page.tsx",
  },
  {
    capability: "products",
    appPath: "/app/sales-partner/products",
    partnersPageModule: "app/partners/marketing/product-catalog/page.tsx",
  },
  {
    capability: "links",
    appPath: "/app/sales-partner/links",
    partnersPageModule: "app/partners/referrals/links/page.tsx",
  },
  {
    capability: "sales_page",
    appPath: "/app/sales-partner/sales-page",
    partnersPageModule: "app/partners/sales-page/page.tsx",
  },
  {
    capability: "leads",
    appPath: "/app/sales-partner/leads",
    partnersPageModule: "app/partners/customers/leads/page.tsx",
  },
  {
    capability: "customers",
    appPath: "/app/sales-partner/customers",
    partnersPageModule: "app/partners/customers/prospects/page.tsx",
  },
  {
    capability: "pipeline",
    appPath: "/app/sales-partner/pipeline",
    partnersPageModule: "app/partners/customers/pipeline/page.tsx",
  },
  {
    capability: "commissions",
    appPath: "/app/sales-partner/commissions",
    partnersPageModule: "app/partners/settlement/page.tsx",
  },
  {
    capability: "academy",
    appPath: "/app/sales-partner/academy",
    partnersPageModule: "app/partners/academy/training/page.tsx",
  },
  {
    capability: "certificates",
    appPath: "/app/sales-partner/certificates",
    partnersPageModule: "app/partners/academy/certifications/page.tsx",
  },
  {
    capability: "tools",
    appPath: "/app/sales-partner/tools",
    partnersPageModule: "app/partners/marketing/assets/page.tsx",
    initialMarketingSection: "center",
  },
  {
    capability: "materials",
    appPath: "/app/sales-partner/materials",
    partnersPageModule: "app/partners/marketing/assets/page.tsx",
    initialMarketingSection: "library",
  },
  {
    capability: "email_templates",
    appPath: "/app/sales-partner/email-templates",
    partnersPageModule: "app/partners/marketing/email-templates/page.tsx",
  },
  {
    capability: "messages",
    appPath: "/app/sales-partner/messages",
    partnersPageModule: "app/partners/account/messages/page.tsx",
  },
] as const;

/** Phase B menu bindings — APP hosts (no /partners cutover). */
export const SALES_PARTNER_PHASE_B_NAV_BINDINGS = {
  salesPartnerOverview: "/app/sales-partner",
  salesPartnerProducts: "/app/sales-partner/products",
  salesPartnerCustomers: "/app/sales-partner/customers",
  salesPartnerCommissions: "/app/sales-partner/commissions",
  salesPartnerAcademy: "/app/sales-partner/academy",
} as const;

export function thinHostsCoverMatrix(): boolean {
  const thinCaps = new Set(
    SALES_PARTNER_APP_ROUTE_MATRIX.filter((r) => r.hostStrategy === "thin_app_host").map(
      (r) => r.capability,
    ),
  );
  const hostCaps = new Set(SALES_PARTNER_THIN_HOSTS.map((h) => h.capability));
  for (const cap of thinCaps) {
    if (!hostCaps.has(cap)) return false;
  }
  return true;
}
