export const ROCI588_CUSTOMER_SECTIONS = [
  { key: "overview", href: "/app/revenue" },
  { key: "revenue", href: "/app/revenue/revenue" },
  { key: "customers", href: "/app/revenue/customers" },
  { key: "subscriptions", href: "/app/revenue/subscriptions" },
  { key: "businessPacks", href: "/app/revenue/business-packs" },
  { key: "forecasts", href: "/app/revenue/forecasts" },
  { key: "growth", href: "/app/revenue/growth" },
  { key: "retention", href: "/app/revenue/retention" },
  { key: "reports", href: "/app/revenue/reports" },
] as const;

export type Roci588CustomerSection = (typeof ROCI588_CUSTOMER_SECTIONS)[number]["key"];

export const ROCI588_PLATFORM_SECTIONS = [
  { key: "overview", href: "/platform/revenue" },
  { key: "revenue", href: "/platform/revenue/revenue" },
  { key: "customers", href: "/platform/revenue/customers" },
  { key: "subscriptions", href: "/platform/revenue/subscriptions" },
  { key: "businessPacks", href: "/platform/revenue/business-packs" },
  { key: "forecasts", href: "/platform/revenue/forecasts" },
  { key: "growth", href: "/platform/revenue/growth" },
  { key: "retention", href: "/platform/revenue/retention" },
  { key: "reports", href: "/platform/revenue/reports" },
] as const;

export type Roci588PlatformSection = (typeof ROCI588_PLATFORM_SECTIONS)[number]["key"];

export const ROCI588_HEALTH_STATUSES = ["strong_growth", "stable", "watch_closely", "revenue_risk"] as const;

export function getRoci588PlatformActiveNavId(pathname: string): Roci588PlatformSection {
  if (pathname === "/platform/revenue" || pathname === "/platform/revenue/") return "overview";
  const match = ROCI588_PLATFORM_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}
