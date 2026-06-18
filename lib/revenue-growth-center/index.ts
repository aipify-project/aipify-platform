export * from "./types";
export * from "./parse";
export * from "./labels";

export const REVENUE_GROWTH_BASE = "/app/revenue-growth";

export const REVENUE_GROWTH_SECTIONS = [
  { key: "overview", href: "/app/revenue-growth" },
  { key: "renewals", href: "/app/revenue-growth/renewals" },
  { key: "expansion", href: "/app/revenue-growth/expansion" },
  { key: "subscription", href: "/app/revenue-growth/subscription" },
  { key: "businessPacks", href: "/app/revenue-growth/business-packs" },
  { key: "forecast", href: "/app/revenue-growth/forecast" },
  { key: "clv", href: "/app/revenue-growth/clv" },
  { key: "retention", href: "/app/revenue-growth/retention" },
  { key: "recommendations", href: "/app/revenue-growth/recommendations" },
  { key: "executive", href: "/app/revenue-growth/executive" },
  { key: "partner", href: "/app/revenue-growth/partner" },
  { key: "playbooks", href: "/app/revenue-growth/playbooks" },
  { key: "governance", href: "/app/revenue-growth/governance" },
] as const;
