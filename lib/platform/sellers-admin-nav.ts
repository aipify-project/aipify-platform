/** Existing Platform Admin seller routes. No copied pages. */
export const SELLERS_ADMIN_NAV = [
  { id: "overview", href: "/platform/sellers" },
  { id: "partners", href: "/platform/sellers/partners" },
  { id: "products", href: "/platform/sellers/products" },
  { id: "commissionRates", href: "/platform/sellers/commission-rates" },
  { id: "attribution", href: "/platform/sellers/attribution" },
  { id: "academy", href: "/platform/sellers/academy" },
  { id: "materials", href: "/platform/sellers/materials" },
  { id: "leadsSales", href: "/platform/sellers/leads-sales" },
  { id: "commissions", href: "/platform/sellers/commissions" },
  { id: "settlements", href: "/platform/sellers/settlements" },
  { id: "messages", href: "/platform/sellers/messages" },
  { id: "audit", href: "/platform/sellers/audit" },
  { id: "settings", href: "/platform/sellers/settings" },
] as const;

export const SELLERS_ADMIN_FRAME = "mx-auto w-full max-w-[1600px]";

export function sellersAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/platform/sellers") return pathname === "/platform/sellers";
  return pathname === href || pathname.startsWith(`${href}/`);
}
