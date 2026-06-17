import type { PartnerPortalSectionKey } from "./types";

export const PARTNER_PORTAL_HOME = "/partner/dashboard";

export const PARTNER_PORTAL_NAV: Array<{
  id: PartnerPortalSectionKey;
  href: string;
  labelKey: string;
}> = [
  { id: "dashboard", href: "/partner/dashboard", labelKey: "nav.dashboard" },
  { id: "opportunities", href: "/partner/opportunities", labelKey: "nav.opportunities" },
  { id: "customers", href: "/partner/customers", labelKey: "nav.customers" },
  { id: "academy", href: "/partner/academy", labelKey: "nav.academy" },
  { id: "materials", href: "/partner/materials", labelKey: "nav.materials" },
  { id: "commissions", href: "/partner/commissions", labelKey: "nav.commissions" },
  { id: "settlements", href: "/partner/settlements", labelKey: "nav.settlements" },
  { id: "compliance", href: "/partner/compliance", labelKey: "nav.compliance" },
  { id: "communications", href: "/partner/communications", labelKey: "nav.communications" },
  { id: "performance", href: "/partner/performance", labelKey: "nav.performance" },
  { id: "advisor", href: "/partner/advisor", labelKey: "nav.advisor" },
  { id: "settings", href: "/partner/settings", labelKey: "nav.settings" },
];

export function partnerPortalNavIdFromPath(pathname: string): PartnerPortalSectionKey {
  const match = PARTNER_PORTAL_NAV.find((item) => pathname.startsWith(item.href));
  return match?.id ?? "dashboard";
}

export const PARTNER_LEGACY_REDIRECTS: Record<string, string> = {
  "/growth-partner": "/partner/dashboard",
  "/growth-partner/dashboard": "/partner/dashboard",
  "/growth-partner/leads": "/partner/opportunities",
  "/growth-partner/referrals": "/partner/customers",
  "/growth-partner/commissions": "/partner/commissions",
  "/growth-partner/payouts": "/partner/settlements",
  "/growth-partner/academy": "/partner/academy",
  "/growth-partner/assets": "/partner/materials",
  "/growth-partner/team": "/partner/settings",
  "/growth-partner/settings": "/partner/settings",
};

export function getPartnerLegacyRedirect(pathname: string): string | null {
  return PARTNER_LEGACY_REDIRECTS[pathname] ?? null;
}
