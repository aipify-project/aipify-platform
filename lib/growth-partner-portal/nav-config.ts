export * from "./types";
export * from "./parse";

export const GROWTH_PARTNER_PORTAL_HOME = "/growth-partner/dashboard";

export const GROWTH_PARTNER_PORTAL_NAV = [
  { id: "dashboard", href: "/growth-partner/dashboard", labelKey: "nav.dashboard" },
  { id: "leads", href: "/growth-partner/leads", labelKey: "nav.leads" },
  { id: "referrals", href: "/growth-partner/referrals", labelKey: "nav.referrals" },
  { id: "commissions", href: "/growth-partner/commissions", labelKey: "nav.commissions" },
  { id: "payouts", href: "/growth-partner/payouts", labelKey: "nav.payouts" },
  { id: "academy", href: "/growth-partner/academy", labelKey: "nav.academy" },
  { id: "assets", href: "/growth-partner/assets", labelKey: "nav.assets" },
  { id: "team", href: "/growth-partner/team", labelKey: "nav.team" },
  { id: "settings", href: "/growth-partner/settings", labelKey: "nav.settings" },
] as const;

export type GrowthPartnerPortalNavId = (typeof GROWTH_PARTNER_PORTAL_NAV)[number]["id"];

export function growthPartnerPortalNavIdFromPath(pathname: string): GrowthPartnerPortalNavId {
  const match = GROWTH_PARTNER_PORTAL_NAV.find((item) => pathname.startsWith(item.href));
  return match?.id ?? "dashboard";
}
